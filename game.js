const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Resolución interna pensada para un juego 2D retro en pantalla horizontal.
const GAME_WIDTH = 960;
const GAME_HEIGHT = 540;

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

const player = {
  x: 120,
  y: 400,
  width: 48,
  height: 72,
  speed: 4,
  vy: 0,
  jumpPower: -12,
  grounded: true
};

const keys = new Set();

window.addEventListener('keydown', (event) => {
  keys.add(event.key.toLowerCase());
  if (['arrowleft', 'arrowright', 'arrowup', ' '].includes(event.key.toLowerCase())) {
    event.preventDefault();
  }
});

window.addEventListener('keyup', (event) => {
  keys.delete(event.key.toLowerCase());
});

function resizeCanvas() {
  const scale = Math.min(window.innerWidth / GAME_WIDTH, window.innerHeight / GAME_HEIGHT);
  canvas.style.width = `${GAME_WIDTH * scale}px`;
  canvas.style.height = `${GAME_HEIGHT * scale}px`;
}

function update() {
  if (keys.has('arrowleft') || keys.has('a')) player.x -= player.speed;
  if (keys.has('arrowright') || keys.has('d')) player.x += player.speed;

  const jumping = keys.has('arrowup') || keys.has('w') || keys.has(' ');
  if (jumping && player.grounded) {
    player.vy = player.jumpPower;
    player.grounded = false;
  }

  player.vy += 0.55;
  player.y += player.vy;

  const floor = 472;
  if (player.y + player.height >= floor) {
    player.y = floor - player.height;
    player.vy = 0;
    player.grounded = true;
  }

  player.x = Math.max(0, Math.min(GAME_WIDTH - player.width, player.x));
}

function draw() {
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Fondo provisional: luego lo reemplazaremos por los gráficos del juego.
  ctx.fillStyle = '#172033';
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  ctx.fillStyle = '#293b24';
  ctx.fillRect(0, 472, GAME_WIDTH, GAME_HEIGHT - 472);

  ctx.fillStyle = '#e8e8e8';
  ctx.font = '28px monospace';
  ctx.fillText('JUEGOEMI', 30, 45);

  // Personaje provisional. Será reemplazado por tus sprites.
  ctx.fillStyle = '#d8a25e';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
loop();
