// Un hábito: no cambia nada él mismo, avisa al padre con las funciones que recibe
export default function TarjetaHabito({ habito, onMarcar, onEliminar }) {
  return (
    <li className={habito.hechoHoy ? "habito hecho" : "habito"}>
      <div>
        <p className="habito-nombre">{habito.nombre}</p>
        <p className="habito-racha">🔥 Racha: {habito.racha} {habito.racha === 1 ? "día" : "días"}</p>
      </div>
      <div className="habito-botones">
        <button onClick={() => onMarcar(habito.id)}>{habito.hechoHoy ? "✔ Hecho" : "Hecho hoy"}</button>
        <button onClick={() => onEliminar(habito.id)}>Eliminar</button>
      </div>
    </li>
  );
}
