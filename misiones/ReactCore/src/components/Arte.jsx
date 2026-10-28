import { useState } from "react";

// Ilustración oficial: aparece al cargar y se oculta si la URL falla.
// Quien la usa le pone key={src}: con otra imagen, el estado vuelve a empezar
export default function Arte({ src, alt, clase, perezosa = false }) {
  const [estado, setEstado] = useState("cargando"); // "cargando" | "lista" | "rota"

  return (
    <img
      className={estado === "cargando" ? clase : `${clase} ${estado}`}
      src={src}
      alt={alt}
      width="475"
      height="475"
      loading={perezosa ? "lazy" : "eager"}
      onLoad={() => setEstado("lista")}
      onError={() => setEstado("rota")}
    />
  );
}
