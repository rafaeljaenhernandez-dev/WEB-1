const numeroInput = document.querySelector('#numero');
const boton = document.querySelector('#comprobar');
const botonReiniciar = document.querySelector('#reiniciar');
const mensaje = document.querySelector('#mensaje');
const contador = document.querySelector('#intentos');

let secreto = Math.floor(Math.random() * 100) + 1;
let intentos = 0;
const maxIntentos = 7;

function setMensaje(texto, tipo = 'neutral') {
  mensaje.textContent = texto;
  mensaje.className = `message ${tipo}`;
}

function actualizarIntentos() {
  contador.textContent = String(intentos);
}

function revisarNumero() {
  const valor = Number(numeroInput.value);

  if (numeroInput.value.trim() === '') {
    setMensaje('Introduce un número antes de consultar al oráculo.', 'info');
    return;
  }

  if (Number.isNaN(valor) || valor < 1 || valor > 100) {
    setMensaje('El número debe estar entre 1 y 100. Intenta otra vez.', 'error');
    return;
  }

  intentos += 1;
  actualizarIntentos();

  if (valor === secreto) {
    setMensaje(`¡Correcto! Has acertado en ${intentos} intento${intentos === 1 ? '' : 's'}.`, 'success');
    boton.disabled = true;
    numeroInput.disabled = true;
    return;
  }

  if (intentos >= maxIntentos) {
    setMensaje(`Se han acabado los intentos. El número secreto era ${secreto}.`, 'error');
    boton.disabled = true;
    numeroInput.disabled = true;
    return;
  }

  if (valor < secreto) {
    setMensaje('El oráculo dice: el número es mayor.', 'info');
  } else {
    setMensaje('El oráculo dice: el número es menor.', 'info');
  }

  numeroInput.value = '';
  numeroInput.focus();
}

function reiniciarJuego() {
  secreto = Math.floor(Math.random() * 100) + 1;
  intentos = 0;
  actualizarIntentos();
  numeroInput.value = '';
  numeroInput.disabled = false;
  boton.disabled = false;
  setMensaje('Introduce un número para comenzar.', 'neutral');
  numeroInput.focus();
}

boton.addEventListener('click', revisarNumero);

numeroInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    revisarNumero();
  }
});

botonReiniciar.addEventListener('click', reiniciarJuego);
