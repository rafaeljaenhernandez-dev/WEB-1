# 🔮 Memoria Arcana

Misión M1 · El Despertar del DOM — Web Development I.

Juego de memoria de cartas con temática de fantasía, hecho con HTML, CSS y JavaScript puro, sin frameworks ni librerías. Todo el tablero se genera y se actualiza manipulando el DOM a mano.

## Cómo probarlo

Abre `index.html` en el navegador (o con Live Server).

1. Elige la dificultad: **Aprendiz** (6 parejas), **Hechicero** (8) o **Archimago** (10).
2. Gira dos cartas. Si coinciden se quedan boca arriba; si no, se vuelven a ocultar.
3. El tiempo empieza a contar con la primera carta que giras.
4. Encadena aciertos seguidos para conseguir una **racha**.
5. Tienes un **hechizo de revelación** por partida: enseña todas las cartas durante un segundo y medio, pero te suma 5 movimientos.
6. Al completar el tablero verás tu resultado. Se guarda el **récord** de cada dificultad (menos movimientos y, si empatas, menos tiempo).

**Tecla secreta:** pulsa **N** para activar o desactivar el modo nocturno.

## Estructura

```
despertarDelDOM/
├── index.html   estructura de la página (sin eventos inline)
├── styles.css   estilos, animación de giro y modo nocturno
├── app.js       estado del juego, DOM y eventos
└── README.md
```

## Qué practica

- **DOM:** `querySelector`, `createElement`, `DocumentFragment`, `replaceChildren`, `dataset`, `classList`, `textContent`, el atributo `hidden` y variables CSS con `style.setProperty`.
- **Eventos:** todos se enganchan con `addEventListener` desde `app.js`. Hay un único listener en el tablero (delegación con `closest`) y un `keydown` sobre `document` para la tecla secreta.
- **Fundamentos JS:** `const` por defecto y `let` solo donde el valor cambia, template literals, desestructuración, spread, `setInterval` / `setTimeout` y `localStorage` con `try/catch`.

## Uso de IA

Usé **Claude Code** (modelo Claude Opus 5.5) dentro de VS Code. La IA generó el código de las fases 1 a 5, el bonus y un primer borrador de este README, y fue haciendo un commit al cerrar cada fase.

Prompt real con el que empecé: le pegué el enunciado completo de la M1 y le pedí:
"en la carpeta despertarDelDOM quiero que hagas esto ten muy en cuenta lo de los commits y eso cumple todo a rajatabla".

Cómo se verificó:
- Se cargó la página en Chrome sin interfaz (headless) con un script de prueba aparte, que no está en el repositorio, y que jugaba una partida completa. Comprobaba 23 casos: fallos, pareja acertada, doble clic en la misma carta, bloqueo mientras se ocultan las cartas, racha, hechizo (+5 movimientos), fin de partida, récord por dificultad, temporizador parado al acabar, cambio a 20 cartas en Archimago, la tecla N y el caso de pulsar «Nueva partida» mientras dos cartas fallidas todavía se están ocultando.
- Se revisaron capturas en modo claro y en modo nocturno.
- Se buscó en el código que no hubiera `var`, `innerHTML`, `onclick` ni `console.log`.

Escrito a mano: _(pendiente: añade aquí lo que cambies o escribas tú mismo)_.

## Autopsia

1. **Todo el estado de la partida está en un solo objeto `estado`, que se crea de nuevo con `crearEstadoInicial()` en cada partida.** Así, reiniciar es una sola asignación y no se puede olvidar ninguna variable (movimientos, racha, hechizo…). Descarté tener nueve variables `let` sueltas, porque cada campo nuevo obligaba a acordarse de reiniciarlo a mano en `nuevaPartida()`. Por el mismo motivo guardo en `estado.espera` el identificador del `setTimeout` que oculta las cartas falladas. Si empiezas una partida nueva justo en ese momento, se cancela con `clearTimeout`, y así no desbloquea ni vacía las cartas de la partida nueva.
2. **Un único listener en el contenedor del tablero (delegación) en vez de uno por carta.** Las cartas se destruyen y se crean en cada partida y en cada cambio de dificultad (12, 16 o 20 cartas). Con delegación no hay que volver a enganchar ni quitar listeners, y no aparecen handlers duplicados. Descarté poner `addEventListener` en cada carta dentro de `crearCarta()`, porque serían hasta 20 listeners que se crean de nuevo en cada partida, cuando un solo punto de entrada (`manejarClicTablero`) basta para decidir si una carta se puede girar.
