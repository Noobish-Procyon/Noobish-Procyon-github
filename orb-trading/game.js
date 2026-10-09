const rarities = [
  { id: 'common', name: 'Common', short: 'C', color: '#b7c0b6', sell: 150, orbs: ['Bland', 'Rotating', 'Kilogram', 'Pebble', 'Dust', 'Plain', 'Tiny', 'Dull', 'Smooth', 'Lopsided', 'Chalk'] },
  { id: 'uncommon', name: 'Uncommon', short: 'UC', color: '#75d7c0', sell: 350, orbs: ['Sand', 'Energy', 'Smoke', 'Shadow', 'Leaf', 'Echo', 'Mist', 'Copper', 'Bubble', 'Static', 'Moss', 'Ripple'] },
  { id: 'rare', name: 'Rare', short: 'R', color: '#79aff0', sell: 800, orbs: ['Fire', 'Frost', 'Magnet', 'Sound', 'Wind', 'Gravity', 'Quake', 'Pulse', 'Metal', 'Orbit', 'Crystal', 'Tide', 'Ember', 'Verdant Compass'] },
  { id: 'epic', name: 'Epic', short: 'E', color: '#c394f5', sell: 4000, sellMultiplier: 10, orbs: ['Glass', 'Exploding', 'Photon', 'Dark', 'Magma', 'Blizzard', 'Song', 'Pi', 'Aurora', 'Vortex', 'Void', 'Catalyst', 'Comet', 'Mirage', 'Runic', 'Fission', 'Crater Heart'] },
  { id: 'legendary', name: 'Legendary', short: 'L', color: '#f2bd61', sell: 10000, sellMultiplier: 10, orbs: ['Chrono', 'Poison', 'Water', 'Storm', 'Meteor', 'Rift', 'Nebula', 'Eclipse', 'Titan', 'Horizon', 'Singularity', 'Tempest', 'Atlas', 'Equinox', 'Starfire'] },
  { id: 'mythic', name: 'Mythic', short: 'M', color: '#f1819c', sell: 24000, sellMultiplier: 10, orbs: ['Prism', 'Summer Triangle', 'Solar', 'Lunarink', 'Gas', 'Angel', 'Celestial', 'Supernova', 'Galaxy', 'Stardust', 'Zenith', 'Moonstone', 'Infinity', 'Starforge', 'Eventide', 'Astral Bloom'] },
  { id: 'transcendent', name: 'Transcendent', short: 'T', color: '#d0ef70', sell: 60000, sellMultiplier: 10, orbs: ['Cyborg', 'Demon', 'Algebra', 'Warp', 'Dino', 'Phoenix', 'Disco', 'Genesis', 'Eternity', 'Paradox', 'Multiverse', 'Omniscient', 'Ascension', 'Dimension', 'Quantum', 'Dragon'] },
  { id: 'oneOfAKind', name: 'One of a Kind', short: '1oAK', color: '#fff1a8', sell: 0, sellMultiplier: 10, orbs: ['Winter Triangle', 'Flame and Frost', 'Astral Crown', 'Starheart', 'Cosmic Key', 'Procyon Orb'] }
];

const knownOrbNames = new Set(rarities.flatMap(rarity => rarity.orbs));
const journalMilestones = [
  { id: 'discover-5', total: 5, gems: 1 },
  { id: 'discover-15', total: 15, gems: 2 },
  { id: 'discover-30', total: 30, gems: 5 },
  { id: 'discover-all', total: knownOrbNames.size, gems: 10 }
];
const dailyContractTemplates = [
  { id: 'spin-three', title: 'Spin Cycle', description: 'Roll any gacha 3 times', event: 'roll', target: 3, reward: { coins: 500 } },
  { id: 'sell-five', title: 'Market Regular', description: 'Sell 5 orbs', event: 'sell', target: 5, reward: { coins: 750 } },
  { id: 'npc-trade', title: 'Good Neighbors', description: 'Complete an NPC trade', event: 'trade', target: 1, reward: { gems: 1 } },
  { id: 'new-discovery', title: 'Something New', description: 'Discover a new orb', event: 'discover', target: 1, reward: { gems: 1 } },
  { id: 'stock-buy', title: 'Market Shopper', description: 'Buy an orb from stock', event: 'buy', target: 1, reward: { coins: 500 } },
  { id: 'rare-sale', title: 'Premium Sale', description: 'Sell a Mythic or rarer orb', event: 'sellRare', target: 1, reward: { gems: 1 } },
  { id: 'expedition', title: 'Trailblazer', description: 'Complete an expedition', event: 'expedition', target: 1, reward: { gems: 1 } }
];

