const intento = document.querySelector("#intento");
const probar = document.querySelector("#probar");
const respuesta = document.querySelector("#respuesta");
const marcador = document.querySelector("#marcador");
const reiniciar = document.querySelector("#reiniciar");
const historial = document.querySelector("#historial");

const MAX_INTENTOS = 7;

let secreto = Math.floor(Math.random() * 100) + 1;
let intentos = 0;
let probados = [];

function responder(texto, tipo) {
  respuesta.textContent = texto;
  respuesta.className = `message ${tipo}`;
}

function actualizarMarcador() {
  marcador.textContent = `Intentos: ${intentos} / ${MAX_INTENTOS}`;
  historial.textContent = probados.length > 0 ? `Has probado: ${probados.join(", ")}` : "";
}

function terminarPartida() {
  probar.disabled = true;
  intento.disabled = true;
}

function consultar() {
  if (intento.value === "") {
    responder("🤨 Eso no es un número válido", "error");
    return;
  }

  const numero = Number(intento.value);

  if (!Number.isInteger(numero) || numero < 1 || numero > 100) {
    responder("🤨 Eso no es un número válido", "error");
    return;
  }

  intentos++;
  probados.push(numero);
  actualizarMarcador();

  if (numero === secreto) {
    responder(`🎉 ¡Correcto! Lo has adivinado en ${intentos} intento(s).`, "success");
    terminarPartida();
    return;
  }

  if (intentos >= MAX_INTENTOS) {
    responder(`💀 Se agotaron los intentos. Mi número era ${secreto}.`, "error");
    terminarPartida();
    return;
  }

  if (numero < secreto) {
    responder(`📈 Mi número es mayor que ${numero}`, "info");
  } else {
    responder(`📉 Mi número es menor que ${numero}`, "info");
  }

  intento.value = "";
  intento.focus();
}

function nuevaProfecia() {
  secreto = Math.floor(Math.random() * 100) + 1;
  intentos = 0;
  probados = [];
  intento.value = "";
  intento.disabled = false;
  probar.disabled = false;
  responder("El oráculo espera...", "neutral");
  actualizarMarcador();
  intento.focus();
}

probar.addEventListener("click", consultar);
reiniciar.addEventListener("click", nuevaProfecia);
intento.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    consultar();
  }
});

actualizarMarcador();
