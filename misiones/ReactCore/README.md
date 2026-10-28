# ⚛️ Reactor Core · Pokédex en React

Misión M3 · Reactor Core, de Web Development I.

Es la Pokédex de la M2 ([Async Odyssey](../async_odyssey/)) **reconstruida en React 19** con Vite. Funciona igual que la de la M2: regiones, búsqueda, filtro por tipo, orden y ficha de cada Pokémon. La diferencia es que la interfaz ya no se pinta a mano con `createElement`: está hecha de componentes que reciben props, y **la pantalla se deriva del estado**. Como novedad trae **Mi equipo**, un equipo de hasta 6 Pokémon que se guarda en `localStorage`.

## Cómo probarlo

Necesita Node.js.

```bash
cd misiones/ReactCore
npm install
npm run dev
```

Se abre en `http://localhost:5173`. `npm run build` genera la versión de producción y `npm run lint` pasa oxlint con la regla de los hooks.

1. Al entrar se cargan los Pokémon de **Kanto** y, a la vez, la ficha de **Pikachu**.
2. Cambia de región con los chips, busca por nombre (`pika`) o por número (`25`, `#025`), filtra por tipo y cambia el orden.
3. Pulsa una tarjeta para abrir su ficha. El título de la pestaña cambia al Pokémon elegido.
4. En la ficha, pulsa **Añadir al equipo**. El equipo aparece arriba de la Pokédex, dice cuántos de los 18 tipos cubre y no deja pasar de 6. Pulsa un miembro para abrir su ficha o la × para quitarlo. Si recargas la página, el equipo sigue ahí.

## Estructura

```
ReactCore/
├── index.html
├── package.json            React 19, Vite y oxlint
├── vite.config.js
└── src/
    ├── main.jsx            monta <App /> dentro de <StrictMode>
    ├── App.jsx             dueño del estado compartido; calcula lo derivado
    ├── styles.css          los estilos de la M2, reutilizados
    ├── hooks/
    │   ├── useFetch.js     pide datos en un efecto (carga, error, reintentar y respuestas viejas)
    │   └── useLocalStorage.js   useState que sobrevive a recargar
    ├── datos/              JavaScript sin React
    │   ├── pokeapi.js      fetch, errores y caché (de api.js de la M2)
    │   ├── pokedex.js      regiones, tipos, limpiar, filtrar, ordenar y contar (de logica.js)
    │   ├── ficha.js        monta la ficha con sus dos respuestas
    │   └── cargas.js       las funciones que usa useFetch: cargarRegion y cargarFicha
    └── components/
        ├── Cabecera.jsx, Pie.jsx
        ├── Mandos.jsx → Regiones.jsx        formulario con campos controlados
        ├── Resumen.jsx                      sin estado: todo derivado
        ├── ListaPokemon.jsx → TarjetaPokemon.jsx → Arte.jsx, Tipos.jsx
        ├── Ficha.jsx → Stats.jsx, Tipos.jsx, Arte.jsx
        ├── Equipo.jsx (+ equipo.css)
        └── Aviso.jsx                        mensaje de error o vacío con botón
```

Ningún fichero de JavaScript pasa de 100 líneas. `styles.css` es el CSS de la M2 tal cual y `equipo.css` añade solo lo del equipo.

## Qué practica

- **Componentización:**
  - Cada componente hace una sola cosa. `TarjetaPokemon` pinta una tarjeta, `ListaPokemon` decide qué estado enseñar y `Ficha` pide y pinta su ficha.
  - Las props tienen nombres que dicen qué son. Los datos bajan del padre al hijo (`pokemons`, `elegidoId`) y los avisos suben con funciones (`alElegir`, `alQuitar`, `alCambiarFiltro`).
  - `Tipos`, `Arte` y `Aviso` se reutilizan en la lista, la ficha y los errores.
- **Estado mínimo y valores derivados.** Solo hay estos estados:
  - `region`, `filtros`, `elegido` y `equipo` (este con `useLocalStorage`) en App;
  - `intento` y `respuesta` dentro de `useFetch`;
  - en `Arte`, si la imagen está cargando, lista o rota (cada imagen la suya).
  - Todo lo demás se calcula en el render: la lista visible (`ordenar(filtrar(...))`), el resumen y el tipo más común, si el elegido está en el equipo, si el equipo está lleno, cuántos tipos cubre y hasta *cargando*. *Cargando* no es un estado propio: es «la respuesta guardada no es de la petición actual».
  - Las actualizaciones no mutan: `{ ...anteriores, [campo]: valor }`, `[...anterior, nuevo]`, `filter` para quitar y `toSorted` para ordenar.
- **Lifting state up:** el equipo lo usan dos hermanos, la ficha (botón de añadir o quitar) y el panel del equipo. Por eso vive en `App`, que se lo pasa a los dos.
- **Efectos, solo para sincronizar con algo externo:**
  1. `useFetch`: pedir a la PokeAPI cuando cambia la región o el Pokémon. La limpieza marca la respuesta como vieja (`ignorar = true`). Si cambias de región antes de que llegue la anterior, esa respuesta no pisa a la nueva, y con `StrictMode` tampoco se guarda dos veces.
  2. `useLocalStorage`: escribir el equipo en `localStorage` cada vez que cambia. La lectura va en la función inicializadora de `useState`, así que solo se lee en el primer render.
  3. `document.title` con el nombre del Pokémon elegido.
  - Ni filtrar, ni ordenar, ni contar usan efectos: son cálculos del render. Añadir al equipo tampoco, porque es la respuesta a un clic y va en el manejador.
