import TarjetaHabito from "./TarjetaHabito.jsx";

// Recibe los hábitos y las funciones por props: no tiene estado propio
export default function ListaHabitos({ habitos, onMarcar, onEliminar }) {
  if (habitos.length === 0) {
    return <p className="habitos-vacio">No tienes hábitos. Añade el primero arriba.</p>;
  }

  return (
    <ul className="habitos-lista">
      {habitos.map((habito) => (
        <TarjetaHabito key={habito.id} habito={habito} onMarcar={onMarcar} onEliminar={onEliminar} />
      ))}
    </ul>
  );
}
