export default function FichaTripulante({ nombre, rol, especie = "humana" }) {
  return (
    <article>
      <h2>{nombre}</h2>
      <p>Rol: {rol}</p>
      <p>Especie: {especie}</p>
    </article>
  );
}
