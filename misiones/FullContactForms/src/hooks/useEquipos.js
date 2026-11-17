import { useQuery } from "@tanstack/react-query";
import { obtenerEquipos } from "../datos/api.js";

// Clave ["equipos", juego]: cada filtro tiene su propia entrada en la caché,
// y todas comparten el prefijo "equipos" para poder invalidarlas de golpe
export function useEquipos(juego) {
  return useQuery({
    queryKey: ["equipos", juego],
    queryFn: () => obtenerEquipos(juego),
  });
}
