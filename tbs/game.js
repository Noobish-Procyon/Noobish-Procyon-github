const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.onresize = resizeCanvas;

let units = [];
let projectiles = [];

let wave = 1;

const playerBank = new Bank();
const enemyAI = new EnemyAI();

const coinsSpan = document.getElementById("coins");
const waveSpan = document.getElementById("wave");
const bankLevelSpan = document.getElementById("bankLevel");
const upgradeBankBtn = document.getElementById("upgradeBankBtn");

document.querySelectorAll("button[data-unit]").forEach(btn => {
  btn.onclick = () => {
    const type = btn.getAttribute("data-unit");
    const cost = {
      basic:10, shield:20, sword:25, headbanger:30,
      sniper:35, cannon:40, giant:60, speedshape:30
    }[type];

    if (playerBank.coins >= cost) {
      playerBank.coins -= cost;
      units.push(new Unit(type, "player", 100, canvas.height/2 + randInt(-150,150)));
    }
  };
});

upgradeBankBtn.onclick = () => {
  playerBank.upgrade();
};

function update(dt) {
  playerBank.update(dt);
  enemyAI.update(dt, wave, units);

  for (let u of units) {
    u.update(dt, units, projectiles);
  }

  for (let p of projectiles) {
    p.update(dt, units);
  }

  units = units.filter(u => u.hp > 0);
  projectiles = projectiles.filter(p => p.alive);

  coinsSpan.textContent = Math.floor(playerBank.coins);
  waveSpan.textContent = wave;
  bankLevelSpan.textContent = playerBank.level;
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  for (let u of units) u.draw(ctx);
  for (let p of projectiles) p.draw(ctx);
}

let last = performance.now();
function loop(now) {
  const dt = (now - last) / 1000;
  last = now;

  update(dt);
  draw();

  requestAnimationFrame(loop);
}

loop();
