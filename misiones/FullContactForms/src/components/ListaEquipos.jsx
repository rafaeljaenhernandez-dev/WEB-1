import { useState } from "react";
import { useEquipos } from "../hooks/useEquipos.js";
import { JUEGOS } from "../datos/juegos.js";
import TarjetaEquipo from "./TarjetaEquipo.jsx";

const FILTROS = [{ id: "todos", nombre: "Todos" }, ...JUEGOS];

export default function ListaEquipos() {
  const [juego, setJuego] = useState("todos");
  const consulta = useEquipos(juego); // cambiar de filtro cambia la clave y Query pide (o saca de caché) esa lista

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
      <Contenido consulta={consulta} />
    </>
  );
}

// Los estados de la lista: cargando, error, vacía y con datos (y aviso si hubo datos corruptos)
function Contenido({ consulta }) {
  const { data, isPending, isError, error, isFetching, refetch } = consulta;

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
        <p>{error.message}</p>
        <p>¿Está arrancado el API? Ejecuta npm run api en otra terminal.</p>
        <button type="button" className="boton boton--secundario" onClick={() => refetch()}>
          Reintentar
        </button>
      </div>
    );
  }

  const { equipos, corruptos } = data;

  return (
    <>
      <p className="estado-lista" role="status">
        <span>
          {equipos.length} {equipos.length === 1 ? "equipo inscrito" : "equipos inscritos"}
        </span>
        {isFetching && <span>Actualizando…</span>}
      </p>

      {/* Reto bonus: lo que Zod rechazó en la respuesta del API no se pinta, pero se avisa */}
      {corruptos.length > 0 && (
        <div className="mensaje mensaje--aviso">
          <p>
            Zod ha descartado {corruptos.length} {corruptos.length === 1 ? "registro" : "registros"} del servidor con
            datos corruptos:
          </p>
          <ul>
            {corruptos.map((corrupto) => (
              <li key={corrupto.id}>
                id {corrupto.id}: {corrupto.campos.join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}

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
