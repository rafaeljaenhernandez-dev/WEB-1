// Piezas de accesibilidad que se repiten en todos los campos del formulario

// Atributos ARIA del input: aria-invalid y aria-describedby apuntando a la ayuda y al error
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

// Mensaje de error de un campo: role="alert" para que el lector lo anuncie al aparecer
export function MensajeError({ id, error }) {
  if (!error) return null;
  return (
    <p id={`error-${id}`} role="alert" className="error">
      {error.message}
    </p>
  );
}

// Etiqueta + input (children) + ayuda opcional + error
export default function Campo({ id, etiqueta, error, ayuda, children }) {
  return (
    <div className="campo">
      <label htmlFor={id}>{etiqueta}</label>
      {children}
      {ayuda && (
        <p id={`ayuda-${id}`} className="ayuda">
          {ayuda}
        </p>
      )}
      <MensajeError id={id} error={error} />
    </div>
  );
}
