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

export const numero = (id) => `N.º ${String(id).padStart(4, "0")}`;
export const nombreTipo = (clave) => TIPOS[clave] ?? clave;

// "mr-mime" → "Mr Mime"
function capitalizar(nombre) {
  return nombre
    .split("-")
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join(" ");
}

// La API solo da URLs: el número sale del final (".../pokemon/25/")
function idDesdeUrl(url) {
  return Number(String(url).split("/").filter(Boolean).at(-1));
}

// Une las 18 respuestas de /type en { 25: [{ tipo: "electric" }], 1: [{ tipo: "grass" }, { tipo: "poison" }] … }
export function tiposPorId(respuestas) {
  const entradas = respuestas
    .flatMap((respuesta, i) =>
      respuesta.status === "fulfilled"
        ? respuesta.value.map((p) => ({ id: idDesdeUrl(p.url), slot: p.slot, tipo: CLAVES_TIPOS[i] }))
        : [],
    )
    .filter((entrada) => Number.isInteger(entrada.id))
    .toSorted((a, b) => a.slot - b.slot); // primero el tipo principal
  return Object.groupBy(entradas, (entrada) => entrada.id);
}

export function limpiarLista(resultados, tipos) {
  return resultados
    .filter((r) => typeof r?.name === "string" && typeof r?.url === "string")
    .map((r) => ({ id: idDesdeUrl(r.url), nombre: capitalizar(r.name) }))
    .filter((pokemon) => Number.isInteger(pokemon.id) && pokemon.id > 0)
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
      (pokemon.nombre.toLowerCase().includes(buscado) || String(pokemon.id) === buscado.replace(/^0+/, "")),
  );
}

// toSorted no muta el array original
export function ordenar(pokemons, orden) {
  if (orden === "numero") return pokemons.toSorted((a, b) => a.id - b.id);
  const porNombre = (a, b) => a.nombre.localeCompare(b.nombre, "es");
  return pokemons.toSorted((a, b) => (orden === "za" ? porNombre(b, a) : porNombre(a, b)));
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
    valor: Number.isFinite(s.base_stat) ? s.base_stat : 0,
  }));
  const descripcion = especie.flavor_text_entries?.at(-1)?.flavor_text;
  return {
    id: pokemon.id,
    nombre: especie.names?.[0]?.name ?? capitalizar(pokemon.name ?? "Desconocido"),
    categoria: especie.genera?.[0]?.genus ?? "Pokémon",
    descripcion: descripcion?.replace(/\s+/g, " ") ?? "La Pokédex aún no tiene una descripción en español.",
    tipos: (pokemon.types ?? []).map((t) => t.type?.name).filter(Boolean),
    altura: Number.isFinite(pokemon.height) ? `${pokemon.height / 10} m` : "?",
    peso: Number.isFinite(pokemon.weight) ? `${pokemon.weight / 10} kg` : "?",
    stats,
    total: stats.reduce((suma, s) => suma + s.valor, 0),
    mejor: stats.reduce((mejor, s) => (s.valor > mejor.valor ? s : mejor), { nombre: "—", valor: 0 }),
    arte: `${ARTE}/${pokemon.id}.png`,
  };
}
