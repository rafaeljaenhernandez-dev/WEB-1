// ===== Transforma los datos, sin React ni red (viene de logica.js de la M2) =====
const ARTE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

export const REGIONES = [
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

// Clave de la API → nombre en español (las claves se usan también para el color en el CSS)
export const TIPOS = {
  normal: "Normal", fire: "Fuego", water: "Agua", grass: "Planta", electric: "Eléctrico", ice: "Hielo",
  fighting: "Lucha", poison: "Veneno", ground: "Tierra", flying: "Volador", psychic: "Psíquico", bug: "Bicho",
  rock: "Roca", ghost: "Fantasma", dragon: "Dragón", dark: "Siniestro", steel: "Acero", fairy: "Hada",
};
export const CLAVES_TIPOS = Object.keys(TIPOS);

export const numero = (id) => `N.º ${id}`;
export const nombreTipo = (clave) => TIPOS[clave] ?? clave;
export const arteDe = (id) => `${ARTE}/${id}.png`;

// La API da los nombres en minúsculas y con guiones: "mr-mime" → "mr mime"
const limpiarNombre = (nombre) => nombre.replaceAll("-", " ");

// La API solo da URLs: el número es el penúltimo trozo (".../pokemon/25/" → "25")
function idDesdeUrl(url) {
  return Number(String(url).split("/").at(-2));
}

// Une las 18 respuestas de /type en { 25: [{ tipo: "electric" }], 1: [{ tipo: "grass" }, { tipo: "poison" }] … }
export function tiposPorId(respuestas) {
  const entradas = respuestas
    .flatMap((respuesta, i) =>
      respuesta.status === "fulfilled"
        ? respuesta.value.map((p) => ({ id: idDesdeUrl(p.url), slot: p.slot, tipo: CLAVES_TIPOS[i] }))
        : [],
    )
    .filter((entrada) => entrada.id > 0) // NaN > 0 es false: descarta las URLs raras
    .toSorted((a, b) => a.slot - b.slot); // primero el tipo principal
  return Object.groupBy(entradas, (entrada) => entrada.id);
}

export function limpiarLista(resultados, tipos) {
  return resultados
    .filter((r) => typeof r?.name === "string" && typeof r?.url === "string")
    .map((r) => ({ id: idDesdeUrl(r.url), nombre: limpiarNombre(r.name) }))
    .filter((pokemon) => pokemon.id > 0)
    .map((pokemon) => ({
      ...pokemon,
      arte: arteDe(pokemon.id),
      tipos: (tipos[pokemon.id] ?? []).map((entrada) => entrada.tipo),
    }));
}
