const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const GAME_WIDTH = 960, GAME_HEIGHT = 540;
canvas.width = GAME_WIDTH; canvas.height = GAME_HEIGHT;

const SPRITES = { idle:'parada.png', walk:'caminar.png', jump:'salto.png', shoot:'disparar.png', punch:'golpear.png', hurt:'herido.png', dance:'bailando.png', character:'personaje.png' };
const images = {};
for (const [name, src] of Object.entries(SPRITES)) { const image = new Image(); image.src = src; images[name] = image; }

const animations = {
  idle:{frames:1,fps:2}, walk:{frames:4,fps:9}, jump:{frames:1,fps:1},
  shoot:{frames:1,fps:8}, punch:{frames:1,fps:10}, hurt:{frames:1,fps:6}, dance:{frames:4,fps:7}
};

const player = {x:120,y:400,width:72,height:96,speed:4,vy:0,jumpPower:-12,grounded:true,direction:1,state:'idle',frame:0,frameTimer:0,actionTimer:0};
const keys = new Set();

window.addEventListener('keydown', e => { keys.add(e.key.toLowerCase()); if(['arrowleft','arrowright','arrowup',' ','z','x'].includes(e.key.toLowerCase())) e.preventDefault(); });
window.addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));

// Controles táctiles: mantienen la tecla virtual mientras el dedo está apoyado.
document.querySelectorAll('#touch-controls button').forEach(button => {
  const key = button.dataset.key;
  const press = e => { e.preventDefault(); keys.add(key); button.setPointerCapture?.(e.pointerId); };
  const release = e => { e.preventDefault(); keys.delete(key); };
  button.addEventListener('pointerdown', press);
  button.addEventListener('pointerup', release);
  button.addEventListener('pointercancel', release);
  button.addEventListener('pointerleave', release);
});

function resizeCanvas(){ const scale=Math.min(innerWidth/GAME_WIDTH,innerHeight/GAME_HEIGHT); canvas.style.width=`${GAME_WIDTH*scale}px`; canvas.style.height=`${GAME_HEIGHT*scale}px`; }
function setState(state){ if(player.state!==state){ player.state=state; player.frame=0; player.frameTimer=0; } }
function updateAnimation(){ const a=animations[player.state]||animations.idle; if(a.frames<=1)return; player.frameTimer++; const ticks=Math.max(1,Math.round(60/a.fps)); if(player.frameTimer>=ticks){player.frameTimer=0;player.frame=(player.frame+1)%a.frames;} }

function update(){
  const left=keys.has('arrowleft')||keys.has('a'), right=keys.has('arrowright')||keys.has('d'), jumping=keys.has('arrowup')||keys.has('w')||keys.has(' ');
  if(left){player.x-=player.speed;player.direction=-1;} if(right){player.x+=player.speed;player.direction=1;}
  if(jumping&&player.grounded){player.vy=player.jumpPower;player.grounded=false;}
  player.vy+=0.55; player.y+=player.vy;
  const floor=472; if(player.y+player.height>=floor){player.y=floor-player.height;player.vy=0;player.grounded=true;}
  player.x=Math.max(0,Math.min(GAME_WIDTH-player.width,player.x));
  if(keys.has('z')){setState('punch');player.actionTimer=12;} else if(keys.has('x')){setState('shoot');player.actionTimer=12;} else if(!player.grounded)setState('jump'); else if(player.actionTimer>0)player.actionTimer--; else if(left||right)setState('walk'); else setState('idle');
  updateAnimation();
}

function drawSprite(){
  const image=images[player.state]||images.idle, anim=animations[player.state]||animations.idle;
  if(!image.complete||!image.naturalWidth){ctx.fillStyle='#d8a25e';ctx.fillRect(player.x,player.y,player.width,player.height);return;}
  const frameWidth=image.naturalWidth/anim.frames, frameHeight=image.naturalHeight, sx=player.frame*frameWidth;
  ctx.save();
  if(player.direction<0){ctx.translate(player.x+player.width,player.y);ctx.scale(-1,1);ctx.drawImage(image,sx,0,frameWidth,frameHeight,0,0,player.width,player.height);}
  else ctx.drawImage(image,sx,0,frameWidth,frameHeight,player.x,player.y,player.width,player.height);
  ctx.restore();
}

function draw(){
  ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT); ctx.fillStyle='#172033';ctx.fillRect(0,0,GAME_WIDTH,GAME_HEIGHT);ctx.fillStyle='#293b24';ctx.fillRect(0,472,GAME_WIDTH,GAME_HEIGHT-472);
  ctx.fillStyle='#e8e8e8';ctx.font='28px monospace';ctx.fillText('JUEGOEMI',30,45);drawSprite();
}
function loop(){update();draw();requestAnimationFrame(loop);} window.addEventListener('resize',resizeCanvas);resizeCanvas();loop();
