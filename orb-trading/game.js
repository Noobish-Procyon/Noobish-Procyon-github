const rarities = [
  { id: 'common', name: 'Common', short: 'C', color: '#b7c0b6', sell: 150, orbs: ['Bland', 'Rotating', 'Kilogram'] },
  { id: 'uncommon', name: 'Uncommon', short: 'UC', color: '#75d7c0', sell: 350, orbs: ['Sand', 'Energy', 'Smoke', 'Shadow'] },
  { id: 'rare', name: 'Rare', short: 'R', color: '#79aff0', sell: 800, orbs: ['Fire', 'Frost', 'Magnet', 'Sound', 'Wind'] },
  { id: 'epic', name: 'Epic', short: 'E', color: '#c394f5', sell: 4000, orbs: ['Glass', 'Exploding', 'Photon', 'Dark', 'Magma', 'Blizzard', 'Song', 'Pi'] },
  { id: 'legendary', name: 'Legendary', short: 'L', color: '#f2bd61', sell: 10000, orbs: ['Chrono', 'Poison', 'Water', 'Storm', 'Meteor', 'Rift', 'Nebula'] },
  { id: 'mythic', name: 'Mythic', short: 'M', color: '#f1819c', sell: 24000, orbs: ['Prism', 'Summer Triangle', 'Solar', 'Lunarink', 'Gas', 'Angel', 'Celestial'] },
  { id: 'transcendent', name: 'Transcendent', short: 'T', color: '#d0ef70', sell: 60000, orbs: ['Cyborg', 'Demon', 'Algebra', 'Warp', 'Dino', 'Phoenix', 'Disco'] },
  { id: 'oneOfAKind', name: 'One of a Kind', short: '1oAK', color: '#fff1a8', sell: 0, orbs: ['Winter Triangle', 'Procyon Orb'] }
];

const gachas = [
  { id: 'copper', name: 'Copper', cost: 100, tier: 'STARTER SERIES', description: 'A first step into the orb market. Every rarity is in play.', odds: [50, 25, 12.5, 6.25, 3.125, 1.5, 1, .625] },
  { id: 'iron', name: 'Iron', cost: 1000, tier: 'FOR THE DEDICATED', description: 'Better odds for the rarities worth chasing.', odds: [45, 25, 12, 7, 4, 4, 2, 1] },
  { id: 'gold', name: 'Gold', cost: 5000, tier: 'MARKET FAVORITE', description: 'A balanced roll with a real chance at the top tiers.', odds: [40, 22.5, 10, 8, 7, 6, 5, 1.5] },
  { id: 'silver', name: 'Silver', cost: 10000, tier: 'HIGHER STAKES', description: 'Epic finds and above are starting to feel closer.', odds: [35, 20, 10, 10, 7.5, 6.5, 6, 5] },
  { id: 'platinum', name: 'Platinum', cost: 25000, tier: 'PREMIUM SERIES', description: 'A refined mix, with a stronger pull toward rare finds.', odds: [25, 20, 7.5, 10, 12.5, 12.5, 7.5, 5] },
  { id: 'diamond', name: 'Diamond', cost: 50000, tier: 'BRILLIANT ODDS', description: 'Rare is common here. The biggest finds still take luck.', odds: [20, 20, 20, 10, 12, 7, 6, 5] },
  { id: 'iridium', name: 'Iridium', cost: 100000, tier: 'ULTRA SERIES', description: 'The odds lean hard toward transcendent and mythic orbs.', odds: [2, 4, 6, 10, 18, 20, 25, 15] },
  { id: 'bigBang', name: 'Big Bang', cost: 1000000, tier: 'ENDGAME SERIES', description: 'No common, uncommon, or rare pulls. Just cosmic stakes.', odds: [0, 0, 0, 1, 2, 12, 40, 45] }
];

