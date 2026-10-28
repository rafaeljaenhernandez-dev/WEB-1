import { useContext } from "react";
import { TemaContext } from "./TemaContext.js";

// Lee el tema y la función para cambiarlo del contexto, no de props
export default function Cabecera() {
  const { tema, alternarTema } = useContext(TemaContext);

  return (
    <header className="videoclub-cabecera">
      <h2>Videoclub Nébula 🎬</h2>
      <button onClick={alternarTema} aria-label={tema === "claro" ? "Pasar a tema oscuro" : "Pasar a tema claro"}>
        {tema === "claro" ? "🌙" : "🌞"}
      </button>
    </header>
  );
}
