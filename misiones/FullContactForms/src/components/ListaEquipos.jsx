import { useState } from "react";
import { useEquipos } from "../hooks/useEquipos.js";
import { JUEGOS } from "../datos/juegos.js";
import TarjetaEquipo from "./TarjetaEquipo.jsx";

const FILTROS = [{ id: "todos", nombre: "Todos" }, ...JUEGOS];

export default function ListaEquipos() {
  const [juego, setJuego] = useState("todos");
  const { data: equipos, isPending, isError, error, isFetching, refetch } = useEquipos(juego);

  return (
    <>
      <div className="filtros" role="group" aria-label="Filtrar por juego">
        {FILTROS.map((filtro) => (
          <button
            key={filtro.id}
            type="button"
            className="boton boton--secundario filtro"
            aria-pressed={juego === filtro.id}
            onClick={() => setJuego(filtro.id)}
          >
            {filtro.nombre}
          </button>
        ))}
      </div>
      <Contenido
        equipos={equipos}
        isPending={isPending}
        isError={isError}
        error={error}
        isFetching={isFetching}
        refetch={refetch}
      />
    </>
  );
}

// Los cuatro estados de la lista: cargando, error, vacía y con datos
function Contenido({ equipos, isPending, isError, error, isFetching, refetch }) {
  if (isPending) {
    return (
      <p role="status" className="mensaje mensaje--carga">
        Cargando equipos…
      </p>
    );
  }

  if (isError) {
    return (
      <div role="alert" className="mensaje mensaje--error">
        <p>{error.message}. ¿Está arrancado el API (npm run api)?</p>
        <button type="button" className="boton boton--secundario" onClick={() => refetch()}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      <p className="estado-lista" role="status">
        <span>
          {equipos.length} {equipos.length === 1 ? "equipo inscrito" : "equipos inscritos"}
        </span>
        {isFetching && <span>Actualizando…</span>}
      </p>
      {equipos.length === 0 ? (
        <p className="mensaje">Todavía no hay equipos en este juego. ¡Sé el primero!</p>
      ) : (
        <ul className="equipos">
          {equipos.map((equipo) => (
            <TarjetaEquipo key={equipo.id} equipo={equipo} />
          ))}
        </ul>
      )}
    </>
  );
}
