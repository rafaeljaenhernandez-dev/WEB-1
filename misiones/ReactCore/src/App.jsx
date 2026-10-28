import { useState } from "react";
import { REGIONES } from "./datos/pokedex.js";
import { cargarRegion } from "./datos/cargas.js";
import { useFetch } from "./hooks/useFetch.js";
import Cabecera from "./components/Cabecera.jsx";
import Regiones from "./components/Regiones.jsx";
import ListaPokemon from "./components/ListaPokemon.jsx";
import Pie from "./components/Pie.jsx";

export default function App() {
  const [region, setRegion] = useState(0); // índice en REGIONES
  const [elegido, setElegido] = useState({ id: 25, nombre: "Pikachu" });

  const carga = useFetch(cargarRegion, region);
  const pokemons = carga.datos ?? [];

  return (
    <>
      <Cabecera />
      <main className="consola">
        <section className="ficha" aria-label="Ficha del Pokémon"></section>
        <section className="pokedex" aria-labelledby="titulo-pokedex">
          <h2 id="titulo-pokedex" className="pokedex__titulo">Pokédex</h2>
          <form className="mandos" role="search" onSubmit={(evento) => evento.preventDefault()}>
            <Regiones indice={region} alCambiar={setRegion} />
          </form>
          <ListaPokemon
            region={REGIONES[region].nombre}
            carga={carga}
            pokemons={pokemons}
            elegidoId={elegido.id}
            alElegir={setElegido}
            mensajeVacio={`No hay Pokémon en ${REGIONES[region].nombre}.`}
          />
        </section>
      </main>
      <Pie />
    </>
  );
}
