const SIMBOLOS = ["🐉", "🧙", "🗡️", "🛡️", "🔮", "🏰", "🦄", "👑"];

const tablero = document.querySelector("#tablero");

function barajar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function crearElemento(etiqueta, clase, texto = "") {
  const elemento = document.createElement(etiqueta);
  elemento.className = clase;
  elemento.textContent = texto;
  return elemento;
}

function crearCarta(simbolo) {
  const carta = crearElemento("button", "carta");
  carta.type = "button";
  carta.dataset.simbolo = simbolo;
  carta.append(
    crearElemento("span", "carta__cara carta__dorso", "✦"),
    crearElemento("span", "carta__cara carta__frente", simbolo)
  );
  return carta;
}

function pintarTablero() {
  const mazo = barajar([...SIMBOLOS, ...SIMBOLOS]);
  const fragmento = document.createDocumentFragment();
  mazo.forEach((simbolo) => fragmento.append(crearCarta(simbolo)));
  tablero.replaceChildren(fragmento);
}

function manejarClicTablero(event) {
  const carta = event.target.closest(".carta");
  if (!carta) {
    return;
  }
  carta.classList.toggle("carta--girada");
}

tablero.addEventListener("click", manejarClicTablero);

pintarTablero();
