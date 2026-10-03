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

const orbSellPrices = {
  Bland: 150,
  Rotating: 175,
  Kilogram: 200,
  Sand: 350,
  Energy: 400,
  Smoke: 450,
  Shadow: 500,
  Fire: 800,
  Frost: 900,
  Magnet: 1000,
  Sound: 1100,
  Wind: 1200,
  Glass: 4000,
  Exploding: 4300,
  Photon: 4600,
  Dark: 4900,
  Magma: 5200,
  Blizzard: 5500,
  Song: 5800,
  Pi: 6100,
  Chrono: 10000,
  Poison: 10500,
  Water: 11000,
  Storm: 11500,
  Meteor: 12000,
  Rift: 12500,
  Nebula: 13000,
  Prism: 24000,
  'Summer Triangle': 25500,
  Solar: 27000,
  Lunarink: 28500,
  Gas: 30000,
  Angel: 31500,
  Celestial: 33000,
  Cyborg: 60000,
  Demon: 63000,
  Algebra: 66000,
  Warp: 69000,
  Dino: 72000,
  Phoenix: 75000,
  Disco: 78000,
  'Winter Triangle': 200000,
  'Procyon Orb': 600000
};

const orbArt = {
  Bland: { symbol: '·', color: '#aeb7ae', accent: '#eef3e9' },
  Rotating: { symbol: '↻', color: '#55c9b7', accent: '#cafff2' },
  Kilogram: { symbol: 'kg', color: '#aa926c', accent: '#f3dfad' },
  Sand: { symbol: '≋', color: '#d4b56b', accent: '#fff0bd' },
  Energy: { symbol: '✦', color: '#f1d74b', accent: '#fff9be' },
  Smoke: { symbol: '≋', color: '#9da7aa', accent: '#f1f5f3' },
  Shadow: { symbol: '◐', color: '#504d75', accent: '#c8c2ff' },
  Fire: { symbol: '♨', color: '#f2633c', accent: '#ffe08b' },
  Frost: { symbol: '❄', color: '#70cce8', accent: '#e2fbff' },
  Magnet: { symbol: '∩', color: '#e45c65', accent: '#b3dcff' },
  Sound: { symbol: ')))', color: '#65a8dc', accent: '#d5f3ff' },
  Wind: { symbol: '〰', color: '#8bd6c6', accent: '#e0fff5' },
  Glass: { symbol: '◇', color: '#91dbe1', accent: '#efffff' },
  Exploding: { symbol: '✹', color: '#f47745', accent: '#fff1a1' },
  Photon: { symbol: '✦', color: '#f6e587', accent: '#ffffff' },
  Dark: { symbol: '●', color: '#343047', accent: '#b7a4ee' },
  Magma: { symbol: '⌁', color: '#d94d38', accent: '#ffbd54' },
  Blizzard: { symbol: '❅', color: '#9cdaeb', accent: '#ffffff' },
  Song: { symbol: '♫', color: '#cb83d9', accent: '#ffe0fa' },
  Pi: { symbol: 'π', color: '#6fc9ae', accent: '#d7ffcb' },
  Chrono: { symbol: '◷', color: '#e5bd68', accent: '#fff0ac' },
  Poison: { symbol: '☣', color: '#86c34d', accent: '#e5ff9c' },
  Water: { symbol: '◡', color: '#438fda', accent: '#b8f2ff' },
  Storm: { symbol: 'ϟ', color: '#5578d9', accent: '#fff285' },
  Meteor: { symbol: '☄', color: '#e98a50', accent: '#ffe1a0' },
  Rift: { symbol: '◉', color: '#9c65d4', accent: '#f2c1ff' },
  Nebula: { symbol: '✺', color: '#d166a2', accent: '#ffd0f0' },
  Prism: { symbol: '◈', color: '#68b9ce', accent: '#fff3a4' },
  'Summer Triangle': { symbol: '△', color: '#7892da', accent: '#fff4bb' },
  Solar: { symbol: '☼', color: '#e8a83e', accent: '#fff5a5' },
  Lunarink: { symbol: '☾', color: '#555b93', accent: '#d8d0ff' },
  Gas: { symbol: '°', color: '#76c8a8', accent: '#d3ffdd' },
  Angel: { symbol: '⋈', color: '#e4d9bd', accent: '#ffffff' },
  Celestial: { symbol: '✧', color: '#8ea8e8', accent: '#fff7c9' },
  Cyborg: { symbol: '▦', color: '#58bbb6', accent: '#c7fff1' },
  Demon: { symbol: '♆', color: '#b34b61', accent: '#ffb9a6' },
  Algebra: { symbol: '∑', color: '#79bf59', accent: '#e5ff9b' },
  Warp: { symbol: '∞', color: '#ab71d7', accent: '#ffd3ff' },
  Dino: { symbol: '◖', color: '#7eaa4b', accent: '#e9ff99' },
  Phoenix: { symbol: '♨', color: '#ea653e', accent: '#ffdc69' },
  Disco: { symbol: '✺', color: '#e46ebd', accent: '#a8fff0' },
  'Winter Triangle': { symbol: '❄', color: '#93cae8', accent: '#c5f0ff' },
  'Procyon Orb': { symbol: '✶', color: '#fff0a1', accent: '#fff1a1' }
};

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

