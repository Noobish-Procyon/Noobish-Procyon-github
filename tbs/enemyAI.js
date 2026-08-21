class EnemyAI {
  constructor() {
    this.coins = 0;
    this.level = 1;
  }

  getIncomePerSecond() {
    switch (this.level) {
      case 1: return 6;
      case 2: return 10;
      case 3: return 15;
      case 4: return 22;
      default: return 30;
    }
  }

  update(dt, wave, units) {
    this.coins += dt * this.getIncomePerSecond();

    // Auto-upgrade enemy bank every few waves
    if (wave % 3 === 0 && this.level < 5) {
      this.level++;
    }

    const costs = {
      basic:10, shield:20, sword:25, headbanger:30,
      sniper:35, cannon:40, giant:60, speedshape:30
    };

    const types = ["basic","shield","sword","headbanger","sniper","cannon","giant","speedshape"];

    const choice = types[randInt(0, types.length-1)];
    const cost = costs[choice];

    if (this.coins >= cost) {
      this.coins -= cost;
      units.push(new Unit(choice, "enemy", canvas.width - 100, canvas.height/2 + randInt(-150,150)));
    }
  }
}
