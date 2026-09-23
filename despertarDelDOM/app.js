const SIMBOLOS = ["🐉", "🧙", "🗡️", "🛡️", "🔮", "🏰", "🦄", "👑"];
const DURACION_FALLO = 800;

const tablero = document.querySelector("#tablero");
const mensaje = document.querySelector("#mensaje");
const textoMovimientos = document.querySelector("#movimientos");
const textoParejas = document.querySelector("#parejas");

const estado = {
  giradas: [],
  parejas: 0,
  movimientos: 0,
  bloqueado: false,
};

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

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = `mensaje mensaje--${tipo}`;
}

function actualizarMarcador() {
  textoMovimientos.textContent = estado.movimientos;
  textoParejas.textContent = `${estado.parejas} / ${SIMBOLOS.length}`;
}

function puedeGirar(carta) {
  return !estado.bloqueado && !carta.classList.contains("carta--girada");
}

function acertarPareja(primera, segunda) {
  primera.classList.add("carta--resuelta");
  segunda.classList.add("carta--resuelta");
  primera.disabled = true;
  segunda.disabled = true;
  estado.giradas = [];
  estado.parejas++;
  mostrarMensaje("✨ ¡Pareja encontrada!", "exito");

  if (estado.parejas === SIMBOLOS.length) {
    mostrarMensaje("🎉 ¡Has encontrado todas las parejas!", "exito");
  }
}

function fallarPareja(primera, segunda) {
  estado.bloqueado = true;
  mostrarMensaje("💨 No coinciden… memoriza dónde estaban.", "fallo");

  setTimeout(() => {
    primera.classList.remove("carta--girada");
    segunda.classList.remove("carta--girada");
    estado.giradas = [];
    estado.bloqueado = false;
  }, DURACION_FALLO);
}

function comprobarPareja() {
  const [primera, segunda] = estado.giradas;
  estado.movimientos++;

  if (primera.dataset.simbolo === segunda.dataset.simbolo) {
    acertarPareja(primera, segunda);
  } else {
    fallarPareja(primera, segunda);
  }

  actualizarMarcador();
}

function girarCarta(carta) {
  carta.classList.add("carta--girada");
  estado.giradas.push(carta);

  if (estado.giradas.length === 2) {
    comprobarPareja();
  }
}

function manejarClicTablero(event) {
  const carta = event.target.closest(".carta");
  if (!carta || !puedeGirar(carta)) {
    return;
  }
  girarCarta(carta);
}

tablero.addEventListener("click", manejarClicTablero);

pintarTablero();
actualizarMarcador();
