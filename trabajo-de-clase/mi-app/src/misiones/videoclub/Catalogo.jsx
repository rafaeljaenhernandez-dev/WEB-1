import TarjetaPelicula from "./TarjetaPelicula.jsx";

// Rejilla de películas; no recibe el tema: cada tarjeta lo lee del contexto
export default function Catalogo({ peliculas }) {
  if (peliculas.length === 0) {
    return <p className="videoclub-vacio">Vaya, no tenemos esa película 🍿 Prueba con otro título o con otro género.</p>;
  }

  return (
    <ul className="videoclub-catalogo">
      {peliculas.map((pelicula) => (
        <TarjetaPelicula key={pelicula.id} pelicula={pelicula} />
      ))}
    </ul>
  );
}
