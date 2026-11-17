// Piezas de accesibilidad que se repiten en todos los campos del formulario

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
