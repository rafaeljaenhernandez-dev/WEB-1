import { useDarDeBaja } from "../hooks/useEquipos.js";
import { DIAS, NIVELES, buscarJuego, estrellasDe } from "../datos/juegos.js";

const formatoFecha = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

// Iniciales del equipo para su emblema: "Merge Conflict" → "MC"
function iniciales(nombre) {
  return nombre
    .split(" ")
    .filter((palabra) => palabra.length > 0)
    .slice(0, 2)
    .map((palabra) => palabra[0].toUpperCase())
    .join("");
}

// La luz que sigue al ratón: guarda la posición en variables CSS de la carta
function moverLuz(evento) {
  const caja = evento.currentTarget.getBoundingClientRect();
  evento.currentTarget.style.setProperty("--x", `${evento.clientX - caja.left}px`);
  evento.currentTarget.style.setProperty("--y", `${evento.clientY - caja.top}px`);
}

// Carta de un equipo inscrito, con el color de su juego
export default function TarjetaEquipo({ equipo }) {
  // Cada carta tiene su propia mutación: el "Dando de baja…" solo sale en la suya
  const baja = useDarDeBaja();
  const juego = buscarJuego(equipo.juego);
  const suplentes = equipo.jugadores - juego.titulares;
  const estrellas = estrellasDe(equipo.nivel);
  const nivel = NIVELES.find((elemento) => elemento.id === equipo.nivel).nombre;

  function darDeBaja() {
    if (window.confirm(`¿Seguro que quieres dar de baja a «${equipo.nombre}»?`)) baja.mutate(equipo.id);
  }

  return (
    <li className="tarjeta" data-juego={equipo.juego} onPointerMove={moverLuz}>
      <div className="tarjeta__banda">
        <span className="tarjeta__escudo" aria-hidden="true">
          {iniciales(equipo.nombre)}
        </span>
        <div>
          <h3>{equipo.nombre}</h3>
          <p className="tarjeta__capitan">Capitán: {equipo.capitan}</p>
        </div>
        <span className="etiqueta">
          <span className="emblema emblema--mini" aria-hidden="true">
            {juego.emblema}
          </span>
          {juego.nombre}
        </span>
      </div>

      <div className="tarjeta__cuerpo">
        <div className="dato">
          <span className="dato__titulo">Plantilla</span>
          <span className="plantilla" role="img" aria-label={`${juego.titulares} titulares y ${suplentes} suplentes`}>
            {Array.from({ length: equipo.jugadores }, (_, indice) => (
              <span key={indice} className={indice < juego.titulares ? "ficha" : "ficha ficha--suplente"}></span>
            ))}
          </span>
        </div>
        <div className="dato">
          <span className="dato__titulo">Nivel</span>
          <span className="estrellas" role="img" aria-label={`${nivel}: ${estrellas} de 3 estrellas`}>
            {[1, 2, 3].map((numero) => (
              <span key={numero} className={numero <= estrellas ? "estrella estrella--llena" : "estrella"}>
                ★
              </span>
            ))}
          </span>
        </div>
        <div className="dato dato--ancho">
          <span className="dato__titulo">Juega</span>
          <span className="chips">
            {equipo.dias.map((id) => (
              <span key={id} className="chip">
                {DIAS.find((dia) => dia.id === id).nombre}
              </span>
            ))}
          </span>
        </div>
      </div>

      <div className="tarjeta__pie">
        <span className="tarjeta__fecha">Inscrito el {formatoFecha.format(new Date(equipo.inscrito))}</span>
        <button
          type="button"
          className="boton boton--secundario boton--peligro"
          disabled={baja.isPending}
          onClick={darDeBaja}
        >
          {baja.isPending ? "Dando de baja…" : "Dar de baja"}
        </button>
      </div>
      {baja.isError && (
        <p role="alert" className="error">
          {baja.error.message}
        </p>
      )}
    </li>
  );
}
