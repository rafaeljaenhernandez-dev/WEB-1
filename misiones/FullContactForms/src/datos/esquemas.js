import { z } from "zod";
import { DIAS, IDS_JUEGOS, NIVELES, buscarJuego } from "./juegos.js";

// Edad cumplida a día de hoy a partir de una fecha "AAAA-MM-DD" (lo que da <input type="date">)
export function calcularEdad(fecha) {
  const nacimiento = new Date(fecha);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const aunNoHaCumplido =
    hoy.getMonth() < nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate());
  if (aunNoHaCumplido) edad = edad - 1;
  return edad;
}

const EDAD_MINIMA = 16;

// Reglas de cada campo. Se definen una sola vez y las usan los dos esquemas de abajo:
// el del formulario y el que valida lo que responde el API.
const campos = {
  nombre: z
    .string()
    .trim()
    .min(3, "El nombre del equipo necesita al menos 3 caracteres")
    .max(24, "El nombre del equipo admite como mucho 24 caracteres"),
  capitan: z.string().trim().min(2, "Escribe el nombre del capitán o capitana"),
  email: z
    .email("Escribe un email válido, p. ej. nombre@live.u-tad.com")
    .refine((email) => email.endsWith("@live.u-tad.com") || email.endsWith("@u-tad.com"), {
      error: "El torneo es interno: usa tu correo de la U-tad (@live.u-tad.com)",
    }),
  nacimiento: z
    .string()
    .min(1, "Indica la fecha de nacimiento del capitán")
    .refine((fecha) => calcularEdad(fecha) >= EDAD_MINIMA, {
      error: `El capitán debe tener al menos ${EDAD_MINIMA} años`,
    }),
  juego: z.enum(IDS_JUEGOS, { error: "Elige el juego en el que compite el equipo" }),
  nivel: z.enum(
    NIVELES.map((nivel) => nivel.id),
    { error: "Elige el nivel del equipo" },
  ),
  dias: z
    .array(z.enum(DIAS.map((dia) => dia.id)))
    .min(1, "Marca al menos un día en el que podáis jugar"),
};

// ¿El número de jugadores cabe en el formato del juego? (titulares como mínimo, suplentes como extra)
function cabeEnElFormato(datos) {
  const juego = buscarJuego(datos.juego);
  return datos.jugadores >= juego.titulares && datos.jugadores <= juego.titulares + juego.maxSuplentes;
}

// Esquema del formulario: única fuente de verdad de la validación (lo usa zodResolver)
export const esquemaInscripcion = z
  .object({
    ...campos,
    // Los inputs siempre dan texto: coerce lo convierte a número antes de validar
    jugadores: z.coerce
      .number()
      .int("El número de jugadores tiene que ser entero")
      .min(1, "Indica cuántos jugadores sois"),
    normas: z.literal(true, { error: "Tienes que aceptar las normas del torneo" }),
  })
  .refine(cabeEnElFormato, {
    error: "El número de jugadores no encaja con el formato del juego elegido",
    path: ["jugadores"],
  });

// Esquema de un equipo tal y como lo devuelve el API (reto bonus).
// Reutiliza las mismas reglas del formulario: un email que no sea de la U-tad
// o un juego que no existe tampoco se aceptan si vienen del servidor.
export const esquemaEquipo = z.object({
  id: z.number().int(),
  ...campos,
  jugadores: z.number().int().min(1), // del servidor ya llega como número: sin coerce
  inscrito: z.string().refine((fecha) => !Number.isNaN(Date.parse(fecha)), { error: "Fecha de inscripción no válida" }),
});

// La respuesta de GET /equipos tiene que ser, como mínimo, una lista
export const esquemaLista = z.array(z.unknown(), { error: "El servidor no devolvió una lista" });
