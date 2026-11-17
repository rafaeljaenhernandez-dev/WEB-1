import { useEquipos } from "../hooks/useEquipos.js";
import { JUEGOS } from "../datos/juegos.js";

// Cabecera tipo cartel del torneo con un marcador en vivo.
// Usa la misma query que la lista con el filtro "Todos" (["equipos", "todos"]):
// Query comparte la caché y no hace una segunda petición.
export default function Cabecera() {
  const { data, isPending, isError } = useEquipos("todos");
  const equipos = data ? data.equipos : [];
  const sinDatos = isPending || isError;

  const jugadores = equipos.reduce((total, equipo) => total + equipo.jugadores, 0);
  const porJuego = JUEGOS.map((juego) => ({
    ...juego,
    cuantos: equipos.filter((equipo) => equipo.juego === juego.id).length,
  }));
  const maximo = Math.max(1, ...porJuego.map((juego) => juego.cuantos));

  return (
    <header className="cabecera">
      <div className="cabecera__dentro">
        <div className="cartel">
          <p className="cabecera__antetitulo">
            <span className="punto-vivo" aria-hidden="true"></span>
            U-tad Esports · Temporada 2026-27 · Inscripciones abiertas
          </p>
          <h1 className="titulo">
            Full Contact <span className="titulo__acento">Forms</span>
          </h1>
          <p className="lema">
            Inscribe a tu equipo en el torneo interno de la U-tad. Valida o muere: si el formulario no está bien, no
            entras en el cuadro.
          </p>
        </div>

        <section className="marcador" aria-label="Marcador del torneo">
          <div className="marcador__cifras">
            <p className="cifra">
              <span className="cifra__numero">{sinDatos ? "—" : equipos.length}</span>
              <span className="cifra__texto">equipos</span>
            </p>
            <p className="cifra">
              <span className="cifra__numero">{sinDatos ? "—" : jugadores}</span>
              <span className="cifra__texto">jugadores</span>
            </p>
            <p className="cifra">
              <span className="cifra__numero">{JUEGOS.length}</span>
              <span className="cifra__texto">juegos</span>
            </p>
          </div>
          <ul className="barras">
            {porJuego.map((juego) => (
              <li key={juego.id} className="barra" data-juego={juego.id}>
                <span className="barra__nombre">{juego.emblema}</span>
                <span className="barra__pista">
                  <span className="barra__relleno" style={{ width: `${(juego.cuantos / maximo) * 100}%` }}></span>
                </span>
                <span className="barra__numero">{sinDatos ? "—" : juego.cuantos}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </header>
  );
}
