const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
const scoreDisplay = document.getElementById("score");

// ---------------------- UPGRADE VARIABLES ----------------------
let scoreMultiplier = 1;
let scoreMultiplierLevel = 0;
const scoreMultiplierMax = 5;

let autoCollector = false;
let autoCollectorLevel = 0;
const autoCollectorMax = 5;

// ---------------------- BLACK HOLE ----------------------
const blackHole = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 80
};

let shapes = [];
let draggingShape = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
const ambientStars = Array.from({ length: 90 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: 0.5 + Math.random() * 1.6,
    phase: Math.random() * Math.PI * 2
}));

// ---------------------- SHAPE TYPES WITH RARITY ----------------------
const SHAPE_TYPES = [
    { type: "square", points: 1, chance: 0.50 },
    { type: "circle", points: 2, chance: 0.30 },
    { type: "triangle", points: 4, chance: 0.15 },
    { type: "diamond", points: 10, chance: 0.05 }
];

function rollShapeType() {
    let r = Math.random();
    let sum = 0;

    for (let s of SHAPE_TYPES) {
        sum += s.chance;
        if (r < sum) return s;
    }
    return SHAPE_TYPES[0];
}

// ---------------------- MUTATIONS ----------------------
const MUTATIONS = [
    { name: "none", chance: 0.85, bonus: 0, colorEffect: null },
    { name: "spark", chance: 0.10, bonus: 1, colorEffect: "white" },
    { name: "flare", chance: 0.04, bonus: 3, colorEffect: "yellow" },
    { name: "nova", chance: 0.01, bonus: 10, colorEffect: "cyan" },
    { name: "supernova", chance: 0.002, bonus: 25, colorEffect: "magenta" }
];

function rollMutation() {
    let r = Math.random();
    let sum = 0;

    for (let m of MUTATIONS) {
        sum += m.chance;
        if (r < sum) return m;
    }
    return MUTATIONS[0];
}

// ---------------------- SPAWN SHAPES ----------------------
function spawnShape() {
    const size = 40;
    const shapeType = rollShapeType();
    const mutation = rollMutation();

    shapes.push({
        x: Math.random() * (canvas.width - size),
        y: Math.random() * (canvas.height - size),
        size,
        color: `hsl(${Math.random() * 360}, 80%, 60%)`,
        type: shapeType.type,
        points: shapeType.points + mutation.bonus,
        mutation,
        born: performance.now()
    });

    if (mutation.name === "supernova") {
        announce("MYTHIC MUTATION!");
    }
}

// ⭐ Slower spawn interval (4 seconds)
setInterval(spawnShape, 4000);

