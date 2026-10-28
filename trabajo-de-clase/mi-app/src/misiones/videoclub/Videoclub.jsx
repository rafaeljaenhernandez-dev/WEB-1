import { useEffect, useState } from "react";
import { PELICULAS } from "./peliculas.js";
import { TemaContext } from "./TemaContext.js";
import Cabecera from "./Cabecera.jsx";
import Filtros from "./Filtros.jsx";
import Catalogo from "./Catalogo.jsx";
import "./videoclub.css";

// Los géneros del <select> salen de los datos (Set quita los repetidos)
const GENEROS = [...new Set(PELICULAS.map((p) => p.genero))];

export default function Videoclub() {
  // Tema inicial: localStorage se lee solo en el primer render (función inicializadora)
  const [tema, setTema] = useState(() => localStorage.getItem("tema") ?? "claro");
  const [busqueda, setBusqueda] = useState("");
  const [genero, setGenero] = useState("todos");

  // Lista visible: se calcula en el render, no es estado ni sale de un efecto
  const filtradas = PELICULAS.filter(
    (p) =>
      p.titulo.toLowerCase().includes(busqueda.toLowerCase()) && (genero === "todos" || p.genero === genero),
  );

  // El único efecto: sincronizar con lo que vive fuera de React (título de la pestaña y localStorage)
  useEffect(() => {
    document.title = `Videoclub Nébula · ${filtradas.length} ${filtradas.length === 1 ? "película" : "películas"}`;
    localStorage.setItem("tema", tema);
  }, [filtradas.length, tema]);

  function alternarTema() {
    setTema(tema === "claro" ? "oscuro" : "claro");
  }

  return (
    <TemaContext value={{ tema, alternarTema }}>
      <section className={`videoclub videoclub--${tema}`}>
        <Cabecera />
        <Filtros
          busqueda={busqueda}
          onBusqueda={setBusqueda}
          genero={genero}
          onGenero={setGenero}
          generos={GENEROS}
        />
        <Catalogo peliculas={filtradas} />
      </section>
    </TemaContext>
  );
}
