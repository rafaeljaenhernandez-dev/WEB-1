// ===== Módulo principal: une la API, la lógica y el render =====
import { pedirLista, pedirTipo, pedirFicha } from "./api.js";
import { CLAVES_TIPOS, tiposPorId, limpiarLista, filtrar, ordenar, tipoMasComun, aFicha } from "./logica.js";
import * as vista from "./render.js";

const REGIONES = [
  { nombre: "Kanto", desde: 1, hasta: 151 },
  { nombre: "Johto", desde: 152, hasta: 251 },
  { nombre: "Hoenn", desde: 252, hasta: 386 },
  { nombre: "Sinnoh", desde: 387, hasta: 493 },
  { nombre: "Teselia", desde: 494, hasta: 649 },
  { nombre: "Kalos", desde: 650, hasta: 721 },
  { nombre: "Alola", desde: 722, hasta: 809 },
  { nombre: "Galar", desde: 810, hasta: 905 },
  { nombre: "Paldea", desde: 906, hasta: 1025 },
];

const mandos = document.querySelector("#mandos");
const estado = {
  region: REGIONES[0],
  pokemons: [],
  elegido: { id: 25, nombre: "Pikachu" }, // el Pokémon que abre la ficha
};
// Contadores para descartar respuestas que llegan tarde
let numeroLista = 0;
let numeroFicha = 0;

// Los 18 tipos se piden una sola vez y a la vez. allSettled nunca rechaza:
// si falla algún tipo, esos Pokémon salen sin color, pero la lista se pinta igual
const tiposListos = Promise.allSettled(CLAVES_TIPOS.map(pedirTipo)).then(tiposPorId);

async function cargarRegion(region) {
  estado.region = region;
  const miLista = ++numeroLista;
  vista.pintarListaCargando(region.nombre);
  try {
    const [resultados, tipos] = await Promise.all([pedirLista(region.desde, region.hasta), tiposListos]);
    if (miLista !== numeroLista) return; // mientras esperábamos se eligió otra región
    estado.pokemons = limpiarLista(resultados, tipos);
    refrescar(true);
  } catch (error) {
    if (miLista === numeroLista) vista.pintarListaError(error.message);
  }
}

function refrescar(animar = false) {
  const filtros = Object.fromEntries(new FormData(mandos)); // { region, texto, tipo, orden }
  const visibles = ordenar(filtrar(estado.pokemons, filtros), filtros.orden);
  vista.pintarResumen(visibles.length, estado.pokemons.length, estado.region.nombre, tipoMasComun(visibles));
  if (visibles.length === 0) vista.pintarListaVacia(filtros.texto, estado.region.nombre);
  else vista.pintarLista(visibles, animar, estado.elegido.id);
}

async function elegir({ id, nombre }) {
  estado.elegido = { id, nombre };
  vista.marcarElegido(id);
  const miFicha = ++numeroFicha;
  vista.pintarFichaCargando(nombre);
  try {
    const ficha = aFicha(await pedirFicha(id));
    if (miFicha === numeroFicha) vista.pintarFicha(ficha);
  } catch (error) {
    if (miFicha === numeroFicha) vista.pintarFichaError(nombre, error.message);
  }
}

// Cambiar de región pide datos nuevos; buscar, filtrar u ordenar solo vuelve a pintar
mandos.addEventListener("input", (evento) => {
  if (evento.target.name === "region") cargarRegion(REGIONES[Number(evento.target.value)]);
  else refrescar();
});
mandos.addEventListener("submit", (evento) => evento.preventDefault());

// Delegación: un solo listener para los Pokémon y los botones de reintentar
document.addEventListener("click", (evento) => {
  const boton = evento.target.closest(".pokemon[data-id]");
  if (boton) {
    elegir(estado.pokemons.find((pokemon) => pokemon.id === Number(boton.dataset.id)));
    vista.enfocarFicha();
  }
  const accion = evento.target.closest("[data-accion]")?.dataset.accion;
  if (accion === "reintentar-lista") cargarRegion(estado.region);
  if (accion === "reintentar-ficha") elegir(estado.elegido);
});

vista.pintarRegiones(REGIONES);
vista.pintarOpcionesTipo(CLAVES_TIPOS);
// La lista y la ficha arrancan a la vez: ninguna espera a la otra
cargarRegion(estado.region);
elegir(estado.elegido);
