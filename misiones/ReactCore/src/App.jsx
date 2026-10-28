import { useState } from "react";
import { REGIONES, filtrar, ordenar } from "./datos/pokedex.js";
import { cargarRegion } from "./datos/cargas.js";
import { useFetch } from "./hooks/useFetch.js";
import Cabecera from "./components/Cabecera.jsx";
import Ficha from "./components/Ficha.jsx";
import Mandos from "./components/Mandos.jsx";
import Resumen from "./components/Resumen.jsx";
import ListaPokemon from "./components/ListaPokemon.jsx";
import Pie from "./components/Pie.jsx";

const FILTROS_INICIALES = { texto: "", tipo: "todos", orden: "numero" };

export default function App() {
  const [region, setRegion] = useState(0); // índice en REGIONES
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [elegido, setElegido] = useState({ id: 25, nombre: "Pikachu" });

  const carga = useFetch(cargarRegion, region);

  // Derivados en el render: no son estado porque salen de la lista y de los filtros
  const pokemons = carga.datos ?? [];
  const visibles = ordenar(filtrar(pokemons, filtros), filtros.orden);
  const nombreRegion = REGIONES[region].nombre;
  const mensajeVacio = filtros.texto.trim()
    ? `Ningún Pokémon de ${nombreRegion} coincide con «${filtros.texto.trim()}» y ese tipo.`
    : `No hay Pokémon de ${nombreRegion} con ese tipo. Prueba con otro.`;

  // Objeto nuevo con spread: si se modificara filtros, React no vería el cambio
  function cambiarFiltro(campo, valor) {
    setFiltros((anteriores) => ({ ...anteriores, [campo]: valor }));
  }

  return (
    <>
      <Cabecera />
      <main className="consola">
        <Ficha elegido={elegido} />
        <section className="pokedex" aria-labelledby="titulo-pokedex">
          <h2 id="titulo-pokedex" className="pokedex__titulo">Pokédex</h2>
          <Mandos region={region} alCambiarRegion={setRegion} filtros={filtros} alCambiarFiltro={cambiarFiltro} />
          <Resumen visibles={visibles} total={pokemons.length} region={nombreRegion} />
          <ListaPokemon
            region={nombreRegion}
            carga={carga}
            pokemons={visibles}
            elegidoId={elegido.id}
            alElegir={setElegido}
            mensajeVacio={mensajeVacio}
          />
        </section>
      </main>
      <Pie />
    </>
  );
}
