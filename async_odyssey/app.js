// ===== API: lo único que habla con la Open Library =====
const URL_BUSQUEDA = "https://openlibrary.org/search.json";
const CAMPOS = "key,title,author_name,first_publish_year,cover_i,edition_count";

async function buscarLibros(consulta) {
  const parametros = new URLSearchParams({ q: consulta, limit: 40, fields: CAMPOS });
  try {
    const respuesta = await fetch(`${URL_BUSQUEDA}?${parametros}`, {
      signal: AbortSignal.timeout(10000),
    });
    // fetch no rechaza con un 404 o un 500: hay que mirar response.ok
    if (!respuesta.ok) throw new Error(`La biblioteca respondió con un error (HTTP ${respuesta.status}).`);
    const datos = await respuesta.json();
    return Array.isArray(datos?.docs) ? datos.docs : [];
  } catch (error) {
    if (error.name === "TimeoutError") throw new Error("La biblioteca tarda demasiado en contestar.");
    if (error.name === "TypeError") throw new Error("No hay conexión con la biblioteca. Revisa tu red.");
    throw error;
  }
}

// ===== Render: solo toca el DOM =====
const estado = document.querySelector("#estado");
const estanteria = document.querySelector("#resultados");

function crear(etiqueta, clase, texto) {
  const nodo = document.createElement(etiqueta);
  if (clase) nodo.className = clase;
  if (texto !== undefined) nodo.textContent = texto;
  return nodo;
}

function pintarEstado(tipo, ...nodos) {
  estado.dataset.tipo = tipo;
  estado.replaceChildren(...nodos);
}

function pintarCargando(consulta) {
  estanteria.replaceChildren();
  pintarEstado("cargando", crear("p", "estado__titulo", `Zarpando hacia «${consulta}»…`));
}

function pintarError(mensaje) {
  estanteria.replaceChildren();
  const boton = crear("button", "boton boton--secundario", "Volver a intentarlo");
  boton.type = "button";
  boton.dataset.accion = "reintentar";
  pintarEstado("error", crear("p", "estado__titulo", "Tormenta en alta mar"), crear("p", "estado__texto", mensaje), boton);
}

function pintarVacio(consulta) {
  estanteria.replaceChildren();
  pintarEstado(
    "vacio",
    crear("p", "estado__titulo", "Mar en calma"),
    crear("p", "estado__texto", `Ningún libro responde a «${consulta}». Prueba con otra palabra.`),
  );
}

function pintarLibros(docs) {
  pintarEstado("datos");
  estanteria.replaceChildren(...docs.map((doc) => crear("li", "libro", doc.title)));
}

// ===== Arranque: une la API con el render =====
const formulario = document.querySelector("#buscador");
const campo = document.querySelector("#consulta");
let consultaActual = "";
let numeroBusqueda = 0;

async function buscar(consulta) {
  consultaActual = consulta;
  const miBusqueda = ++numeroBusqueda;
  pintarCargando(consulta);
  try {
    const docs = await buscarLibros(consulta);
    if (miBusqueda !== numeroBusqueda) return; // llegó tarde: ya hay una búsqueda más nueva
    if (docs.length === 0) pintarVacio(consulta);
    else pintarLibros(docs);
  } catch (error) {
    if (miBusqueda === numeroBusqueda) pintarError(error.message);
  }
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const consulta = campo.value.trim();
  if (consulta) buscar(consulta);
});

estado.addEventListener("click", (evento) => {
  if (evento.target.closest("[data-accion='reintentar']")) buscar(consultaActual);
});

buscar("odyssey");
