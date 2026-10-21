import { useState } from "react";
import { PREGUNTAS } from "./preguntas.js";
import Resultado from "./Resultado.jsx";
import "./quiz.css";

export default function Quiz() {
  const [indice, setIndice] = useState(0);
  const [puntos, setPuntos] = useState(0);
  // Índice de la opción pulsada en la pregunta actual (null = sin responder)
  const [seleccion, setSeleccion] = useState(null);

  const pregunta = PREGUNTAS[indice];

  function responder(opcion) {
    setSeleccion(opcion);
    if (opcion === pregunta.correcta) {
      setPuntos(puntos + 1);
    }
  }

  function siguiente() {
    setIndice(indice + 1);
    setSeleccion(null);
  }

  function reiniciar() {
    setIndice(0);
    setPuntos(0);
  }

  // La clase de cada botón se calcula en el render a partir de seleccion
  function claseOpcion(opcion) {
    if (seleccion === null) return "";
    if (opcion === pregunta.correcta) return "correcta";
    if (opcion === seleccion) return "incorrecta";
    return "";
  }

  // Pantalla final: ya no quedan preguntas
  if (indice === PREGUNTAS.length) {
    return <Resultado aciertos={puntos} total={PREGUNTAS.length} onReiniciar={reiniciar} />;
  }

  return (
    <section className="quiz">
      <h2>Trivial de la Academia</h2>
      <p className="quiz-texto">{pregunta.texto}</p>

      <div className="quiz-opciones">
        {pregunta.opciones.map((texto, i) => (
          <button
            key={texto}
            className={claseOpcion(i)}
            disabled={seleccion !== null}
            onClick={() => responder(i)}
          >
            {texto}
          </button>
        ))}
      </div>

      {seleccion !== null && (
        <button className="quiz-siguiente" onClick={siguiente}>
          {indice + 1 === PREGUNTAS.length ? "Ver resultado" : "Siguiente"}
        </button>
      )}
    </section>
  );
}
