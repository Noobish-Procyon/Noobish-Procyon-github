const ELEMENTS = ["fire", "water", "electric", "shadow"];

class Circle {
  constructor(name, x, y) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.radius = 20;

    this.hp = randInt(40, 80);
    this.atk = randInt(8, 16);
    this.spd = randInt(1, 3);
    this.crit = randInt(5, 20); // %
    this.element = ELEMENTS[randInt(0, ELEMENTS.length - 1)];

    this.level = 1;
    this.exp = 0;
    this.maxHp = this.hp;
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = this.getColor();
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.fillText(this.name, this.x, this.y - this.radius - 5);
    ctx.fillText(`Lv${this.level}`, this.x, this.y + this.radius + 10);
    ctx.restore();
  }

  getColor() {
    switch (this.element) {
      case "fire": return "#ff4444";
      case "water": return "#44aaff";
      case "electric": return "#ffff44";
      case "shadow": return "#aa44ff";
      default: return "#ffffff";
    }
  }

  gainExp(amount) {
    this.exp += amount;
    while (this.exp >= this.expToNextLevel()) {
      this.exp -= this.expToNextLevel();
      this.level++;
      this.onLevelUp();
    }
  }

  expToNextLevel() {
    return 20 + this.level * 10;
  }

  onLevelUp() {
    this.hp += 5;
    this.maxHp += 5;
    this.atk += 2;
    this.spd += 0.2;
    this.crit += 1;
  }

  toData() {
    return {
      name: this.name,
      x: this.x,
      y: this.y,
      radius: this.radius,
      hp: this.hp,
      atk: this.atk,
      spd: this.spd,
      crit: this.crit,
      element: this.element,
      level: this.level,
      exp: this.exp,
      maxHp: this.maxHp
    };
  }

  static fromData(data) {
    const c = new Circle(data.name, data.x, data.y);
    Object.assign(c, data);
    return c;
  }
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
