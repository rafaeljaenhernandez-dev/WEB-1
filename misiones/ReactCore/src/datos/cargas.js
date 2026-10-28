// ===== Las cargas que usan los componentes: piden a la API y transforman =====
import { pedirLista, pedirTipo, pedirFicha } from "./pokeapi.js";
import { REGIONES, CLAVES_TIPOS, tiposPorId, limpiarLista } from "./pokedex.js";
import { aFicha } from "./ficha.js";

// Los 18 tipos se piden una sola vez y a la vez. allSettled nunca rechaza:
// si falla algún tipo, esos Pokémon salen sin color, pero la lista se pinta igual
let tiposListos = null;
function pedirTipos() {
  tiposListos ??= Promise.allSettled(CLAVES_TIPOS.map(pedirTipo)).then((respuestas) => {
    // Si falló alguno (por ejemplo, sin red), se olvida la promesa: el siguiente intento los vuelve a pedir
    if (respuestas.some((respuesta) => respuesta.status === "rejected")) tiposListos = null;
    return tiposPorId(respuestas);
  });
  return tiposListos;
}

export async function cargarRegion(indice) {
  const { desde, hasta } = REGIONES[indice];
  const [resultados, tipos] = await Promise.all([pedirLista(desde, hasta), pedirTipos()]);
  return limpiarLista(resultados, tipos);
}

export async function cargarFicha(id) {
  return aFicha(await pedirFicha(id));
}
