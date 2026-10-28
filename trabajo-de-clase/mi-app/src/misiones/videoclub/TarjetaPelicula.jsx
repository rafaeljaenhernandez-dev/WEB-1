import { useContext } from "react";
import { TemaContext } from "./TemaContext.js";

// El tema llega por useContext: Catalogo no tiene que pasarlo (sin prop drilling)
export default function TarjetaPelicula({ pelicula }) {
  const { tema } = useContext(TemaContext);

  return (
    <li className={`pelicula pelicula--${tema}`}>
      <span className="pelicula-cartel" aria-hidden="true">
        {pelicula.emoji}
      </span>
      <p className="pelicula-titulo">{pelicula.titulo}</p>
      <p className="pelicula-datos">
        {pelicula.genero} · {pelicula.anio}
      </p>
      <p className="pelicula-nota">⭐ {pelicula.nota}</p>
    </li>
  );
}
