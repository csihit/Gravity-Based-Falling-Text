const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let w = window.innerWidth;
let h = window.innerHeight;
canvas.width = w;
canvas.height = h;

const colors = ['#7f5af0', '#2cb1bc', '#ff6b81', '#ffd166', '#4ecdc4', '#f472b6', '#a78bfa', '#22d3ee'];
function randColor() { return colors[Math.floor(Math.random() * colors.length)]; }

let letters = [];
let gravityDir = 1; // 1 = normal (neeche), -1 = flipped (upar)
const GRAVITY_STRENGTH = 0.5;
const BOUNCE = 0.55;
const FRICTION = 0.995;

function Letter(ch, x, y) {
  this.ch = ch;
  this.x = x;
  this.y = y;
  this.vx = (Math.random() - 0.5) * 2;
  this.vy = 0;
  this.size = 40 + Math.random() * 16;
  this.color = randColor();
  this.rotation = 0;
  this.rotSpeed = (Math.random() - 0.5) * 0.05;
}

function dropText(str) {
  const chars = str.split('').filter(c => c !== ' ');
  const startX = w / 2 - (chars.length * 32) / 2;
  chars.forEach((ch, i) => {
    setTimeout(() => {
      letters.push(new Letter(ch, startX + i * 34, -60 - Math.random() * 100));
    }, i * 80);
  });
}

function update() {
  letters.forEach(l => {
    // gravity apply karo
    l.vy += GRAVITY_STRENGTH * gravityDir;
    l.x += l.vx;
    l.y += l.vy;
    l.rotation += l.rotSpeed;

    const half = l.size / 2;

    // floor / ceiling collision
    if (l.y + half > h && gravityDir === 1) {
      l.y = h - half;
      l.vy *= -BOUNCE;
      l.vx *= FRICTION;
    }
    if (l.y - half < 0 && gravityDir === -1) {
      l.y = half;
      l.vy *= -BOUNCE;
      l.vx *= FRICTION;
    }
    // agar gravity normal hai to letter ceiling se bhi na nikle (safety)
    if (l.y - half < 0 && gravityDir === 1) {
      l.y = half;
      l.vy *= -BOUNCE;
    }
    if (l.y + half > h && gravityDir === -1) {
      l.y = h - half;
      l.vy *= -BOUNCE;
    }

    // left / right walls
    if (l.x - half < 0) {
      l.x = half;
      l.vx *= -BOUNCE;
    }
    if (l.x + half > w) {
      l.x = w - half;
      l.vx *= -BOUNCE;
    }
  });
}

function draw() {
  ctx.clearRect(0, 0, w, h);
  letters.forEach(l => {
    ctx.save();
    ctx.translate(l.x, l.y);
    ctx.rotate(l.rotation);
    ctx.shadowColor = l.color;
    ctx.shadowBlur = 20;
    ctx.fillStyle = l.color;
    ctx.font = `700 ${l.size}px 'Segoe UI', Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(l.ch, 0, 0);
    ctx.restore();
  });
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();

// Buttons
document.getElementById('dropBtn').addEventListener('click', () => {
  dropText((document.getElementById('textInput').value.trim() || 'GRAVITY').toUpperCase());
});

document.getElementById('clearBtn').addEventListener('click', () => {
  letters = [];
});

document.getElementById('gravityBtn').addEventListener('click', () => {
  gravityDir *= -1;
});

document.getElementById('textInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    dropText((e.target.value.trim() || 'GRAVITY').toUpperCase());
  }
});

// Click anywhere to drop a letter
let clickIndex = 0;
canvas.addEventListener('mousedown', (e) => {
  const text = document.getElementById('textInput').value || 'A';
  const chars = text.replace(/\s/g, '').split('');
  const ch = chars[clickIndex % chars.length];
  clickIndex++;
  letters.push(new Letter(ch, e.clientX, e.clientY));
});

// Resize handling
window.addEventListener('resize', () => {
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;
});

