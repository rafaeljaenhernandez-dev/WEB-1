// Cero useState: todos los totales se derivan del array que recibe
export default function PanelResumen({ habitos }) {
  const hechos = habitos.filter((habito) => habito.hechoHoy).length;
  const mejorRacha = habitos.reduce((mejor, habito) => (habito.racha > mejor ? habito.racha : mejor), 0);

  return (
    <div className="habitos-resumen">
      <p>
        <strong>{hechos} de {habitos.length}</strong> hechos hoy
      </p>
      <p>
        Mejor racha: <strong>{mejorRacha} {mejorRacha === 1 ? "día" : "días"}</strong>
      </p>
    </div>
  );
}
