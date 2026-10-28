import { useState } from "react";

// Input controlado: el texto del campo vive en el estado del formulario
export default function FormularioHabito({ onAnadir }) {
  const [texto, setTexto] = useState("");

  function manejarEnvio(evento) {
    evento.preventDefault(); // evita que la página se recargue
    const nombre = texto.trim();
    if (nombre === "") return; // rechaza hábitos vacíos (o solo con espacios)
    onAnadir(nombre);
    setTexto(""); // limpia el input tras añadir
  }

  return (
    <form className="habitos-formulario" onSubmit={manejarEnvio}>
      <input
        type="text"
        placeholder="Nuevo hábito, p. ej. «Salir a correr»"
        value={texto}
        onChange={(evento) => setTexto(evento.target.value)}
      />
      <button type="submit">Añadir</button>
    </form>
  );
}