const npcTrades = [
  { npc: 'Moss', title: 'The Tinker', note: 'A little pile of plain orbs for something with more spark.', give: 'common', count: 3, get: 'uncommon', color: '#d2a968' },
  { npc: 'Sable', title: 'The Sifter', note: 'Two useful finds for one with a sharper edge.', give: 'uncommon', count: 2, get: 'rare', color: '#78c8a7' },
  { npc: 'Juno', title: 'The Gemkeeper', note: 'Rare things catch my eye. Bring me a pair.', give: 'rare', count: 2, get: 'epic', color: '#7ea9e5' },
  { npc: 'Orin', title: 'The Archivist', note: 'I will trade old stories for a legendary discovery.', give: 'epic', count: 2, get: 'legendary', color: '#bd91df' },
  { npc: 'Vela', title: 'The Astronomer', note: 'Two legendary lights for a mythic one.', give: 'legendary', count: 2, get: 'mythic', color: '#e5b95b' },
  { npc: 'Unit-8', title: 'The Broker', note: 'Mythic energy can be refined into something transcendent.', give: 'mythic', count: 2, get: 'transcendent', color: '#72cfc7' },
  { npc: 'Wayfarer', title: 'Beyond the Veil', note: 'Two transcendent orbs. One impossible prize.', give: 'transcendent', count: 2, get: 'oneOfAKind', color: '#efe0a0' }
];

const stockOdds = {
  common: .68,
  uncommon: .52,
  rare: .36,
  epic: .24,
  legendary: .15,
  mythic: .08,
  transcendent: .04,
  oneOfAKind: .025
};
const stockCycleMs = 3 * 60 * 1000;
const initialCoins = 5000;
const saveKey = 'orbTradingSaveV1';
const elements = {
  balance: document.getElementById('coin-balance'),
  orbStage: document.getElementById('orb-stage'),
  gachaTitle: document.getElementById('gacha-title'),
  gachaTier: document.getElementById('gacha-tier'),
  gachaDescription: document.getElementById('gacha-description'),
  rollName: document.getElementById('roll-gacha-name'),
  rollCost: document.getElementById('roll-cost'),
  rollButton: document.getElementById('roll-button'),
  rollAnimationToggle: document.getElementById('roll-animation-toggle'),
  rollMessage: document.getElementById('roll-message'),
  oddsList: document.getElementById('odds-list'),
  inventoryGrid: document.getElementById('inventory-grid'),
  inventoryEmpty: document.getElementById('inventory-empty'),
  inventoryCount: document.getElementById('inventory-count'),
  tradeList: document.getElementById('trade-list'),
  tradeCount: document.getElementById('trade-count'),
  tradeMessage: document.getElementById('trade-message'),
  tradingDialog: document.getElementById('trading-dialog'),
  stockDialog: document.getElementById('stock-dialog'),
  stockList: document.getElementById('stock-list'),
  stockCountdown: document.getElementById('stock-countdown'),
  stockMessage: document.getElementById('stock-message'),
  sellAll: document.getElementById('sell-all'),
  lastPull: document.getElementById('last-pull-content'),
  pullNumber: document.getElementById('pull-number'),
  gachaDialog: document.getElementById('gacha-dialog'),
  gachaOptions: document.getElementById('gacha-options'),
  resetDialog: document.getElementById('reset-dialog')
};

