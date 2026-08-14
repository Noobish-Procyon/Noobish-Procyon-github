const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.onresize = resizeCanvas;

const fusionEnergySpan = document.getElementById("fusionEnergy");
const selectedCircleSpan = document.getElementById("selectedCircle");
const circleListDiv = document.getElementById("circleList");

const battleBtn = document.getElementById("battleBtn");
const fuseBtn = document.getElementById("fuseBtn");
const saveBtn = document.getElementById("saveBtn");
const loadBtn = document.getElementById("loadBtn");

let circles = [];
let selectedCircleIndex = -1;
let inBattle = false;

function init() {
  const loaded = loadGame();
  if (loaded && loaded.length > 0) {
    circles = loaded;
  } else {
    circles.push(new Circle("Alpha", 200, 300));
    circles.push(new Circle("Beta", 300, 300));
    circles.push(new Circle("Gamma", 400, 300));
  }
  updateUI();
  loop();
}

function updateUI() {
  fusionEnergySpan.textContent = fusionEnergy;
  if (selectedCircleIndex >= 0 && circles[selectedCircleIndex]) {
    selectedCircleSpan.textContent = circles[selectedCircleIndex].name;
  } else {
    selectedCircleSpan.textContent = "None";
  }
  renderCircleList();
}

function renderCircleList() {
  circleListDiv.innerHTML = "";
  circles.forEach((c, i) => {
    const btn = document.createElement("button");
    btn.textContent = `${i}: ${c.name} (Lv${c.level})`;
    btn.onclick = () => {
      selectedCircleIndex = i;
      updateUI();
    };
    circleListDiv.appendChild(btn);
  });
}

battleBtn.onclick = () => {
  if (inBattle) return;
  if (selectedCircleIndex < 0) return;
  const circle = circles[selectedCircleIndex];
  inBattle = true;
  circle.hp = circle.maxHp;
  battle(circle, ctx, (win) => {
    inBattle = false;
    if (win) {
      fusionEnergy += 10;
    }
    updateUI();
  });
};

fuseBtn.onclick = () => {
  if (circles.length < 2) return;
  if (selectedCircleIndex < 0) return;
  const c1 = circles[selectedCircleIndex];
  let idx2 = randInt(0, circles.length - 1);
  if (idx2 === selectedCircleIndex && circles.length > 1) {
    idx2 = (idx2 + 1) % circles.length;
  }
  const c2 = circles[idx2];
  const fused = fuseCircles(c1, c2);
  circles.push(fused);
  updateUI();
};

saveBtn.onclick = () => {
  saveGame(circles);
};

loadBtn.onclick = () => {
  const loaded = loadGame();
  if (loaded) {
    circles = loaded;
    selectedCircleIndex = -1;
    updateUI();
  }
};

function loop() {
  if (!inBattle) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const spacing = canvas.width / (circles.length + 1);

    circles.forEach((c, i) => {
      c.x = spacing * (i + 1);
      c.y = canvas.height / 2;
      c.draw(ctx);
    });
  }
  requestAnimationFrame(loop);
}

init();
