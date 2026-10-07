// ===== Módulo principal: une la API, la lógica y el render =====
import { pedirModelos } from "./api.js";
import { unirRespuestas, agruparPorMarca } from "./logica.js";
import * as vista from "./render.js";

const MARCAS = ["Ferrari", "Lamborghini", "Porsche", "McLaren", "Aston Martin", "Bugatti", "Koenigsegg", "Pagani", "Lotus", "Maserati"];

const estado = { modelos: [], caidas: [] };

async function cargarGaraje() {
  vista.pintarGarajeCargando(MARCAS.length);
  // allSettled espera a todas y nunca rechaza: si una marca falla, el resto se pinta igual
  const respuestas = await Promise.allSettled(MARCAS.map(pedirModelos));
  Object.assign(estado, unirRespuestas(MARCAS, respuestas));
  refrescar();
}

function refrescar() {
  if (estado.modelos.length === 0) {
    vista.pintarGarajeError("Ninguna marca ha contestado. Comprueba tu conexión y vuelve a intentarlo.");
    return;
  }
  vista.pintarGaraje(agruparPorMarca(estado.modelos));
}

document.addEventListener("click", (evento) => {
  const accion = evento.target.closest("[data-accion]")?.dataset.accion;
  if (accion === "reintentar-garaje") cargarGaraje();
});

cargarGaraje();
