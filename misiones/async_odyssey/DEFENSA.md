# Defensa de la Misión 2 · Async Odyssey

## 1. ¿Qué API consumas y qué le pides exactamente?

```
Consumo la PokeAPI. La función es pedirJSON, en api.js, y de ella cuelgan pedirLista, pedirTipo y pedirFicha. Hace fetch con async/await y devuelve el JSON recortado (pedirLista devuelve results).
Si no es ok (respuesta.ok), lanza ErrorHttp con el código. Si falla la red, hay timeout o el JSON es ilegible, traducirError lo convierte en un mensaje claro.
```

## 2. ¿Qué ve el usuario mientras espera y si algo falla?

```
Carga: tarjetas fantasma y "Buscando los Pokémon…" (pintarListaCargando). Error: mensaje y botón de reintentar (pintarListaError). Vacío: pintarListaVacia.
Los pinta render.js, pero main.js decide cuándo: pone "cargando" antes del await, pinta los datos si va bien y pinta el error en el catch (cargarRegion y elegir).
```

## 3. Una transformación de datos

```
limpiarLista (logica.js). Entra results de la API ({name, url}) y salen objetos {id, nombre, tipos, arte}.
Uso filter, map, filter, map: descarto entradas raras, saco el id de la URL y añado los tipos. La API no da el id ni el tipo directamente y los datos pueden venir mal.
```

## 4. Módulos del proyecto

```
- main.js: estado, eventos y orden de las cargas. Es el único que importa los otros tres.
- api.js: peticiones, errores y caché. No toca el DOM.
- logica.js: funciones puras de datos (limpiarLista, filtrar, ordenar, aFicha).
- render.js: lo único que toca el DOM.
api.js exporta pedirLista, pedirTipo, pedirFicha y ErrorHttp. Solo main.js los importa.
```

## 5. Decisión (Uso de IA / Autopsia)

```
Exigí que el JavaScript usara solo lo visto en clase para poder defenderlo. Cambiamos regex por replaceAll, localeCompare por < y >, y FormData por .value. Descarté lo que funcionaba pero no había visto en clase.
Otra decisión de la Autopsia: Promise.allSettled en los 18 tipos en vez de Promise.all. Si un tipo falla, la lista se pinta igual y solo esos Pokémon salen sin color.
```
