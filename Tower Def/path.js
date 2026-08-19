class Path {
  constructor() {
    this.points = [
      { x: 50, y: 100 },
      { x: 200, y: 100 },
      { x: 400, y: 200 },
      { x: 600, y: 200 },
      { x: 800, y: 300 },
      { x: 1000, y: 350 },
      { x: 1200, y: 400 }
    ];
  }

  getPosition(t) {
    const idx = Math.floor(t);
    const frac = t - idx;
    if (idx >= this.points.length - 1) {
      return this.points[this.points.length - 1];
    }
    const p1 = this.points[idx];
    const p2 = this.points[idx + 1];
    return {
      x: p1.x + (p2.x - p1.x) * frac,
      y: p1.y + (p2.y - p1.y) * frac
    };
  }

  draw(ctx) {
    ctx.save();
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 8;
    ctx.beginPath();
    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i];
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    ctx.restore();
  }
}
