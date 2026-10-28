import { useState } from "react";
import { HABITOS_INICIALES } from "./habitosIniciales.js";
import FormularioHabito from "./FormularioHabito.jsx";
import ListaHabitos from "./ListaHabitos.jsx";
import PanelResumen from "./PanelResumen.jsx";
import "./habitos.css";

// Dueña del estado: el array de hábitos vive aquí y en ningún otro sitio
export default function AppHabitos() {
  const [habitos, setHabitos] = useState(HABITOS_INICIALES);

  // Fase 2: map + spread crea un hábito nuevo, no modifica el que había
  function marcarHecho(id) {
    setHabitos(
      habitos.map((habito) =>
        habito.id === id
          ? { ...habito, hechoHoy: !habito.hechoHoy, racha: habito.hechoHoy ? habito.racha - 1 : habito.racha + 1 }
          : habito,
      ),
    );
  }

  // Fase 3: añadir con un array nuevo (spread) y un id único
  function anadirHabito(nombre) {
    const nuevo = { id: crypto.randomUUID(), nombre, hechoHoy: false, racha: 0 };
    setHabitos([...habitos, nuevo]);
  }

  // Fase 3: eliminar con filter, que devuelve otro array sin ese hábito
  function eliminarHabito(id) {
    setHabitos(habitos.filter((habito) => habito.id !== id));
  }

  return (
    <section className="habitos">
      <h2>Forja de hábitos 🔥</h2>
      <PanelResumen habitos={habitos} />
      <FormularioHabito onAnadir={anadirHabito} />
      <ListaHabitos habitos={habitos} onMarcar={marcarHecho} onEliminar={eliminarHabito} />
    </section>
  );
}