const initialCoins = 5000;
const saveKey = 'orbTradingSaveV1';
const elements = {
  balance: document.getElementById('coin-balance'),
  gachaTitle: document.getElementById('gacha-title'),
  gachaTier: document.getElementById('gacha-tier'),
  gachaDescription: document.getElementById('gacha-description'),
  rollName: document.getElementById('roll-gacha-name'),
  rollCost: document.getElementById('roll-cost'),
  rollButton: document.getElementById('roll-button'),
  rollMessage: document.getElementById('roll-message'),
  oddsList: document.getElementById('odds-list'),
  inventoryGrid: document.getElementById('inventory-grid'),
  inventoryEmpty: document.getElementById('inventory-empty'),
  inventoryCount: document.getElementById('inventory-count'),
  sellAll: document.getElementById('sell-all'),
  lastPull: document.getElementById('last-pull-content'),
  pullNumber: document.getElementById('pull-number'),
  gachaDialog: document.getElementById('gacha-dialog'),
  gachaOptions: document.getElementById('gacha-options'),
  resetDialog: document.getElementById('reset-dialog')
};

let state = loadGame();
let selectedGacha = gachas.find(gacha => gacha.id === state.selectedGacha) || gachas[0];

function formatCoins(value) {
  return Math.floor(value).toLocaleString('en-US');
}

function getOrbPrice(rarity, orbName) {
  if (rarity.id === 'oneOfAKind') return orbName === 'Winter Triangle' ? 200000 : 600000;
  return rarity.sell;
}

function loadGame() {
  try {
    const saved = JSON.parse(localStorage.getItem(saveKey));
    if (saved && Number.isFinite(saved.coins) && Array.isArray(saved.inventory)) {
      return {
        coins: Math.max(0, saved.coins),
        inventory: saved.inventory.filter(item => item && typeof item.name === 'string' && typeof item.rarity === 'string'),
        rolls: Math.max(0, Number(saved.rolls) || 0),
        lastPull: saved.lastPull || null,
        selectedGacha: saved.selectedGacha || 'copper'
      };
    }
  } catch (error) {
    console.warn('Could not load Orb Trading save.', error);
  }
  return { coins: initialCoins, inventory: [], rolls: 0, lastPull: null, selectedGacha: 'copper' };
}

function saveGame() {
  try {
    localStorage.setItem(saveKey, JSON.stringify(state));
  } catch (error) {
    elements.rollMessage.textContent = 'Save unavailable in this browser.';
    elements.rollMessage.classList.add('error');
  }
}

function renderOdds() {
  elements.oddsList.replaceChildren();
  rarities.forEach((rarity, index) => {
    const row = document.createElement('div');
    row.className = `odds-item${selectedGacha.odds[index] === 0 ? ' zero' : ''}`;
    const label = document.createElement('span');
    label.textContent = `${rarity.short} · ${rarity.name}`;
    const chance = document.createElement('strong');
    chance.textContent = `${selectedGacha.odds[index]}%`;
    row.append(label, chance);
    elements.oddsList.append(row);
  });
}

function renderGachaOptions() {
  elements.gachaOptions.replaceChildren();
  gachas.forEach(gacha => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = `gacha-option${gacha.id === selectedGacha.id ? ' selected' : ''}`;
    option.disabled = state.coins < gacha.cost;
    const top = document.createElement('span');
    top.className = 'gacha-option-top';
    const name = document.createElement('strong');
    name.textContent = gacha.name;
    const cost = document.createElement('span');
    cost.textContent = `¢ ${formatCoins(gacha.cost)}`;
    top.append(name, cost);

    const meta = document.createElement('span');
    meta.className = 'gacha-option-meta';
    const tier = document.createElement('span');
    tier.textContent = gacha.tier;
    const status = document.createElement('span');
    status.textContent = gacha.id === selectedGacha.id ? 'SELECTED' : gacha.cost > state.coins ? 'LOCKED' : 'AVAILABLE';
    meta.append(tier, status);

    const odds = document.createElement('span');
    odds.className = 'gacha-option-odds';
    gacha.odds.forEach((chance, index) => {
      if (chance <= 0) return;
      const tag = document.createElement('span');
      tag.textContent = `${rarities[index].short} ${chance}%`;
      odds.append(tag);
    });
    option.append(top, meta, odds);
    option.addEventListener('click', () => selectGacha(gacha));
    elements.gachaOptions.append(option);
  });
}

