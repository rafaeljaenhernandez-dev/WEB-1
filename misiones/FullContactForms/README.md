# 🎮 Full Contact Forms · Inscripción al torneo de esports de la U-tad

Misión M4 · Full Contact Forms, de Web Development I. *«Valida o muere.»*

Una app de React 19 con Vite para **inscribir equipos en un torneo interno de esports** (Valorant, League of Legends, Rocket League y Brawl Stars) y **ver la lista de inscritos**. El formulario usa **React Hook Form** con un esquema de **Zod** como única fuente de verdad de la validación, y los datos remotos van con **TanStack Query v5**: una query para el listado y dos mutaciones (inscribir y dar de baja), ambas con invalidación. El API es una API REST de verdad, montada con **json-server** sobre `db.json`.

## Cómo probarlo

Necesita Node.js 22 o superior y **dos terminales**, una para el API y otra para la app:

```bash
cd misiones/FullContactForms
npm install

# Terminal A: el API en http://localhost:3001 (responde con 600 ms de retraso para que se vean los estados de carga)
npm run api

# Terminal B: la app en http://localhost:5173
npm run dev
```

La URL del API sale de `VITE_API_URL`. Si no se define, se usa `http://localhost:3001`; `.env.example` muestra cómo cambiarla. `npm run build` genera la versión de producción y `npm run lint` pasa oxlint.

1. Pulsa **Inscribir equipo** sin rellenar nada. Cada campo enseña su error, el foco salta al primero y un lector de pantalla lo anuncia.
2. Prueba las reglas del esquema: un email `@gmail.com` (solo valen correos de la U-tad), un capitán menor de 16 años o 7 jugadores en Rocket League (el formato es de 3 titulares más 1 suplente).
3. Corrige los campos. Los errores desaparecen mientras escribes, y si cambias de juego también se revalida el número de jugadores.
4. Envía el formulario. El botón pasa a «Inscribiendo…», sale el mensaje de éxito, el formulario se vacía y el equipo aparece el primero en la lista sin recargar la página.
5. Repite el mismo nombre en el mismo juego, aunque sea en mayúsculas: el servidor no lo admite y el error se muestra debajo del botón.
6. Filtra por juego con los botones de arriba de la lista, o pulsa **Dar de baja** en una tarjeta.
7. Para el API (Ctrl+C en la terminal A) y recarga: la lista muestra el error y un botón **Reintentar**.
8. **★ Bonus:** en `db.json` hay un equipo con datos corruptos a propósito (id 4, «Equipo Fantasma»). Zod lo rechaza, no se pinta, y la lista avisa de qué campos fallan: `email, nivel, dias, jugadores`.

> `npm run api` arranca json-server con `--watch`, así que las altas y bajas se guardan en `db.json`. Para volver a los datos iniciales: `git checkout db.json`.

## Estructura

```
FullContactForms/
├── index.html
├── package.json              React 19, RHF, Zod, @hookform/resolvers, TanStack Query y json-server
├── vite.config.js
├── db.json                   «base de datos» del API: 3 equipos válidos y 1 corrupto (bonus)
├── .env.example              VITE_API_URL
└── src/
    ├── main.jsx              QueryClient + QueryClientProvider + Devtools
    ├── App.jsx               maqueta: formulario a la izquierda y lista a la derecha
    ├── styles.css
    ├── datos/                JavaScript sin React
    │   ├── juegos.js         catálogo: juegos con su formato, niveles y días
    │   ├── esquemas.js       Zod: esquema del formulario y esquema de la respuesta del API
    │   ├── api.js            capa de servicios: GET, POST y DELETE con fetch y safeParse
    │   └── accesibilidad.js  aria-invalid y aria-describedby de cada campo
    ├── hooks/
    │   └── useEquipos.js     useEquipos (useQuery), useInscribir y useDarDeBaja (useMutation)
    └── components/
        ├── Cabecera.jsx                cartel del torneo y marcador en vivo (misma query que la lista)
        ├── FormularioInscripcion.jsx   useForm + zodResolver + useInscribir
        ├── Campo.jsx                   etiqueta + input + ayuda + error con role="alert"
        ├── Celebracion.jsx             confeti decorativo al inscribir (aria-hidden)
        ├── ListaEquipos.jsx            filtros y estados: cargando, error, vacío, datos y corruptos
        └── TarjetaEquipo.jsx           carta de un equipo y su botón de baja (con su propia mutación)
```

Los componentes no llaman nunca a `fetch`. Solo usan los hooks de `useEquipos.js`, que a su vez llaman a `api.js`.

## Qué practica

