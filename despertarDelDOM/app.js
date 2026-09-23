const SIMBOLOS = ["🐉", "🧙", "🗡️", "🛡️", "🔮", "🏰", "🦄", "👑", "🧪", "📜"];

const NIVELES = {
  facil: { parejas: 6, columnas: 4 },
  normal: { parejas: 8, columnas: 4 },
  dificil: { parejas: 10, columnas: 5 },
};

const DURACION_FALLO = 800;

const tablero = document.querySelector("#tablero");
const mensaje = document.querySelector("#mensaje");
const selectorNivel = document.querySelector("#nivel");
const botonNuevaPartida = document.querySelector("#nueva-partida");
const textoMovimientos = document.querySelector("#movimientos");
const textoTiempo = document.querySelector("#tiempo");
const textoParejas = document.querySelector("#parejas");
const resultado = document.querySelector("#resultado");
const resumen = document.querySelector("#resumen");
const botonRevancha = document.querySelector("#revancha");

function crearEstadoInicial(nivel) {
  return {
    nivel,
    giradas: [],
    parejas: 0,
    movimientos: 0,
    segundos: 0,
    bloqueado: false,
    terminada: false,
    intervalo: null,
    espera: null,
  };
}

let estado = crearEstadoInicial(selectorNivel.value);

function totalParejas() {
  return NIVELES[estado.nivel].parejas;
}

function barajar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function formatearTiempo(segundos) {
  const minutos = String(Math.floor(segundos / 60)).padStart(2, "0");
  const resto = String(segundos % 60).padStart(2, "0");
  return `${minutos}:${resto}`;
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
  const { parejas, columnas } = NIVELES[estado.nivel];
  const simbolos = SIMBOLOS.slice(0, parejas);
  const mazo = barajar([...simbolos, ...simbolos]);
  const fragmento = document.createDocumentFragment();

  mazo.forEach((simbolo) => fragmento.append(crearCarta(simbolo)));
  tablero.style.setProperty("--columnas", columnas);
  tablero.replaceChildren(fragmento);
}

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = `mensaje mensaje--${tipo}`;
}

function actualizarMarcador() {
  textoMovimientos.textContent = estado.movimientos;
  textoTiempo.textContent = formatearTiempo(estado.segundos);
  textoParejas.textContent = `${estado.parejas} / ${totalParejas()}`;
}

function iniciarTemporizador() {
  estado.intervalo = setInterval(() => {
    estado.segundos++;
    actualizarMarcador();
  }, 1000);
}

function detenerTemporizador() {
  clearInterval(estado.intervalo);
  estado.intervalo = null;
}

function terminarPartida() {
  estado.terminada = true;
  detenerTemporizador();
  mostrarMensaje("🎉 ¡Has encontrado todas las parejas!", "exito");
  resumen.textContent = `Lo has conseguido en ${estado.movimientos} movimientos y ${formatearTiempo(estado.segundos)}.`;
  resultado.hidden = false;
}

function puedeGirar(carta) {
  return !estado.bloqueado && !estado.terminada && !carta.classList.contains("carta--girada");
}

function acertarPareja(primera, segunda) {
  primera.classList.add("carta--resuelta");
  segunda.classList.add("carta--resuelta");
  primera.disabled = true;
  segunda.disabled = true;
  estado.giradas = [];
  estado.parejas++;
  mostrarMensaje("✨ ¡Pareja encontrada!", "exito");

  if (estado.parejas === totalParejas()) {
    terminarPartida();
  }
}

function fallarPareja(primera, segunda) {
  estado.bloqueado = true;
  mostrarMensaje("💨 No coinciden… memoriza dónde estaban.", "fallo");

  estado.espera = setTimeout(() => {
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
  if (estado.intervalo === null) {
    iniciarTemporizador();
  }

  carta.classList.add("carta--girada");
  estado.giradas.push(carta);

  if (estado.giradas.length === 2) {
    comprobarPareja();
  }
}

function nuevaPartida() {
  detenerTemporizador();
  clearTimeout(estado.espera);
  estado = crearEstadoInicial(selectorNivel.value);
  resultado.hidden = true;
  pintarTablero();
  actualizarMarcador();
  mostrarMensaje("Gira dos cartas para empezar.", "neutro");
}

function manejarClicTablero(event) {
  const carta = event.target.closest(".carta");
  if (!carta || !puedeGirar(carta)) {
    return;
  }
  girarCarta(carta);
}

tablero.addEventListener("click", manejarClicTablero);
selectorNivel.addEventListener("change", nuevaPartida);
botonNuevaPartida.addEventListener("click", nuevaPartida);
botonRevancha.addEventListener("click", nuevaPartida);

nuevaPartida();