function renderInventory() {
  elements.inventoryGrid.replaceChildren();
  const count = state.inventory.length;
  elements.inventoryCount.textContent = count;
  elements.inventoryEmpty.hidden = count > 0;
  elements.sellAll.disabled = count === 0;

  const grouped = new Map();
  state.inventory.forEach(item => {
    const key = `${item.rarity}:${item.name}`;
    const existing = grouped.get(key);
    if (existing) existing.count += 1;
    else grouped.set(key, { ...item, count: 1 });
  });

  const rarityById = new Map(rarities.map(rarity => [rarity.id, rarity]));
  [...grouped.values()].sort((a, b) => {
    const rarityOrder = rarityById.get(b.rarity).sell - rarityById.get(a.rarity).sell;
    return rarityOrder || a.name.localeCompare(b.name);
  }).forEach(item => {
    const rarity = rarityById.get(item.rarity);
    if (!rarity) return;
    const card = document.createElement('article');
    card.className = 'orb-card';
    const token = document.createElement('span');
    token.className = 'orb-token';
    token.style.setProperty('--rarity-color', rarity.color);
    token.setAttribute('aria-hidden', 'true');
    const details = document.createElement('div');
    details.className = 'orb-details';
    const title = document.createElement('h4');
    title.textContent = item.name;
    const rarityLabel = document.createElement('p');
    rarityLabel.textContent = `${rarity.short} · ${rarity.name} · ×${item.count}`;
    details.append(title, rarityLabel);
    const actions = document.createElement('div');
    actions.className = 'orb-actions';
    const value = document.createElement('span');
    const unitPrice = getOrbPrice(rarity, item.name);
    value.className = 'orb-value';
    value.textContent = `¢ ${formatCoins(unitPrice * item.count)}`;
    const sell = document.createElement('button');
    sell.type = 'button';
    sell.className = 'sell-button';
    sell.textContent = `Sell ×${item.count}`;
    sell.setAttribute('aria-label', `Sell ${item.count} ${item.name} orb${item.count === 1 ? '' : 's'} for ${formatCoins(unitPrice * item.count)} coins`);
    sell.addEventListener('click', () => sellOrb(item.rarity, item.name));
    actions.append(value, sell);
    card.append(token, details, actions);
    elements.inventoryGrid.append(card);
  });
}

function renderLastPull() {
  elements.pullNumber.textContent = `#${String(state.rolls).padStart(3, '0')}`;
  elements.lastPull.classList.remove('has-pull');
  elements.lastPull.replaceChildren();
  if (!state.lastPull) {
    const placeholder = document.createElement('div');
    placeholder.className = 'pull-placeholder';
    placeholder.setAttribute('aria-hidden', 'true');
    placeholder.textContent = '?';
    const title = document.createElement('p');
    title.textContent = 'Make your first roll';
    const text = document.createElement('span');
    text.textContent = 'Your latest orb will show up here.';
    elements.lastPull.append(placeholder, title, text);
    return;
  }
  const rarity = rarities.find(item => item.id === state.lastPull.rarity);
  const token = document.createElement('span');
  token.className = 'orb-token';
  token.style.setProperty('--rarity-color', rarity.color);
  token.setAttribute('aria-hidden', 'true');
  const title = document.createElement('p');
  title.textContent = state.lastPull.name;
  const detail = document.createElement('span');
  detail.textContent = `${rarity.name} · sells for ¢ ${formatCoins(getOrbPrice(rarity, state.lastPull.name))}`;
  elements.lastPull.append(token, title, detail);
  elements.lastPull.classList.add('has-pull');
}

