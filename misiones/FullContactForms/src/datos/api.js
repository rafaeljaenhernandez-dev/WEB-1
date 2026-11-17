// Capa de servicios: el único sitio que sabe hablar con el API (json-server)
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

// GET /equipos (todos o filtrados por juego), del más reciente al más antiguo
export async function obtenerEquipos(juego) {
  let url = `${API_URL}/equipos?_sort=inscrito&_order=desc`;
  if (juego !== "todos") url = url + `&juego=${juego}`;
  const respuesta = await fetch(url);
  if (!respuesta.ok) throw new Error(`No se pudo cargar la lista de equipos (error ${respuesta.status})`);
  return respuesta.json();
}

// POST /equipos. Antes comprueba que el nombre no esté cogido en ese juego (sin distinguir mayúsculas)
export async function crearEquipo(datos) {
  const existentes = await obtenerEquipos(datos.juego);
  const repetido = existentes.some((equipo) => equipo.nombre.toLowerCase() === datos.nombre.toLowerCase());
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
  return respuesta.json();
}

// DELETE /equipos/:id
export async function borrarEquipo(id) {
  const respuesta = await fetch(`${API_URL}/equipos/${id}`, { method: "DELETE" });
  if (!respuesta.ok) throw new Error(`No se pudo dar de baja al equipo (error ${respuesta.status})`);
}
