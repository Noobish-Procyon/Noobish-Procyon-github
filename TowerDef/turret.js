class Turret {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.radius = 18;
    this.range = 150;
    this.fireRate = 0.8; // shots per second
    this.cooldown = 0;

    this.color = this.getColor();
  }

  getColor() {
    switch (this.type) {
      case "cannon": return "#ff4444";
      case "laser": return "#44aaff";
      case "freeze": return "#44ff88";
      case "chain": return "#ffff44";
      default: return "#ffffff";
    }
  }

  update(dt, enemies, projectiles) {
    this.cooldown -= dt;
    if (this.cooldown <= 0) {
      const target = this.findTarget(enemies);
      if (target) {
        this.shoot(target, projectiles);
        this.cooldown = 1 / this.fireRate;
      }
    }
  }

  findTarget(enemies) {
    let best = null;
    let bestProgress = -1;
    for (let e of enemies) {
      const dx = e.x - this.x;
      const dy = e.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= this.range) {
        if (e.progress > bestProgress) {
          bestProgress = e.progress;
          best = e;
        }
      }
    }
    return best;
  }

  shoot(target, projectiles) {
    if (this.type === "laser") {
      // Instant hit
      target.hp -= 12;
    } else if (this.type === "freeze") {
      target.hp -= 6;
      target.slowTimer = 1.0;
    } else if (this.type === "chain") {
      target.hp -= 8;
      // Chain to another enemy
      target.chainTimer = 0.2;
    } else {
      // Cannon projectile
      projectiles.push(new Projectile(this.x, this.y, target));
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = this.color;
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.fillText(this.type[0].toUpperCase(), this.x, this.y + 3);
    ctx.restore();
  }
}
