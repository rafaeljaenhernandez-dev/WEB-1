// ===== Módulo API: lo único que hace peticiones de red =====
const NHTSA = "https://vpic.nhtsa.dot.gov/api/vehicles";
const WIKIPEDIA = "https://es.wikipedia.org/api/rest_v1/page/summary";

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
  if (error.name === "TimeoutError") return new Error("El servidor tarda demasiado en contestar.");
  if (error.name === "SyntaxError") return new Error("El servidor ha devuelto datos ilegibles.");
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

async function pedirJSON(url) {
  const enCache = leerCache(url);
  if (enCache) return enCache; // ya la teníamos: no se repite la petición
  try {
    const respuesta = await fetch(url, { signal: AbortSignal.timeout(10000) });
    // fetch no rechaza con un 404 o un 500: hay que comprobar response.ok
    if (!respuesta.ok) throw new ErrorHttp(respuesta.status);
    const datos = await respuesta.json();
    guardarCache(url, datos);
    return datos;
  } catch (error) {
    throw traducirError(error);
  }
}

export async function pedirModelos(marca) {
  const datos = await pedirJSON(
    `${NHTSA}/GetModelsForMakeYear/make/${encodeURIComponent(marca)}/vehicletype/car?format=json`,
  );
  return Array.isArray(datos?.Results) ? datos.Results : [];
}

// Un 404 de Wikipedia no es un fallo: significa que ese modelo no tiene artículo
export async function pedirFicha(marca, modelo) {
  const titulo = encodeURIComponent(`${marca} ${modelo}`.replaceAll(" ", "_"));
  try {
    return await pedirJSON(`${WIKIPEDIA}/${titulo}`);
  } catch (error) {
    if (error.codigo === 404) return null;
    throw error;
  }
}
