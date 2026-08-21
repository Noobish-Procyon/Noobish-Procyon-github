class Bank {
  constructor() {
    this.coins = 50;
    this.level = 1;
  }

  getIncomePerSecond() {
    switch (this.level) {
      case 1: return 8;
      case 2: return 12;
      case 3: return 18;
      case 4: return 25;
      default: return 35;
    }
  }

  update(dt) {
    this.coins += dt * this.getIncomePerSecond();
  }

  getUpgradeCost() {
    if (this.level === 1) return 50;
    if (this.level === 2) return 80;
    if (this.level === 3) return 120;
    if (this.level === 4) return 180;
    return 9999;
  }

  upgrade() {
    const cost = this.getUpgradeCost();
    if (this.coins >= cost && this.level < 5) {
      this.coins -= cost;
      this.level++;
    }
  }
}