- **React Hook Form:**
  - Formulario no controlado: cada campo se conecta con `{...register("campo")}` y no hay ningún `useState` por campo.
  - `handleSubmit(onSubmit)` solo llama a `onSubmit` cuando Zod da los datos por buenos. El `<form>` lleva `noValidate` para que mande Zod y no el navegador.
  - El juego se elige con tarjetas grandes, pero por dentro son radios normales con `register("juego")`: el radio queda invisible encima de la tarjeta, así que funcionan el teclado, el lector de pantalla y el foco al error.
  - Los radios del nivel y los checkboxes de los días comparten `name`. RHF junta los días en un array: `["lunes", "jueves"]`.
  - `register("juego", { deps: ["jugadores"] })` vuelve a validar los jugadores al cambiar de juego.
  - `reset()` vacía el formulario cuando la inscripción sale bien, y `defaultValues` define cómo empieza.
- **Errores accesibles:**
  - Cada campo tiene su `<label htmlFor>` unido al `id` del input; el placeholder solo da una pista del formato.
  - Los campos con error llevan `aria-invalid="true"` y `aria-describedby`, que apunta al mensaje de error y, si la hay, a la ayuda.
  - Los mensajes de error van en `role="alert"`. Los radios y los checkboxes se agrupan en `<fieldset>` + `<legend>`, y los inputs llevan `autocomplete` (`name`, `email`, `bday`).
  - Al enviar, el foco salta al primer campo con error: es el `shouldFocusError` de RHF, activo por defecto.
  - El botón solo se deshabilita durante el envío (`isPending`), nunca «hasta que el formulario sea válido».
- **Zod como única fuente de verdad:**
  - Todos los mensajes son propios y van en castellano. Se usan `z.email()`, `z.enum()`, `z.literal(true)` para las normas, `z.coerce.number()` para el número de jugadores (que llega como texto) y `.trim()`.
  - Refinamiento de campo: el email tiene que ser de la U-tad y el capitán tiene que tener al menos 16 años, calculados a partir de la fecha de nacimiento.
  - Refinamiento entre campos: el número de jugadores tiene que encajar con el formato del juego elegido. Va en `.refine(…, { path: ["jugadores"] })`, así que el error sale debajo del campo de jugadores.
  - Las reglas de cada campo se escriben una sola vez (`campos`) y las comparten el esquema del formulario y el de la respuesta del API.
- **TanStack Query v5:**
  - `useQuery({ queryKey: ["equipos", juego] })`: cada filtro tiene su propia entrada en la caché. Volver a un filtro ya visitado enseña la lista al instante y la refresca en segundo plano (aparece «Actualizando…»).
  - La cabecera usa `useEquipos("todos")`, la misma clave que la lista con el filtro «Todos». Query comparte la caché y solo sale **una** petición para los dos componentes. Cuando se inscribe un equipo, el marcador se actualiza solo, gracias a la misma invalidación.
  - `useMutation` para inscribir (POST) y para dar de baja (DELETE). Al terminar bien, `invalidateQueries({ queryKey: ["equipos"] })` invalida por prefijo **todas** las listas: «Todos» y la de cada juego.
  - `retry: 1` en el `QueryClient`: un reintento basta para un corte de red; con los tres por defecto, la pantalla se quedaba unos 7 segundos en «Cargando…».
  - La capa de servicios comprueba `response.ok` y lanza un `Error` con un mensaje legible, que Query recoge en `isError`.
- **Experiencia de usuario:**
  - Lista: «Cargando equipos…», error con botón de reintentar, lista vacía («¡Sé el primero!») y lista con datos.
  - Formulario: «Inscribiendo…» mientras se envía, éxito en `role="status"` («¡«Ctrl Alt Defeat» está dentro del torneo de Rocket League!») y error del servidor en `role="alert"`.
  - Cada tarjeta tiene su propia mutación de baja: «Dando de baja…» solo sale en la tarjeta pulsada, y la baja pide confirmación.
  - Aspecto de torneo de esports: cada juego tiene su color y su emblema, y cada equipo es una carta con su escudo, la plantilla dibujada (titulares rellenos y suplentes a rayas), el nivel en estrellas y los días como chips. Al inscribir un equipo salta un confeti. Todas las animaciones se desactivan con `prefers-reduced-motion`.
- **★ Bonus, la respuesta del API validada con Zod:** `obtenerEquipos` pasa cada equipo por `esquemaEquipo.safeParse()`. Los que fallan no llegan a la interfaz: se apartan en `corruptos` con su id y los campos que fallaron, y la lista lo enseña en un aviso. La respuesta del POST también se valida.

