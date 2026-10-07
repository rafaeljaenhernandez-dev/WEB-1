// ===== Módulo render: solo toca el DOM, no sabe nada de la red =====
import { numero, nombreTipo } from "./logica.js";

const lista = document.querySelector("#lista");
const resumen = document.querySelector("#resumen");
const regiones = document.querySelector("#regiones");
const selectorTipo = document.querySelector("#tipo");
const ficha = document.querySelector("#ficha");

function crear(etiqueta, clase, texto) {
  const nodo = document.createElement(etiqueta);
  if (clase) nodo.className = clase;
  if (texto !== undefined) nodo.textContent = texto;
  return nodo;
}

function crearBoton(texto, accion) {
  const boton = crear("button", "boton", texto);
  boton.type = "button";
  boton.dataset.accion = accion;
  return boton;
}

// Etiqueta de tipo: data-tipo decide su color en el CSS
function crearTipos(tipos) {
  const contenedor = crear("ul", "tipos");
  contenedor.append(
    ...tipos.map((tipo) => {
      const etiqueta = crear("li", "tipo", nombreTipo(tipo));
      etiqueta.dataset.tipo = tipo;
      return etiqueta;
    }),
  );
  return contenedor;
}

function crearArte(src, alt, clase) {
  const imagen = crear("img", clase);
  imagen.src = src;
  imagen.alt = alt;
  imagen.width = 475;
  imagen.height = 475;
  imagen.addEventListener("load", () => imagen.classList.add("lista"), { once: true });
  imagen.addEventListener("error", () => imagen.classList.add("rota"), { once: true });
  return imagen;
}

// Cambia el estado de una zona (cargando, error, vacio, datos) y su contenido
function pintar(zona, tipo, ...nodos) {
  zona.dataset.estado = tipo;
  zona.setAttribute("aria-busy", tipo === "cargando");
  zona.replaceChildren(...nodos);
}

// ----- Mandos -----
export function pintarRegiones(lista) {
  const chips = lista.map((region, i) => {
    const radio = crear("input");
    radio.type = "radio";
    radio.name = "region";
    radio.value = i;
    radio.checked = i === 0;
    const chip = crear("label", "chip");
    chip.append(radio, crear("span", null, region.nombre));
    return chip;
  });
  regiones.append(...chips);
}

export function pintarOpcionesTipo(claves) {
  const opciones = claves.map((clave) => {
    const opcion = crear("option", null, nombreTipo(clave));
    opcion.value = clave;
    return opcion;
  });
  selectorTipo.append(...opciones);
}

export function pintarResumen(visibles, total, region, { tipo, veces }) {
  if (total === 0) resumen.textContent = "";
  else {
    const cuantos = visibles === total ? `${total} Pokémon en ${region}` : `${visibles} de ${total} Pokémon de ${region}`;
    resumen.textContent = tipo ? `${cuantos} · el tipo más común es ${nombreTipo(tipo)} (${veces}).` : `${cuantos}.`;
  }
}

// ----- Lista de la región -----
export function pintarListaCargando(region) {
  resumen.textContent = "";
  const huecos = Array.from({ length: 12 }, () => crear("span", "pokemon pokemon--fantasma"));
  const rejilla = crear("div", "rejilla");
  rejilla.append(...huecos);
  pintar(lista, "cargando", crear("p", "aviso", `Buscando los Pokémon de ${region}…`), rejilla);
}

export function pintarListaError(mensaje) {
  resumen.textContent = "";
  pintar(
    lista,
    "error",
    crear("p", "aviso__titulo", "Error de conexión"),
    crear("p", "aviso", mensaje),
    crearBoton("Volver a intentarlo", "reintentar-lista"),
  );
}

export function pintarListaVacia(texto, region) {
  const mensaje = texto.trim()
    ? `Ningún Pokémon de ${region} coincide con «${texto.trim()}» y ese tipo.`
    : `No hay Pokémon de ${region} con ese tipo. Prueba con otro.`;
  pintar(lista, "vacio", crear("p", "aviso__titulo", "Ni rastro"), crear("p", "aviso", mensaje));
}

function crearPokemon(pokemon, posicion, elegidoId) {
  const boton = crear("button", "pokemon");
  boton.type = "button";
  boton.dataset.id = pokemon.id;
  if (pokemon.tipos[0]) boton.dataset.tipo = pokemon.tipos[0]; // el color de la tarjeta es el del tipo principal
  boton.setAttribute("aria-pressed", pokemon.id === elegidoId);
  boton.style.setProperty("--orden", posicion);

  const arte = crearArte(pokemon.arte, "", "pokemon__arte");
  arte.loading = "lazy";
  boton.append(
    arte,
    crear("span", "pokemon__numero", numero(pokemon.id)),
    crear("span", "pokemon__nombre", pokemon.nombre),
    crearTipos(pokemon.tipos),
  );
  return boton;
}

// animar solo cuando llega una región nueva: al teclear en el buscador no se anima
export function pintarLista(pokemons, animar, elegidoId) {
  lista.classList.toggle("animar", animar);
  const rejilla = crear("div", "rejilla");
  rejilla.append(...pokemons.map((pokemon, i) => crearPokemon(pokemon, i, elegidoId)));
  pintar(lista, "datos", rejilla);
}

export function marcarElegido(id) {
  lista.querySelectorAll(".pokemon[data-id]").forEach((boton) => boton.setAttribute("aria-pressed", Number(boton.dataset.id) === id));
}

// ----- Ficha -----
export function pintarFichaCargando(nombre) {
  delete ficha.dataset.tipo;
  pintar(ficha, "cargando", crear("div", "ficha__foco"), crear("p", "ficha__nombre", nombre), crear("p", "aviso", "Consultando la Pokédex…"));
}

export function pintarFichaError(nombre, mensaje) {
  delete ficha.dataset.tipo;
  pintar(
    ficha,
    "error",
    crear("p", "ficha__nombre", nombre),
    crear("p", "aviso", `No se ha podido leer su ficha. ${mensaje}`),
    crearBoton("Volver a intentarlo", "reintentar-ficha"),
  );
}

function crearStat({ nombre, valor }) {
  const barra = crear("span", "stat__barra");
  barra.style.setProperty("--valor", Math.min(valor, 255)); // 255 es el máximo posible
  const fila = crear("li", "stat");
  fila.append(crear("span", "stat__nombre", nombre), crear("span", "stat__valor", valor), barra);
  return fila;
}

export function pintarFicha(datos) {
  if (datos.tipos[0]) ficha.dataset.tipo = datos.tipos[0];

  const foco = crear("div", "ficha__foco");
  foco.append(crearArte(datos.arte, datos.nombre, "ficha__arte"));

  const stats = crear("ul", "stats");
  stats.append(...datos.stats.map(crearStat));

  const titulo = crear("h2", "ficha__nombre", datos.nombre);
  titulo.append(crear("span", "ficha__numero", numero(datos.id)));

  pintar(
    ficha,
    "datos",
    foco,
    titulo,
    crearTipos(datos.tipos),
    crear("p", "ficha__medidas", `${datos.categoria} · ${datos.altura} · ${datos.peso}`),
    crear("p", "ficha__texto", datos.descripcion),
    stats,
    crear("p", "ficha__total", `Total ${datos.total} · Destaca en ${datos.mejor.nombre}`),
  );
}

// En móvil la ficha queda arriba: si no se ve, sube hasta ella
export function enfocarFicha() {
  if (ficha.getBoundingClientRect().top < 0) ficha.scrollIntoView({ block: "start" });
}
