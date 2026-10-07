# 🔴 Async Odyssey · Pokédex

Misión M2 · Async Odyssey, de Web Development I.

Es una Pokédex que consume la **[PokeAPI](https://pokeapi.co)**, una API pública real, con `fetch` + `async/await`. El código está separado en módulos ES y el proyecto se arranca con Vite. Los datos se transforman con métodos de array antes de pintarlos, y cada zona de la página enseña al usuario si está cargando, si ha fallado o si no hay resultados.

## Cómo probarlo

Necesita Node.js.

```bash
cd async_odyssey
npm install
npm run dev
```

Se abre en `http://localhost:5173` (o en el puerto que indique Vite si ese está ocupado). Para generar la versión de producción, usa `npm run build`.

1. Al entrar se cargan los Pokémon de **Kanto** y, a la vez, la ficha de **Pikachu**.
2. Cambia de región con los chips: Kanto, Johto, Hoenn, Sinnoh, Teselia, Kalos, Alola, Galar o Paldea.
3. Busca por nombre (`pika`) o por número (`25`, `#025`), filtra por **tipo** y cambia el orden (por número, de la A a la Z o de la Z a la A).
4. Pulsa cualquier tarjeta para abrir su **ficha**: ilustración oficial, tipos, categoría, altura, peso, descripción en español y estadísticas, con el total y la que más destaca.
5. Cada tarjeta y cada ficha toman el **color de su tipo principal**: verde Planta, naranja Fuego, azul Agua…

## Estructura

```
async_odyssey/
├── index.html     estructura de la página (sin eventos inline)
├── styles.css     estilos de Pokédex, colores de los 18 tipos, estados y móvil
├── main.js        une los módulos: estado, eventos y orden de las cargas
├── api.js         lo único que hace peticiones: fetch, errores y caché
├── logica.js      transforma los datos: limpiar, filtrar, ordenar, contar y montar la ficha
├── render.js      lo único que toca el DOM: estados de carga, error, vacío y datos
├── package.json   proyecto Vite (scripts dev, build y preview)
└── README.md
```

Cada módulo tiene una sola responsabilidad. `api.js` no sabe nada del DOM, `render.js` no sabe nada de la red y `logica.js` son funciones que reciben datos y devuelven datos. `main.js` es el único que los importa a los tres.

## Qué practica

- **Asincronía:**
  - Cada petición usa `async/await` con `try/catch` y comprueba `response.ok`, porque `fetch` no falla con un 404 o un 500.
  - Hay un tiempo máximo de espera con `AbortSignal.timeout(10000)` y un error propio (`class ErrorHttp extends Error`).
  - La ficha pide `/pokemon/{id}` y `/pokemon-species/{id}` **en paralelo** con `Promise.all`.
  - Los 18 tipos se piden a la vez con `Promise.allSettled`.
  - La lista y la ficha arrancan a la vez, sin esperarse.
- **Estados visibles:** la lista y la ficha tienen cada una su estado de *cargando* (tarjetas que «respiran»), *error* (con botón para reintentar), *vacío* y *datos*.
- **Transformación de datos sin bucles:**
  - `filter` y `map` limpian la lista.
  - `flatMap`, `toSorted` y `Object.groupBy` cruzan los tipos con cada Pokémon.
  - `toSorted` ordena sin mutar el array.
  - `reduce` calcula el tipo más común de la región, el total de estadísticas y la mejor estadística.
  - `at(-1)` coge la descripción más reciente.
- **Módulos ES:** `import` / `export`, `import * as vista` y `<script type="module">`.
- **Robustez:** la app no explota con ninguno de estos casos:
  - red caída;
  - un HTTP 500;
  - un JSON ilegible;
  - una lista que no es un array;
  - entradas sin nombre o con una URL rara;
  - un tipo que no responde (esos Pokémon salen sin color);
  - Pokémon sin descripción en español;
  - imágenes que no cargan;
  - una caché corrupta o un `localStorage` lleno.
  - Además, si cambias de región o de Pokémon muy rápido, las respuestas que llegan tarde se descartan.
- **★ Bonus, caché en localStorage:**
  - Cada URL ya pedida se guarda y no se vuelve a pedir: la segunda visita hace **0 peticiones** a la PokeAPI (compruébalo en la pestaña *Network* de las DevTools).
  - Como `/pokemon/{id}` pesa unos 250 KB (trae todos sus movimientos), antes de guardarlo se recorta y solo se queda con los campos que se usan.
  - Las entradas se ven en *Application → Local Storage* con el prefijo `pokedex:`.

## Uso de IA

Usé **Claude Code** (modelos Claude Sonnet 5.5 y Claude Opus 5.5) como pareja de programación, con dos guías de diseño: *Emil Kowalski* (animaciones y detalles) e *impeccable* (diseño de interfaces).

Prompts reales que usé:
- Para empezar le pegué el enunciado completo de la M2 y le pedí: *«vamos con la mision que tenemos que hacer en base a la teoria del tema2, tiene que cumplir con esto […] hazmelo todo en esta carpeta async_odyssey […] el javascript que no sea larguisimo para yo poder defenderlo bien y ve subiendo todo al github […] por commits»*.
- Durante el desarrollo cambié de idea varias veces:
  - *«quiero que la web sea de modelos de deportivos»*;
  - *«vamos a hacerlo con la pokeapi y ya esta»*;
  - *«quiero que se vean bien como una pokedex real color dependiendo del tipo fondo blanco»*.
- Al final le pregunté: *«el js lo has hecho como hemos aprendido en clase no? en base a eso»*. Revisamos cada método contra los PDF de teoría de las Unidades 1 y 2 y cambiamos los que no salían:
  - expresiones regulares por `replaceAll`;
  - `localeCompare` por comparadores con `<` y `>`;
  - `FormData` por el `.value` de cada campo;
  - `Number.isInteger` por `typeof` y comparaciones;
  - y alguno más.

El proyecto se hizo por fases y cada una terminó con algo funcionando y su propio commit. El historial muestra los cambios de tema tal como pasaron:

| Fase | Qué se añadió | Commit |
|------|---------------|--------|
| 1 | Proyecto Vite, esqueleto HTML y estilos base | `proyecto base con Vite…` |
| 2 | `fetch` + `async/await` y estados de carga, error y vacío (primera versión con Open Library, en un solo archivo) | `fetch con async/await y estados…` |
| 3 | Cambio de tema a deportivos (API de la NHTSA) y separación en módulos ES | `cambio a modelos deportivos…` |
| 4 | Buscador, filtro y orden con `filter`, `toSorted`, `reduce` y `Object.groupBy` | `buscador, filtro por marca y orden…` |
| 5 | Segunda petición con su propio estado (ficha de Wikipedia) | `vitrina con la ficha y la foto…` |
| 6 | Bonus: caché en `localStorage` | `bonus, caché de un día…` |
| 7 | Diseño adaptado a móvil | `diseño adaptado a móvil…` |
| 8 | Cambio definitivo a la PokeAPI: Pokédex por regiones y ficha con `Promise.all` | `cambio a la PokeAPI…` |
| 9 | Diseño de Pokédex real: fondo blanco, ilustraciones oficiales, colores por tipo y filtro por tipo | `diseño de Pokédex real…` |
| 10 | JavaScript ajustado a lo visto en clase | `JavaScript ajustado a lo visto en clase…` |

Cada fase partió del código de la anterior. Al cambiar de API se reaprovechó todo lo que ya funcionaba: `pedirJSON`, los errores, la caché, los estados y los contadores de respuestas tardías.

Cómo se verificó:
- Se probó en el navegador cada estado, forzando los fallos desde la consola:
  - red caída;
  - un HTTP 500;
  - datos basura;
  - la caché corrupta;
  - cambios rápidos de región y de Pokémon, para ver que gana el último.
- Se comprobaron la búsqueda por nombre y por número, los tres órdenes y el filtro por tipo. Por ejemplo, Dragón en Kanto da Dratini, Dragonair y Dragonite.
- Se contaron las peticiones de red: con la caché, la segunda visita hace 0 peticiones a la PokeAPI.
- Se revisaron capturas en escritorio y en móvil (375 px), sin scroll horizontal.
- `npm run build` compila sin errores.
- Se buscó en el código que no hubiera `var`, `innerHTML`, `onclick` ni `console.log`.

**Escrito a mano:** no escribí código a mano. Mi parte fue elegir la API y el estilo de la página, pedir los cambios que veía necesarios, revisar el resultado en el navegador y exigir que el JavaScript usara solo lo visto en clase para poder defenderlo.

## Autopsia

1. **`Promise.allSettled` para los 18 tipos, en vez de `Promise.all`.**
   - La lista de una región solo trae nombres y URLs, sin tipos. Para pintar el color de cada tarjeta se pide `/type/{tipo}` para los 18 tipos y se cruza con `Object.groupBy`.
   - Con `Promise.all`, basta con que falle uno (por ejemplo, Hada da un 500) para que se rechace todo y la Pokédex no se pinte. `allSettled` espera a todas y nunca rechaza: si falla un tipo, esos Pokémon salen sin color, pero la lista funciona.
   - En la ficha sí uso `Promise.all`, porque sin `/pokemon` o sin `/pokemon-species` la ficha está incompleta y es mejor enseñar el error con su botón de reintentar.
   - Descarté pedir el detalle de cada Pokémon para sacar su tipo: serían 151 peticiones solo para Kanto, frente a 18 que valen para todas las regiones.
2. **Un contador (`numeroLista`, `numeroFicha`) para descartar las respuestas que llegan tarde.**
   - Si pulsas Johto y enseguida Hoenn, la respuesta de Johto puede llegar después y pisar la lista con la región equivocada. Lo mismo pasa con la ficha si pulsas dos Pokémon seguidos.
   - Cada carga guarda su número. Cuando vuelve el `await`, solo pinta si su número sigue siendo el último.
   - Descarté cancelar la petición anterior con `AbortController`: también funciona, pero obliga a pasar la señal por `pedirJSON` y a distinguir una cancelación de un error de verdad. El contador son dos líneas y se explica solo.
