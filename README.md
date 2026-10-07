# WEB-1 · Web Development I, the Client

Prácticas de la asignatura **Web Development I** (U-tad).

Cada misión o proyecto está en su propia carpeta, con su código y su propio README.

## Misiones y proyectos

| Misión | Carpeta | Descripción |
|--------|---------|-------------|
| 🔮 El oráculo de los números | [mision1/](mision1/) · [README](mision1/README.md) | Ejercicio de clase de la Unidad 1: adivinar un número del 1 al 100 en 7 intentos. |
| ⚔️ M1 · El Despertar del DOM | [despertarDelDOM/](despertarDelDOM/) · [README](despertarDelDOM/README.md) | **Entrega de la M1.** *Memoria Arcana*: juego de memoria de cartas en JavaScript puro, con dificultad, temporizador, rachas, hechizo de revelación, récord y modo nocturno con la tecla **N**. |
| 🔴 M2 · Async Odyssey | [async_odyssey/](async_odyssey/) · [README](async_odyssey/README.md) | **Entrega de la M2.** *Pokédex* con la PokeAPI: regiones, búsqueda por nombre o número, filtro por tipo y ficha de cada Pokémon. Usa `fetch` + `async/await`, módulos ES (api, lógica, render y main), estados de carga y error, colores por tipo y caché en `localStorage`. Proyecto Vite. |
| ⚛️ mi-app · Primeros pasos con React | [mi-app/](mi-app/) · [README](mi-app/README.md) | Proyecto de React + Vite para los ejercicios del cuaderno 3. **1.1 La tripulación**: componente `FichaTripulante` con props y un valor por defecto, y las fichas de la tripulación en una cuadrícula. |

## Estructura

```
WEB-1/
├── README.md            este índice
├── mision1/             El oráculo de los números
│   ├── index.html
│   ├── index.css
│   ├── index.js
│   └── README.md
├── despertarDelDOM/     M1 · El Despertar del DOM (Memoria Arcana)
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── README.md
├── async_odyssey/       M2 · Async Odyssey (Pokédex con la PokeAPI, Vite)
│   ├── index.html
│   ├── styles.css
│   ├── main.js          une los módulos
│   ├── api.js           peticiones, errores y caché
│   ├── logica.js        transformación de los datos
│   ├── render.js        DOM y estados
│   ├── package.json
│   └── README.md
└── mi-app/              React + Vite (ejercicios del cuaderno 3)
    ├── index.html
    ├── package.json
    ├── src/
    │   ├── App.jsx
    │   └── components/  FichaTripulante, Boton, Saludo
    └── README.md
```

## Cómo probar cada proyecto

- **Misiones en JavaScript puro** (`mision1/`, `despertarDelDOM/`): abre el `index.html` de la carpeta en el navegador (o con Live Server). No hace falta instalar nada.
- **Proyectos con Vite** (`async_odyssey/`, `mi-app/`): necesitan Node.js. Se arrancan entrando en su carpeta:

  ```bash
  cd async_odyssey
  npm install
  npm run dev
  ```

  Para `mi-app` es igual, cambiando `async_odyssey` por `mi-app`.
