import Aviso from "./Aviso.jsx";
import TarjetaPokemon from "./TarjetaPokemon.jsx";

const HUECOS = Array.from({ length: 12 }, (_, i) => i);

// Cuatro estados posibles: cargando, error, vacío y datos
export default function ListaPokemon({ region, carga, pokemons, elegidoId, alElegir, mensajeVacio }) {
  if (carga.cargando) {
    return (
      <div className="lista" data-estado="cargando" aria-busy="true">
        <p className="aviso">Buscando los Pokémon de {region}…</p>
        <div className="rejilla">
          {HUECOS.map((hueco) => (
            <span key={hueco} className="pokemon pokemon--fantasma"></span>
          ))}
        </div>
      </div>
    );
  }

  if (carga.error) {
    return (
      <div className="lista" data-estado="error">
        <Aviso titulo="Error de conexión" texto={carga.error} accion="Volver a intentarlo" alPulsar={carga.reintentar} />
      </div>
    );
  }

  if (pokemons.length === 0) {
    return (
      <div className="lista" data-estado="vacio">
        <Aviso titulo="Ni rastro" texto={mensajeVacio} />
      </div>
    );
  }

  // key = número del Pokémon: es único y no cambia al filtrar u ordenar (el índice sí)
  return (
    <div className="lista animar" data-estado="datos">
      <div className="rejilla">
        {pokemons.map((pokemon, i) => (
          <TarjetaPokemon
            key={pokemon.id}
            pokemon={pokemon}
            posicion={i}
            elegida={pokemon.id === elegidoId}
            alElegir={alElegir}
          />
        ))}
      </div>
    </div>
  );
}
