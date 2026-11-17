// Destello de confeti al inscribir un equipo. Es solo decoración: aria-hidden,
// y el mensaje de éxito con role="status" es lo que se anuncia.
const PIEZAS = Array.from({ length: 18 }, (_, indice) => indice);

export default function Celebracion() {
  return (
    <div className="celebracion" aria-hidden="true">
      {PIEZAS.map((pieza) => (
        <span key={pieza} className="confeti" style={{ "--i": pieza }}></span>
      ))}
    </div>
  );
}
