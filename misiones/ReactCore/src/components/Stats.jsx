// Barras de estadísticas: el ancho sale de --valor en el CSS (255 es el máximo posible)
export default function Stats({ stats }) {
  return (
    <ul className="stats">
      {stats.map((stat) => (
        <li key={stat.nombre} className="stat">
          <span className="stat__nombre">{stat.nombre}</span>
          <span className="stat__valor">{stat.valor}</span>
          <span className="stat__barra" style={{ "--valor": Math.min(stat.valor, 255) }}></span>
        </li>
      ))}
    </ul>
  );
}
