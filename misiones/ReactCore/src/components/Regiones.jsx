import { REGIONES } from "../datos/pokedex.js";

// Chips de región: radios controlados por el índice que guarda App
export default function Regiones({ indice, alCambiar }) {
  return (
    <fieldset className="regiones">
      <legend className="campo__nombre">Región</legend>
      {REGIONES.map((region, i) => (
        <label key={region.nombre} className="chip">
          <input type="radio" name="region" value={i} checked={i === indice} onChange={() => alCambiar(i)} />
          <span>{region.nombre}</span>
        </label>
      ))}
    </fieldset>
  );
}
