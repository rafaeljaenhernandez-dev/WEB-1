// ===== Monta la ficha de un Pokémon con sus dos respuestas (viene de aFicha de la M2) =====
import { arteDe } from "./pokedex.js";

const STATS = {
  hp: "PS", attack: "Ataque", defense: "Defensa",
  "special-attack": "At. esp.", "special-defense": "Def. esp.", speed: "Velocidad",
};

// Junta /pokemon y /pokemon-species en una ficha limpia, con valores por defecto si falta algo
export function aFicha({ pokemon, especie }) {
  const stats = (pokemon.stats ?? []).map((s) => ({
    nombre: STATS[s.stat?.name] ?? s.stat?.name ?? "?",
    valor: typeof s.base_stat === "number" ? s.base_stat : 0,
  }));
  const descripcion = especie.flavor_text_entries?.at(-1)?.flavor_text;
  return {
    id: pokemon.id,
    nombre: especie.names?.[0]?.name ?? (pokemon.name ?? "desconocido").replaceAll("-", " "),
    categoria: especie.genera?.[0]?.genus ?? "Pokémon",
    // Los textos de los juegos traen saltos de línea a mitad de frase
    descripcion: descripcion?.replaceAll("\n", " ").replaceAll("\f", " ") ?? "La Pokédex aún no tiene una descripción en español.",
    tipos: (pokemon.types ?? []).map((t) => t.type?.name).filter((tipo) => tipo !== undefined),
    altura: typeof pokemon.height === "number" ? `${pokemon.height / 10} m` : "?",
    peso: typeof pokemon.weight === "number" ? `${pokemon.weight / 10} kg` : "?",
    stats,
    total: stats.reduce((suma, s) => suma + s.valor, 0),
    mejor: stats.reduce((mejor, s) => (s.valor > mejor.valor ? s : mejor), { nombre: "—", valor: 0 }),
    arte: arteDe(pokemon.id),
  };
}
