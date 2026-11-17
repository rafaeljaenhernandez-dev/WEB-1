import { esquemaEquipo, esquemaLista } from "./esquemas.js";

// Capa de servicios: el único sitio que sabe hablar con el API (json-server)
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

// GET /equipos (todos o filtrados por juego), del más reciente al más antiguo.
// No se fía del servidor: valida cada equipo con Zod (safeParse) y separa los corruptos.
export async function obtenerEquipos(juego) {
  let url = `${API_URL}/equipos?_sort=inscrito&_order=desc`;
  if (juego !== "todos") url = url + `&juego=${juego}`;
  const respuesta = await fetch(url);
  if (!respuesta.ok) throw new Error(`No se pudo cargar la lista de equipos (error ${respuesta.status})`);

  const lista = esquemaLista.safeParse(await respuesta.json());
  if (!lista.success) throw new Error(lista.error.issues[0].message);

  const equipos = [];
  const corruptos = [];
  for (const dato of lista.data) {
    const resultado = esquemaEquipo.safeParse(dato);
    if (resultado.success) {
      equipos.push(resultado.data);
    } else {
      // Se guarda qué falló para poder enseñarlo: { id, campos: ["email", "jugadores"] }
      const campos = resultado.error.issues.map((problema) => problema.path.join("."));
      corruptos.push({ id: dato?.id ?? "sin id", campos: [...new Set(campos)] });
      console.warn("Equipo descartado por datos corruptos:", dato, resultado.error.issues);
    }
  }
  return { equipos, corruptos };
}

// POST /equipos. Antes comprueba que el nombre no esté cogido en ese juego (sin distinguir mayúsculas)
export async function crearEquipo(datos) {
  const { equipos } = await obtenerEquipos(datos.juego);
  const repetido = equipos.some((equipo) => equipo.nombre.toLowerCase() === datos.nombre.toLowerCase());
  if (repetido) throw new Error(`Ya hay un equipo llamado «${datos.nombre}» en este juego. Elige otro nombre.`);

  // "normas" solo sirve para el formulario: no se guarda
  const nuevo = {
    nombre: datos.nombre,
    capitan: datos.capitan,
    email: datos.email,
    nacimiento: datos.nacimiento,
    juego: datos.juego,
    jugadores: datos.jugadores,
    nivel: datos.nivel,
    dias: datos.dias,
    inscrito: new Date().toISOString(),
  };
  const respuesta = await fetch(`${API_URL}/equipos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevo),
  });
  if (!respuesta.ok) throw new Error(`No se pudo inscribir al equipo (error ${respuesta.status})`);

  // También se valida lo que devuelve el POST
  const creado = esquemaEquipo.safeParse(await respuesta.json());
  if (!creado.success) throw new Error("El servidor guardó el equipo pero devolvió datos no válidos");
  return creado.data;
}

// DELETE /equipos/:id
export async function borrarEquipo(id) {
  const respuesta = await fetch(`${API_URL}/equipos/${id}`, { method: "DELETE" });
  if (!respuesta.ok) throw new Error(`No se pudo dar de baja al equipo (error ${respuesta.status})`);
}
