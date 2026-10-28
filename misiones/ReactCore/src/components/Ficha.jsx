import { numero } from "../datos/pokedex.js";
import { cargarFicha } from "../datos/cargas.js";
import { useFetch } from "../hooks/useFetch.js";
import Arte from "./Arte.jsx";
import Aviso from "./Aviso.jsx";
import Stats from "./Stats.jsx";
import Tipos from "./Tipos.jsx";

// La ficha pide sus propios datos: cada vez que cambia el id, useFetch vuelve a pedir
export default function Ficha({ elegido, enEquipo, equipoLleno, alAlternarEquipo }) {
  const carga = useFetch(cargarFicha, elegido.id);
  const datos = carga.datos;

  if (carga.cargando) {
    return (
      <section className="ficha" data-estado="cargando" aria-busy="true" aria-live="polite" aria-label="Ficha del Pokémon">
        <div className="ficha__foco"></div>
        <p className="ficha__nombre">{elegido.nombre}</p>
        <p className="aviso">Consultando la Pokédex…</p>
      </section>
    );
  }

  if (carga.error) {
    return (
      <section className="ficha" data-estado="error" aria-live="polite" aria-label="Ficha del Pokémon">
        <p className="ficha__nombre">{elegido.nombre}</p>
        <Aviso texto={`No se ha podido leer su ficha. ${carga.error}`} accion="Volver a intentarlo" alPulsar={carga.reintentar} />
      </section>
    );
  }

  return (
    <section className="ficha" data-estado="datos" data-tipo={datos.tipos[0]} aria-live="polite" aria-label="Ficha del Pokémon">
      <div className="ficha__foco">
        <Arte key={datos.arte} src={datos.arte} alt={datos.nombre} clase="ficha__arte" />
      </div>
      <h2 className="ficha__nombre">
        {datos.nombre}
        <span className="ficha__numero">{numero(datos.id)}</span>
      </h2>
      <Tipos tipos={datos.tipos} />
      <p className="ficha__medidas">
        {datos.categoria} · {datos.altura} · {datos.peso}
      </p>
      <button
        type="button"
        className="boton boton--equipo"
        aria-pressed={enEquipo}
        disabled={equipoLleno && !enEquipo}
        onClick={() => alAlternarEquipo(datos)}
      >
        {enEquipo ? "Quitar del equipo" : equipoLleno ? "Equipo completo" : "Añadir al equipo"}
      </button>
      <p className="ficha__texto">{datos.descripcion}</p>
      <Stats stats={datos.stats} />
      <p className="ficha__total">
        Total {datos.total} · Destaca en {datos.mejor.nombre}
      </p>
    </section>
  );
}
