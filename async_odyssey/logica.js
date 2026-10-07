// ===== Módulo lógica: transforma los datos, sin tocar el DOM ni la red =====
const SPRITES = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

const TIPOS = {
  normal: "Normal", fire: "Fuego", water: "Agua", grass: "Planta", electric: "Eléctrico", ice: "Hielo",
  fighting: "Lucha", poison: "Veneno", ground: "Tierra", flying: "Volador", psychic: "Psíquico", bug: "Bicho",
  rock: "Roca", ghost: "Fantasma", dragon: "Dragón", dark: "Siniestro", steel: "Acero", fairy: "Hada",
};

const STATS = {
  hp: "PS", attack: "Ataque", defense: "Defensa",
  "special-attack": "At. esp.", "special-defense": "Def. esp.", speed: "Velocidad",
};

export const numero = (id) => `#${String(id).padStart(3, "0")}`;

// "mr-mime" → "Mr Mime"
function capitalizar(nombre) {
  return nombre
    .split("-")
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join(" ");
}

// La lista solo trae nombre y URL: el número sale del final de la URL (".../pokemon/25/")
function idDesdeUrl(url) {
  return Number(url.split("/").filter(Boolean).at(-1));
}

export function limpiarLista(resultados) {
  return resultados
    .filter((r) => typeof r?.name === "string" && typeof r?.url === "string")
    .map((r) => ({ id: idDesdeUrl(r.url), nombre: capitalizar(r.name) }))
    .filter((pokemon) => Number.isInteger(pokemon.id) && pokemon.id > 0)
    .map((pokemon) => ({ ...pokemon, sprite: `${SPRITES}/${pokemon.id}.png` }));
}

// Busca por nombre ("pika") o por número ("25", "#025")
export function filtrar(pokemons, texto = "") {
  const buscado = texto.trim().toLowerCase().replace("#", "");
  return pokemons.filter(
    (pokemon) => pokemon.nombre.toLowerCase().includes(buscado) || String(pokemon.id) === buscado.replace(/^0+/, ""),
  );
}

// toSorted no muta el array original
export function ordenar(pokemons, orden) {
  if (orden === "numero") return pokemons.toSorted((a, b) => a.id - b.id);
  const porNombre = (a, b) => a.nombre.localeCompare(b.nombre, "es");
  return pokemons.toSorted((a, b) => (orden === "za" ? porNombre(b, a) : porNombre(a, b)));
}

// Junta las dos respuestas en una ficha limpia, con valores por defecto si falta algo
export function aFicha({ pokemon, especie }) {
  const stats = (pokemon.stats ?? []).map((s) => ({
    nombre: STATS[s.stat?.name] ?? s.stat?.name ?? "?",
    valor: Number.isFinite(s.base_stat) ? s.base_stat : 0,
  }));
  const descripcion = especie.flavor_text_entries?.at(-1)?.flavor_text;
  return {
    id: pokemon.id,
    nombre: especie.names?.[0]?.name ?? capitalizar(pokemon.name ?? "Desconocido"),
    categoria: especie.genera?.[0]?.genus ?? "Pokémon",
    descripcion: descripcion?.replace(/\s+/g, " ") ?? "La Pokédex aún no tiene una descripción en español.",
    tipos: (pokemon.types ?? []).map((t) => TIPOS[t.type?.name] ?? t.type?.name ?? "?"),
    altura: Number.isFinite(pokemon.height) ? `${pokemon.height / 10} m` : "?",
    peso: Number.isFinite(pokemon.weight) ? `${pokemon.weight / 10} kg` : "?",
    stats,
    total: stats.reduce((suma, s) => suma + s.valor, 0),
    mejor: stats.reduce((mejor, s) => (s.valor > mejor.valor ? s : mejor), { nombre: "—", valor: 0 }),
    sprite: pokemon.sprites?.front_default ?? `${SPRITES}/${pokemon.id}.png`,
  };
}
