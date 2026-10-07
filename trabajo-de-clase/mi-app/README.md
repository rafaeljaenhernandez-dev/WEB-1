# mi-app · Primeros pasos con React

Proyecto de **React + Vite** para los ejercicios de la unidad de React (cuaderno 3).

## Ejercicios

### 1.1 · La tripulación

Fichas de la tripulación de una nave con el componente `FichaTripulante`.

- **Props:** `nombre`, `rol` y `especie`. Si no se pasa `especie`, vale `"humana"` por defecto.
- **Qué devuelve:** un `<article>` con el nombre como título y dos líneas de texto (rol y especie).
- **Dónde se usa:** `App` renderiza cuatro tripulantes, y dos de ellos no reciben `especie`, así que se ve «humana».

```jsx
function FichaTripulante({ nombre, rol, especie = "humana" }) { … }
```

El valor por defecto es el de JavaScript al desestructurar: solo se usa cuando la prop llega como `undefined`.

**Estilos:** cada ficha es un panel con la esquina superior derecha recortada (`clip-path`). Las fichas se colocan en una cuadrícula que se adapta al ancho de la pantalla (`grid` con `auto-fill`). Los colores son variables CSS y cambian solos en modo oscuro (`prefers-color-scheme`).

### Componentes de clase

- `Boton`: un botón simple.
- `Saludo`: recibe `nombre` y `apellido` por props.

Están en `components/`, pero ahora mismo `App` no los usa.

## Cómo arrancarlo

```bash
cd trabajo-de-clase/mi-app
npm install
npm run dev
```

Después se abre la dirección que muestra Vite (normalmente http://localhost:5173).

## Estructura

```
mi-app/
├── index.html                    carga la fuente Chakra Petch
├── package.json
├── vite.config.js
├── public/
└── src/
    ├── main.jsx                  monta <App /> en #root
    ├── index.css                 variables de color (claro/oscuro) y estilos base
    ├── App.jsx                   renderiza las fichas de la tripulación
    ├── App.css                   título y cuadrícula de fichas
    └── components/
        ├── fichaTripulante.jsx   ejercicio 1.1
        ├── fichaTripulante.css   estilos de la ficha
        ├── button.jsx            Boton
        └── saludo.jsx            Saludo
```

## Uso de IA

He usado Claude Code (Anthropic) en el ejercicio 1.1. Le pasé el enunciado y generó el componente `FichaTripulante`, los cambios en `App.jsx` y todos los estilos CSS. Después revisé el código y lo probé en el navegador.
