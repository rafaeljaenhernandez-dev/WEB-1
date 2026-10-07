// ===== Módulo render: solo toca el DOM, no sabe nada de la red =====
const garaje = document.querySelector("#garaje");
const resumen = document.querySelector("#resumen");
const filtroMarcas = document.querySelector("#marcas");
const vitrina = document.querySelector("#vitrina");
const fichaModelo = vitrina.querySelector(".vitrina__modelo");
const fichaTexto = vitrina.querySelector(".vitrina__resumen");
const fichaAcciones = vitrina.querySelector(".vitrina__acciones");
const fichaFoto = vitrina.querySelector(".vitrina__foto");

function crear(etiqueta, clase, texto) {
  const nodo = document.createElement(etiqueta);
  if (clase) nodo.className = clase;
  if (texto !== undefined) nodo.textContent = texto;
  return nodo;
}

function crearBoton(texto, accion) {
  const boton = crear("button", "boton boton--borde", texto);
  boton.type = "button";
  boton.dataset.accion = accion;
  return boton;
}

// Cambia el estado de una zona (cargando, error, vacio, datos) y su contenido
function pintar(zona, tipo, ...nodos) {
  zona.dataset.tipo = tipo;
  zona.setAttribute("aria-busy", tipo === "cargando");
  zona.replaceChildren(...nodos);
}

// Un chip (radio) por marca, más «Todas», que va marcado al principio
export function pintarMarcas(marcas) {
  const chips = ["Todas", ...marcas].map((marca) => {
    const radio = crear("input");
    radio.type = "radio";
    radio.name = "marca";
    radio.value = marca === "Todas" ? "todas" : marca;
    radio.checked = marca === "Todas";
    const chip = crear("label", "chip");
    chip.append(radio, crear("span", null, marca));
    return chip;
  });
  filtroMarcas.append(...chips);
}

export function pintarResumen({ total, marcas, lider, maximo }, caidas) {
  const modelos = `${total} ${total === 1 ? "modelo" : "modelos"}`;
  let texto = `${modelos} de ${marcas} marcas · ${lider} manda con ${maximo}.`;
  if (total === 0) texto = "Ningún modelo a la vista.";
  else if (marcas === 1) texto = `${modelos} de ${lider}.`;
  const partes = [crear("p", "resumen__texto", texto)];
  if (caidas.length > 0) {
    partes.push(crear("p", "resumen__caidas", `Sin respuesta: ${caidas.join(", ")}.`), crearBoton("Reintentar", "reintentar-garaje"));
  }
  resumen.replaceChildren(...partes);
}

export function pintarGarajeCargando(numeroMarcas) {
  resumen.replaceChildren();
  const placas = crear("div", "placas");
  placas.append(...Array.from({ length: 18 }, () => crear("span", "placa placa--fantasma")));
  pintar(garaje, "cargando", crear("p", "aviso", `Arrancando motores: preguntando a ${numeroMarcas} marcas a la vez…`), placas);
}

export function pintarGarajeError(mensaje) {
  resumen.replaceChildren();
  pintar(
    garaje,
    "error",
    crear("p", "aviso__titulo", "Motor calado"),
    crear("p", "aviso", mensaje),
    crearBoton("Volver a arrancar", "reintentar-garaje"),
  );
}

function crearPlaca(modelo, posicion, elegidoId) {
  const placa = crear("button", "placa", modelo.nombre);
  placa.type = "button";
  placa.dataset.id = modelo.id;
  placa.setAttribute("aria-pressed", modelo.id === elegidoId);
  placa.style.setProperty("--orden", posicion);
  return placa;
}

export function marcarElegido(id) {
  garaje.querySelectorAll(".placa[data-id]").forEach((placa) => placa.setAttribute("aria-pressed", placa.dataset.id === id));
}

export function pintarGarajeVacio(texto) {
  const buscado = texto.trim() ? ` con «${texto.trim()}»` : "";
  pintar(
    garaje,
    "vacio",
    crear("p", "aviso__titulo", "Box vacío"),
    crear("p", "aviso", `Ningún deportivo coincide${buscado}. Prueba otro nombre o elige «Todas» las marcas.`),
  );
}

// animar solo cuando llegan datos nuevos: al teclear en el buscador no se anima
export function pintarGaraje(grupos, animar, elegidoId) {
  garaje.classList.toggle("animar", animar);
  const secciones = Object.entries(grupos).map(([marca, modelos]) => {
    const titulo = crear("h3", "grupo__marca", marca);
    titulo.append(crear("span", "grupo__cuenta", modelos.length));
    const placas = crear("div", "placas");
    placas.append(...modelos.map((modelo, i) => crearPlaca(modelo, i, elegidoId)));
    const seccion = crear("section", "grupo");
    seccion.append(titulo, placas);
    return seccion;
  });
  pintar(garaje, "datos", ...secciones);
}

// ----- Vitrina: la ficha del coche elegido -----
function pintarVitrina(tipo, modelo, texto, ...acciones) {
  vitrina.dataset.tipo = tipo;
  vitrina.setAttribute("aria-busy", tipo === "cargando");
  fichaModelo.replaceChildren(crear("span", "vitrina__marca", modelo.marca), modelo.nombre);
  fichaTexto.textContent = texto;
  fichaAcciones.replaceChildren(...acciones);
}

function crearSinFoto(texto) {
  return crear("span", "vitrina__sinfoto", texto);
}

function crearFoto(src, modelo) {
  const foto = crear("img");
  foto.src = src;
  foto.alt = `${modelo.marca} ${modelo.nombre}`;
  foto.addEventListener("load", () => foto.classList.add("lista"), { once: true });
  foto.addEventListener("error", () => foto.replaceWith(crearSinFoto("La foto no ha llegado")), { once: true });
  return foto;
}

export function pintarFichaCargando(modelo) {
  pintarVitrina("cargando", modelo, "Buscando su ficha en Wikipedia…");
  fichaFoto.replaceChildren();
}

export function pintarFicha(modelo, ficha) {
  const acciones = [];
  if (ficha.enlace) {
    const enlace = crear("a", "boton", "Leer la ficha completa");
    enlace.href = ficha.enlace;
    enlace.target = "_blank";
    enlace.rel = "noopener";
    acciones.push(enlace);
  }
  pintarVitrina("datos", modelo, ficha.texto, ...acciones);
  fichaFoto.replaceChildren(ficha.foto ? crearFoto(ficha.foto, modelo) : crearSinFoto("Sin foto en Wikipedia"));
}

export function pintarFichaError(modelo, mensaje) {
  pintarVitrina("error", modelo, `No hemos podido traer su ficha. ${mensaje}`, crearBoton("Volver a intentarlo", "reintentar-ficha"));
  fichaFoto.replaceChildren(crearSinFoto("Sin señal"));
}

// Si la vitrina se ha quedado arriba, fuera de la pantalla, sube hasta ella
export function enfocarVitrina() {
  if (vitrina.getBoundingClientRect().top < 0) vitrina.scrollIntoView({ block: "start" });
}
