import { useEffect, useState } from "react";
import { REGIONES, filtrar, ordenar } from "./datos/pokedex.js";
import { cargarRegion } from "./datos/cargas.js";
import { useFetch } from "./hooks/useFetch.js";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import Cabecera from "./components/Cabecera.jsx";
import Ficha from "./components/Ficha.jsx";
import Equipo, { TAMANO_EQUIPO } from "./components/Equipo.jsx";
import Mandos from "./components/Mandos.jsx";
import Resumen from "./components/Resumen.jsx";
import ListaPokemon from "./components/ListaPokemon.jsx";
import Pie from "./components/Pie.jsx";

const FILTROS_INICIALES = { texto: "", tipo: "todos", orden: "numero" };

// Lo que se lee de localStorage puede venir roto: cada miembro tiene que tener id, nombre y tipos
const esEquipoValido = (valor) =>
  Array.isArray(valor) &&
  valor.length <= TAMANO_EQUIPO &&
  valor.every((p) => typeof p?.id === "number" && typeof p?.nombre === "string" && Array.isArray(p?.tipos));

export default function App() {
  const [region, setRegion] = useState(0); // índice en REGIONES
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [elegido, setElegido] = useState({ id: 25, nombre: "Pikachu" });
  // El equipo está aquí arriba porque lo usan dos hermanos: la ficha y el panel del equipo
  const [equipo, setEquipo] = useLocalStorage("reactor-core:equipo", [], esEquipoValido);

  const carga = useFetch(cargarRegion, region);

  // Derivados en el render: no son estado porque salen de la lista, los filtros y el equipo
  const pokemons = carga.datos ?? [];
  const visibles = ordenar(filtrar(pokemons, filtros), filtros.orden);
  const nombreRegion = REGIONES[region].nombre;
  const enEquipo = equipo.some((pokemon) => pokemon.id === elegido.id);
  const equipoLleno = equipo.length === TAMANO_EQUIPO;
  const mensajeVacio = filtros.texto.trim()
    ? `Ningún Pokémon de ${nombreRegion} coincide con «${filtros.texto.trim()}» y ese tipo.`
    : `No hay Pokémon de ${nombreRegion} con ese tipo. Prueba con otro.`;

  // Efecto: el título de la pestaña es un sistema externo a React
  useEffect(() => {
    // Los nombres de la lista vienen en minúsculas: se pone la inicial en mayúscula
    document.title = `${elegido.nombre[0].toUpperCase()}${elegido.nombre.slice(1)} · Reactor Core`;
  }, [elegido.nombre]);

  // Objeto nuevo con spread: si se modificara filtros, React no vería el cambio
  function cambiarFiltro(campo, valor) {
    setFiltros((anteriores) => ({ ...anteriores, [campo]: valor }));
  }

  function quitarDelEquipo(id) {
    setEquipo((anterior) => anterior.filter((pokemon) => pokemon.id !== id));
  }

  // Recibe la ficha entera, pero en el equipo solo se guarda lo que hace falta
  function alternarEquipo({ id, nombre, tipos }) {
    if (enEquipo) quitarDelEquipo(id);
    else if (!equipoLleno) setEquipo((anterior) => [...anterior, { id, nombre, tipos }]);
  }

  return (
    <>
      <Cabecera />
      <main className="consola">
        <Ficha elegido={elegido} enEquipo={enEquipo} equipoLleno={equipoLleno} alAlternarEquipo={alternarEquipo} />
        <section className="pokedex" aria-labelledby="titulo-pokedex">
          <h2 id="titulo-pokedex" className="pokedex__titulo">Pokédex</h2>
          <Equipo equipo={equipo} elegidoId={elegido.id} alElegir={setElegido} alQuitar={quitarDelEquipo} />
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
