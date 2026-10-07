// ===== Módulo render: solo toca el DOM, no sabe nada de la red =====
const garaje = document.querySelector("#garaje");

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

export function pintarGarajeCargando(numeroMarcas) {
  const placas = crear("div", "placas");
  placas.append(...Array.from({ length: 18 }, () => crear("span", "placa placa--fantasma")));
  pintar(garaje, "cargando", crear("p", "aviso", `Arrancando motores: preguntando a ${numeroMarcas} marcas a la vez…`), placas);
}

export function pintarGarajeError(mensaje) {
  pintar(
    garaje,
    "error",
    crear("p", "aviso__titulo", "Motor calado"),
    crear("p", "aviso", mensaje),
    crearBoton("Volver a arrancar", "reintentar-garaje"),
  );
}

function crearPlaca(modelo, posicion) {
  const placa = crear("button", "placa", modelo.nombre);
  placa.type = "button";
  placa.dataset.id = modelo.id;
  placa.style.setProperty("--orden", posicion);
  return placa;
}

export function pintarGaraje(grupos) {
  const secciones = Object.entries(grupos).map(([marca, modelos]) => {
    const titulo = crear("h3", "grupo__marca", marca);
    titulo.append(crear("span", "grupo__cuenta", modelos.length));
    const placas = crear("div", "placas");
    placas.append(...modelos.map(crearPlaca));
    const seccion = crear("section", "grupo");
    seccion.append(titulo, placas);
    return seccion;
  });
  pintar(garaje, "datos", ...secciones);
}
