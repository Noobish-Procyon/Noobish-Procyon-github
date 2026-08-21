class Projectile {
  constructor(x, y, target, dmg, team, splash=false) {
    this.x = x;
    this.y = y;
    this.target = target;
    this.dmg = dmg;
    this.team = team;
    this.splash = splash;
    this.speed = 6;
    this.radius = 5;
    this.alive = true;
  }

  update(dt, units) {
    if (!this.target || this.target.hp <= 0) {
      this.alive = false;
      return;
    }

    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const d = Math.sqrt(dx*dx + dy*dy);

    if (d < 10) {
      if (this.splash) {
        for (let u of units) {
          if (u.team !== this.team && dist(u, this.target) < 40) {
            u.hp -= this.dmg;
          }
        }
      } else {
        this.target.hp -= this.dmg;
      }
      this.alive = false;
      return;
    }

    this.x += (dx/d) * this.speed;
    this.y += (dy/d) * this.speed;
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = this.team === "player" ? "#fff" : "#ffaaaa";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }
}
