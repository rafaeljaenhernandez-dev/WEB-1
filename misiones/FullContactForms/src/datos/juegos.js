// Catálogo del torneo: cada juego tiene su emblema y su formato (titulares + suplentes permitidos).
// El color de cada juego va en el CSS, con el selector [data-juego="…"]
export const JUEGOS = [
  { id: "valorant", nombre: "Valorant", emblema: "VAL", titulares: 5, maxSuplentes: 2 },
  { id: "lol", nombre: "League of Legends", emblema: "LOL", titulares: 5, maxSuplentes: 2 },
  { id: "rocket", nombre: "Rocket League", emblema: "RL", titulares: 3, maxSuplentes: 1 },
  { id: "brawl", nombre: "Brawl Stars", emblema: "BS", titulares: 3, maxSuplentes: 1 },
];

export const IDS_JUEGOS = JUEGOS.map((juego) => juego.id);

export const NIVELES = [
  { id: "novato", nombre: "Novato" },
  { id: "intermedio", nombre: "Intermedio" },
  { id: "experto", nombre: "Experto" },
];

export const DIAS = [
  { id: "lunes", nombre: "Lunes" },
  { id: "martes", nombre: "Martes" },
  { id: "miercoles", nombre: "Miércoles" },
  { id: "jueves", nombre: "Jueves" },
  { id: "viernes", nombre: "Viernes" },
];

export function buscarJuego(id) {
  return JUEGOS.find((juego) => juego.id === id);
}

// Texto del formato, p. ej. "5 titulares + hasta 2 suplentes"
export function textoFormato(juego) {
  return `${juego.titulares} titulares + hasta ${juego.maxSuplentes} ${juego.maxSuplentes === 1 ? "suplente" : "suplentes"}`;
}

// Estrellas del nivel: novato 1, intermedio 2, experto 3
export function estrellasDe(nivel) {
  return NIVELES.findIndex((elemento) => elemento.id === nivel) + 1;
}
