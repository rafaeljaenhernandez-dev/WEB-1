import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { borrarEquipo, crearEquipo, obtenerEquipos } from "../datos/api.js";

// Clave ["equipos", juego]: cada filtro tiene su propia entrada en la caché,
// y todas comparten el prefijo "equipos" para poder invalidarlas de golpe
export function useEquipos(juego) {
  return useQuery({
    queryKey: ["equipos", juego],
    queryFn: () => obtenerEquipos(juego),
  });
}

// Tras inscribir, invalida ["equipos"]: se refrescan "todos" y el filtro de cada juego
export function useInscribir() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: crearEquipo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["equipos"] }),
  });
}

// Tras dar de baja, lo mismo
export function useDarDeBaja() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: borrarEquipo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["equipos"] }),
  });
}
