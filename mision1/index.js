const input = document.querySelector('#numero');
const comprobar = document.querySelector('#comprobar');
const reiniciar = document.querySelector('#reiniciar');
const mensaje = document.querySelector('#mensaje');
const contador = document.querySelector('#contador');

let secreto = Math.floor(Math.random() * 100) + 1;
let intentos = 0;
const maxIntentos = 7;

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = `message ${tipo}`;
}

function actualizarContador() {
  contador.textContent = intentos;
}

function comprobarNumero() {
  const valor = Number(input.value);

  if (input.value.trim() === '') {
    mostrarMensaje('Introduce un número antes de comprobar.', 'info');
    return;
  }

  if (Number.isNaN(valor) || valor < 1 || valor > 100) {
    mostrarMensaje('El número debe estar entre 1 y 100.', 'error');
    return;
  }

  intentos += 1;
  actualizarContador();

  if (valor === secreto) {
    mostrarMensaje(`¡Correcto! Has acertado en ${intentos} intento(s).`, 'success');
    comprobar.disabled = true;
    input.disabled = true;
    return;
  }

  if (intentos >= maxIntentos) {
    mostrarMensaje(`Se acabaron los intentos. El número secreto era ${secreto}.`, 'error');
    comprobar.disabled = true;
    input.disabled = true;
    return;
  }

  if (valor < secreto) {
    mostrarMensaje('El oráculo dice: es mayor.', 'info');
  } else {
    mostrarMensaje('El oráculo dice: es menor.', 'info');
  }

  input.value = '';
  input.focus();
}

function iniciarJuego() {
  secreto = Math.floor(Math.random() * 100) + 1;
  intentos = 0;
  actualizarContador();
  input.value = '';
  input.disabled = false;
  comprobar.disabled = false;
  mostrarMensaje('Introduce un número para comenzar.', 'neutral');
  input.focus();
}

comprobar.addEventListener('click', comprobarNumero);
reiniciar.addEventListener('click', iniciarJuego);
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    comprobarNumero();
  }
});

actualizarContador();
