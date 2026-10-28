import { numero } from "../datos/pokedex.js";
import Arte from "./Arte.jsx";
import Tipos from "./Tipos.jsx";

// El color de la tarjeta es el del tipo principal (data-tipo)
export default function TarjetaPokemon({ pokemon, posicion, elegida, alElegir }) {
  return (
    <button
      type="button"
      className="pokemon"
      data-tipo={pokemon.tipos[0]}
      aria-pressed={elegida}
      style={{ "--orden": posicion }}
      onClick={() => alElegir(pokemon)}
    >
      <Arte key={pokemon.arte} src={pokemon.arte} alt="" clase="pokemon__arte" perezosa />
      <span className="pokemon__numero">{numero(pokemon.id)}</span>
      <span className="pokemon__nombre">{pokemon.nombre}</span>
      <Tipos tipos={pokemon.tipos} />
    </button>
  );
}
