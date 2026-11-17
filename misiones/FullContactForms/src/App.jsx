import Cabecera from "./components/Cabecera.jsx";
import FormularioInscripcion from "./components/FormularioInscripcion.jsx";

export default function App() {
  return (
    <>
      <Cabecera />
      <main className="contenido">
        <section className="panel" aria-labelledby="titulo-inscripcion">
          <h2 id="titulo-inscripcion">Inscripción</h2>
          <FormularioInscripcion />
        </section>
        <section className="panel" aria-labelledby="titulo-inscritos">
          <h2 id="titulo-inscritos">Equipos inscritos</h2>
        </section>
      </main>
    </>
  );
}
