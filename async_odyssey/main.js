// ===== Módulo principal: une la API, la lógica y el render =====
import { pedirModelos } from "./api.js";
import { unirRespuestas, filtrar, ordenar, agruparPorMarca, resumir } from "./logica.js";
import * as vista from "./render.js";

const MARCAS = ["Ferrari", "Lamborghini", "Porsche", "McLaren", "Aston Martin", "Bugatti", "Koenigsegg", "Pagani", "Lotus", "Maserati"];

const mandos = document.querySelector("#mandos");
const estado = { modelos: [], caidas: [] };

async function cargarGaraje() {
  vista.pintarGarajeCargando(MARCAS.length);
  // allSettled espera a todas y nunca rechaza: si una marca falla, el resto se pinta igual
  const respuestas = await Promise.allSettled(MARCAS.map(pedirModelos));
  Object.assign(estado, unirRespuestas(MARCAS, respuestas));
  refrescar(true);
}

function refrescar(animar = false) {
  if (estado.modelos.length === 0) {
    vista.pintarGarajeError("Ninguna marca ha contestado. Comprueba tu conexión y vuelve a intentarlo.");
    return;
  }
  const filtros = Object.fromEntries(new FormData(mandos)); // { texto, orden, marca }
  const visibles = ordenar(filtrar(estado.modelos, filtros), filtros.orden);
  vista.pintarResumen(resumir(visibles), estado.caidas);
  if (visibles.length === 0) vista.pintarGarajeVacio(filtros.texto);
  else vista.pintarGaraje(agruparPorMarca(visibles), animar);
}

mandos.addEventListener("input", () => refrescar());
mandos.addEventListener("submit", (evento) => evento.preventDefault());

document.addEventListener("click", (evento) => {
  const accion = evento.target.closest("[data-accion]")?.dataset.accion;
  if (accion === "reintentar-garaje") cargarGaraje();
});

vista.pintarMarcas(MARCAS);
cargarGaraje();
