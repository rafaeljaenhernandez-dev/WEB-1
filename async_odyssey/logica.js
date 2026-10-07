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

export function filtrar(modelos, { texto = "", marca = "todas" }) {
  const buscado = texto.trim().toLowerCase();
  return modelos.filter(
    (modelo) => (marca === "todas" || modelo.marca === marca) && modelo.nombre.toLowerCase().includes(buscado),
  );
}

// toSorted no muta el array original; numeric: true pone "F8" antes que "F12"
export function ordenar(modelos, orden) {
  const porNombre = (a, b) => a.nombre.localeCompare(b.nombre, "es", { numeric: true });
  return modelos.toSorted((a, b) => (orden === "za" ? porNombre(b, a) : porNombre(a, b)));
}

// Ordena por marca (toSorted es estable: respeta el orden de los modelos) y agrupa
export function agruparPorMarca(modelos) {
  const porMarca = modelos.toSorted((a, b) => a.marca.localeCompare(b.marca, "es"));
  return Object.groupBy(porMarca, (modelo) => modelo.marca);
}

// Cuenta los modelos de cada marca con reduce y saca la que tiene más
export function resumir(modelos) {
  const porMarca = modelos.reduce((cuenta, { marca }) => ({ ...cuenta, [marca]: (cuenta[marca] ?? 0) + 1 }), {});
  const [lider, maximo] = Object.entries(porMarca).reduce((mejor, par) => (par[1] > mejor[1] ? par : mejor), ["", 0]);
  return { total: modelos.length, marcas: Object.keys(porMarca).length, lider, maximo };
}
