class Unit {
  constructor(type, team, x, y) {
    this.type = type;
    this.team = team;
    this.x = x;
    this.y = y;

    this.setStats(type);

    this.target = null;
    this.attackCooldown = 0;
  }

  setStats(type) {
    const stats = {
      basic:      { hp:40,  dmg:6,  range:20,  speed:1.2, color:"#44aaff" },
      shield:     { hp:120, dmg:3,  range:20,  speed:0.8, color:"#88ccff" },
      sword:      { hp:70,  dmg:12, range:20,  speed:1.4, color:"#3399ff" },
      headbanger: { hp:90,  dmg:10, range:20,  speed:1.6, color:"#2277ff" },
      sniper:     { hp:40,  dmg:20, range:250, speed:0.6, color:"#55bbff" },
      cannon:     { hp:60,  dmg:15, range:180, speed:0.5, color:"#99ddff" },
      giant:      { hp:250, dmg:15, range:20,  speed:0.7, color:"#0066ff" },
      speedshape: { hp:50,  dmg:4,  range:20,  speed:2.0, color:"#33ffee" }
    };

    const s = stats[type];
    this.maxHp = s.hp;
    this.hp = s.hp;
    this.dmg = s.dmg;
    this.range = s.range;
    this.speed = s.speed;
    this.baseColor = s.color;

    this.radius = 18;
  }

  getColor() {
    return this.team === "player" ? this.baseColor : "#ff4444";
  }

  update(dt, units, projectiles) {
    if (this.hp <= 0) return;

    this.attackCooldown -= dt;

    let nearest = null;
    let nearestDist = Infinity;

    for (let u of units) {
      if (u.team !== this.team && u.hp > 0) {
        const d = dist(this, u);
        if (d < nearestDist) {
          nearestDist = d;
          nearest = u;
        }
      }
    }

    this.target = nearest;

    if (nearest) {
      if (nearestDist > this.range) {
        const dx = nearest.x - this.x;
        const dy = nearest.y - this.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        this.x += (dx/d) * this.speed;
        this.y += (dy/d) * this.speed;
      } else {
        this.attack(nearest, projectiles);
      }
    }
  }

  attack(target, projectiles) {
    if (this.attackCooldown > 0) return;

    if (this.type === "sniper") {
      projectiles.push(new Projectile(this.x, this.y, target, this.dmg, this.team));
    }
    else if (this.type === "cannon") {
      projectiles.push(new Projectile(this.x, this.y, target, this.dmg, this.team, true));
    }
    else {
      target.hp -= this.dmg;
    }

    this.attackCooldown = 0.8;
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = this.getColor();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fill();

    ctx.fillStyle = "#000";
    ctx.fillRect(this.x - 20, this.y - this.radius - 10, 40, 5);
    ctx.fillStyle = "#0f0";
    const w = 40 * (this.hp / this.maxHp);
    ctx.fillRect(this.x - 20, this.y - this.radius - 10, w, 5);

    ctx.restore();
  }
}
