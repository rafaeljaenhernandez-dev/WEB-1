import "./App.css";
import FichaTripulante from "./components/fichaTripulante.jsx";

export default function App() {
  return (
  <main className="tripulacion">
    <h1>Tripulación</h1>
    <div className="fichas">
      <FichaTripulante nombre="Ripley" rol="Capitana" />
      <FichaTripulante nombre="Spock" rol="Oficial científico" especie="vulcana" />
      <FichaTripulante nombre="Chewbacca" rol="Copiloto" especie="wookiee" />
      <FichaTripulante nombre="Scotty" rol="Ingeniero jefe" />
    </div>
  </main>
  )
}
