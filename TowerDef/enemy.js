class Enemy {
  constructor(path, wave) {
    this.path = path;
    this.progress = 0;
    this.speed = 0.8 + wave * 0.05;
    this.radius = 14;

    this.maxHp = 40 + wave * 10;
    this.hp = this.maxHp;

    this.slowTimer = 0;
    this.chainTimer = 0;

    this.x = 0;
    this.y = 0;
  }

  update(dt) {
    if (this.slowTimer > 0) {
      this.slowTimer -= dt;
      this.progress += this.speed * 0.4 * dt;
    } else {
      this.progress += this.speed * dt;
    }
    const pos = this.path.getPosition(this.progress);
    this.x = pos.x;
    this.y = pos.y;
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "#ff8800";
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // HP bar
    ctx.fillStyle = "#000";
    ctx.fillRect(this.x - 15, this.y - this.radius - 10, 30, 4);
    ctx.fillStyle = "#0f0";
    const w = 30 * (this.hp / this.maxHp);
    ctx.fillRect(this.x - 15, this.y - this.radius - 10, w, 4);

    ctx.restore();
  }

  isDead() {
    return this.hp <= 0;
  }

  reachedEnd() {
    const last = this.path.points[this.path.points.length - 1];
    const dx = this.x - last.x;
    const dy = this.y - last.y;
    return Math.sqrt(dx * dx + dy * dy) < 10;
  }
}
