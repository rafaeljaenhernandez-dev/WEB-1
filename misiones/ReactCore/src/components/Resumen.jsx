import { nombreTipo, tipoMasComun } from "../datos/pokedex.js";

// Sin estado: todo lo que dice se calcula con lo que recibe
export default function Resumen({ visibles, total, region }) {
  if (total === 0) return <p className="resumen" aria-live="polite"></p>;

  const cuantos = visibles.length === total ? `${total} Pokémon en ${region}` : `${visibles.length} de ${total} Pokémon de ${region}`;
  const { tipo, veces } = tipoMasComun(visibles);

  return (
    <p className="resumen" aria-live="polite">
      {tipo ? `${cuantos} · el tipo más común es ${nombreTipo(tipo)} (${veces}).` : `${cuantos}.`}
    </p>
  );
}
