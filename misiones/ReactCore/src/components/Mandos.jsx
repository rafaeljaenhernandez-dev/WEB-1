import { CLAVES_TIPOS, nombreTipo } from "../datos/pokedex.js";
import Regiones from "./Regiones.jsx";

// Formulario de búsqueda: todos los campos son controlados (su valor vive en App)
export default function Mandos({ region, alCambiarRegion, filtros, alCambiarFiltro }) {
  return (
    <form className="mandos" role="search" onSubmit={(evento) => evento.preventDefault()}>
      <Regiones indice={region} alCambiar={alCambiarRegion} />
      <label className="campo campo--texto">
        <span className="campo__nombre">Busca por nombre o número</span>
        <input
          type="search"
          name="texto"
          placeholder="pikachu, 25, #150…"
          autoComplete="off"
          value={filtros.texto}
          onChange={(evento) => alCambiarFiltro("texto", evento.target.value)}
        />
      </label>
      <label className="campo">
        <span className="campo__nombre">Tipo</span>
        <select name="tipo" value={filtros.tipo} onChange={(evento) => alCambiarFiltro("tipo", evento.target.value)}>
          <option value="todos">Todos los tipos</option>
          {CLAVES_TIPOS.map((clave) => (
            <option key={clave} value={clave}>
              {nombreTipo(clave)}
            </option>
          ))}
        </select>
      </label>
      <label className="campo">
        <span className="campo__nombre">Orden</span>
        <select name="orden" value={filtros.orden} onChange={(evento) => alCambiarFiltro("orden", evento.target.value)}>
          <option value="numero">Por número</option>
          <option value="az">De la A a la Z</option>
          <option value="za">De la Z a la A</option>
        </select>
      </label>
    </form>
  );
}