## Uso de IA

Usé **Claude Code** (modelo Claude Opus 5.5).

Prompts reales:
- Le adjunté el PDF del enunciado de la M4 y le escribí *«vamos con la m4»*.
- Me preguntó por el dominio y por el API, y elegí **inscripción a un torneo** y **json-server local**, las dos opciones que recomendaba.
- Para el diseño le pedí *«hazmelo un poco mas chetado visualmente de css»* y después *«quiero que sea mucho mas visual tengo amigos con cosas super guapas»*. En cada caso me propuso una lista de cambios y elegí cuáles meter.

La IA escribió el código por fases. Cada fase terminó con algo funcionando y con su propio commit:

| Fase | Qué se añadió | Commit |
|------|---------------|--------|
| 1 | Proyecto React 19 + Vite con RHF, Zod, Query y json-server; cabecera y estilos | `proyecto React 19 + Vite…` |
| 2 | Esquema Zod de la inscripción y formulario accesible con RHF | `esquema Zod de la inscripción…` |
| 3 | Capa de servicios y lista con `useQuery`, filtros por juego y estados | `capa de servicios y lista de equipos…` |
| 4 | Inscribir y dar de baja con `useMutation` e invalidación | `inscripción y baja con useMutation…` |
| 5 | Bonus: `safeParse` de la respuesta y equipo corrupto en `db.json` | `reto bonus…` |
| 6 | Arreglos visuales tras mirar las capturas | `casilla de las normas alineada…` |
| 7 | Este README | `README de la M4…` |
| 8 | Arena neón: rejilla, focos de color, paneles de cristal y animaciones | `estilo de arena neón…` |
| 9 | Rediseño: cabecera con marcador, juegos con color y emblema, cartas de equipo y efectos | `rediseño visual…` |

Cómo se verificó:
- El esquema, con casos de prueba en Node: formulario vacío, email de Gmail, capitán de 11 años y 6 jugadores en Rocket League. Cada caso da el mensaje esperado, y cuando faltan las normas el `.refine` del formato no se ejecuta (la trampa de Zod 4 que explica la teoría).
- La capa de servicios, contra json-server: lista ordenada, filtro por juego, alta sin el campo `normas`, nombre repetido rechazado sin distinguir mayúsculas, baja y el equipo corrupto descartado con sus campos.
- La app, en un navegador controlado por script:
  - al enviar vacío salen 9 errores con `role="alert"`, el foco va a «Nombre del equipo» y el email lleva `aria-invalid="true"` y `aria-describedby="ayuda-email error-email"`;
  - al corregir, los errores desaparecen sin volver a enviar;
  - el alta sale en la lista y el formulario se vacía;
  - el nombre repetido da error y el filtro de Rocket League enseña solo sus equipos.
- `npm run build` y `npm run lint` pasan limpios.

**Escrito a mano:** elegí el dominio del torneo y json-server como API. El código lo generó la IA; lo revisé fase a fase comparándolo con el PDF de la Unidad 4 (formularios y peticiones HTTP).

## Autopsia

1. **json-server en vez de JSONPlaceholder.**
   - JSONPlaceholder es el API de los ejercicios de la teoría, pero no guarda nada: el POST responde con éxito y el equipo nunca aparece en la lista. Así no se puede ver si la invalidación funciona.
   - json-server es una API REST de verdad sobre `db.json`. Guarda lo que envías, filtra (`?juego=rocket`) y ordena (`?_sort=inscrito&_order=desc`), así que la mutación y la invalidación se ven funcionar.
   - El coste es una segunda terminal (`npm run api`) y una dependencia de desarrollo más.
   - Descarté simular el API con `localStorage` y promesas con retraso: no habría peticiones HTTP de verdad, ni CORS, ni `response.ok`.
2. **La regla del nombre repetido va en `crearEquipo` y no en el esquema de Zod.**
   - Comprobarla necesita al servidor (los equipos ya inscritos), y el esquema del formulario es síncrono y no sabe nada del API. Por eso `crearEquipo` pide los equipos de ese juego antes del POST y lanza un error si el nombre ya está cogido. Ese error llega al formulario como `inscripcion.error`, en `role="alert"`.
   - Descarté un `.refine` asíncrono en el esquema: haría una petición en cada validación (cada tecla después del primer envío) y mezclaría las reglas del dato con el estado del servidor.
   - La comprobación tiene un límite: si dos equipos se inscriben a la vez con el mismo nombre, los dos pasan. En un API real esa regla iría también en el servidor; json-server no permite programarla.
