// Mensaje de error o de "no hay nada", con un botón opcional
export default function Aviso({ titulo, texto, accion, alPulsar }) {
  return (
    <>
      {titulo && <p className="aviso__titulo">{titulo}</p>}
      <p className="aviso">{texto}</p>
      {accion && (
        <button type="button" className="boton" onClick={alPulsar}>
          {accion}
        </button>
      )}
    </>
  );
}
