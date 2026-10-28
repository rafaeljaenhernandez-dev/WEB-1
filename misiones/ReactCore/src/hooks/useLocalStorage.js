import { useEffect, useState } from "react";

// Lee el valor guardado; si no hay, está roto o no pasa la validación, usa el inicial
function leer(clave, inicial, validar) {
  try {
    const guardado = JSON.parse(localStorage.getItem(clave));
    return guardado !== null && validar(guardado) ? guardado : inicial;
  } catch {
    return inicial;
  }
}

// Hook propio: como useState, pero el valor sobrevive a recargar la página
export function useLocalStorage(clave, inicial, validar = () => true) {
  // Función inicializadora: localStorage se lee solo en el primer render, no en cada uno
  const [valor, setValor] = useState(() => leer(clave, inicial, validar));

  // Efecto: sincronizar con un sistema externo (localStorage) cada vez que cambia el valor
  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch {
      // almacenamiento lleno o bloqueado: el valor sigue funcionando en memoria
    }
  }, [clave, valor]);

  return [valor, setValor];
}
