// ===== Módulo render: solo toca el DOM, no sabe nada de la red =====
import { numero } from "./logica.js";

const lista = document.querySelector("#lista");
const resumen = document.querySelector("#resumen");
const regiones = document.querySelector("#regiones");
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

// Cambia el estado de una zona (cargando, error, vacio, datos) y su contenido
function pintar(zona, tipo, ...nodos) {
  zona.dataset.tipo = tipo;
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

export function pintarResumen(visibles, total, region) {
  if (total === 0) resumen.textContent = "";
  else if (visibles === total) resumen.textContent = `${total} Pokémon en ${region}.`;
  else resumen.textContent = `${visibles} de ${total} Pokémon de ${region}.`;
}

// ----- Lista de la región -----
export function pintarListaCargando(region) {
  resumen.textContent = "";
  const huecos = Array.from({ length: 24 }, () => crear("span", "pokemon pokemon--fantasma"));
  const rejilla = crear("div", "rejilla");
  rejilla.append(...huecos);
  pintar(lista, "cargando", crear("p", "aviso", `Conectando con ${region}…`), rejilla);
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
    ? `Ningún Pokémon de ${region} coincide con «${texto.trim()}».`
    : `${region} ha llegado sin Pokémon. Prueba con otra región.`;
  pintar(lista, "vacio", crear("p", "aviso__titulo", "Hierba alta vacía"), crear("p", "aviso", mensaje));
}

function crearPokemon(pokemon, posicion, elegidoId) {
  const sprite = crear("img", "pokemon__sprite");
  sprite.src = pokemon.sprite;
  sprite.alt = "";
  sprite.width = 96;
  sprite.height = 96;
  sprite.loading = "lazy";
  sprite.addEventListener("error", () => sprite.classList.add("pokemon__sprite--roto"), { once: true });

  const boton = crear("button", "pokemon");
  boton.type = "button";
  boton.dataset.id = pokemon.id;
  boton.setAttribute("aria-pressed", pokemon.id === elegidoId);
  boton.style.setProperty("--orden", posicion);
  boton.append(sprite, crear("span", "pokemon__numero", numero(pokemon.id)), crear("span", "pokemon__nombre", pokemon.nombre));
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

// ----- Ficha (la pantalla de la Game Boy) -----
export function pintarFichaCargando(nombre) {
  pintar(ficha, "cargando", crear("p", "pantalla__nombre", nombre), crear("p", "pantalla__parpadeo", "Leyendo datos…"));
}

export function pintarFichaError(nombre, mensaje) {
  pintar(
    ficha,
    "error",
    crear("p", "pantalla__nombre", nombre),
    crear("p", "pantalla__texto", `No se ha podido leer su ficha. ${mensaje}`),
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
  const titulo = crear("h2", "pantalla__nombre", datos.nombre);
  titulo.prepend(crear("span", "pantalla__numero", `${numero(datos.id)} `));

  const sprite = crear("img", "pantalla__sprite");
  sprite.src = datos.sprite;
  sprite.alt = datos.nombre;
  sprite.width = 96;
  sprite.height = 96;
  sprite.addEventListener("load", () => sprite.classList.add("lista"), { once: true });
  sprite.addEventListener("error", () => sprite.replaceWith(crear("p", "pantalla__sinsprite", "Sin imagen")), { once: true });

  const tipos = crear("ul", "tipos");
  tipos.append(...datos.tipos.map((tipo) => crear("li", "tipo", tipo)));

  const medidas = crear("p", "pantalla__medidas", `${datos.categoria} · ${datos.altura} · ${datos.peso}`);

  const stats = crear("ul", "stats");
  stats.append(...datos.stats.map(crearStat));

  const total = crear("p", "pantalla__total", `Total ${datos.total} · Destaca en ${datos.mejor.nombre}`);

  pintar(ficha, "datos", titulo, sprite, tipos, medidas, crear("p", "pantalla__texto", datos.descripcion), stats, total);
}

// En móvil la ficha queda arriba: si no se ve, sube hasta ella
export function enfocarFicha() {
  if (ficha.getBoundingClientRect().top < 0) ficha.scrollIntoView({ block: "start" });
}
