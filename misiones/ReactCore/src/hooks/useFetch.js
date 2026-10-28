import { useEffect, useState } from "react";

// Hook propio: ejecuta cargar(argumento) y devuelve { cargando, error, datos, reintentar }.
// cargar tiene que ser una función de fuera del componente (si no, cambiaría en cada render)
export function useFetch(cargar, argumento) {
  const [intento, setIntento] = useState(0);
  // La respuesta guarda a qué petición pertenece: así "cargando" se deriva y no es otro estado
  const [respuesta, setRespuesta] = useState(null);
  const peticion = `${argumento}#${intento}`;

  useEffect(() => {
    // Si el argumento cambia antes de que llegue la respuesta, la limpieza la marca
    // como vieja y no se guarda (así no pisa a la nueva)
    let ignorar = false;
    async function pedir() {
      try {
        const datos = await cargar(argumento);
        if (!ignorar) setRespuesta({ peticion, datos, error: null });
      } catch (error) {
        if (!ignorar) setRespuesta({ peticion, datos: null, error: error.message });
      }
    }
    pedir();
    return () => {
      ignorar = true;
    };
  }, [cargar, argumento, peticion]);

  const alDia = respuesta?.peticion === peticion;
  return {
    cargando: !alDia,
    error: alDia ? respuesta.error : null,
    datos: alDia ? respuesta.datos : null,
    reintentar: () => setIntento((i) => i + 1),
  };
}
