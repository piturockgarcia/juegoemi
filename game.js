const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const GAME_WIDTH = 960;
const GAME_HEIGHT = 540;
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

// Tus sprites están actualmente en la raíz del repositorio.
const SPRITES = {
  idle: 'parada.png',
  walk: 'caminar.png',
  jump: 'salto.png',
  shoot: 'disparar.png',
  punch: 'golpear.png',
  hurt: 'herido.png',
  dance: 'bailando.png',
  character: 'personaje.png'
};

const images = {};
for (const [name, src] of Object.entries(SPRITES)) {
  const image = new Image();
  image.src = src;
  images[name] = image;
}

const player = {
  x: 120,
  y: 400,
  width: 72,
  height: 96,
  speed: 4,
  vy: 0,
  jumpPower: -12,
  grounded: true,
  direction: 1,
  state: 'idle',
  actionTimer: 0
};

const keys = new Set();
window.addEventListener('keydown', (event) => {
  keys.add(event.key.toLowerCase());
  if (['arrowleft', 'arrowright', 'arrowup', ' ', 'z', 'x'].includes(event.key.toLowerCase())) {
    event.preventDefault();
  }
});
window.addEventListener('keyup', (event) => keys.delete(event.key.toLowerCase()));

function resizeCanvas() {
  const scale = Math.min(window.innerWidth / GAME_WIDTH, window.innerHeight / GAME_HEIGHT);
  canvas.style.width = `${GAME_WIDTH * scale}px`;
  canvas.style.height = `${GAME_HEIGHT * scale}px`;
}

function update() {
  const left = keys.has('arrowleft') || keys.has('a');
  const right = keys.has('arrowright') || keys.has('d');
  const jumping = keys.has('arrowup') || keys.has('w') || keys.has(' ');

  if (left) {
    player.x -= player.speed;
    player.direction = -1;
  }
  if (right) {
    player.x += player.speed;
    player.direction = 1;
  }

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

  if (keys.has('z')) {
    player.state = 'punch';
    player.actionTimer = 12;
  } else if (keys.has('x')) {
    player.state = 'shoot';
    player.actionTimer = 12;
  } else if (!player.grounded) {
    player.state = 'jump';
  } else if (player.actionTimer > 0) {
    player.actionTimer--;
  } else if (left || right) {
    player.state = 'walk';
  } else {
    player.state = 'idle';
  }
}

function drawSprite() {
  const image = images[player.state] || images.idle;
  if (!image.complete || !image.naturalWidth) {
    ctx.fillStyle = '#d8a25e';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    return;
  }

  ctx.save();
  if (player.direction < 0) {
    ctx.translate(player.x + player.width, player.y);
    ctx.scale(-1, 1);
    ctx.drawImage(image, 0, 0, player.width, player.height);
  } else {
    ctx.drawImage(image, player.x, player.y, player.width, player.height);
  }
  ctx.restore();
}

function draw() {
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  ctx.fillStyle = '#172033';
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  ctx.fillStyle = '#293b24';
  ctx.fillRect(0, 472, GAME_WIDTH, GAME_HEIGHT - 472);

  ctx.fillStyle = '#e8e8e8';
  ctx.font = '28px monospace';
  ctx.fillText('JUEGOEMI', 30, 45);

  drawSprite();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
loop();
