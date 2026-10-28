// Barra roja de arriba, con la lente azul y las tres luces de la Pokédex
export default function Cabecera() {
  return (
    <header className="cabecera">
      <div className="cabecera__dentro">
        <span className="lente" aria-hidden="true"></span>
        <span className="luces" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </span>
        <div>
          <h1 className="titulo">Reactor Core</h1>
          <p className="lema">La Pokédex en React: elige una región, busca, abre la ficha de cualquier Pokémon y arma tu equipo.</p>
        </div>
      </div>
    </header>
  );
}
