function battle(circle, ctx, onResult) {
  const enemy = new Enemy();
  let turn = 0;
  let log = [];

  function step() {
    ctx.clearRect(0, 0, 800, 600);

    // Draw circle and enemy
    circle.draw(ctx);
    enemy.draw(ctx);

    // Simple turn-based simulation
    if (turn % 2 === 0) {
      // Circle attacks
      const dmg = computeDamage(circle, enemy);
      enemy.hp -= dmg;
      log.push(`${circle.name} hits for ${dmg}`);
    } else {
      // Enemy attacks
      const dmg = computeDamage(enemy, circle);
      circle.hp -= dmg;
      log.push(`Enemy hits for ${dmg}`);
    }

    drawBattleLog(ctx, log);

    if (circle.hp <= 0 || enemy.hp <= 0) {
      const win = enemy.hp <= 0 && circle.hp > 0;
      if (win) {
        circle.gainExp(20);
      }
      onResult(win);
      return;
    }

    turn++;
    requestAnimationFrame(step);
  }

  step();
}

function computeDamage(attacker, defender) {
  let base = attacker.atk;
  // Crit
  if (Math.random() * 100 < attacker.crit) {
    base *= 1.5;
  }
  // Element interactions (simple)
  if (attacker.element === "fire" && defender.element === "shadow") base *= 1.2;
  if (attacker.element === "water" && defender.element === "fire") base *= 1.2;
  if (attacker.element === "electric" && defender.element === "water") base *= 1.2;
  if (attacker.element === "shadow" && defender.element === "electric") base *= 1.2;
  return Math.floor(base);
}

function drawBattleLog(ctx, log) {
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.font = "12px Arial";
  let startY = 20;
  const lastLines = log.slice(-6);
  for (let line of lastLines) {
    ctx.fillText(line, 10, startY);
    startY += 14;
  }
  ctx.restore();
}
