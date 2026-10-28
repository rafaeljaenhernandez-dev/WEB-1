// Búsqueda por título y género: los dos campos son controlados (su valor vive en Videoclub)
export default function Filtros({ busqueda, onBusqueda, genero, onGenero, generos }) {
  return (
    <div className="videoclub-filtros">
      <input
        type="search"
        placeholder="Busca por título…"
        value={busqueda}
        onChange={(evento) => onBusqueda(evento.target.value)}
      />
      <select value={genero} onChange={(evento) => onGenero(evento.target.value)}>
        <option value="todos">Todos los géneros</option>
        {generos.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
    </div>
  );
}