const expeditionDestinations = [
  { id: 'verdantReach', name: 'Verdant Reach', description: 'Follow old lantern trails through a living canopy.', durationMs: 60 * 1000, minPower: 3, coins: 2500, gems: 0, orbRarity: 'rare', exclusiveOrb: 'Verdant Compass', exclusiveChance: .2 },
  { id: 'shardfallCrater', name: 'Shardfall Crater', description: 'Map the glassy impact zone and recover its bright fragments.', durationMs: 4 * 60 * 1000, minPower: 9, coins: 14000, gems: 1, orbRarity: 'epic', exclusiveOrb: 'Crater Heart', exclusiveChance: .2 },
  { id: 'astralDeep', name: 'Astral Deep', description: 'Chart a cold ocean of stars beyond the known routes.', durationMs: 12 * 60 * 1000, minPower: 15, coins: 45000, gems: 2, orbRarity: 'mythic', exclusiveOrb: 'Astral Bloom', exclusiveChance: .2 }
];
const expeditionExclusiveOrbs = new Set(expeditionDestinations.map(destination => destination.exclusiveOrb));
const skillTreeNodes = [
  { id: 'market1', branch: 'market', level: 1, title: 'Appraiser I', description: 'Orb sales earn 5% more coins.', cost: 2, prerequisite: null },
  { id: 'market2', branch: 'market', level: 2, title: 'Appraiser II', description: 'Orb sales earn another 5% more coins.', cost: 4, prerequisite: 'market1' },
  { id: 'market3', branch: 'market', level: 3, title: 'Appraiser III', description: 'Orb sales earn another 5% more coins.', cost: 7, prerequisite: 'market2' },
  { id: 'fortune1', branch: 'fortune', level: 1, title: 'Gem Sense I', description: 'Gain +0.5 percentage points to Mystic Gem find chance.', cost: 2, prerequisite: null },
  { id: 'fortune2', branch: 'fortune', level: 2, title: 'Gem Sense II', description: 'Gain another +0.5 percentage points to Mystic Gem find chance.', cost: 4, prerequisite: 'fortune1' },
  { id: 'fortune3', branch: 'fortune', level: 3, title: 'Gem Sense III', description: 'Gain another +0.5 percentage points to Mystic Gem find chance.', cost: 7, prerequisite: 'fortune2' },
  { id: 'explorer1', branch: 'explorer', level: 1, title: 'Trailcraft I', description: 'Expeditions return 10% sooner.', cost: 2, prerequisite: null },
  { id: 'explorer2', branch: 'explorer', level: 2, title: 'Trailcraft II', description: 'Expeditions return another 10% sooner.', cost: 4, prerequisite: 'explorer1' },
  { id: 'explorer3', branch: 'explorer', level: 3, title: 'Trailcraft III', description: 'Expeditions return another 10% sooner.', cost: 7, prerequisite: 'explorer2' }
];
const skillBranches = [
  { id: 'market', name: 'Market', description: 'Increase the coins earned when selling orbs.' },
  { id: 'fortune', name: 'Fortune', description: 'Find Mystic Gems more often when selling.' },
  { id: 'explorer', name: 'Exploration', description: 'Reduce the time your teams spend away.' }
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
  'Flame and Frost': 400000,
  'Astral Crown': 800000,
  Starheart: 1000000,
  'Cosmic Key': 1200000,
  'Procyon Orb': 4200000,
  Pebble: 225,
  Dust: 250,
  Plain: 275,
  Tiny: 300,
  Dull: 325,
  Smooth: 350,
  Lopsided: 375,
  Chalk: 400,
  Leaf: 550,
  Echo: 600,
  Mist: 650,
  Copper: 700,
  Bubble: 750,
  Static: 800,
  Moss: 850,
  Ripple: 900,
  Gravity: 1300,
  Quake: 1400,
  Pulse: 1500,
  Metal: 1600,
  Orbit: 1700,
  Crystal: 1800,
  Tide: 1900,
  Ember: 2000,
  'Verdant Compass': 2400,
  Aurora: 6400,
  Vortex: 6700,
  Void: 7000,
  Catalyst: 7300,
  Comet: 7600,
  Mirage: 7900,
  Runic: 8200,
  Fission: 8500,
  'Crater Heart': 9000,
  Eclipse: 13500,
  Titan: 14000,
  Horizon: 14500,
  Singularity: 15000,
  Tempest: 15500,
  Atlas: 16000,
  Equinox: 16500,
  Starfire: 17000,
  Supernova: 34500,
  Galaxy: 36000,
  Stardust: 37500,
  Zenith: 39000,
  Moonstone: 40500,
  Infinity: 42000,
  Starforge: 43500,
  Eventide: 45000,
  'Astral Bloom': 108000,
  Genesis: 81000,
  Eternity: 84000,
  Paradox: 87000,
  Multiverse: 90000,
  Omniscient: 93000,
  Ascension: 96000,
  Dimension: 99000,
  Quantum: 102000,
  Dragon: 105000
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
  'Flame and Frost': { symbol: '✧', color: '#f28743', accent: '#b8e9ff' },
  'Astral Crown': { symbol: '♕', color: '#e7c65d', accent: '#fff7bd' },
  Starheart: { symbol: '♥', color: '#df6b91', accent: '#ffe0ec' },
  'Cosmic Key': { symbol: '⚿', color: '#8b78d5', accent: '#e5d5ff' },
  'Procyon Orb': { symbol: '✶', color: '#fff0a1', accent: '#fff1a1' },
  Pebble: { symbol: '●', color: '#929b92', accent: '#d8dfd4' },
  Dust: { symbol: '·', color: '#b2aa91', accent: '#f5ecc8' },
  Plain: { symbol: '○', color: '#a8b1a6', accent: '#e7eee4' },
  Tiny: { symbol: '▪', color: '#83948a', accent: '#d5e5d8' },
  Dull: { symbol: '◌', color: '#8d9691', accent: '#d1d8d2' },
  Smooth: { symbol: '◯', color: '#78a39a', accent: '#dcfff0' },
  Lopsided: { symbol: '◍', color: '#9e8c72', accent: '#f1d5a6' },
  Chalk: { symbol: '✧', color: '#c5c6b2', accent: '#fffde5' },
  Leaf: { symbol: '❧', color: '#62b878', accent: '#dcff9f' },
  Echo: { symbol: ')))', color: '#5fa9b5', accent: '#d1fbff' },
  Mist: { symbol: '≋', color: '#9cc6c0', accent: '#effff8' },
  Copper: { symbol: '◉', color: '#bc784b', accent: '#ffe0a3' },
  Bubble: { symbol: '○', color: '#65c6cb', accent: '#d5ffff' },
  Static: { symbol: 'ϟ', color: '#9ca3e2', accent: '#fff8aa' },
  Moss: { symbol: '❋', color: '#71914b', accent: '#d8f58c' },
  Ripple: { symbol: '◡', color: '#4d9cb4', accent: '#bff4ff' },
  Gravity: { symbol: '⊙', color: '#5c74a8', accent: '#d5ddff' },
  Quake: { symbol: '⌁', color: '#9d795f', accent: '#f7d197' },
  Pulse: { symbol: '♥', color: '#dc658c', accent: '#ffd2eb' },
  Metal: { symbol: '▧', color: '#84949d', accent: '#e0f4f6' },
  Orbit: { symbol: '◎', color: '#536eb3', accent: '#c6e7ff' },
  Crystal: { symbol: '◇', color: '#79c8d6', accent: '#edffff' },
  Tide: { symbol: '≈', color: '#438bce', accent: '#b5ecff' },
  Ember: { symbol: '♨', color: '#e7783d', accent: '#ffe194' },
  'Verdant Compass': { symbol: '⌖', color: '#70a65c', accent: '#e5ffb1' },
  Aurora: { symbol: '✧', color: '#64bcae', accent: '#e3ffd6' },
  Vortex: { symbol: '◉', color: '#8d5bc6', accent: '#e6c4ff' },
  Void: { symbol: '●', color: '#38364f', accent: '#bdb2f4' },
  Catalyst: { symbol: '⚗', color: '#63b587', accent: '#e5ffad' },
  Comet: { symbol: '☄', color: '#e79552', accent: '#fff0aa' },
  Mirage: { symbol: '◇', color: '#d58abc', accent: '#fff0fd' },
  Runic: { symbol: 'ᚱ', color: '#648ab5', accent: '#d2f4ff' },
  Fission: { symbol: '✹', color: '#df794b', accent: '#fff2a0' },
  'Crater Heart': { symbol: '✹', color: '#d86f52', accent: '#ffd28f' },
  Eclipse: { symbol: '◐', color: '#55536f', accent: '#f8d77d' },
  Titan: { symbol: '⬟', color: '#b08a55', accent: '#ffe2a1' },
  Horizon: { symbol: '⊖', color: '#6285b4', accent: '#ffda94' },
  Singularity: { symbol: '⊙', color: '#4f3d7d', accent: '#f4b9ee' },
  Tempest: { symbol: 'ϟ', color: '#5574c2', accent: '#fff09a' },
  Atlas: { symbol: '✥', color: '#bb7751', accent: '#ffe1a3' },
  Equinox: { symbol: '☯', color: '#9d7ac7', accent: '#fff1a8' },
  Starfire: { symbol: '✹', color: '#eb7245', accent: '#fff3a0' },
  Supernova: { symbol: '✹', color: '#ed7b50', accent: '#fff3a0' },
  Galaxy: { symbol: '✺', color: '#ac68c9', accent: '#ffc9f4' },
  Stardust: { symbol: '⁕', color: '#d8b965', accent: '#fff7c5' },
  Zenith: { symbol: '✦', color: '#77b8d2', accent: '#f4ffcb' },
  Moonstone: { symbol: '◐', color: '#7c83b4', accent: '#e3e2ff' },
  Infinity: { symbol: '∞', color: '#64bcb6', accent: '#ddfff0' },
  Starforge: { symbol: '⚒', color: '#d07955', accent: '#fff0a0' },
  Eventide: { symbol: '☾', color: '#555b93', accent: '#efcef4' },
  'Astral Bloom': { symbol: '✿', color: '#bc78bb', accent: '#ffe4ff' },
  Genesis: { symbol: '✧', color: '#9ad05e', accent: '#fff7a5' },
  Eternity: { symbol: '∞', color: '#79b7d0', accent: '#e2fff9' },
  Paradox: { symbol: '⧖', color: '#bd72ca', accent: '#ffe0ff' },
  Multiverse: { symbol: '✺', color: '#7da8d4', accent: '#f4d2ff' },
  Omniscient: { symbol: '◉', color: '#d0a84f', accent: '#fff7b8' },
  Ascension: { symbol: '⇧', color: '#8bca85', accent: '#f1ffc1' },
  Dimension: { symbol: '▧', color: '#9276c5', accent: '#e9d6ff' },
  Quantum: { symbol: '⌘', color: '#62c6bb', accent: '#fff2a5' },
  Dragon: { symbol: '🐉', color: '#c45e3b', accent: '#ffdf83' }
};

