// Atributos ARIA de un input: aria-invalid y aria-describedby apuntando a la ayuda y al error
export function ariaDelCampo(id, error, conAyuda = false) {
  const descripciones = [];
  if (conAyuda) descripciones.push(`ayuda-${id}`);
  if (error) descripciones.push(`error-${id}`);
  return {
    id,
    "aria-invalid": error ? "true" : "false",
    "aria-describedby": descripciones.length > 0 ? descripciones.join(" ") : undefined,
  };
}
