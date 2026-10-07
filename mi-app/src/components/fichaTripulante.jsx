import "./fichaTripulante.css";

export default function FichaTripulante({ nombre, rol, especie = "humana" }) {
  return (
    <article className="ficha">
      <h2>{nombre}</h2>
      <p><span className="etiqueta">Rol:</span> {rol}</p>
      <p><span className="etiqueta">Especie:</span> {especie}</p>
    </article>
  );
}
