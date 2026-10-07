// ===== Módulo lógica: transforma los datos, sin tocar el DOM ni la red =====
const RUIDO = /trailer|automotive/i; // filas de la API que no son coches

// "SENNA GTR" → "Senna GTR": las palabras largas solo en mayúsculas pasan a nombre propio
export function nombreBonito(nombre) {
  return nombre
    .trim()
    .split(/\s+/)
    .map((palabra) => (/^[A-Z]{4,}$/.test(palabra) ? palabra[0] + palabra.slice(1).toLowerCase() : palabra))
    .join(" ");
}

function esModeloValido(fila) {
  return typeof fila?.Model_Name === "string" && fila.Model_Name.trim() !== "" && !RUIDO.test(fila.Model_Name);
}

function aModelo(marca, fila) {
  const nombre = nombreBonito(fila.Model_Name);
  return { id: `${marca}-${nombre}`.toLowerCase(), marca, nombre };
}

// Une las respuestas de Promise.allSettled en una lista limpia y sin repetidos
export function unirRespuestas(marcas, respuestas) {
  const modelos = respuestas.flatMap((respuesta, i) =>
    respuesta.status === "fulfilled" ? respuesta.value.filter(esModeloValido).map((fila) => aModelo(marcas[i], fila)) : [],
  );
  return {
    modelos: modelos.filter((modelo, i) => modelos.findIndex((otro) => otro.id === modelo.id) === i),
    caidas: marcas.filter((_, i) => respuestas[i].status === "rejected"),
  };
}

export function agruparPorMarca(modelos) {
  return Object.groupBy(modelos, (modelo) => modelo.marca);
}
