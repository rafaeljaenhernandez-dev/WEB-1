const SIMBOLOS = ["🐉", "🧙", "🗡️", "🛡️", "🔮", "🏰", "🦄", "👑", "🧪", "📜"];

const NIVELES = {
  facil: { parejas: 6, columnas: 4 },
  normal: { parejas: 8, columnas: 4 },
  dificil: { parejas: 10, columnas: 5 },
};

const DURACION_FALLO = 800;
const DURACION_HECHIZO = 1500;
const PENALIZACION_HECHIZO = 5;
const TECLA_SECRETA = "n";

const tablero = document.querySelector("#tablero");
const mensaje = document.querySelector("#mensaje");
const selectorNivel = document.querySelector("#nivel");
const botonNuevaPartida = document.querySelector("#nueva-partida");
const botonHechizo = document.querySelector("#hechizo");
const textoMovimientos = document.querySelector("#movimientos");
const textoTiempo = document.querySelector("#tiempo");
const textoParejas = document.querySelector("#parejas");
const textoRecord = document.querySelector("#record");
const resultado = document.querySelector("#resultado");
const tituloResultado = document.querySelector("#resultado-titulo");
const resumen = document.querySelector("#resumen");
const botonRevancha = document.querySelector("#revancha");

function crearEstadoInicial(nivel) {
  return {
    nivel,
    giradas: [],
    parejas: 0,
    movimientos: 0,
    segundos: 0,
    racha: 0,
    hechizoUsado: false,
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

function claveRecord(nivel) {
  return `memoria-arcana-record-${nivel}`;
}

function leerRecord(nivel) {
  try {
    const guardado = localStorage.getItem(claveRecord(nivel));
    return guardado ? JSON.parse(guardado) : null;
  } catch {
    return null;
  }
}

function guardarRecord(nivel, record) {
  try {
    localStorage.setItem(claveRecord(nivel), JSON.stringify(record));
  } catch {
    mostrarMensaje("⚠️ No se ha podido guardar el récord en este navegador.", "info");
  }
}

function esMejorQue(partida, record) {
  if (record === null) {
    return true;
  }
  if (partida.movimientos !== record.movimientos) {
    return partida.movimientos < record.movimientos;
  }
  return partida.segundos < record.segundos;
}

function actualizarRecord() {
  const record = leerRecord(estado.nivel);
  textoRecord.textContent = record
    ? `${record.movimientos} mov · ${formatearTiempo(record.segundos)}`
    : "—";
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
  botonHechizo.disabled = true;

  const partida = { movimientos: estado.movimientos, segundos: estado.segundos };
  const esRecord = esMejorQue(partida, leerRecord(estado.nivel));

  if (esRecord) {
    guardarRecord(estado.nivel, partida);
    actualizarRecord();
  }

  tituloResultado.textContent = esRecord ? "🏆 ¡Nuevo récord!" : "🎉 ¡Tablero completado!";
  resumen.textContent = `Lo has conseguido en ${partida.movimientos} movimientos y ${formatearTiempo(partida.segundos)}.`;
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
  estado.racha++;

  const texto = estado.racha > 1 ? `🔥 ¡Racha x${estado.racha}!` : "✨ ¡Pareja encontrada!";
  mostrarMensaje(texto, "exito");

  if (estado.parejas === totalParejas()) {
    terminarPartida();
  }
}

function fallarPareja(primera, segunda) {
  estado.racha = 0;
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

function arrancarSiHaceFalta() {
  if (estado.intervalo === null) {
    iniciarTemporizador();
  }
}

function lanzarHechizo() {
  if (estado.hechizoUsado || estado.bloqueado || estado.terminada) {
    return;
  }

  arrancarSiHaceFalta();
  estado.hechizoUsado = true;
  estado.bloqueado = true;
  estado.movimientos += PENALIZACION_HECHIZO;
  botonHechizo.disabled = true;
  tablero.classList.add("tablero--revelado");
  mostrarMensaje(`🔮 Hechizo lanzado: +${PENALIZACION_HECHIZO} movimientos. ¡Memoriza!`, "info");
  actualizarMarcador();

  estado.espera = setTimeout(() => {
    tablero.classList.remove("tablero--revelado");
    estado.bloqueado = false;
  }, DURACION_HECHIZO);
}

function girarCarta(carta) {
  arrancarSiHaceFalta();

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
  botonHechizo.disabled = false;
  tablero.classList.remove("tablero--revelado");
  pintarTablero();
  actualizarMarcador();
  actualizarRecord();
  mostrarMensaje("Gira dos cartas para empezar.", "neutro");
}

function alternarModoNocturno(event) {
  const escribiendo = event.target.matches("input, select, textarea");
  if (event.key?.toLowerCase() !== TECLA_SECRETA || event.repeat || escribiendo) {
    return;
  }

  const activado = document.body.classList.toggle("modo-oscuro");
  mostrarMensaje(activado ? "🌙 Modo nocturno activado." : "☀️ Vuelve la luz del día.", "info");
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
botonHechizo.addEventListener("click", lanzarHechizo);
document.addEventListener("keydown", alternarModoNocturno);

nuevaPartida();
