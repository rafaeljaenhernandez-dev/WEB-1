import FichaTripulante from "./components/fichaTripulante.jsx";

export default function App() {
  return (
  <>
    <FichaTripulante nombre="Ripley" rol="Capitana" />
    <FichaTripulante nombre="Spock" rol="Oficial científico" especie="vulcana" />
    <FichaTripulante nombre="Chewbacca" rol="Copiloto" especie="wookiee" />
    <FichaTripulante nombre="Scotty" rol="Ingeniero jefe" />
  </>
  )
}