let state = loadGame();
let selectedGacha = gachas.find(gacha => gacha.id === state.selectedGacha) || gachas[0];
let isRolling = false;
let rollAnimationId = 0;

function formatCoins(value) {
  return Math.floor(value).toLocaleString('en-US');
}

function getOrbPrice(rarity, orbName) {
  return orbSellPrices[orbName] ?? rarity.sell;
}

function getStockPrice(rarity, orbName) {
  return Math.floor(getOrbPrice(rarity, orbName) * .75);
}

function createEmptyStock() {
  return Object.fromEntries(rarities.flatMap(rarity => rarity.orbs.map(name => [name, false])));
}

function generateStock() {
  const stock = createEmptyStock();
  rarities.filter(rarity => rarity.id !== 'oneOfAKind').forEach(rarity => {
    rarity.orbs.forEach(name => {
      stock[name] = Math.random() < stockOdds[rarity.id];
    });
  });
  if (Math.random() < stockOdds.oneOfAKind) {
    const uniqueOrb = Math.random() < .9 ? 'Winter Triangle' : 'Procyon Orb';
    stock[uniqueOrb] = true;
  }
  return stock;
}

function createOrbToken(name, rarity) {
  const art = orbArt[name] || { symbol: '✦', color: rarity.color, accent: '#ffffff' };
  const token = document.createElement('span');
  token.className = `orb-token${name === 'Storm' ? ' orb-token--storm' : ''}${rarity.id === 'oneOfAKind' ? ' orb-token--one-of-a-kind' : ''}`;
  token.style.setProperty('--orb-color', art.color);
  token.style.setProperty('--orb-accent', art.accent);
  token.setAttribute('aria-hidden', 'true');
  const symbol = document.createElement('span');
  symbol.className = 'orb-symbol';
  symbol.textContent = art.symbol;
  token.append(symbol);
  return token;
}

