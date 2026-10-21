// Preguntas del trivial: correcta es el índice de la opción buena
export const PREGUNTAS = [
  {
    id: "q1",
    texto: "¿Qué hook añade memoria a un componente?",
    opciones: ["useEffect", "useState", "useRef", "useContext"],
    correcta: 1,
  },
  {
    id: "q2",
    texto: "¿Qué necesita cada elemento de una lista hecha con .map()?",
    opciones: ["Una key única y estable", "Un className", "Un useEffect", "Un id en el CSS"],
    correcta: 0,
  },
  {
    id: "q3",
    texto: "Si llamas tres veces a setCuenta(cuenta + 1) en el mismo clic, ¿cuánto sube cuenta?",
    opciones: ["3", "0", "1", "Da error"],
    correcta: 2,
  },
  {
    id: "q4",
    texto: "¿Cómo añades x a la lista del estado sin mutarla?",
    opciones: ["lista.push(x)", "lista[lista.length] = x", "lista.unshift(x)", "[...lista, x]"],
    correcta: 3,
  },
];
