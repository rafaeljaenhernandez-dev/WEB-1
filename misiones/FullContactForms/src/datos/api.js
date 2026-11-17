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
