export default function Resultado({ aciertos, total, onReiniciar }) {
  // El porcentaje y el mensaje no son estado: se derivan de aciertos
  const porcentaje = (aciertos / total) * 100;

  let mensaje;
  if (porcentaje === 100) {
    mensaje = "¡Pleno! Dominas React 🧠";
  } else if (porcentaje >= 50) {
    mensaje = "Bien, pero repasa lo que has fallado.";
  } else {
    mensaje = "Toca volver a los apuntes de la U3.";
  }

  return (
    <section className="quiz">
      <h2>Resultado</h2>
      <p className="quiz-texto">{aciertos} de {total} aciertos</p>
      <p>{mensaje}</p>
      <button className="quiz-siguiente" onClick={onReiniciar}>Jugar otra vez</button>
    </section>
  );
}