// ---------------------- DRAW SHAPES ----------------------
function drawShape(s) {
    const pulse = (Math.sin(performance.now() / 420 + s.x * .013) + 1) / 2;
    const centerX = s.x + s.size / 2;
    const centerY = s.y + s.size / 2;
    const inset = s.size * .1;
    const vertices = s.type === "triangle"
        ? [[centerX, s.y + inset], [s.x + s.size - inset, s.y + s.size - inset], [s.x + inset, s.y + s.size - inset]]
        : s.type === "diamond"
            ? [[centerX, s.y + inset], [s.x + s.size - inset, centerY], [centerX, s.y + s.size - inset], [s.x + inset, centerY]]
            : null;
    const gradient = ctx.createLinearGradient(s.x, s.y, s.x + s.size, s.y + s.size);
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(.22, s.color);
    gradient.addColorStop(1, "#10252b");
    ctx.save();
    ctx.shadowColor = s.mutation.name === "none" ? s.color : s.mutation.colorEffect;
    ctx.shadowBlur = s === draggingShape ? 30 : 12 + pulse * 8;
    ctx.fillStyle = gradient;
    ctx.strokeStyle = "rgba(232,255,247,.82)";
    ctx.lineWidth = 2;
    if (s.type === "square") {
        const corner = s.size * .16;
        ctx.beginPath();
        ctx.roundRect(s.x + inset, s.y + inset, s.size - inset * 2, s.size - inset * 2, corner);
        ctx.fill();
        ctx.stroke();
    }

    if (s.type === "circle") {
        ctx.beginPath();
        ctx.arc(centerX, centerY, s.size * .42, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    if (vertices) {
        ctx.beginPath();
        ctx.moveTo(vertices[0][0], vertices[0][1]);
        vertices.slice(1).forEach(([x, y]) => ctx.lineTo(x, y));
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(s.x + s.size * .31, s.y + s.size * .27, Math.max(2, s.size * .07), 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,.8)";
    ctx.fill();

    // Mutation glow
    if (s.mutation.name !== "none") {
        ctx.strokeStyle = s.mutation.colorEffect;
        ctx.lineWidth = 2 + pulse;
        ctx.setLineDash([5, 4]);
        ctx.strokeRect(s.x - 4, s.y - 4, s.size + 8, s.size + 8);
        ctx.setLineDash([]);
    }
    if (s === draggingShape) {
        ctx.strokeStyle = "rgba(255,255,255,.9)";
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 4]);
        ctx.strokeRect(s.x - 7, s.y - 7, s.size + 14, s.size + 14);
    }
    ctx.restore();
}

// ---------------------- INPUT ----------------------
function getCanvasPoint(event) {
    const bounds = canvas.getBoundingClientRect();
    return {
        x: (event.clientX - bounds.left) * canvas.width / bounds.width,
        y: (event.clientY - bounds.top) * canvas.height / bounds.height
    };
}

canvas.addEventListener("pointerdown", event => {
    const point = getCanvasPoint(event);
    for (let index = shapes.length - 1; index >= 0; index--) {
        const shape = shapes[index];
        if (point.x >= shape.x && point.x <= shape.x + shape.size &&
            point.y >= shape.y && point.y <= shape.y + shape.size) {
            draggingShape = shape;
            dragOffsetX = point.x - shape.x;
            dragOffsetY = point.y - shape.y;
            canvas.setPointerCapture(event.pointerId);
            canvas.style.cursor = "grabbing";
            event.preventDefault();
            break;
        }
    }
});

canvas.addEventListener("pointermove", event => {
    if (!draggingShape) return;
    const point = getCanvasPoint(event);
    draggingShape.x = Math.max(0, Math.min(canvas.width - draggingShape.size, point.x - dragOffsetX));
    draggingShape.y = Math.max(0, Math.min(canvas.height - draggingShape.size, point.y - dragOffsetY));
    event.preventDefault();
});

function stopDragging() {
    draggingShape = null;
    canvas.style.cursor = "default";
}
canvas.addEventListener("pointerup", stopDragging);
canvas.addEventListener("pointercancel", stopDragging);
canvas.addEventListener("lostpointercapture", stopDragging);

// ---------------------- UPDATE ----------------------
function update() {
    shapes = shapes.filter(s => {

        // AUTO COLLECTOR (with level scaling)
        if (autoCollector) {
            const dx = blackHole.x - (s.x + s.size/2);
            const dy = blackHole.y - (s.y + s.size/2);
            const dist = Math.sqrt(dx*dx + dy*dy);

            const pullRadius = 150 + autoCollectorLevel * 40;
            const pullStrength = 0.01 + autoCollectorLevel * 0.005;

            if (dist < pullRadius) {
                s.x += dx * pullStrength;
                s.y += dy * pullStrength;
            }
        }

        // Black hole collision
        const dx = (s.x + s.size / 2) - blackHole.x;
        const dy = (s.y + s.size / 2) - blackHole.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < blackHole.radius) {
            score += s.points * scoreMultiplier;
            scoreDisplay.textContent = "Score: " + score;
            return false;
        }
        return true;
    });
}