function loadGame() {
  try {
    const saved = JSON.parse(localStorage.getItem(saveKey));
    if (saved && Number.isFinite(saved.coins) && Array.isArray(saved.inventory)) {
      const stock = createEmptyStock();
      const hasSavedStock = saved.stock && typeof saved.stock === 'object' && !Array.isArray(saved.stock);
      if (hasSavedStock) {
        Object.keys(stock).forEach(name => { stock[name] = saved.stock[name] === true; });
      } else {
        Object.assign(stock, generateStock());
      }
      return {
        coins: Math.max(0, saved.coins),
        inventory: saved.inventory.filter(item => item && typeof item.name === 'string' && typeof item.rarity === 'string'),
        rolls: Math.max(0, Number(saved.rolls) || 0),
        tradeCount: Math.max(0, Number(saved.tradeCount) || 0),
        animateRolls: saved.animateRolls !== false,
        stock,
        stockRefreshAt: Number.isFinite(saved.stockRefreshAt) ? saved.stockRefreshAt : Date.now() + stockCycleMs,
        lastPull: saved.lastPull || null,
        selectedGacha: saved.selectedGacha || 'copper'
      };
    }
  } catch (error) {
    console.warn('Could not load Orb Trading save.', error);
  }
  return { coins: initialCoins, inventory: [], rolls: 0, tradeCount: 0, animateRolls: true, stock: generateStock(), stockRefreshAt: Date.now() + stockCycleMs, lastPull: null, selectedGacha: 'copper' };
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
  const sortValue = item => getOrbPrice(rarityById.get(item.rarity), item.name);
  [...grouped.values()].sort((a, b) => {
    const rarityOrder = sortValue(b) - sortValue(a);
    return rarityOrder || a.name.localeCompare(b.name);
  }).forEach(item => {
    const rarity = rarityById.get(item.rarity);
    if (!rarity) return;
    const card = document.createElement('article');
    card.className = 'orb-card';
    const token = createOrbToken(item.name, rarity);
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
  elements.lastPull.classList.remove('has-pull', 'is-rolling');
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
  const token = createOrbToken(state.lastPull.name, rarity);
  const title = document.createElement('p');
  title.textContent = state.lastPull.name;
  const detail = document.createElement('span');
  detail.textContent = `${rarity.name} · sells for ¢ ${formatCoins(getOrbPrice(rarity, state.lastPull.name))}`;
  elements.lastPull.append(token, title, detail);
  elements.lastPull.classList.add('has-pull');
}

function formatStockTimer(milliseconds) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function renderStock() {
  if (state.stockRefreshAt <= Date.now()) {
    state.stock = generateStock();
    state.stockRefreshAt = Date.now() + stockCycleMs;
    saveGame();
  }
  elements.stockCountdown.textContent = `RESTOCK IN ${formatStockTimer(state.stockRefreshAt - Date.now())}`;
  elements.stockList.replaceChildren();

  rarities.forEach(rarity => {
    const section = document.createElement('section');
    section.className = 'stock-tier';
    const header = document.createElement('div');
    header.className = 'stock-tier-header';
    const title = document.createElement('h3');
    title.textContent = rarity.name;
    const availableCount = rarity.orbs.filter(name => state.stock[name]).length;
    const count = document.createElement('span');
    count.textContent = `${availableCount}/${rarity.orbs.length} IN STOCK`;
    header.append(title, count);
    const grid = document.createElement('div');
    grid.className = 'stock-items';

    rarity.orbs.forEach(name => {
      const available = state.stock[name] === true;
      const price = getStockPrice(rarity, name);
      const card = document.createElement('article');
      card.className = `stock-item${available ? ' stock-item-available' : ''}`;
      const token = createOrbToken(name, rarity);
      const details = document.createElement('div');
      details.className = 'stock-item-details';
      const orbName = document.createElement('strong');
      orbName.textContent = name;
      const status = document.createElement('span');
      status.textContent = available ? 'IN STOCK' : 'OUT OF STOCK';
      details.append(orbName, status);
      const action = document.createElement('button');
      action.type = 'button';
      action.className = 'stock-buy-button';
      action.disabled = !available || state.coins < price;
      action.textContent = !available ? 'Sold out' : state.coins < price ? `Need ¢${formatCoins(price - state.coins)}` : `Buy · ¢${formatCoins(price)}`;
      action.addEventListener('click', () => buyStockOrb(name, rarity.id));
      card.append(token, details, action);
      grid.append(card);
    });

    section.append(header, grid);
    elements.stockList.append(section);
  });
}

function renderTrades() {
  elements.tradeList.replaceChildren();
  elements.tradeCount.textContent = `${state.tradeCount} trade${state.tradeCount === 1 ? '' : 's'}`;

  npcTrades.forEach((trade, index) => {
    const giveRarity = rarities.find(rarity => rarity.id === trade.give);
    const getRarity = rarities.find(rarity => rarity.id === trade.get);
    const owned = state.inventory.filter(item => item.rarity === trade.give).length;
    const ready = owned >= trade.count;
    const card = document.createElement('article');
    card.className = `trade-card${ready ? ' trade-card-ready' : ''}`;

    const header = document.createElement('div');
    header.className = 'trader-header';
    const portrait = document.createElement('span');
    portrait.className = 'trader-portrait';
    portrait.style.setProperty('--npc-color', trade.color);
    portrait.textContent = trade.npc.slice(0, 1);
    portrait.setAttribute('aria-hidden', 'true');
    const identity = document.createElement('div');
    identity.className = 'trader-identity';
    const name = document.createElement('strong');
    name.textContent = trade.npc;
    const title = document.createElement('span');
    title.textContent = trade.title;
    identity.append(name, title);
    const readyMark = document.createElement('span');
    readyMark.className = 'trade-ready-mark';
    readyMark.textContent = ready ? 'READY' : `${owned}/${trade.count}`;
    header.append(portrait, identity, readyMark);

    const note = document.createElement('p');
    note.className = 'trader-note';
    note.textContent = trade.note;

    const exchange = document.createElement('div');
    exchange.className = 'trade-exchange';
    const give = document.createElement('div');
    give.className = 'trade-side';
    const giveLabel = document.createElement('span');
    giveLabel.textContent = 'YOU GIVE';
    const giveValue = document.createElement('strong');
    giveValue.style.setProperty('--trade-color', giveRarity.color);
    giveValue.textContent = `${trade.count} ${giveRarity.name}`;
    give.append(giveLabel, giveValue);
    const arrow = document.createElement('span');
    arrow.className = 'trade-arrow';
    arrow.textContent = '→';
    arrow.setAttribute('aria-hidden', 'true');
    const receive = document.createElement('div');
    receive.className = 'trade-side trade-side-receive';
    const receiveLabel = document.createElement('span');
    receiveLabel.textContent = 'YOU GET';
    const receiveValue = document.createElement('strong');
    receiveValue.style.setProperty('--trade-color', getRarity.color);
    receiveValue.textContent = `1 ${getRarity.name}`;
    receive.append(receiveLabel, receiveValue);
    exchange.append(give, arrow, receive);

    const action = document.createElement('button');
    action.type = 'button';
    action.className = 'trade-button';
    action.disabled = !ready;
    action.textContent = ready ? 'Make trade' : `Need ${trade.count - owned} more`;
    action.addEventListener('click', () => makeTrade(index));
    card.append(header, note, exchange, action);
    elements.tradeList.append(card);
  });
}

function render() {
  elements.balance.textContent = formatCoins(state.coins);
  elements.orbStage.dataset.gacha = selectedGacha.id;
  elements.gachaTitle.textContent = selectedGacha.name;
  elements.gachaTier.textContent = selectedGacha.tier;
  elements.gachaDescription.textContent = selectedGacha.description;
  elements.rollName.textContent = selectedGacha.name;
  elements.rollCost.textContent = formatCoins(selectedGacha.cost);
  elements.rollAnimationToggle.checked = state.animateRolls;
  elements.rollButton.disabled = isRolling || state.coins < selectedGacha.cost;
  elements.rollMessage.classList.remove('error');
  elements.rollMessage.textContent = state.coins < selectedGacha.cost
    ? `You need ¢ ${formatCoins(selectedGacha.cost - state.coins)} more to roll this gacha.`
    : 'One roll. One orb. What will you find?';
  renderOdds();
  renderInventory();
  renderTrades();
  renderStock();
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

function buyStockOrb(name, rarityId) {
  const rarity = rarities.find(item => item.id === rarityId);
  if (!rarity || state.stock[name] !== true) return;
  const price = getStockPrice(rarity, name);
  if (state.coins < price) return;

  state.coins -= price;
  state.stock[name] = false;
  state.inventory.push({ name, rarity: rarity.id, gacha: 'Orb Stock' });
  saveGame();
  render();
  elements.stockMessage.textContent = `Bought ${name} for ¢ ${formatCoins(price)}.`;
  elements.stockMessage.classList.add('stock-message-success');
}

function updateStockCountdown() {
  const remaining = state.stockRefreshAt - Date.now();
  if (remaining <= 0) {
    state.stock = generateStock();
    state.stockRefreshAt = Date.now() + stockCycleMs;
    saveGame();
    renderStock();
    elements.stockMessage.textContent = 'The market has been restocked.';
    elements.stockMessage.classList.add('stock-message-success');
    return;
  }
  elements.stockCountdown.textContent = `RESTOCK IN ${formatStockTimer(remaining)}`;
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

function makeTrade(tradeIndex) {
  const trade = npcTrades[tradeIndex];
  if (!trade) return;
  const owned = state.inventory.filter(item => item.rarity === trade.give).length;
  if (owned < trade.count) return;

  let removed = 0;
  state.inventory = state.inventory.filter(item => {
    if (item.rarity === trade.give && removed < trade.count) {
      removed += 1;
      return false;
    }
    return true;
  });

  const rewardRarity = rarities.find(rarity => rarity.id === trade.get);
  const rewardName = rollOrb(rewardRarity);
  state.inventory.push({ name: rewardName, rarity: rewardRarity.id, gacha: `Trade with ${trade.npc}` });
  state.tradeCount += 1;
  saveGame();
  render();
  elements.tradeMessage.classList.add('trade-message-success');
  elements.tradeMessage.textContent = `${trade.npc} traded your ${trade.count} ${rarities.find(rarity => rarity.id === trade.give).name} orbs for ${rewardName} · ${rewardRarity.name}!`;
}

function animateLastPull(result, animationId) {
  const duration = 2900;
  const startTime = performance.now();
  let nextChange = startTime;
  elements.lastPull.classList.add('is-rolling');

  function animate(now) {
    if (animationId !== rollAnimationId) return;
    const progress = Math.min(1, (now - startTime) / duration);
    if (progress >= 1) {
      isRolling = false;
      render();
      elements.rollMessage.textContent = `You found ${result.name} · ${rarities.find(item => item.id === result.rarity).name}!`;
      return;
    }

    if (now >= nextChange) {
      const rarity = rarities[Math.floor(Math.random() * rarities.length)];
      const name = rarity.orbs[Math.floor(Math.random() * rarity.orbs.length)];
      const token = createOrbToken(name, rarity);
      token.classList.add('rolling-orb');
      elements.lastPull.querySelector('.orb-token')?.replaceWith(token);
      elements.lastPull.querySelector('p').textContent = name;
      elements.lastPull.lastElementChild.textContent = `${rarity.name} · sells for ¢ ${formatCoins(getOrbPrice(rarity, name))}`;
      nextChange = now + 45 + 620 * progress ** 3;
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

function roll() {
  if (isRolling || state.coins < selectedGacha.cost) return;
  const animate = state.animateRolls;
  isRolling = animate;
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
  if (!animate) {
    elements.rollMessage.textContent = `You found ${name} · ${rarity.name}!`;
    return;
  }
  elements.rollMessage.textContent = 'Rolling...';
  rollAnimationId += 1;
  animateLastPull(result, rollAnimationId);
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
  rollAnimationId += 1;
  isRolling = false;
  state = { coins: initialCoins, inventory: [], rolls: 0, tradeCount: 0, animateRolls: true, stock: generateStock(), stockRefreshAt: Date.now() + stockCycleMs, lastPull: null, selectedGacha: 'copper' };
  selectedGacha = gachas[0];
  saveGame();
  render();
  elements.resetDialog.close();
}

document.getElementById('open-gachas').addEventListener('click', () => elements.gachaDialog.showModal());
document.getElementById('close-gachas').addEventListener('click', () => elements.gachaDialog.close());
document.getElementById('open-trading').addEventListener('click', () => elements.tradingDialog.showModal());
document.getElementById('close-trading').addEventListener('click', () => elements.tradingDialog.close());
document.getElementById('open-stock').addEventListener('click', () => elements.stockDialog.showModal());
document.getElementById('close-stock').addEventListener('click', () => elements.stockDialog.close());
elements.rollButton.addEventListener('click', roll);
elements.rollAnimationToggle.addEventListener('change', () => {
  state.animateRolls = elements.rollAnimationToggle.checked;
  saveGame();
  if (!state.animateRolls && isRolling) {
    rollAnimationId += 1;
    isRolling = false;
    render();
    const rarity = rarities.find(item => item.id === state.lastPull.rarity);
    elements.rollMessage.textContent = `You found ${state.lastPull.name} · ${rarity.name}!`;
  }
});
elements.sellAll.addEventListener('click', sellAll);
document.getElementById('reset-game').addEventListener('click', () => elements.resetDialog.showModal());
document.getElementById('cancel-reset').addEventListener('click', () => elements.resetDialog.close());
document.getElementById('confirm-reset').addEventListener('click', resetGame);
elements.gachaDialog.addEventListener('click', event => {
  if (event.target === elements.gachaDialog) elements.gachaDialog.close();
});
elements.tradingDialog.addEventListener('click', event => {
  if (event.target === elements.tradingDialog) elements.tradingDialog.close();
});
elements.stockDialog.addEventListener('click', event => {
  if (event.target === elements.stockDialog) elements.stockDialog.close();
});
elements.resetDialog.addEventListener('click', event => {
  if (event.target === elements.resetDialog) elements.resetDialog.close();
});

render();
window.setInterval(updateStockCountdown, 1000);