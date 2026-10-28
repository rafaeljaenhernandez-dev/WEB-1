import { useState } from "react";
import "./App.css";
import Boton from "./components/button.jsx";
import Saludo from "./components/saludo.jsx";
import FichaTripulante from "./components/fichaTripulante.jsx";
import Aplausometro from "./components/Aplausometro.jsx";
import Quiz from "./misiones/quiz/Quiz.jsx";
import AppHabitos from "./misiones/habitos/AppHabitos.jsx";

// Ejercicios del menú, en el orden en que se hicieron en clase
const ejercicios = [
  { id: "boton", titulo: "Botón" },
  { id: "saludo", titulo: "Saludo" },
  { id: "tripulacion", titulo: "Tripulación" },
  { id: "aplausometro", titulo: "Aplausómetro" },
  { id: "quiz", titulo: "M1 · Trivial" },
  { id: "habitos", titulo: "M2 · Hábitos" },
];

export default function App() {
  const [actual, setActual] = useState("habitos");

  return (
    <main className="app">
      <h1>Ejercicios de clase</h1>

      <nav className="menu">
        {ejercicios.map((ejercicio) => (
          <button
            key={ejercicio.id}
            className={ejercicio.id === actual ? "activo" : ""}
            onClick={() => setActual(ejercicio.id)}
          >
            {ejercicio.titulo}
          </button>
        ))}
      </nav>

      {actual === "boton" && <Boton />}

      {actual === "saludo" && <Saludo nombre="Rafa" apellido="Jaén" />}

      {actual === "tripulacion" && (
        <section>
          <h2>Tripulación</h2>
          <div className="fichas">
            <FichaTripulante nombre="Ripley" rol="Capitana" />
            <FichaTripulante nombre="Spock" rol="Oficial científico" especie="vulcana" />
            <FichaTripulante nombre="Chewbacca" rol="Copiloto" especie="wookiee" />
            <FichaTripulante nombre="Scotty" rol="Ingeniero jefe" />
          </div>
        </section>
      )}

      {actual === "aplausometro" && <Aplausometro />}

      {actual === "quiz" && <Quiz />}

      {actual === "habitos" && <AppHabitos />}
    </main>
  );
}
