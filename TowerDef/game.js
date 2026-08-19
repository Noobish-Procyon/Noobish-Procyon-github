const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.onresize = resizeCanvas;

const coinsSpan = document.getElementById("coins");
const waveSpan = document.getElementById("wave");
const uiDiv = document.getElementById("ui");

const path = new Path();
let turrets = [];
let enemies = [];
let projectiles = [];

let coins = 50;
let wave = 1;
let spawnTimer = 0;
let enemiesToSpawn = 0;
let gameOver = false;

const turretButtons = uiDiv.querySelectorAll("button[data-type]");

turretButtons.forEach(btn => {
  btn.onclick = () => {
    const type = btn.getAttribute("data-type");
    const cost = getTurretCost(type);
    if (coins >= cost) {
      pendingTurretType = type;
    }
  };
});

let pendingTurretType = null;

canvas.addEventListener("click", (e) => {
  if (!pendingTurretType) return;
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  // Only allow placement near path
  let closestDist = Infinity;
  for (let p of path.points) {
    const dx = p.x - mx;
    const dy = p.y - my;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < closestDist) closestDist = d;
  }
  if (closestDist < 80) {
    const cost = getTurretCost(pendingTurretType);
    if (coins >= cost) {
      coins -= cost;
      turrets.push(new Turret(pendingTurretType, mx, my));
      pendingTurretType = null;
      updateUI();
    }
  }
});

function getTurretCost(type) {
  switch (type) {
    case "cannon": return 20;
    case "laser": return 25;
    case "freeze": return 25;
    case "chain": return 30;
    default: return 20;
  }
}

function startWave() {
  enemiesToSpawn = 6 + wave * 2;
  spawnTimer = 0;
}

function update(dt) {
  if (gameOver) return;

  // Spawn enemies
  if (enemiesToSpawn > 0) {
    spawnTimer -= dt;
    if (spawnTimer <= 0) {
      enemies.push(new Enemy(path, wave));
      enemiesToSpawn--;
      spawnTimer = 1.0;
    }
  }

  // Update enemies
  enemies.forEach(e => e.update(dt));

  // Chain effect
  enemies.forEach(e => {
    if (e.chainTimer > 0) {
      e.chainTimer -= dt;
      if (e.chainTimer <= 0) {
        // damage another random enemy
        const others = enemies.filter(o => o !== e && !o.isDead());
        if (others.length > 0) {
          const target = others[randInt(0, others.length - 1)];
          target.hp -= 6;
        }
      }
    }
  });

  // Update turrets
  turrets.forEach(t => t.update(dt, enemies, projectiles));

  // Update projectiles
  projectiles.forEach(p => p.update(dt));
  projectiles = projectiles.filter(p => p.alive);

  // Handle deaths and leaks
  let leaked = 0;
  enemies = enemies.filter(e => {
    if (e.isDead()) {
      coins += 5;
      return false;
    }
    if (e.reachedEnd()) {
      leaked++;
      return false;
    }
    return true;
  });

  if (leaked > 0) {
    // simple life system: 3 leaks = game over
    if (leaked >= 3) {
      gameOver = true;
    }
  }

  // Wave finished?
  if (enemies.length === 0 && enemiesToSpawn === 0 && !gameOver) {
    wave++;
    coins += 20;
    startWave();
  }

  updateUI();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  path.draw(ctx);

  turrets.forEach(t => t.draw(ctx));
  enemies.forEach(e => e.draw(ctx));
  projectiles.forEach(p => p.draw(ctx));

  if (pendingTurretType) {
    ctx.save();
    ctx.fillStyle = "#fff";
    ctx.font = "12px Arial";
    ctx.fillText("Placing: " + pendingTurretType, 10, canvas.height - 20);
    ctx.restore();
  }

  if (gameOver) {
    ctx.save();
    ctx.fillStyle = "#f00";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    ctx.restore();
  }
}

function updateUI() {
  coinsSpan.textContent = coins;
  waveSpan.textContent = wave;
}

let lastTime = performance.now();
function loop(now) {
  const dt = (now - lastTime) / 1000;
  lastTime = now;

  update(dt);
  draw();

  requestAnimationFrame(loop);
}

function init() {
  const loaded = loadTDGame(path);
  if (loaded) {
    coins = loaded.coins;
    wave = loaded.wave;
    turrets = loaded.turrets;
  } else {
    coins = 50;
    wave = 1;
  }
  startWave();
  updateUI();
  requestAnimationFrame(loop);
}

init();

// Optional: auto-save every 10 seconds
setInterval(() => {
  saveTDGame({ coins, wave, turrets });
}, 10000);
