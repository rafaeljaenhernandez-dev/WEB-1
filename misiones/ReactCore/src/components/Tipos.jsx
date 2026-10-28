import { nombreTipo } from "../datos/pokedex.js";

// Etiquetas de tipo: data-tipo decide su color en el CSS
export default function Tipos({ tipos }) {
  return (
    <ul className="tipos">
      {tipos.map((tipo) => (
        <li key={tipo} className="tipo" data-tipo={tipo}>
          {nombreTipo(tipo)}
        </li>
      ))}
    </ul>
  );
}
