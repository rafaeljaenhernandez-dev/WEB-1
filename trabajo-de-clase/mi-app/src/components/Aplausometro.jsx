import { useState } from "react";

export default function Aplausometro() {
  const [aplausos, setAplausos] = useState(0);

  // El mensaje no es estado: se deriva de aplausos en cada render
  let mensaje;
  if (aplausos < 5) {
    mensaje = "Tímido...";
  } else if (aplausos < 15) {
    mensaje = "¡Se anima la sala!";
  } else {
    mensaje = "¡OVACIÓN TOTAL! 🎉";
  }

  return (
    <section>
      <h2>Aplausómetro</h2>
      <p>Aplausos: {aplausos}</p>
      <p>{mensaje}</p>
      <button onClick={() => setAplausos(aplausos + 1)}>👏 Aplaudir</button>
      <button onClick={() => setAplausos(0)}>Reiniciar</button>
    </section>
  );
}
