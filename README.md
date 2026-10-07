# WEB-1 · Web Development I, the Client

Prácticas de la asignatura **Web Development I** (U-tad).

Cada misión o proyecto está en su propia carpeta, con su código y su propio README.

## Misiones y proyectos

| Misión | Carpeta | Descripción |
|--------|---------|-------------|
| 🔮 El oráculo de los números | [mision1/](mision1/) · [README](mision1/README.md) | Ejercicio de clase de la Unidad 1: adivinar un número del 1 al 100 en 7 intentos. |
| ⚔️ M1 · El Despertar del DOM | [despertarDelDOM/](despertarDelDOM/) · [README](despertarDelDOM/README.md) | **Entrega de la M1.** *Memoria Arcana*: juego de memoria de cartas en JavaScript puro, con dificultad, temporizador, rachas, hechizo de revelación, récord y modo nocturno con la tecla **N**. |
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
- **Proyectos de React** (`mi-app/`): necesitan Node.js.

  ```bash
  cd mi-app
  npm install
  npm run dev
  ```