const gachas = [
  { id: 'copper', name: 'Copper', cost: 100, tier: 'STARTER SERIES', description: 'A first step into the orb market. Every rarity is in play.', odds: [50, 25, 12.5, 6.25, 3.125, 1.5, 1, .625] },
  { id: 'iron', name: 'Iron', cost: 1000, tier: 'FOR THE DEDICATED', description: 'Better odds for the rarities worth chasing.', odds: [45, 25, 12, 7, 4, 4, 2, 1] },
  { id: 'gold', name: 'Gold', cost: 5000, tier: 'MARKET FAVORITE', description: 'A balanced roll with a real chance at the top tiers.', odds: [40, 22.5, 10, 8, 7, 6, 5, 1.5] },
  { id: 'silver', name: 'Silver', cost: 10000, tier: 'HIGHER STAKES', description: 'Epic finds and above are starting to feel closer.', odds: [35, 20, 10, 10, 7.5, 6.5, 6, 5] },
  { id: 'platinum', name: 'Platinum', cost: 25000, tier: 'PREMIUM SERIES', description: 'A refined mix, with a stronger pull toward rare finds.', odds: [25, 20, 7.5, 10, 12.5, 12.5, 7.5, 5] },
  { id: 'diamond', name: 'Diamond', cost: 50000, tier: 'BRILLIANT ODDS', description: 'Rare is common here. The biggest finds still take luck.', odds: [20, 20, 20, 10, 12, 7, 6, 5] },
  { id: 'iridium', name: 'Iridium', cost: 100000, tier: 'ULTRA SERIES', description: 'The odds lean hard toward transcendent and mythic orbs.', odds: [2, 4, 6, 10, 18, 20, 25, 15] },
  { id: 'bigBang', name: 'Big Bang', cost: 1000000, tier: 'ENDGAME SERIES', description: 'No common, uncommon, or rare pulls. Just cosmic stakes.', odds: [0, 0, 0, 1, 2, 12, 40, 45] },
  { id: 'commonOnly', name: 'Common Only', cost: 150, tier: 'RARITY LOCKED', description: 'Every roll is guaranteed to be Common.', odds: [100, 0, 0, 0, 0, 0, 0, 0] },
  { id: 'uncommonOnly', name: 'Uncommon Only', cost: 350, tier: 'RARITY LOCKED', description: 'Every roll is guaranteed to be Uncommon.', odds: [0, 100, 0, 0, 0, 0, 0, 0] },
  { id: 'rareOnly', name: 'Rare Only', cost: 800, tier: 'RARITY LOCKED', description: 'Every roll is guaranteed to be Rare.', odds: [0, 0, 100, 0, 0, 0, 0, 0] },
  { id: 'epicOnly', name: 'Epic Only', cost: 10000, tier: 'RARITY LOCKED', description: 'Every roll is guaranteed to be Epic.', odds: [0, 0, 0, 100, 0, 0, 0, 0] },
  { id: 'legendaryOnly', name: 'Legendary Only', cost: 40000, tier: 'RARITY LOCKED', description: 'Every roll is guaranteed to be Legendary.', odds: [0, 0, 0, 0, 100, 0, 0, 0] },
  { id: 'mythicOnly', name: 'Mythic Only', cost: 100000, tier: 'RARITY LOCKED', description: 'Every roll is guaranteed to be Mythic.', odds: [0, 0, 0, 0, 0, 100, 0, 0] },
  { id: 'transcendentOnly', name: 'Transcendent Only', cost: 300000, tier: 'RARITY LOCKED', description: 'Every roll is guaranteed to be Transcendent.', odds: [0, 0, 0, 0, 0, 0, 100, 0] }
];

