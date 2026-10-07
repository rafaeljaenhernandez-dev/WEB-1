// ===== Módulo principal: une la API, la lógica y el render =====
import { pedirModelos, pedirFicha } from "./api.js";
import { unirRespuestas, filtrar, ordenar, agruparPorMarca, resumir, aFicha } from "./logica.js";
import * as vista from "./render.js";

const MARCAS = ["Ferrari", "Lamborghini", "Porsche", "McLaren", "Aston Martin", "Bugatti", "Koenigsegg", "Pagani", "Lotus", "Maserati"];

const mandos = document.querySelector("#mandos");
const estado = {
  modelos: [],
  caidas: [],
  elegido: { id: "mclaren-p1", marca: "McLaren", nombre: "P1" }, // el coche que abre la vitrina
};
let numeroFicha = 0; // para descartar fichas que llegan tarde

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
  else vista.pintarGaraje(agruparPorMarca(visibles), animar, estado.elegido.id);
}

async function elegir(modelo) {
  estado.elegido = modelo;
  vista.marcarElegido(modelo.id);
  const miFicha = ++numeroFicha;
  vista.pintarFichaCargando(modelo);
  try {
    const ficha = aFicha(await pedirFicha(modelo.marca, modelo.nombre));
    // si mientras esperábamos se eligió otro coche, esta ficha ya no vale
    if (miFicha === numeroFicha) vista.pintarFicha(modelo, ficha);
  } catch (error) {
    if (miFicha === numeroFicha) vista.pintarFichaError(modelo, error.message);
  }
}

mandos.addEventListener("input", () => refrescar());
mandos.addEventListener("submit", (evento) => evento.preventDefault());

// Delegación: un solo listener para las placas y los botones de reintentar
document.addEventListener("click", (evento) => {
  const placa = evento.target.closest(".placa[data-id]");
  if (placa) {
    elegir(estado.modelos.find((modelo) => modelo.id === placa.dataset.id));
    vista.enfocarVitrina();
  }
  const accion = evento.target.closest("[data-accion]")?.dataset.accion;
  if (accion === "reintentar-garaje") cargarGaraje();
  if (accion === "reintentar-ficha") elegir(estado.elegido);
});

vista.pintarMarcas(MARCAS);
// Las dos cargas arrancan a la vez: la vitrina no espera al garaje
cargarGaraje();
elegir(estado.elegido);