// ---------------------- DRAW ----------------------
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const now = performance.now();
    const background = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    background.addColorStop(0, "#071819");
    background.addColorStop(.55, "#0b2325");
    background.addColorStop(1, "#101827");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(107,218,185,.055)";
    ctx.lineWidth = 1;
    const grid = 48;
    for (let gx = 0; gx < canvas.width; gx += grid) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, canvas.height); ctx.stroke();
    }
    for (let gy = 0; gy < canvas.height; gy += grid) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(canvas.width, gy); ctx.stroke();
    }
    ambientStars.forEach(star => {
        const alpha = .22 + (Math.sin(now / 700 + star.phase) + 1) * .2;
        ctx.fillStyle = `rgba(202,255,230,${alpha})`;
        ctx.beginPath(); ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2); ctx.fill();
    });

    // Black hole
    const pulse = (Math.sin(now / 850) + 1) / 2;
    const aura = ctx.createRadialGradient(blackHole.x, blackHole.y, blackHole.radius * .4, blackHole.x, blackHole.y, blackHole.radius * 2.1);
    aura.addColorStop(0, "rgba(0,0,0,0)");
    aura.addColorStop(.52, `rgba(54,238,198,${.08 + pulse * .08})`);
    aura.addColorStop(.75, "rgba(135,82,255,.13)");
    aura.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = aura;
    ctx.fillRect(blackHole.x - blackHole.radius * 2.2, blackHole.y - blackHole.radius * 2.2, blackHole.radius * 4.4, blackHole.radius * 4.4);

    ctx.save();
    ctx.translate(blackHole.x, blackHole.y);
    ctx.rotate(now * .00016);
    for (let ring = 0; ring < 3; ring++) {
        ctx.beginPath();
        ctx.ellipse(0, 0, blackHole.radius * (1.22 + ring * .16), blackHole.radius * (.31 + ring * .035), ring * .13, .12, Math.PI * 1.75);
        ctx.strokeStyle = `rgba(${ring === 1 ? "161,113,255" : "83,245,207"},${.56 - ring * .12})`;
        ctx.lineWidth = ring === 0 ? 4 : 2;
        ctx.shadowColor = ring === 1 ? "#a777ff" : "#51f5cb";
        ctx.shadowBlur = 16 - ring * 3;
        ctx.stroke();
    }
    ctx.restore();
    ctx.save();
    ctx.shadowColor = "#6c56ff";
    ctx.shadowBlur = 36;
    ctx.beginPath();
    ctx.arc(blackHole.x, blackHole.y, blackHole.radius, 0, Math.PI * 2);
    const hole = ctx.createRadialGradient(blackHole.x - blackHole.radius * .28, blackHole.y - blackHole.radius * .35, 1, blackHole.x, blackHole.y, blackHole.radius);
    hole.addColorStop(0, "#243047");
    hole.addColorStop(.35, "#090d19");
    hole.addColorStop(1, "#020409");
    ctx.fillStyle = hole;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = `rgba(160,131,255,${.7 + pulse * .25})`;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    for (let s of shapes) drawShape(s);
}

// ---------------------- GAME LOOP ----------------------
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

// ---------------------- UPGRADES ----------------------
const upgrades = {
    biggerHole: { 
        cost: 10, 
        apply: () => blackHole.radius += 20 
    },

    doublePoints: { 
        cost: 30, 
        apply: () => {
            if (scoreMultiplierLevel < scoreMultiplierMax) {
                scoreMultiplierLevel++;
                scoreMultiplier = 1 + scoreMultiplierLevel;
            }
        }
    },

    autoCollector: { 
        cost: 40, 
        apply: () => {
            if (autoCollectorLevel < autoCollectorMax) {
                autoCollectorLevel++;
                autoCollector = true;
            }
        }
    }
};

function buyUpgrade(name) {
    const u = upgrades[name];
    if (score >= u.cost) {
        score -= u.cost;
        u.apply();
        scoreDisplay.textContent = "Score: " + score;
    }
}

// ---------------------- ANNOUNCE ----------------------
function announce(text) {
    const div = document.createElement("div");
    div.textContent = text;
    div.style.position = "absolute";
    div.style.top = "50%";
    div.style.left = "50%";
    div.style.transform = "translate(-50%, -50%)";
    div.style.color = "white";
    div.style.fontSize = "40px";
    div.style.opacity = "1";
    div.style.transition = "opacity 1s";
    document.body.appendChild(div);

    setTimeout(() => div.style.opacity = "0", 100);
    setTimeout(() => div.remove(), 1100);
}
