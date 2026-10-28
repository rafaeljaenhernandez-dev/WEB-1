import Cabecera from "./components/Cabecera.jsx";
import Pie from "./components/Pie.jsx";

export default function App() {
  return (
    <>
      <Cabecera />
      <main className="consola">
        <section className="ficha" aria-label="Ficha del Pokémon"></section>
        <section className="pokedex" aria-labelledby="titulo-pokedex">
          <h2 id="titulo-pokedex" className="pokedex__titulo">Pokédex</h2>
        </section>
      </main>
      <Pie />
    </>
  );
}
