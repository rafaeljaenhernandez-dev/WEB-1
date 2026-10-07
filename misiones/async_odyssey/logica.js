// ===== Módulo lógica: transforma los datos, sin tocar el DOM ni la red =====
const ARTE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

// Clave de la API → nombre en español (las claves se usan también para el color en el CSS)
export const TIPOS = {
  normal: "Normal", fire: "Fuego", water: "Agua", grass: "Planta", electric: "Eléctrico", ice: "Hielo",
  fighting: "Lucha", poison: "Veneno", ground: "Tierra", flying: "Volador", psychic: "Psíquico", bug: "Bicho",
  rock: "Roca", ghost: "Fantasma", dragon: "Dragón", dark: "Siniestro", steel: "Acero", fairy: "Hada",
};
export const CLAVES_TIPOS = Object.keys(TIPOS);

const STATS = {
  hp: "PS", attack: "Ataque", defense: "Defensa",
  "special-attack": "At. esp.", "special-defense": "Def. esp.", speed: "Velocidad",
};

export const numero = (id) => `N.º ${id}`;
export const nombreTipo = (clave) => TIPOS[clave] ?? clave;

// La API da los nombres en minúsculas y con guiones: "mr-mime" → "mr mime"
// (la mayúscula inicial la pone el CSS con text-transform: capitalize)
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
    .filter((pokemon) => pokemon.id > 0) // NaN > 0 es false: descarta las URLs raras
    .map((pokemon) => ({
      ...pokemon,
      arte: `${ARTE}/${pokemon.id}.png`,
      tipos: (tipos[pokemon.id] ?? []).map((entrada) => entrada.tipo),
    }));
}

// Busca por nombre ("pika") o por número ("25", "#025") y filtra por tipo
export function filtrar(pokemons, { texto = "", tipo = "todos" }) {
  const buscado = texto.trim().toLowerCase().replace("#", "");
  return pokemons.filter(
    (pokemon) =>
      (tipo === "todos" || pokemon.tipos.includes(tipo)) &&
      // Number("025") es 25; Number("pika") es NaN y no coincide con ningún número
      (pokemon.nombre.includes(buscado) || pokemon.id === Number(buscado)),
  );
}

// toSorted no muta el array original
export function ordenar(pokemons, orden) {
  if (orden === "numero") return pokemons.toSorted((a, b) => a.id - b.id);
  if (orden === "za") return pokemons.toSorted((a, b) => (a.nombre < b.nombre ? 1 : -1));
  return pokemons.toSorted((a, b) => (a.nombre > b.nombre ? 1 : -1));
}

// Cuenta cuántas veces sale cada tipo con reduce y devuelve el que más
export function tipoMasComun(pokemons) {
  const cuenta = pokemons.flatMap((pokemon) => pokemon.tipos).reduce((total, tipo) => ({ ...total, [tipo]: (total[tipo] ?? 0) + 1 }), {});
  const [tipo, veces] = Object.entries(cuenta).reduce((mejor, par) => (par[1] > mejor[1] ? par : mejor), [null, 0]);
  return { tipo, veces };
}

// Junta las dos respuestas en una ficha limpia, con valores por defecto si falta algo
export function aFicha({ pokemon, especie }) {
  const stats = (pokemon.stats ?? []).map((s) => ({
    nombre: STATS[s.stat?.name] ?? s.stat?.name ?? "?",
    valor: typeof s.base_stat === "number" ? s.base_stat : 0,
  }));
  const descripcion = especie.flavor_text_entries?.at(-1)?.flavor_text;
  return {
    id: pokemon.id,
    nombre: especie.names?.[0]?.name ?? limpiarNombre(pokemon.name ?? "desconocido"),
    categoria: especie.genera?.[0]?.genus ?? "Pokémon",
    // Los textos de los juegos traen saltos de línea a mitad de frase
    descripcion: descripcion?.replaceAll("\n", " ").replaceAll("\f", " ") ?? "La Pokédex aún no tiene una descripción en español.",
    tipos: (pokemon.types ?? []).map((t) => t.type?.name).filter((tipo) => tipo !== undefined),
    altura: typeof pokemon.height === "number" ? `${pokemon.height / 10} m` : "?",
    peso: typeof pokemon.weight === "number" ? `${pokemon.weight / 10} kg` : "?",
    stats,
    total: stats.reduce((suma, s) => suma + s.valor, 0),
    mejor: stats.reduce((mejor, s) => (s.valor > mejor.valor ? s : mejor), { nombre: "—", valor: 0 }),
    arte: `${ARTE}/${pokemon.id}.png`,
  };
}
