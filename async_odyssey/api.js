// ===== Módulo API: lo único que hace peticiones de red =====
const NHTSA = "https://vpic.nhtsa.dot.gov/api/vehicles";

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

async function pedirJSON(url) {
  try {
    const respuesta = await fetch(url, { signal: AbortSignal.timeout(10000) });
    // fetch no rechaza con un 404 o un 500: hay que comprobar response.ok
    if (!respuesta.ok) throw new ErrorHttp(respuesta.status);
    return await respuesta.json();
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