function render() {
  elements.balance.textContent = formatCoins(state.coins);
  elements.gachaTitle.textContent = selectedGacha.name;
  elements.gachaTier.textContent = selectedGacha.tier;
  elements.gachaDescription.textContent = selectedGacha.description;
  elements.rollName.textContent = selectedGacha.name;
  elements.rollCost.textContent = formatCoins(selectedGacha.cost);
  elements.rollButton.disabled = state.coins < selectedGacha.cost;
  elements.rollMessage.classList.remove('error');
  elements.rollMessage.textContent = state.coins < selectedGacha.cost
    ? `You need ¢ ${formatCoins(selectedGacha.cost - state.coins)} more to roll this gacha.`
    : 'One roll. One orb. What will you find?';
  renderOdds();
  renderInventory();
  renderLastPull();
  renderGachaOptions();
}

function selectGacha(gacha) {
  selectedGacha = gacha;
  state.selectedGacha = gacha.id;
  saveGame();
  render();
  elements.gachaDialog.close();
}

function rollRarity() {
  const roll = Math.random() * 100;
  let threshold = 0;
  for (let index = 0; index < selectedGacha.odds.length; index += 1) {
    threshold += selectedGacha.odds[index];
    if (roll < threshold) return rarities[index];
  }
  return rarities[rarities.length - 1];
}

function rollOrb(rarity) {
  if (rarity.id === 'oneOfAKind') {
    return Math.random() < .9 ? 'Winter Triangle' : 'Procyon Orb';
  }
  return rarity.orbs[Math.floor(Math.random() * rarity.orbs.length)];
}

function roll() {
  if (state.coins < selectedGacha.cost) return;
  state.coins -= selectedGacha.cost;
  const rarity = rollRarity();
  const name = rollOrb(rarity);
  const result = { name, rarity: rarity.id, gacha: selectedGacha.name };
  state.inventory.push(result);
  state.rolls += 1;
  state.lastPull = result;
  saveGame();
  render();
  elements.rollMessage.classList.remove('error');
  elements.rollMessage.textContent = `You found ${name} · ${rarity.name}!`;
}

function sellOrb(rarityId, name) {
  const matching = state.inventory.filter(item => item.rarity === rarityId && item.name === name);
  if (matching.length === 0) return;
  const rarity = rarities.find(item => item.id === rarityId);
  state.inventory = state.inventory.filter(item => item.rarity !== rarityId || item.name !== name);
  const price = getOrbPrice(rarity, name) * matching.length;
  state.coins += price;
  saveGame();
  render();
  elements.rollMessage.textContent = `Sold ${matching.length} ${name} orb${matching.length === 1 ? '' : 's'} for ¢ ${formatCoins(price)}.`;
}

function sellAll() {
  if (state.inventory.length === 0) return;
  const total = state.inventory.reduce((sum, item) => {
    const rarity = rarities.find(entry => entry.id === item.rarity);
    return sum + (rarity ? getOrbPrice(rarity, item.name) : 0);
  }, 0);
  state.coins += total;
  state.inventory = [];
  saveGame();
  render();
  elements.rollMessage.textContent = `Sold your collection for ¢ ${formatCoins(total)}.`;
}

function resetGame() {
  state = { coins: initialCoins, inventory: [], rolls: 0, lastPull: null, selectedGacha: 'copper' };
  selectedGacha = gachas[0];
  saveGame();
  render();
  elements.resetDialog.close();
}

document.getElementById('open-gachas').addEventListener('click', () => elements.gachaDialog.showModal());
document.getElementById('close-gachas').addEventListener('click', () => elements.gachaDialog.close());
elements.rollButton.addEventListener('click', roll);
elements.sellAll.addEventListener('click', sellAll);
document.getElementById('reset-game').addEventListener('click', () => elements.resetDialog.showModal());
document.getElementById('cancel-reset').addEventListener('click', () => elements.resetDialog.close());
document.getElementById('confirm-reset').addEventListener('click', resetGame);
elements.gachaDialog.addEventListener('click', event => {
  if (event.target === elements.gachaDialog) elements.gachaDialog.close();
});
elements.resetDialog.addEventListener('click', event => {
  if (event.target === elements.resetDialog) elements.resetDialog.close();
});

render();