const npcTrades = [
  { npc: 'Moss', title: 'The Tinker', note: 'A little pile of plain orbs for something with more spark.', give: 'common', count: 3, get: 'uncommon', color: '#d2a968' },
  { npc: 'Sable', title: 'The Sifter', note: 'Two useful finds for one with a sharper edge.', give: 'uncommon', count: 2, get: 'rare', color: '#78c8a7' },
  { npc: 'Juno', title: 'The Gemkeeper', note: 'Rare things catch my eye. Bring me a pair.', give: 'rare', count: 2, get: 'epic', color: '#7ea9e5' },
  { npc: 'Orin', title: 'The Archivist', note: 'I will trade old stories for a legendary discovery.', give: 'epic', count: 2, get: 'legendary', color: '#bd91df' },
  { npc: 'Vela', title: 'The Astronomer', note: 'Two legendary lights for a mythic one.', give: 'legendary', count: 2, get: 'mythic', color: '#e5b95b' },
  { npc: 'Unit-8', title: 'The Broker', note: 'Mythic energy can be refined into something transcendent.', give: 'mythic', count: 2, get: 'transcendent', color: '#72cfc7' },
  { npc: 'Wayfarer', title: 'Beyond the Veil', note: 'Two transcendent orbs. One impossible prize.', give: 'transcendent', count: 2, get: 'oneOfAKind', color: '#efe0a0' },
  { npc: 'Midas', title: 'The Gem Broker', note: 'Trade me one unlocked One of a Kind orb for five Mystic Gems.', give: 'oneOfAKind', count: 1, reward: { gems: 5 }, color: '#a9ddff' }
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
const mysticGemDropChance = .01;
const moneyBoostPerGem = .0001;
const mythicPityLimit = 40;
const initialCoins = 5000;
const saveKey = 'orbTradingSaveV1';
const reducedMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
const ambientMusic = {
  context: null,
  masterGain: null,
  intervalId: null,
  isPlaying: false,
  turnOn() {
    if (!('AudioContext' in window) || reducedMotionMedia.matches) return false;
    if (!this.context) {
      this.context = new AudioContext();
      this.masterGain = this.context.createGain();
      this.masterGain.gain.value = 0;
      this.masterGain.connect(this.context.destination);
    }
    if (this.context.state === 'suspended') this.context.resume();
    this.masterGain.gain.cancelScheduledValues(this.context.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(.05, this.context.currentTime + .8);
    this.isPlaying = true;
    this.scheduleNextNote();
    return true;
  },
  turnOff() {
    if (!this.context || !this.masterGain) return;
    const { context, masterGain } = this;
    const now = context.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.linearRampToValueAtTime(0, now + .6);
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.isPlaying = false;
    window.setTimeout(() => context.suspend(), 700);
  },
  scheduleNextNote() {
    if (!this.context || !this.masterGain || !this.isPlaying) return;
    clearInterval(this.intervalId);
    const melody = [220, 277.18, 329.63, 277.18, 246.94, 196, 220, 293.66, 329.63, 293.66, 246.94, 196];
    let noteIndex = 0;
    this.intervalId = window.setInterval(() => {
      if (!this.isPlaying) return;
      const baseFrequency = melody[noteIndex % melody.length];
      const chord = [baseFrequency, baseFrequency * 1.25, baseFrequency * 1.5];
      const start = this.context.currentTime;
      const gain = this.context.createGain();
      const filter = this.context.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1400;
      filter.Q.value = .2;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(.021, start + .25);
      gain.gain.exponentialRampToValueAtTime(.0001, start + 2.4);
      chord.forEach((frequency, index) => {
        const oscillator = this.context.createOscillator();
        oscillator.type = index === 0 ? 'sine' : 'triangle';
        oscillator.frequency.setValueAtTime(frequency, start);
        oscillator.connect(filter);
        oscillator.start(start);
        oscillator.stop(start + 2.3);
      });
      filter.connect(gain);
      gain.connect(this.masterGain);
      noteIndex += 1;
    }, 1500);
  }
};
const elements = {
  balance: document.getElementById('coin-balance'),
  mysticGemBalance: document.getElementById('mystic-gem-balance'),
  musicToggle: document.getElementById('music-toggle'),
  gachaCount: document.getElementById('gacha-count'),
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
  pityCount: document.getElementById('pity-count'),
  pityTrack: document.getElementById('pity-track'),
  pityFill: document.getElementById('pity-fill'),
  inventoryGrid: document.getElementById('inventory-grid'),
  inventoryEmpty: document.getElementById('inventory-empty'),
  inventoryCount: document.getElementById('inventory-count'),
  journalDialog: document.getElementById('journal-dialog'),
  journalProgressCount: document.getElementById('journal-progress-count'),
  journalProgressPercent: document.getElementById('journal-progress-percent'),
  journalProgressTrack: document.getElementById('journal-progress-track'),
  journalProgressFill: document.getElementById('journal-progress-fill'),
  journalMessage: document.getElementById('journal-message'),
  journalMilestoneList: document.getElementById('journal-milestone-list'),
  journalRarities: document.getElementById('journal-rarities'),
  dailyContractList: document.getElementById('daily-contract-list'),
  dailyResetLabel: document.getElementById('daily-reset-label'),
  expeditionBoardStatus: document.getElementById('expedition-board-status'),
  expeditionDialog: document.getElementById('expedition-dialog'),
  expeditionTeamPower: document.getElementById('expedition-team-power'),
  expeditionTeamSelects: Array.from(document.querySelectorAll('[data-expedition-slot]')),
  expeditionList: document.getElementById('expedition-list'),
  expeditionMessage: document.getElementById('expedition-message'),
  skillTreeDialog: document.getElementById('skill-tree-dialog'),
  skillGemBalance: document.getElementById('skill-gem-balance'),
  skillBranches: document.getElementById('skill-branches'),
  skillTreeMessage: document.getElementById('skill-tree-message'),
  sellAllPreview: document.getElementById('sell-all-preview'),
  tradeList: document.getElementById('trade-list'),
  tradeCount: document.getElementById('trade-count'),
  tradeMessage: document.getElementById('trade-message'),
  tradingDialog: document.getElementById('trading-dialog'),
  stockDialog: document.getElementById('stock-dialog'),
  stockList: document.getElementById('stock-list'),
  stockCountdown: document.getElementById('stock-countdown'),
  stockMessage: document.getElementById('stock-message'),
  boostDialog: document.getElementById('boost-dialog'),
  boostGemBalance: document.getElementById('boost-gem-balance'),
  boostCurrentRate: document.getElementById('boost-current-rate'),
  boostLevel: document.getElementById('boost-level'),
  buyMoneyBoost: document.getElementById('buy-money-boost'),
  boostMessage: document.getElementById('boost-message'),
  sellAll: document.getElementById('sell-all'),
  lastPull: document.getElementById('last-pull-content'),
  pullNumber: document.getElementById('pull-number'),
  gachaDialog: document.getElementById('gacha-dialog'),
  gachaOptions: document.getElementById('gacha-options'),
  resetDialog: document.getElementById('reset-dialog')
};

let state = loadGame();
let selectedGacha = gachas.find(gacha => gacha.id === state.selectedGacha) || gachas[0];
let expeditionTeamSelection = [null, null, null];
let isRolling = false;
let rollAnimationId = 0;

function formatCoins(value) {
  return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

function getUtcDay() {
  return new Date().toISOString().slice(0, 10);
}

function createDailyContracts(discoveredCount = 0) {
  const available = dailyContractTemplates.filter(contract => contract.event !== 'discover' || discoveredCount < knownOrbNames.size);
  const day = getUtcDay();
  let randomSeed = 0;
  for (const character of day) randomSeed = (randomSeed * 31 + character.charCodeAt(0)) >>> 0;
  const nextRandom = () => {
    randomSeed = (1664525 * randomSeed + 1013904223) >>> 0;
    return randomSeed / 0x100000000;
  };
  for (let index = available.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(nextRandom() * (index + 1));
    [available[index], available[swapIndex]] = [available[swapIndex], available[index]];
  }
  return {
    day,
    offers: available.slice(0, 3).map(contract => ({ ...contract, progress: 0, claimed: false }))
  };
}

function restoreDailyContracts(savedContracts, discoveredCount) {
  if (savedContracts?.day === getUtcDay() && Array.isArray(savedContracts.offers) && savedContracts.offers.length === 3) {
    const offers = savedContracts.offers.filter(offer => dailyContractTemplates.some(template => template.id === offer.id));
    if (offers.length === 3) {
      return {
        day: savedContracts.day,
        offers: offers.map(offer => ({ ...dailyContractTemplates.find(template => template.id === offer.id), progress: Math.min(dailyContractTemplates.find(template => template.id === offer.id).target, Math.max(0, Number(offer.progress) || 0)), claimed: offer.claimed === true }))
      };
    }
  }
  return createDailyContracts(discoveredCount);
}

function advanceDailyContracts(event, amount = 1) {
  const completed = [];
  state.dailyContracts.offers.forEach(offer => {
    if (offer.event !== event || offer.claimed) return;
    offer.progress = Math.min(offer.target, offer.progress + amount);
    if (offer.progress < offer.target) return;
    offer.claimed = true;
    state.coins += offer.reward.coins || 0;
    state.mysticGems += offer.reward.gems || 0;
    completed.push(offer);
  });
  return completed;
}

function getSkillRank(branch) {
  return skillTreeNodes.filter(node => node.branch === branch && state.unlockedSkills.includes(node.id)).length;
}

function getExpeditionDurationMs(destination) {
  return Math.ceil(destination.durationMs * (1 - getSkillRank('explorer') * .1));
}

function getSalePayout(baseAmount) {
  const saleBonus = getSkillRank('market') * .05;
  return Math.round(baseAmount * (1 + state.moneyBoosts * moneyBoostPerGem + saleBonus) * 100) / 100;
}

function rollMysticGems(orbCount) {
  let earned = 0;
  const dropChance = mysticGemDropChance + getSkillRank('fortune') * .005;
  for (let index = 0; index < orbCount; index += 1) {
    if (Math.random() < dropChance) earned += 1;
  }
  state.mysticGems += earned;
  return earned;
}

function applySale(baseAmount, orbCount, rareOrbCount = 0) {
  const payout = getSalePayout(baseAmount);
  const gems = rollMysticGems(orbCount);
  state.coins = Math.round((state.coins + payout) * 100) / 100;
  advanceDailyContracts('sell', orbCount);
  advanceDailyContracts('sellRare', rareOrbCount);
  return { payout, gems };
}

function getOrbPrice(rarity, orbName) {
  return (orbSellPrices[orbName] ?? rarity.sell) * (rarity.sellMultiplier || 1);
}

function getStockPrice(rarity, orbName) {
  return Math.floor(getOrbPrice(rarity, orbName) * .75);
}

function isOrbLocked(name) {
  return state.lockedOrbs.includes(name);
}

function getUnlockedSalePreview() {
  const unlocked = state.inventory.filter(item => !isOrbLocked(item.name));
  const total = unlocked.reduce((sum, item) => {
    const rarity = rarities.find(entry => entry.id === item.rarity);
    return sum + (rarity ? getOrbPrice(rarity, item.name) : 0);
  }, 0);
  return { count: unlocked.length, payout: getSalePayout(total) };
}

function createEmptyStock() {
  return Object.fromEntries(rarities.flatMap(rarity => rarity.orbs.map(name => [name, false])));
}

function getRegularOrbs(rarity) {
  return rarity.orbs.filter(name => !expeditionExclusiveOrbs.has(name));
}

function generateStock() {
  const stock = createEmptyStock();
  rarities.filter(rarity => rarity.id !== 'oneOfAKind').forEach(rarity => {
    getRegularOrbs(rarity).forEach(name => {
      stock[name] = Math.random() < stockOdds[rarity.id];
    });
  });
  if (Math.random() < stockOdds.oneOfAKind) {
    const uniqueOrb = rollOneOfAKind();
    stock[uniqueOrb] = true;
  }
  return stock;
}

function createOrbToken(name, rarity) {
  const art = orbArt[name] || { symbol: '✦', color: rarity.color, accent: '#ffffff' };
  const token = document.createElement('span');
  token.className = `orb-token${name === 'Storm' ? ' orb-token--storm' : ''}${rarity.id === 'mythic' ? ' orb-token--mythic' : ''}${rarity.id === 'transcendent' ? ' orb-token--transcendent' : ''}${rarity.id === 'oneOfAKind' ? ' orb-token--one-of-a-kind' : ''}${name === 'Flame and Frost' ? ' orb-token--flame-frost' : ''}`;
  token.style.setProperty('--orb-color', art.color);
  token.style.setProperty('--orb-accent', art.accent);
  token.setAttribute('aria-hidden', 'true');
  const symbol = document.createElement('span');
  symbol.className = 'orb-symbol';
  symbol.textContent = art.symbol;
  token.append(symbol);
  return token;
}

function createPityCounts(savedCounts = {}) {
  return Object.fromEntries(gachas.map(gacha => {
    const count = Math.floor(Number(savedCounts[gacha.id]) || 0);
    return [gacha.id, Math.max(0, Math.min(mythicPityLimit, count))];
  }));
}

function restoreActiveExpedition(savedExpedition) {
  const destination = expeditionDestinations.find(entry => entry.id === savedExpedition?.destinationId);
  if (!destination || !Number.isFinite(savedExpedition.returnAt) || !Array.isArray(savedExpedition.team) || savedExpedition.team.length !== 3) return null;
  const team = savedExpedition.team.map(item => {
    const rarity = rarities.find(entry => entry.id === item?.rarity && entry.orbs.includes(item?.name));
    return rarity ? { name: item.name, rarity: rarity.id, gacha: typeof item.gacha === 'string' ? item.gacha : '' } : null;
  });
  return team.every(Boolean) ? { destinationId: destination.id, team, returnAt: savedExpedition.returnAt } : null;
}

function restoreUnlockedSkills(savedSkills) {
  const saved = new Set(Array.isArray(savedSkills) ? savedSkills : []);
  const unlocked = [];
  skillTreeNodes.forEach(node => {
    if (saved.has(node.id) && (!node.prerequisite || unlocked.includes(node.prerequisite))) unlocked.push(node.id);
  });
  return unlocked;
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
      const inventory = saved.inventory.filter(item => item && typeof item.name === 'string' && typeof item.rarity === 'string');
      const lockedOrbs = Array.isArray(saved.lockedOrbs) ? [...new Set(saved.lockedOrbs.filter(name => knownOrbNames.has(name)))] : [];
      const discoveredOrbs = new Set(Array.isArray(saved.discoveredOrbs) ? saved.discoveredOrbs.filter(name => knownOrbNames.has(name)) : []);
      inventory.forEach(item => { if (knownOrbNames.has(item.name)) discoveredOrbs.add(item.name); });
      if (saved.lastPull && knownOrbNames.has(saved.lastPull.name)) discoveredOrbs.add(saved.lastPull.name);
      const dailyContracts = restoreDailyContracts(saved.dailyContracts, discoveredOrbs.size);
      const pityCounts = createPityCounts(saved.pityCounts);
      return {
        coins: Math.max(0, saved.coins),
        inventory,
        lockedOrbs,
        rolls: Math.max(0, Number(saved.rolls) || 0),
        tradeCount: Math.max(0, Number(saved.tradeCount) || 0),
        mysticGems: Math.max(0, Math.floor(Number(saved.mysticGems) || 0)),
        moneyBoosts: Math.max(0, Math.floor(Number(saved.moneyBoosts) || 0)),
        discoveredOrbs: [...discoveredOrbs],
        claimedJournalMilestones: Array.isArray(saved.claimedJournalMilestones) ? saved.claimedJournalMilestones.filter(id => journalMilestones.some(milestone => milestone.id === id)) : [],
        dailyContracts,
        pityCounts,
        animateRolls: saved.animateRolls !== false,
        stock,
        stockRefreshAt: Number.isFinite(saved.stockRefreshAt) ? saved.stockRefreshAt : Date.now() + stockCycleMs,
        lastPull: saved.lastPull || null,
        activeExpedition: restoreActiveExpedition(saved.activeExpedition),
        unlockedSkills: restoreUnlockedSkills(saved.unlockedSkills),
        selectedGacha: saved.selectedGacha || 'copper'
      };
    }
  } catch (error) {
    console.warn('Could not load Orb Trading save.', error);
  }
  return { coins: initialCoins, inventory: [], lockedOrbs: [], rolls: 0, tradeCount: 0, mysticGems: 0, moneyBoosts: 0, discoveredOrbs: [], claimedJournalMilestones: [], dailyContracts: createDailyContracts(), pityCounts: createPityCounts(), animateRolls: true, stock: generateStock(), stockRefreshAt: Date.now() + stockCycleMs, lastPull: null, activeExpedition: null, unlockedSkills: [], selectedGacha: 'copper' };
}

function saveGame() {
  try {
    localStorage.setItem(saveKey, JSON.stringify(state));
  } catch (error) {
    elements.rollMessage.textContent = 'Save unavailable in this browser.';
    elements.rollMessage.classList.add('error');
  }
}

function getDisplayRarityOdds(gacha) {
  return rarities
    .map((rarity, index) => ({ rarity, chance: gacha.odds[index] }))
    .filter(({ chance }) => chance > 0);
}

function renderOdds() {
  elements.oddsList.replaceChildren();
  getDisplayRarityOdds(selectedGacha).forEach(({ rarity, chance }) => {
    const row = document.createElement('div');
    row.className = 'odds-item';
    const label = document.createElement('span');
    label.textContent = `${rarity.short} · ${rarity.name}`;
    const chanceValue = document.createElement('strong');
    chanceValue.textContent = `${chance}%`;
    row.append(label, chanceValue);
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
  const salePreview = getUnlockedSalePreview();
  elements.sellAll.disabled = salePreview.count === 0;
  elements.sellAllPreview.textContent = `${salePreview.count} unlocked · ¢ ${formatCoins(salePreview.payout)}`;

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
    const locked = isOrbLocked(item.name);
    const details = document.createElement('div');
    details.className = 'orb-details';
    const title = document.createElement('h4');
    title.textContent = item.name;
    const rarityLabel = document.createElement('p');
    rarityLabel.textContent = `${rarity.short} · ${rarity.name} · ×${item.count}${locked ? ' · LOCKED' : ''}`;
    details.append(title, rarityLabel);
    const actions = document.createElement('div');
    actions.className = 'orb-actions';
    const value = document.createElement('span');
    const unitPrice = getOrbPrice(rarity, item.name);
    value.className = 'orb-value';
    value.textContent = `¢ ${formatCoins(unitPrice * item.count)}`;
    const lock = document.createElement('button');
    lock.type = 'button';
    lock.className = `lock-button${locked ? ' is-locked' : ''}`;
    lock.textContent = locked ? 'Unlock' : 'Lock';
    lock.setAttribute('aria-pressed', String(locked));
    lock.setAttribute('aria-label', `${locked ? 'Unlock' : 'Lock'} all ${item.name} orbs`);
    lock.addEventListener('click', () => toggleOrbLock(item.name));
    const sell = document.createElement('button');
    sell.type = 'button';
    sell.className = 'sell-button';
    sell.disabled = locked;
    sell.textContent = locked ? 'Locked' : `Sell ×${item.count}`;
    sell.setAttribute('aria-label', `Sell ${item.count} ${item.name} orb${item.count === 1 ? '' : 's'} for ${formatCoins(unitPrice * item.count)} coins`);
    sell.addEventListener('click', () => sellOrb(item.rarity, item.name));
    actions.append(value, lock, sell);
    card.append(token, details, actions);
    elements.inventoryGrid.append(card);
  });
}

function renderJournal() {
  const discovered = new Set(state.discoveredOrbs);
  const discoveredCount = discovered.size;
  const progress = Math.round(discoveredCount / knownOrbNames.size * 100);
  elements.journalProgressCount.textContent = `${discoveredCount} / ${knownOrbNames.size}`;
  elements.journalProgressPercent.textContent = `${progress}%`;
  elements.journalProgressTrack.setAttribute('aria-valuenow', discoveredCount);
  elements.journalProgressFill.style.width = `${progress}%`;

  elements.journalMilestoneList.replaceChildren();
  journalMilestones.forEach(milestone => {
    const claimed = state.claimedJournalMilestones.includes(milestone.id);
    const item = document.createElement('div');
    item.className = `journal-milestone${claimed ? ' journal-milestone-claimed' : ''}`;
    const goal = document.createElement('strong');
    goal.textContent = `${milestone.total} orbs`;
    const reward = document.createElement('span');
    reward.textContent = `✧ ${milestone.gems} Mystic Gem${milestone.gems === 1 ? '' : 's'}`;
    const status = document.createElement('span');
    status.textContent = claimed ? 'CLAIMED' : `${Math.min(discoveredCount, milestone.total)}/${milestone.total}`;
    item.append(goal, reward, status);
    elements.journalMilestoneList.append(item);
  });

  elements.journalRarities.replaceChildren();
  rarities.forEach(rarity => {
    const section = document.createElement('section');
    section.className = 'journal-rarity';
    const header = document.createElement('div');
    header.className = 'journal-rarity-header';
    const title = document.createElement('h3');
    title.textContent = rarity.name;
    const rarityDiscovered = rarity.orbs.filter(name => discovered.has(name)).length;
    const count = document.createElement('span');
    count.textContent = `${rarityDiscovered}/${rarity.orbs.length}`;
    header.append(title, count);

    const grid = document.createElement('div');
    grid.className = 'journal-orb-grid';
    rarity.orbs.forEach(name => {
      const found = discovered.has(name);
      const card = document.createElement('article');
      card.className = `journal-orb${found ? ' journal-orb-found' : ' journal-orb-hidden'}`;
      const icon = found ? createOrbToken(name, rarity) : document.createElement('span');
      if (!found) {
        icon.className = 'journal-silhouette';
        icon.textContent = '?';
        icon.setAttribute('aria-label', `Undiscovered ${rarity.name} orb`);
      }
      const details = document.createElement('div');
      details.className = 'journal-orb-details';
      const orbName = document.createElement('strong');
      orbName.textContent = found ? name : '???';
      const info = document.createElement('span');
      info.textContent = found ? `DISCOVERED · ¢ ${formatCoins(getOrbPrice(rarity, name))}` : 'UNDISCOVERED';
      details.append(orbName, info);
      card.append(icon, details);
      grid.append(card);
    });

    section.append(header, grid);
    elements.journalRarities.append(section);
  });
}

function renderDailyContracts() {
  elements.dailyContractList.replaceChildren();
  state.dailyContracts.offers.forEach(offer => {
    const card = document.createElement('article');
    card.className = `daily-contract${offer.claimed ? ' daily-contract-complete' : ''}`;
    const heading = document.createElement('div');
    heading.className = 'daily-contract-heading';
    const title = document.createElement('strong');
    title.textContent = offer.title;
    const reward = document.createElement('span');
    reward.textContent = [offer.reward.coins ? `¢ ${formatCoins(offer.reward.coins)}` : '', offer.reward.gems ? `✧ ${offer.reward.gems}` : ''].filter(Boolean).join(' + ');
    heading.append(title, reward);
    const description = document.createElement('p');
    description.textContent = offer.description;
    const track = document.createElement('div');
    track.className = 'daily-contract-track';
    const fill = document.createElement('span');
    fill.style.width = `${offer.progress / offer.target * 100}%`;
    track.append(fill);
    const status = document.createElement('span');
    status.className = 'daily-contract-status';
    status.textContent = offer.claimed ? 'COMPLETE' : `${offer.progress} / ${offer.target}`;
    card.append(heading, description, track, status);
    elements.dailyContractList.append(card);
  });
}

function updateDailyContractDay() {
  if (state.dailyContracts.day === getUtcDay()) return;
  state.dailyContracts = createDailyContracts(state.discoveredOrbs.length);
  saveGame();
  render();
}

function claimJournalMilestones() {
  const rewards = [];
  journalMilestones.forEach(milestone => {
    if (state.discoveredOrbs.length < milestone.total || state.claimedJournalMilestones.includes(milestone.id)) return;
    state.claimedJournalMilestones.push(milestone.id);
    state.mysticGems += milestone.gems;
    rewards.push(milestone);
  });
  if (rewards.length > 0) {
    const gemsEarned = rewards.reduce((total, milestone) => total + milestone.gems, 0);
    elements.journalMessage.textContent = `Collection milestone reached: +${gemsEarned} Mystic Gem${gemsEarned === 1 ? '' : 's'}.`;
  }
  return rewards;
}

function recordOrbDiscovery(name) {
  if (!knownOrbNames.has(name) || state.discoveredOrbs.includes(name)) return [];
  state.discoveredOrbs.push(name);
  const rewards = claimJournalMilestones();
  advanceDailyContracts('discover');
  return rewards;
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
    const stockOrbs = getRegularOrbs(rarity);
    const availableCount = stockOrbs.filter(name => state.stock[name]).length;
    const count = document.createElement('span');
    count.textContent = `${availableCount}/${stockOrbs.length} IN STOCK`;
    header.append(title, count);
    const grid = document.createElement('div');
    grid.className = 'stock-items';

    stockOrbs.forEach(name => {
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
    const getRarity = trade.get ? rarities.find(rarity => rarity.id === trade.get) : null;
    const owned = state.inventory.filter(item => item.rarity === trade.give && !isOrbLocked(item.name)).length;
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
    receiveValue.style.setProperty('--trade-color', getRarity?.color || '#a9ddff');
    receiveValue.textContent = trade.reward?.gems
      ? `${trade.reward.gems} Mystic Gems`
      : `1 ${getRarity.name}`;
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

function getExpeditionPower(team) {
  return team.reduce((power, item) => power + Math.max(0, rarities.findIndex(rarity => rarity.id === item.rarity) + 1), 0);
}

function formatExpeditionCountdown(milliseconds) {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

function renderExpeditions() {
  const active = state.activeExpedition;
  const remaining = active ? Math.max(0, active.returnAt - Date.now()) : 0;
  elements.expeditionBoardStatus.textContent = active
    ? remaining > 0 ? `IN FLIGHT · ${formatExpeditionCountdown(remaining)}` : 'READY TO CLAIM'
    : '3 DESTINATIONS';

  elements.expeditionTeamSelects.forEach((select, slot) => {
    let selected = expeditionTeamSelection[slot];
    if (selected && (!state.inventory.includes(selected) || isOrbLocked(selected.name))) {
      expeditionTeamSelection[slot] = null;
      selected = null;
    }
    const selectedElsewhere = new Set(expeditionTeamSelection.filter((item, index) => index !== slot && item));
    select.replaceChildren();
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Choose an orb';
    select.append(placeholder);
    state.inventory.forEach((item, index) => {
      if (isOrbLocked(item.name) || (selectedElsewhere.has(item) && item !== selected)) return;
      const rarity = rarities.find(entry => entry.id === item.rarity);
      if (!rarity) return;
      const option = document.createElement('option');
      option.value = String(index);
      option.textContent = `${item.name} · ${rarity.name}`;
      select.append(option);
    });
    select.value = selected ? String(state.inventory.indexOf(selected)) : '';
    select.disabled = Boolean(active);
  });

  const team = expeditionTeamSelection.filter(item => item && state.inventory.includes(item) && !isOrbLocked(item.name));
  const teamPower = getExpeditionPower(team);
  elements.expeditionTeamPower.textContent = `${team.length} / 3 ORBS · POWER ${teamPower}`;
  if (active) {
    const destination = expeditionDestinations.find(entry => entry.id === active.destinationId);
    elements.expeditionMessage.textContent = remaining > 0
      ? `Your team is exploring ${destination.name}. Return in ${formatExpeditionCountdown(remaining)}.`
      : `${destination.name} is complete. Claim the rewards to bring your team home.`;
  }

  elements.expeditionList.replaceChildren();
  expeditionDestinations.forEach(destination => {
    const isActive = active?.destinationId === destination.id;
    const isReturning = isActive && remaining > 0;
    const rewardRarity = rarities.find(rarity => rarity.id === destination.orbRarity);
    const card = document.createElement('article');
    card.className = `expedition-card${isActive ? ' expedition-card-active' : ''}`;
    const heading = document.createElement('div');
    heading.className = 'expedition-card-heading';
    const title = document.createElement('h3');
    title.textContent = destination.name;
    const status = document.createElement('span');
    status.textContent = isActive ? isReturning ? 'IN FLIGHT' : 'READY' : `${formatExpeditionCountdown(getExpeditionDurationMs(destination))} · POWER ${destination.minPower}`;
    heading.append(title, status);
    const description = document.createElement('p');
    description.textContent = destination.description;
    const stats = document.createElement('div');
    stats.className = 'expedition-card-stats';
    const reward = document.createElement('span');
    reward.textContent = `REWARD · ¢ ${formatCoins(destination.coins)}${destination.gems ? ` · ✧ ${destination.gems}` : ''} · ${rewardRarity.name} orb`;
    const exclusiveReward = document.createElement('span');
    exclusiveReward.textContent = `BONUS FIND · ${Math.round(destination.exclusiveChance * 100)}% ${destination.exclusiveOrb}`;
    stats.append(reward, exclusiveReward);
    const action = document.createElement('button');
    action.type = 'button';
    action.className = 'button expedition-action';
    action.disabled = isActive ? isReturning : Boolean(active) || team.length !== 3 || teamPower < destination.minPower;
    action.textContent = isActive
      ? isReturning ? `Returns in ${formatExpeditionCountdown(remaining)}` : 'Claim rewards'
      : active ? 'Team away' : team.length !== 3 ? 'Select three orbs' : teamPower < destination.minPower ? `Need ${destination.minPower - teamPower} more power` : 'Start expedition';
    action.addEventListener('click', () => isActive ? claimExpedition() : startExpedition(destination.id));
    card.append(heading, description, stats, action);
    elements.expeditionList.append(card);
  });
}

function startExpedition(destinationId) {
  const destination = expeditionDestinations.find(entry => entry.id === destinationId);
  const team = expeditionTeamSelection.filter(Boolean);
  if (!destination || state.activeExpedition || team.length !== 3 || new Set(team).size !== 3 || team.some(item => !state.inventory.includes(item) || isOrbLocked(item.name))) return;
  const teamPower = getExpeditionPower(team);
  if (teamPower < destination.minPower) return;
  const reservedTeam = team.map(item => ({ ...item }));
  team.map(item => state.inventory.indexOf(item)).sort((left, right) => right - left).forEach(index => state.inventory.splice(index, 1));
  state.activeExpedition = { destinationId, team: reservedTeam, returnAt: Date.now() + getExpeditionDurationMs(destination) };
  expeditionTeamSelection = [null, null, null];
  saveGame();
  render();
}

function claimExpedition() {
  const active = state.activeExpedition;
  const destination = expeditionDestinations.find(entry => entry.id === active?.destinationId);
  if (!active || !destination || Date.now() < active.returnAt) return;
  const rarity = rarities.find(entry => entry.id === destination.orbRarity);
  const orbName = getRegularOrbs(rarity)[Math.floor(Math.random() * getRegularOrbs(rarity).length)];
  const foundExclusive = Math.random() < destination.exclusiveChance;
  state.inventory.push(...active.team, { name: orbName, rarity: rarity.id, gacha: 'Expedition' });
  if (foundExclusive) {
    const exclusiveRarity = rarities.find(entry => entry.orbs.includes(destination.exclusiveOrb));
    state.inventory.push({ name: destination.exclusiveOrb, rarity: exclusiveRarity.id, gacha: 'Expedition' });
  }
  state.coins = Math.round((state.coins + destination.coins) * 100) / 100;
  state.mysticGems += destination.gems;
  state.activeExpedition = null;
  expeditionTeamSelection = [null, null, null];
  recordOrbDiscovery(orbName);
  if (foundExclusive) recordOrbDiscovery(destination.exclusiveOrb);
  advanceDailyContracts('expedition');
  saveGame();
  render();
  elements.expeditionMessage.textContent = `Team returned from ${destination.name} with ${orbName}${foundExclusive ? ` and the exclusive ${destination.exclusiveOrb}` : ''}, ¢ ${formatCoins(destination.coins)}, and ${destination.gems} Mystic Gems.`;
}

function updateExpeditionCountdown() {
  if (elements.expeditionDialog.open) renderExpeditions();
  else if (state.activeExpedition) {
    const remaining = Math.max(0, state.activeExpedition.returnAt - Date.now());
    elements.expeditionBoardStatus.textContent = remaining > 0 ? `IN FLIGHT · ${formatExpeditionCountdown(remaining)}` : 'READY TO CLAIM';
  }
}

function renderSkillTree() {
  elements.skillGemBalance.textContent = state.mysticGems;
  elements.skillBranches.replaceChildren();
  skillBranches.forEach(branch => {
    const section = document.createElement('section');
    section.className = 'skill-branch';
    const heading = document.createElement('div');
    heading.className = 'skill-branch-heading';
    const title = document.createElement('h3');
    title.textContent = branch.name;
    const description = document.createElement('p');
    description.textContent = branch.description;
    heading.append(title, description);
    section.append(heading);

    skillTreeNodes.filter(node => node.branch === branch.id).forEach(node => {
      const unlocked = state.unlockedSkills.includes(node.id);
      const prerequisite = node.prerequisite && skillTreeNodes.find(entry => entry.id === node.prerequisite);
      const prerequisiteMet = !prerequisite || state.unlockedSkills.includes(prerequisite.id);
      const card = document.createElement('article');
      card.className = `skill-node${unlocked ? ' skill-node-unlocked' : prerequisiteMet ? ' skill-node-ready' : ''}`;
      const nodeHeading = document.createElement('div');
      nodeHeading.className = 'skill-node-heading';
      const nodeTitle = document.createElement('h4');
      nodeTitle.textContent = node.title;
      const level = document.createElement('span');
      level.textContent = `TIER ${node.level}`;
      nodeHeading.append(nodeTitle, level);
      const nodeDescription = document.createElement('p');
      nodeDescription.textContent = node.description;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'skill-node-button';
      button.disabled = unlocked || !prerequisiteMet || state.mysticGems < node.cost;
      button.textContent = unlocked
        ? 'UNLOCKED'
        : !prerequisiteMet
          ? `Requires ${prerequisite.title}`
          : `Unlock · ${node.cost} Mystic Gems`;
      button.addEventListener('click', () => unlockSkill(node.id));
      card.append(nodeHeading, nodeDescription, button);
      section.append(card);
    });
    elements.skillBranches.append(section);
  });
}

function unlockSkill(nodeId) {
  const node = skillTreeNodes.find(entry => entry.id === nodeId);
  if (!node || state.unlockedSkills.includes(node.id)) return;
  if (node.prerequisite && !state.unlockedSkills.includes(node.prerequisite)) return;
  if (state.mysticGems < node.cost) {
    elements.skillTreeMessage.textContent = `You need ${node.cost - state.mysticGems} more Mystic Gem${node.cost - state.mysticGems === 1 ? '' : 's'}.`;
    return;
  }
  state.mysticGems -= node.cost;
  state.unlockedSkills.push(node.id);
  saveGame();
  render();
  elements.skillTreeMessage.textContent = `Unlocked ${node.title}. ${node.description}`;
}

function render() {
  elements.balance.textContent = formatCoins(state.coins);
  elements.mysticGemBalance.textContent = state.mysticGems;
  elements.boostGemBalance.textContent = state.mysticGems;
  elements.boostCurrentRate.textContent = `+${(state.moneyBoosts * .01).toFixed(2)}%`;
  elements.boostLevel.textContent = state.moneyBoosts;
  elements.buyMoneyBoost.disabled = state.mysticGems < 1;
  elements.gachaCount.textContent = gachas.length;
  elements.orbStage.dataset.gacha = selectedGacha.id;
  elements.gachaTitle.textContent = selectedGacha.name;
  elements.gachaTier.textContent = selectedGacha.tier;
  elements.gachaDescription.textContent = selectedGacha.description;
  elements.rollName.textContent = selectedGacha.name;
  elements.rollCost.textContent = formatCoins(selectedGacha.cost);
  elements.rollAnimationToggle.checked = state.animateRolls;
  const pityCount = state.pityCounts[selectedGacha.id] || 0;
  const mythicIndex = rarities.findIndex(rarity => rarity.id === 'mythic');
  const hasMythicPlusOdds = selectedGacha.odds.slice(mythicIndex).some(chance => chance > 0);
  const hasLowerRarityOdds = selectedGacha.odds.slice(0, mythicIndex).some(chance => chance > 0);
  const pityApplies = hasMythicPlusOdds && hasLowerRarityOdds;
  elements.pityCount.textContent = !hasMythicPlusOdds
    ? 'N/A · NO MYTHIC+'
    : !hasLowerRarityOdds
      ? 'ALWAYS MYTHIC+'
      : pityCount >= mythicPityLimit
        ? `${mythicPityLimit} / ${mythicPityLimit} · GUARANTEED NEXT`
        : `${pityCount} / ${mythicPityLimit} MISSES`;
  const displayedPity = pityApplies ? Math.min(pityCount, mythicPityLimit) : 0;
  elements.pityTrack.setAttribute('aria-valuenow', displayedPity);
  elements.pityFill.style.width = `${displayedPity / mythicPityLimit * 100}%`;
  elements.rollButton.disabled = isRolling || state.coins < selectedGacha.cost;
  elements.rollMessage.classList.remove('error');
  elements.rollMessage.textContent = state.coins < selectedGacha.cost
    ? `You need ¢ ${formatCoins(selectedGacha.cost - state.coins)} more to roll this gacha.`
    : 'One roll. One orb. What will you find?';
  renderOdds();
  renderInventory();
  renderJournal();
  renderDailyContracts();
  renderTrades();
  renderExpeditions();
  renderSkillTree();
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
  recordOrbDiscovery(name);
  advanceDailyContracts('buy');
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
  const pityCount = state.pityCounts[selectedGacha.id] || 0;
  const mythicIndex = rarities.findIndex(rarity => rarity.id === 'mythic');
  const eligibleOdds = selectedGacha.odds.slice(mythicIndex);
  const eligibleTotal = eligibleOdds.reduce((total, chance) => total + chance, 0);
  const hasLowerRarityOdds = selectedGacha.odds.slice(0, mythicIndex).some(chance => chance > 0);
  const pityApplies = eligibleTotal > 0 && hasLowerRarityOdds;
  if (pityApplies && pityCount >= mythicPityLimit) {
    const pityRoll = Math.random() * eligibleTotal;
    let eligibleThreshold = 0;
    for (let index = mythicIndex; index < rarities.length; index += 1) {
      eligibleThreshold += selectedGacha.odds[index];
      if (pityRoll < eligibleThreshold) {
        state.pityCounts[selectedGacha.id] = 0;
        return rarities[index];
      }
    }
    state.pityCounts[selectedGacha.id] = 0;
    return rarities[rarities.length - 1];
  }

  const roll = Math.random() * 100;
  let threshold = 0;
  for (let index = 0; index < selectedGacha.odds.length; index += 1) {
    threshold += selectedGacha.odds[index];
    if (roll < threshold) {
      state.pityCounts[selectedGacha.id] = pityApplies && index < mythicIndex ? pityCount + 1 : 0;
      return rarities[index];
    }
  }
  state.pityCounts[selectedGacha.id] = pityApplies ? pityCount + 1 : 0;
  return rarities[rarities.length - 1];
}

function rollOrb(rarity) {
  if (rarity.id === 'oneOfAKind') {
    return rollOneOfAKind();
  }
  const orbs = getRegularOrbs(rarity);
  return orbs[Math.floor(Math.random() * orbs.length)];
}

function rollOneOfAKind() {
  const roll = Math.random();
  if (roll >= .95) return 'Procyon Orb';
  const commonOrbs = rarities.find(rarity => rarity.id === 'oneOfAKind').orbs.filter(name => name !== 'Procyon Orb');
  return commonOrbs[Math.floor(Math.random() * commonOrbs.length)];
}

function makeTrade(tradeIndex) {
  const trade = npcTrades[tradeIndex];
  if (!trade) return;
  const owned = state.inventory.filter(item => item.rarity === trade.give && !isOrbLocked(item.name)).length;
  if (owned < trade.count) return;

  let removed = 0;
  state.inventory = state.inventory.filter(item => {
    if (item.rarity === trade.give && !isOrbLocked(item.name) && removed < trade.count) {
      removed += 1;
      return false;
    }
    return true;
  });

  let rewardDescription;
  if (trade.get) {
    const rewardRarity = rarities.find(rarity => rarity.id === trade.get);
    const rewardName = rollOrb(rewardRarity);
    state.inventory.push({ name: rewardName, rarity: rewardRarity.id, gacha: `Trade with ${trade.npc}` });
    recordOrbDiscovery(rewardName);
    rewardDescription = `${rewardName} · ${rewardRarity.name}`;
  } else if (trade.reward?.gems) {
    state.mysticGems += trade.reward.gems;
    rewardDescription = `${trade.reward.gems} Mystic Gems`;
  } else {
    return;
  }
  state.tradeCount += 1;
  advanceDailyContracts('trade');
  saveGame();
  render();
  elements.tradeMessage.classList.add('trade-message-success');
  elements.tradeMessage.textContent = `${trade.npc} traded your ${trade.count} ${rarities.find(rarity => rarity.id === trade.give).name} orb${trade.count === 1 ? '' : 's'} for ${rewardDescription}!`;
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
      const eligibleRarities = getDisplayRarityOdds(selectedGacha);
      const probabilityTotal = eligibleRarities.reduce((total, { chance }) => total + chance, 0);
      let rarityRoll = Math.random() * probabilityTotal;
      const rarity = eligibleRarities.find(({ chance }) => {
        rarityRoll -= chance;
        return rarityRoll <= 0;
      })?.rarity || eligibleRarities[eligibleRarities.length - 1].rarity;
      const name = rollOrb(rarity);
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
  recordOrbDiscovery(name);
  state.rolls += 1;
  advanceDailyContracts('roll');
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
  if (isOrbLocked(name)) return;
  const matching = state.inventory.filter(item => item.rarity === rarityId && item.name === name);
  if (matching.length === 0) return;
  const rarity = rarities.find(item => item.id === rarityId);
  state.inventory = state.inventory.filter(item => item.rarity !== rarityId || item.name !== name);
  const rareOrbCount = ['mythic', 'transcendent', 'oneOfAKind'].includes(rarityId) ? matching.length : 0;
  const { payout, gems } = applySale(getOrbPrice(rarity, name) * matching.length, matching.length, rareOrbCount);
  saveGame();
  render();
  elements.rollMessage.textContent = `Sold ${matching.length} ${name} orb${matching.length === 1 ? '' : 's'} for ¢ ${formatCoins(payout)}.${gems ? ` Found ${gems} Mystic Gem${gems === 1 ? '' : 's'}!` : ''}`;
}

function sellAll() {
  const unlocked = state.inventory.filter(item => !isOrbLocked(item.name));
  if (unlocked.length === 0) return;
  const soldCount = unlocked.length;
  const rareOrbCount = unlocked.filter(item => ['mythic', 'transcendent', 'oneOfAKind'].includes(item.rarity)).length;
  const total = unlocked.reduce((sum, item) => {
    const rarity = rarities.find(entry => entry.id === item.rarity);
    return sum + (rarity ? getOrbPrice(rarity, item.name) : 0);
  }, 0);
  const { payout, gems } = applySale(total, soldCount, rareOrbCount);
  state.inventory = state.inventory.filter(item => isOrbLocked(item.name));
  saveGame();
  render();
  elements.rollMessage.textContent = `Sold ${soldCount} unlocked orb${soldCount === 1 ? '' : 's'} for ¢ ${formatCoins(payout)}.${gems ? ` Found ${gems} Mystic Gem${gems === 1 ? '' : 's'}!` : ''}`;
}

function toggleOrbLock(name) {
  if (isOrbLocked(name)) state.lockedOrbs = state.lockedOrbs.filter(orbName => orbName !== name);
  else state.lockedOrbs.push(name);
  saveGame();
  render();
}

function buyMoneyBoost() {
  if (state.mysticGems < 1) return;
  state.mysticGems -= 1;
  state.moneyBoosts += 1;
  saveGame();
  render();
  elements.boostMessage.textContent = `Permanent boost purchased. Sale bonus is now +${(state.moneyBoosts * .01).toFixed(2)}%.`;
}

function resetGame() {
  rollAnimationId += 1;
  isRolling = false;
  state = { coins: initialCoins, inventory: [], lockedOrbs: [], rolls: 0, tradeCount: 0, mysticGems: 0, moneyBoosts: 0, unlockedSkills: [], discoveredOrbs: [], claimedJournalMilestones: [], dailyContracts: createDailyContracts(), pityCounts: createPityCounts(), animateRolls: true, stock: generateStock(), stockRefreshAt: Date.now() + stockCycleMs, lastPull: null, activeExpedition: null, selectedGacha: 'copper' };
  selectedGacha = gachas[0];
  saveGame();
  render();
  elements.resetDialog.close();
}

document.getElementById('open-gachas').addEventListener('click', () => elements.gachaDialog.showModal());
document.getElementById('close-gachas').addEventListener('click', () => elements.gachaDialog.close());
function toggleAmbientMusic() {
  const isEnabled = !ambientMusic.isPlaying;
  if (isEnabled) {
    const started = ambientMusic.turnOn();
    if (!started) return;
    elements.musicToggle.classList.add('is-on');
    elements.musicToggle.setAttribute('aria-label', 'Turn background music off');
    elements.musicToggle.setAttribute('aria-pressed', 'true');
    elements.musicToggle.title = 'Background music on';
    return;
  }
  ambientMusic.turnOff();
  elements.musicToggle.classList.remove('is-on');
  elements.musicToggle.setAttribute('aria-label', 'Turn background music on');
  elements.musicToggle.setAttribute('aria-pressed', 'false');
  elements.musicToggle.title = 'Background music off';
}
if (reducedMotionMedia.matches) {
  elements.musicToggle.disabled = true;
  elements.musicToggle.title = 'Background music is disabled for reduced motion';
} else {
  elements.musicToggle.addEventListener('click', toggleAmbientMusic);
}
document.getElementById('open-trading').addEventListener('click', () => elements.tradingDialog.showModal());
document.getElementById('close-trading').addEventListener('click', () => elements.tradingDialog.close());
document.getElementById('open-stock').addEventListener('click', () => elements.stockDialog.showModal());
document.getElementById('close-stock').addEventListener('click', () => elements.stockDialog.close());
document.getElementById('open-expeditions').addEventListener('click', () => elements.expeditionDialog.showModal());
document.getElementById('close-expeditions').addEventListener('click', () => elements.expeditionDialog.close());
elements.expeditionTeamSelects.forEach((select, slot) => {
  select.addEventListener('change', () => {
    expeditionTeamSelection[slot] = select.value === '' ? null : state.inventory[Number(select.value)];
    renderExpeditions();
  });
});
document.getElementById('open-boost-shop').addEventListener('click', () => elements.boostDialog.showModal());
document.getElementById('close-boost-shop').addEventListener('click', () => elements.boostDialog.close());
document.getElementById('open-skill-tree').addEventListener('click', () => {
  renderSkillTree();
  elements.skillTreeDialog.showModal();
});
document.getElementById('close-skill-tree').addEventListener('click', () => elements.skillTreeDialog.close());
elements.buyMoneyBoost.addEventListener('click', buyMoneyBoost);
elements.rollButton.addEventListener('click', roll);
document.getElementById('open-journal').addEventListener('click', () => elements.journalDialog.showModal());
document.getElementById('close-journal').addEventListener('click', () => elements.journalDialog.close());
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
elements.expeditionDialog.addEventListener('click', event => {
  if (event.target === elements.expeditionDialog) elements.expeditionDialog.close();
});
elements.boostDialog.addEventListener('click', event => {
  if (event.target === elements.boostDialog) elements.boostDialog.close();
});
elements.skillTreeDialog.addEventListener('click', event => {
  if (event.target === elements.skillTreeDialog) elements.skillTreeDialog.close();
});
elements.journalDialog.addEventListener('click', event => {
  if (event.target === elements.journalDialog) elements.journalDialog.close();
});
elements.resetDialog.addEventListener('click', event => {
  if (event.target === elements.resetDialog) elements.resetDialog.close();
});

const restoredJournalRewards = claimJournalMilestones();
if (restoredJournalRewards.length > 0) saveGame();
render();
window.setInterval(() => {
  updateStockCountdown();
  updateExpeditionCountdown();
  updateDailyContractDay();
}, 1000);