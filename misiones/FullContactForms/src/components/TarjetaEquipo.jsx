import { useDarDeBaja } from "../hooks/useEquipos.js";
import { DIAS, NIVELES, buscarJuego } from "../datos/juegos.js";

// Pasa una lista de ids a sus nombres: ["lunes", "jueves"] → "Lunes, Jueves"
function nombresDe(ids, catalogo) {
  return ids.map((id) => catalogo.find((elemento) => elemento.id === id).nombre).join(", ");
}

const formatoFecha = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export default function TarjetaEquipo({ equipo }) {
  // Cada tarjeta tiene su propia mutación: el "Dando de baja…" solo sale en la suya
  const baja = useDarDeBaja();
  const juego = buscarJuego(equipo.juego);
  const suplentes = equipo.jugadores - juego.titulares;

  function darDeBaja() {
    if (window.confirm(`¿Seguro que quieres dar de baja a «${equipo.nombre}»?`)) baja.mutate(equipo.id);
  }

  return (
    <li className="tarjeta">
      <div className="tarjeta__cabeza">
        <h3>{equipo.nombre}</h3>
        <span className="etiqueta">{juego.nombre}</span>
      </div>
      <dl className="tarjeta__datos">
        <dt>Capitán</dt>
        <dd>{equipo.capitan}</dd>
        <dt>Plantilla</dt>
        <dd>
          {juego.titulares} titulares{suplentes > 0 && ` + ${suplentes} ${suplentes === 1 ? "suplente" : "suplentes"}`}
        </dd>
        <dt>Nivel</dt>
        <dd>{nombresDe([equipo.nivel], NIVELES)}</dd>
        <dt>Juega</dt>
        <dd>{nombresDe(equipo.dias, DIAS)}</dd>
        <dt>Inscrito</dt>
        <dd>{formatoFecha.format(new Date(equipo.inscrito))}</dd>
      </dl>
      <div className="tarjeta__pie">
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
