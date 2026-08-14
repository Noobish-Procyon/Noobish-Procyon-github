class Enemy {
  constructor() {
    this.x = 600;
    this.y = 300;
    this.radius = 20;

    this.hp = randInt(40, 100);
    this.atk = randInt(6, 14);
    this.spd = 1.5;
    this.element = ELEMENTS[randInt(0, ELEMENTS.length - 1)];
    this.maxHp = this.hp;
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = this.getColor();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Enemy", this.x, this.y - this.radius - 5);
    ctx.restore();
  }

  getColor() {
    switch (this.element) {
      case "fire": return "#aa0000";
      case "water": return "#0044aa";
      case "electric": return "#aaaa00";
      case "shadow": return "#5500aa";
      default: return "#888888";
    }
  }
}
  
