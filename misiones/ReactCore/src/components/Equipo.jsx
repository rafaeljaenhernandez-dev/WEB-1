import { arteDe, CLAVES_TIPOS } from "../datos/pokedex.js";
import "./equipo.css";

export const TAMANO_EQUIPO = 6;
const HUECOS = Array.from({ length: TAMANO_EQUIPO }, (_, i) => i);

// Tu equipo de 6. No tiene estado propio: recibe el array y avisa a App de lo que se pulsa
export default function Equipo({ equipo, elegidoId, alElegir, alQuitar }) {
  // Derivado: cuántos de los 18 tipos cubre el equipo (Set quita los repetidos)
  const cubiertos = new Set(equipo.flatMap((pokemon) => pokemon.tipos)).size;
  const libres = HUECOS.slice(equipo.length);

  return (
    <section className="equipo" aria-labelledby="titulo-equipo">
      <div className="equipo__cabeza">
        <h3 id="titulo-equipo" className="equipo__titulo">
          Mi equipo <span>{equipo.length}/{TAMANO_EQUIPO}</span>
        </h3>
        <p className="equipo__nota">
          {equipo.length === 0
            ? "Abre una ficha y pulsa «Añadir al equipo»."
            : `Cubre ${cubiertos} de ${CLAVES_TIPOS.length} tipos.`}
        </p>
      </div>
      <ol className="equipo__huecos">
        {equipo.map((pokemon) => (
          <li key={pokemon.id} className="hueco" data-tipo={pokemon.tipos[0]}>
            <button
              type="button"
              className="hueco__abrir"
              aria-pressed={pokemon.id === elegidoId}
              onClick={() => alElegir({ id: pokemon.id, nombre: pokemon.nombre })}
            >
              <img src={arteDe(pokemon.id)} alt="" width="475" height="475" />
              <span>{pokemon.nombre}</span>
            </button>
            <button type="button" className="hueco__quitar" aria-label={`Quitar a ${pokemon.nombre}`} onClick={() => alQuitar(pokemon.id)}>
              ×
            </button>
          </li>
        ))}
        {libres.map((hueco) => (
          <li key={`libre-${hueco}`} className="hueco hueco--libre" aria-hidden="true"></li>
        ))}
      </ol>
    </section>
  );
}
