# WEB-1 · Web Development I, the Client

Prácticas de la asignatura **Web Development I** (U-tad), Unidad 1: Introducción a JavaScript.

## Estructura

```
WEB-1/
└── mision1/
    ├── index.html
    ├── index.css
    └── index.js
```

## Misión 1 · 🔮 El oráculo de los números

Juego en el navegador en el que hay que adivinar un número secreto del 1 al 100.

### Cómo ejecutarlo

Abre `mision1/index.html` en el navegador. No hace falta instalar nada ni usar servidor.

### Cómo se juega

1. Escribe un número del 1 al 100 y pulsa **Consultar al oráculo** (o la tecla Enter).
2. El oráculo responde si su número es **mayor** o **menor** que el tuyo.
3. Tienes **7 intentos** como máximo.
4. La partida acaba al acertar o al agotar los intentos. En ese caso se revela el número.
5. **Nueva profecía** empieza otra partida con un número nuevo.

### Qué se ha hecho

**HTML (`index.html`)**
- Estructura semántica con `header`, `main`, `section`, `aside` y `footer`.
- Ficha de la misión: objetivo, prácticas y fases.
- Zona de juego con un input numérico, dos botones y los párrafos donde se muestran la respuesta, el marcador y el historial.
- El script se carga con `defer` para que el DOM esté listo antes de ejecutarlo.

**CSS (`index.css`)**
- Paleta de colores definida con variables CSS en `:root`.
- Maquetación con Flexbox (controles, meta, footer) y Grid (columnas de objetivo y fases).
- Tamaños de texto adaptables con `clamp()`.
- Estilos distintos para cada tipo de mensaje: `neutral`, `info`, `success` y `error`.
- Estilo para los botones desactivados.
- Diseño responsive con dos puntos de corte (820 px y 520 px): en pantallas pequeñas las columnas y los controles se apilan.

**JavaScript (`index.js`)**
- Número secreto con `Math.floor(Math.random() * 100) + 1`.
- Uso de `const` para referencias al DOM y constantes, y `let` para el estado de la partida (`secreto`, `intentos`, `probados`).
- Lectura del input y conversión con `Number()`.
- Validación: rechaza entradas vacías, decimales y números fuera del rango 1–100 sin gastar intento.
- Condicionales para decidir si el número es mayor, menor o correcto.
- Contador de intentos (`Intentos: X / 7`) e historial de los números ya probados.
- Fin de partida: se desactivan el input y el botón al ganar o perder.
- Reinicio completo del estado con **Nueva profecía**.
- Eventos: `click` en los dos botones y `keydown` (Enter) en el input.

### Conceptos practicados

`const` / `let` · `Number()` · `Number.isInteger()` · condicionales `if/else` · `querySelector` · `addEventListener` · `textContent` / `className` · plantillas de texto (template literals) · arrays (`push`, `join`) · atributo `defer`.