- **Listas y condicionales:**
  - `key={pokemon.id}` en las tarjetas y en el equipo, `key={tipo}` en las etiquetas y `key={stat.nombre}` en las barras. Nunca se usa el índice, porque la lista se filtra y se reordena.
  - `ListaPokemon` y `Ficha` devuelven pronto según el estado (cargando → error → vacío → datos), con `if` antes del `return`.
  - `&&` solo con valores que no son números (`titulo &&`, `accion &&`) y ternarios para los textos.
- **Eventos:** `onChange` en los campos controlados, `onClick` con flecha cuando hay argumento (`() => alQuitar(pokemon.id)`) y `preventDefault()` en el `onSubmit` del formulario.
- **★ Bonus, dos hooks propios:**
  - `useFetch(cargar, argumento)` devuelve `{ cargando, error, datos, reintentar }` y lo usan la lista y la ficha.
  - `useLocalStorage(clave, inicial, validar)` funciona como `useState`, pero valida lo que lee: si alguien deja basura en `localStorage`, el equipo arranca vacío en vez de romper la app.
- **Mejoras sobre la M2** (lo que señaló el corrector):
  - los comparadores de nombres devuelven 0 en caso de empate;
  - la caché valida lo que lee, caduca a la semana y lleva versión (`pokedex-v1:`);
  - ya no hay un `find` que pueda fallar al elegir, porque la tarjeta pasa su propio Pokémon;
  - si los tipos fallan sin red, se vuelven a pedir al pulsar «Volver a intentarlo» (en la M2 se quedaban sin color hasta recargar).

## Uso de IA

Usé **Claude Code** (modelo Claude Opus 5.5).

Prompt real que usé: le pegué la captura de la rúbrica de la M3 de la Arena y le escribí *«vamos a hacer en el la carepta de web1 ReactCore la mision3»*.

La IA escribió el código por fases, partiendo de la M2, y cada fase terminó con algo funcionando y su propio commit, ademas, yo estuve mirando cada fase y comparandola con las cosas qu ehicimos en clase, como ya sabe el metodo en el que trabajamos en este caso no tuve que cambiar nada porque el codigo de primeras ya estba hecho como hacemos en clase:

| Fase | Qué se añadió | Commit |
|------|---------------|--------|
| 1 | Proyecto React 19 + Vite, cabecera y estilos de la M2 | `proyecto React 19 + Vite…` |
| 2 | Datos de la M2 pasados a módulos, `useFetch` y lista de cada región con sus estados | `lista de cada región con useFetch…` |
| 3 | Búsqueda, filtro y orden con campos controlados; lista y resumen derivados | `búsqueda, filtro por tipo y orden…` |
| 4 | Ficha del Pokémon con su propia carga | `ficha del Pokémon elegido…` |
| 5 | Mi equipo con `useLocalStorage` y título de la pestaña con `useEffect` | `equipo de 6 con useLocalStorage…` |
| 6 | Arreglo: los tipos que fallan sin red se vuelven a pedir | `los tipos que fallan sin red…` |
| 7 | Este README | `README de la M3…` |

Cómo se verificó:
- Kanto carga 151 Pokémon. Al buscar «char» salen 3 y el orden Z-A los invierte. Con «zzz» aparece el mensaje de vacío.
- Al pulsar Charizard se abre su ficha, su tarjeta queda marcada y cambia el título de la pestaña. Johto carga 100.
- En el equipo, el 7.º no entra (el botón dice «Equipo completo»). La × quita, un miembro abre su ficha y el equipo sigue tras recargar. Con datos rotos en `localStorage`, arranca vacío.
- Con la PokeAPI cortada, la lista y la ficha enseñan su error. «Volver a intentarlo» las recupera, colores incluidos.
- No hubo errores ni avisos en la consola, `npm run build` y `npm run lint` pasan limpios, y no quedan `var`, `innerHTML`, `querySelector`, `push`, `sort` ni `key` con índice.

**Escrito a mano:** 
Por cada una de las 7 fases he ido verfificando que todo este bien, cambiar no he tenido que cambiar nada, la ia ya esta etrenada con nuestros pdf y prestenaciones, con ejemplos de las anteriores misiones y su feetback, entonces lo hace todo bastante bien a la primera.

## Autopsia

1. **`useFetch` guarda a qué petición pertenece la respuesta, en vez de tener un `useState` de `cargando`.**
   - En la M2 había dos contadores (`numeroLista`, `numeroFicha`) para tirar las respuestas que llegaban tarde. En React eso lo hace la limpieza del efecto: cuando cambia el argumento, la petición anterior queda marcada como vieja y no se guarda.
   - Descarté un `useState` de `cargando` que se pone a `true` al empezar y a `false` al terminar. Es un estado que se puede calcular de otro: la respuesta guardada no es de la petición actual. Además, obligaba a hacer un `setState` nada más entrar en el efecto, que provoca un render extra.
   - Descarté también cancelar con `AbortController`. Sale en la teoría de la Unidad 2, pero como algo que se ve en detalle en la Unidad 4. La bandera `ignorar` usa la función de limpieza de la Unidad 3 y basta, porque la caché aprovecha la respuesta aunque se descarte.
2. **El equipo vive en `App`, no en el componente `Equipo`.**
   - Lo necesitan dos componentes hermanos: la ficha (para saber si poner «Añadir» o «Quitar», y si el equipo está lleno) y el panel del equipo. Si viviera en `Equipo`, la ficha no podría leerlo.
   - Descarté un `Context`. Solo hay un nivel entre `App` y los dos componentes, así que no hay *prop drilling* que justifique crearlo.
   - En el equipo solo se guardan `id`, `nombre` y `tipos`, no la ficha entera. Así cabe de sobra en `localStorage` y la validación al leer es sencilla.
