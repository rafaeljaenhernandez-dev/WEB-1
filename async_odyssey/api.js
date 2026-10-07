// ===== Módulo API: lo único que hace peticiones de red =====
const POKEAPI = "https://pokeapi.co/api/v2";

// Error propio para los fallos HTTP: guarda el código (404, 500…)
export class ErrorHttp extends Error {
  constructor(codigo) {
    super(`El servidor respondió con un error (HTTP ${codigo}).`);
    this.name = "ErrorHttp";
    this.codigo = codigo;
  }
}

// Convierte cualquier fallo en un mensaje que el usuario entienda
function traducirError(error) {
  if (error instanceof ErrorHttp) return error;
  if (error.name === "TimeoutError") return new Error("La PokeAPI tarda demasiado en contestar.");
  if (error.name === "SyntaxError") return new Error("La PokeAPI ha devuelto datos ilegibles.");
  return new Error("Sin conexión. Revisa tu red.");
}

// ----- Caché en localStorage (bonus): cada URL ya pedida se guarda un día -----
const CADUCIDAD = 24 * 60 * 60 * 1000; // un día en milisegundos

function leerCache(url) {
  try {
    const guardado = JSON.parse(localStorage.getItem(`async-odyssey:${url}`));
    return guardado && Date.now() - guardado.fecha < CADUCIDAD ? guardado.datos : null;
  } catch {
    return null; // JSON roto o localStorage bloqueado: como si no hubiera caché
  }
}

function guardarCache(url, datos) {
  try {
    localStorage.setItem(`async-odyssey:${url}`, JSON.stringify({ fecha: Date.now(), datos }));
  } catch {
    // almacenamiento lleno o bloqueado: la app sigue funcionando sin caché
  }
}

// recortar: se queda solo con lo que usamos, para no llenar la caché
async function pedirJSON(url, recortar = (datos) => datos) {
  const enCache = leerCache(url);
  if (enCache) return enCache; // ya la teníamos: no se repite la petición
  try {
    const respuesta = await fetch(url, { signal: AbortSignal.timeout(10000) });
    // fetch no rechaza con un 404 o un 500: hay que comprobar response.ok
    if (!respuesta.ok) throw new ErrorHttp(respuesta.status);
    const datos = recortar((await respuesta.json()) ?? {});
    guardarCache(url, datos);
    return datos;
  } catch (error) {
    throw traducirError(error);
  }
}

export async function pedirLista(desde, hasta) {
  const datos = await pedirJSON(`${POKEAPI}/pokemon?offset=${desde - 1}&limit=${hasta - desde + 1}`);
  return Array.isArray(datos.results) ? datos.results : [];
}

// /pokemon/{id} pesa unos 250 KB (trae todos sus movimientos): guardamos solo lo útil
const recortarPokemon = ({ id, name, height, weight, types, stats, sprites }) => ({
  id, name, height, weight, types, stats, sprites: { front_default: sprites?.front_default },
});

const enEspanol = (lista) => (Array.isArray(lista) ? lista.filter((e) => e?.language?.name === "es") : []);
const recortarEspecie = ({ names, genera, flavor_text_entries }) => ({
  names: enEspanol(names), genera: enEspanol(genera), flavor_text_entries: enEspanol(flavor_text_entries),
});

// Las dos peticiones no dependen una de otra: van en paralelo con Promise.all
export async function pedirFicha(id) {
  const [pokemon, especie] = await Promise.all([
    pedirJSON(`${POKEAPI}/pokemon/${id}`, recortarPokemon),
    pedirJSON(`${POKEAPI}/pokemon-species/${id}`, recortarEspecie),
  ]);
  return { pokemon, especie };
}
