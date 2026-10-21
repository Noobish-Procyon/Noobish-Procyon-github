const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
const keys = new Set();
const joystick = { x: 0, y: 0 };
const elements = [
  { id: 'fire', name: 'FIRE', awakenedName: 'LAVA', cost: 10, color: '#f07846', baseMoves: ['EMBER SHOT', 'BLAZE RING', 'FIRESTEP', 'INFERNO'], awakeMoves: ['MAGMA LANCE', 'ERUPTION', 'LAVA SKIN', 'VOLCANIC HEART'], moves: [10, 20, 30, 40] },
  { id: 'ice', name: 'ICE', awakenedName: 'SNOW', cost: 10, color: '#80c9e8', baseMoves: ['FROST NEEDLE', 'SNOW SQUALL', 'ICE WALL', 'GLACIAL PRISON'], awakeMoves: ['ABSOLUTE ZERO', 'BLIZZARD', 'PERMAFROST', 'WHITEOUT'], moves: [10, 20, 30, 40] },
  { id: 'nature', name: 'NATURE', awakenedName: 'FOREST', cost: 15, color: '#68a76c', baseMoves: ['THORN SEED', 'ROOT SNARE', 'RENEWAL', 'WILDSURGE'], awakeMoves: ['ANCIENT SPEAR', 'OVERGROWTH', 'HEARTWOOD', 'WORLD TREE'], moves: [15, 25, 35, 45] },
  { id: 'water', name: 'WATER', awakenedName: 'OCEAN', cost: 15, color: '#4b9fe0', baseMoves: ['WATER JET', 'RIPTIDE', 'MIST VEIL', 'TIDAL CRASH'], awakeMoves: ['ABYSSAL STREAM', 'MAELSTROM', 'OCEAN VEIL', 'TSUNAMI'], moves: [15, 25, 35, 45] },
  { id: 'light', name: 'LIGHT', awakenedName: 'STAR', cost: 20, color: '#f4d777', baseMoves: ['SUNRAY', 'FLASHBANG', 'DAWNSHIELD', 'BLINK'], awakeMoves: ['STARPIERCER', 'SUPERNOVA', 'SOLAR AEGIS', 'CONSTELLATION'], moves: [20, 30, 40, 50] },
  { id: 'dark', name: 'DARK', awakenedName: 'VOID', cost: 20, color: '#a18bd3', baseMoves: ['NIGHT ORB', 'GRAVITY WELL', 'SOUL SIPHON', 'SHADOW STEP'], awakeMoves: ['VOID BOLT', 'SINGULARITY', 'ECLIPSE DRAIN', 'ABYSS WALK'], moves: [20, 30, 40, 50] },
  { id: 'poison', name: 'POISON', awakenedName: 'TOXIN', cost: 30, color: '#9ec84e', baseMoves: ['VENOM DART', 'MIRE CLOUD', 'ANTIDOTE', 'PLAGUE BLOOM'], awakeMoves: ['TOXIN NEEDLE', 'BLACK FOG', 'PURGE', 'CONTAGION'], moves: [30, 40, 50, 60] },
  { id: 'electric', name: 'ELECTRIC', awakenedName: 'VOLTAGE', cost: 40, color: '#f4cf54', baseMoves: ['ARC BOLT', 'CHAIN LIGHTNING', 'STATIC DASH', 'THUNDERCLAP'], awakeMoves: ['RAILGUN', 'OVERLOAD', 'LIGHTNING RUSH', 'STORMFRONT'], moves: [35, 45, 55, 65] },
  { id: 'crystal', name: 'CRYSTAL', awakenedName: 'EMERALD', cost: 50, color: '#61c9a2', baseMoves: ['SHARD FLICK', 'PRISM BURST', 'GEODE GUARD', 'SHATTERLINE'], awakeMoves: ['DIAMOND SPEAR', 'PRISMATIC RUIN', 'FORTRESS CORE', 'WORLD SPLITTER'], moves: [40, 50, 60, 70] },
  { id: 'metal', name: 'METAL', awakenedName: 'STEEL', cost: 55, color: '#aeb8c5', baseMoves: ['IRON NEEDLE', 'ORBITAL BLADES', 'FORGE ARMOR', 'MAGNETIC CRUSH'], awakeMoves: ['CANNON SPIKE', 'SHRAPNEL STORM', 'TITAN PLATING', 'POLARITY COLLAPSE'], moves: [45, 55, 65, 75] },
  { id: 'blood', name: 'BLOOD', cost: 75, color: '#d84d5d', baseMoves: ['SANGUINE BOLT', 'BLOOD TIDE', 'HEART TRADE', 'RED HARVEST'] },
  { id: 'time', name: 'TIME', cost: 100, color: '#bda5e8', baseMoves: ['SECOND HAND', 'TIME SNARE', 'REWIND', 'HOURGLASS'] },
  { id: 'digital', name: 'DIGITAL', cost: 85, color: '#55e6df', baseMoves: ['PIXEL PULSE', 'GLITCH GRID', 'FRAME SKIP', 'SYSTEM CRASH'] }
];
const moveKeys = ['z', 'x', 'c', 'v'];
const rooms = ['THE SUNKEN VESTIBULE', 'MOSS LANTERN HALL', 'THE CLOCKWORK CRYPT', 'THE RED GALLERY', 'THE LAST THRESHOLD'];
const defaultProfile = { fragments: 0, unlocked: [], awakened: [], moves: {} };
const runSaveKey = 'circlebound-elemental-run';
let profile = loadProfile();
let state;
let controlsChosen = false;
let controlMode = null;
let aim = { x: 0, y: 0 };

function loadProfile() {
  const raw = localStorage.getItem('circlebound-elemental-profile');
  if (!raw) return { ...defaultProfile, unlocked: [], awakened: [], moves: {} };
  let saved;
  try {
    saved = JSON.parse(raw);
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    console.warn('Saved elemental progress was unreadable; starting a new profile.');
    return { ...defaultProfile, unlocked: [], awakened: [], moves: {} };
  }
  if (!saved || typeof saved !== 'object') return { ...defaultProfile, unlocked: [], awakened: [], moves: {} };
  const validIds = new Set(elements.map(element => element.id));
  const unlocked = Array.isArray(saved.unlocked) ? saved.unlocked.filter(id => validIds.has(id)) : [];
  const awakened = Array.isArray(saved.awakened) ? saved.awakened.filter(id => elements.some(element => element.id === id && element.moves)) : [];
  const moves = {};
  for (const element of elements) {
    const savedMoves = saved.moves && saved.moves[element.id];
    if (element.moves && Array.isArray(savedMoves)) moves[element.id] = savedMoves.slice(0, 4).map(Boolean);
  }
  return {
    fragments: Number.isFinite(saved.fragments) ? Math.max(0, Math.floor(saved.fragments)) : 0,
    unlocked: [...new Set(unlocked)],
    awakened: [...new Set(awakened)],
    moves,
    equipped: unlocked.includes(saved.equipped) ? saved.equipped : null
  };
}

function saveProfile() {
  localStorage.setItem('circlebound-elemental-profile', JSON.stringify(profile));
}

function getElement(id = profile.equipped) {
  return elements.find(element => element.id === id);
}

function elementName(element) {
  return element && profile.awakened.includes(element.id) ? element.awakenedName : element ? element.name : 'NONE';
}

function loadRunSave() {
  const raw = localStorage.getItem(runSaveKey);
  if (!raw) return null;
  let saved;
  try {
    saved = JSON.parse(raw);
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    console.warn('Saved dungeon run was unreadable; starting a new run.');
    return null;
  }
  const validEntityTypes = new Set(['enemy', 'miniboss', 'awakenedBoss', 'fragment']);
  const validNumber = value => Number.isFinite(value) && value >= 0;
  if (!saved || !Number.isInteger(saved.room) || saved.room < 1 || saved.room > 1000000 ||
      !validNumber(saved.health) || !validNumber(saved.maxHealth) || !Number.isFinite(saved.score) ||
      !Array.isArray(saved.entities) || saved.entities.length > 100 ||
      !saved.entities.every(entity => entity && validEntityTypes.has(entity.type) && Number.isFinite(entity.x) &&
        Number.isFinite(entity.y) && validNumber(entity.r) && (entity.type === 'fragment'
          ? validNumber(entity.value)
          : validNumber(entity.hp) && validNumber(entity.maxHp) && validNumber(entity.speed)))) {
    console.warn('Saved dungeon run was invalid; starting a new run.');
    return null;
  }
  return saved;
}

function saveRun() {
  if (!state || state.health <= 0) return;
  const saved = {
    room: state.room,
    health: state.health,
    maxHealth: state.maxHealth,
    score: state.score,
    player: { x: state.player.x, y: state.player.y },
    entities: state.entities.filter(entity => !entity.dead).map(entity => ({
      type: entity.type, x: entity.x, y: entity.y, r: entity.r, hp: entity.hp, maxHp: entity.maxHp,
      speed: entity.speed, hit: entity.hit, fireTimer: entity.fireTimer, burn: entity.burn,
      poison: entity.poison, slow: entity.slow, root: entity.root, mark: entity.mark,
      stun: entity.stun, glitch: entity.glitch, pause: entity.pause, spin: entity.spin, value: entity.value,
      elementId: entity.elementId
    })),
    upgrades: {
      damageBoost: state.damageBoost, fireBoost: state.fireBoost, attackSpeed: state.attackSpeed,
      moveSpeed: state.moveSpeed, dashCooldown: state.dashCooldown, meleeRange: state.meleeRange,
      fragmentBonus: state.fragmentBonus
    },
    shield: state.shield,
    playerSlow: state.playerSlow, playerRoot: state.playerRoot, playerStun: state.playerStun,
    playerPoison: state.playerPoison, playerGlitch: state.playerGlitch,
    roomCleared: state.roomCleared,
    gateOpen: state.gateOpen,
    bossElement: state.bossElement
  };
  localStorage.setItem(runSaveKey, JSON.stringify(saved));
}

function resetRun(resumeSavedRun = false) {
  const savedRun = resumeSavedRun ? loadRunSave() : null;
  if (!resumeSavedRun) localStorage.removeItem(runSaveKey);
  document.getElementById('run-state').textContent = 'RUN IN PROGRESS';
  state = {
    room: savedRun ? savedRun.room : 1, health: savedRun?.health ?? 100, maxHealth: savedRun?.maxHealth ?? 100,
    score: savedRun?.score ?? 0, combo: 0, comboTimer: 0,
    lastTime: 0, runTime: 0, historySampleTimer: 0, playerHistory: [], autosaveTimer: 0, rangedTimer: 0, meleeTimer: 0, dashTimer: 0, abilityTimers: [0, 0, 0, 0],
    shake: 0, roomCleared: false, gateOpen: false,
    damageBoost: savedRun?.upgrades?.damageBoost ?? 1, fireBoost: savedRun?.upgrades?.fireBoost ?? 1,
    attackSpeed: savedRun?.upgrades?.attackSpeed ?? 1, moveSpeed: savedRun?.upgrades?.moveSpeed ?? 180,
    dashCooldown: savedRun?.upgrades?.dashCooldown ?? 0.8, meleeRange: savedRun?.upgrades?.meleeRange ?? 80,
    fragmentBonus: savedRun?.upgrades?.fragmentBonus ?? 0, shield: savedRun?.shield ?? 0, reflectTimer: 0,
    playerSlow: savedRun?.playerSlow ?? 0, playerRoot: savedRun?.playerRoot ?? 0,
    playerStun: savedRun?.playerStun ?? 0, playerPoison: savedRun?.playerPoison ?? 0,
    playerGlitch: savedRun?.playerGlitch ?? 0,
    bossElement: savedRun?.bossElement ? getElement(savedRun.bossElement)?.id || null : null,
    entities: [], shots: [], enemyShots: [], particles: [], decorations: [], orbitingBlades: [], abilityEffects: [],
    player: { x: 0, y: 0, r: 14 }, keys: new Set()
  };
  keys.clear();
  resize();
  const savedBossElement = savedRun?.entities.find(entity => entity.type === 'awakenedBoss')?.elementId;
  generateRoom(Boolean(savedRun), savedBossElement);
  document.getElementById('upgrade-modal').classList.add('hidden');
  if (savedRun) {
    if (savedRun.player && Number.isFinite(savedRun.player.x) && Number.isFinite(savedRun.player.y)) {
      state.player.x = Math.max(25, Math.min(size().w - 25, savedRun.player.x));
      state.player.y = Math.max(25, Math.min(size().h - 25, savedRun.player.y));
    }
    state.entities = savedRun.entities.map(entity => entity.type === 'awakenedBoss' && !entity.elementId
      ? { ...entity, elementId: state.bossElement || getAwakenedBossElementForRoom(state.room).id }
      : entity);
    state.roomCleared = Boolean(savedRun.roomCleared);
    state.gateOpen = Boolean(savedRun.gateOpen);
    if (state.gateOpen) document.getElementById('wave-status').textContent = 'GATE OPEN';
    else if (state.roomCleared) {
      document.getElementById('wave-status').textContent = 'ROOM CLEARED';
      document.getElementById('upgrade-modal').classList.remove('hidden');
    }
  }
  updateHud();
  renderElementShop();
  renderAbilities();
  document.getElementById('end-modal').classList.add('hidden');
  saveRun();
}

function resize() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(320, Math.floor(rect.width * devicePixelRatio));
  canvas.height = Math.max(300, Math.floor(rect.height * devicePixelRatio));
  context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}

function size() {
  return { w: canvas.clientWidth, h: canvas.clientHeight };
}

function generateRoom(preserveBossElement = false, bossElementId = null) {
  const { w, h } = size();
  state.player = { x: w / 2, y: h / 2, r: 14 };
  state.playerHistory = [{ x: state.player.x, y: state.player.y, time: state.runTime }];
  state.entities = [];
  state.shots = [];
  state.enemyShots = [];
  state.particles = [];
  state.decorations = [];
  state.orbitingBlades = [];
  state.abilityEffects = [];
  state.roomCleared = false;
  state.gateOpen = false;
  state.combo = 0;
  state.comboTimer = 0;
  if (!preserveBossElement) state.bossElement = state.room % 10 === 0 && getElement()?.moves ? getElement().id : null;
  const bossElement = getElement(bossElementId || state.bossElement) || getAwakenedBossElementForRoom(state.room);
  const count = 3 + Math.min(5, state.room + 1);
  for (let i = 0; i < count; i++) state.entities.push(makeEnemy('enemy'));
  if (state.room % 10 === 0) {
    const boss = makeEnemy('awakenedBoss');
    boss.elementId = bossElement.id;
    state.entities.push(boss);
  } else if (state.room % 5 === 0) state.entities.push(makeEnemy('miniboss'));
  for (let i = 0; i < 8; i++) state.decorations.push({ x: 45 + Math.random() * (w - 90), y: 45 + Math.random() * (h - 90), r: 8 + Math.random() * 18, phase: Math.random() * Math.PI * 2 });
  document.getElementById('room-name').textContent = rooms[(state.room - 1) % rooms.length];
  const isAwakenedBoss = state.room % 10 === 0;
  const isMiniboss = state.room % 5 === 0;
  const status = isAwakenedBoss ? 'AWAKENED BOSS' : isMiniboss ? 'MINIBOSS' : 'CLEAR THE ROOM';
  document.getElementById('wave-status').textContent = status;
  addLog(`ROOM ${String(state.room).padStart(2, '0')}`, isAwakenedBoss ? 'An awakened boss guards this depth.' : isMiniboss ? 'A miniboss blocks the way.' : 'New walls, new trouble.');
  if (isAwakenedBoss && bossElement) addLog('BOSS TRIAL', `The boss wields awakened ${bossElement.awakenedName}.`);
  if (isAwakenedBoss) {
    state.shake = 0.35;
    burst(w / 2, h / 2, colors.boss, 18);
  }
}

function getAwakenedBossElementForRoom(room) {
  const awakenedElements = elements.filter(element => element.moves);
  return awakenedElements[(Math.floor(room / 10) - 1) % awakenedElements.length];
}

const colors = { field: '#11131b', wall: '#353340', wallLight: '#62586c', enemy: '#d9774d', boss: '#bf5262', loot: '#b78aff', shot: '#f2dfb2', text: '#e5d9c3' };

function makeEnemy(type) {
  const { w, h } = size();
  const edge = Math.floor(Math.random() * 4);
  const x = edge === 0 ? 30 : edge === 1 ? w - 30 : 50 + Math.random() * (w - 100);
  const y = edge === 2 ? 30 : edge === 3 ? h - 30 : 50 + Math.random() * (h - 100);
  const isBoss = type !== 'enemy';
  const hpTier = Math.floor((state.room - 1) / 15);
  const hpScale = 1 + hpTier * 0.25;
  const baseHp = type === 'awakenedBoss' ? 1500 + state.room * 15 : type === 'miniboss' ? 360 + state.room * 10 : Math.ceil((35 + state.room * 5) * 1.15);
  const hp = Math.ceil(baseHp * hpScale);
  return {
    type, x, y, r: type === 'awakenedBoss' ? 37 : type === 'miniboss' ? 27 : 11 + Math.random() * 4,
    hp, maxHp: hp, speed: type === 'awakenedBoss' ? 34 : type === 'miniboss' ? 27 : (38 + Math.random() * 20) * 1.15,
    elementId: type === 'awakenedBoss' ? (state.bossElement || getAwakenedBossElementForRoom(state.room).id) : null,
    hit: 0, fireTimer: isBoss ? 1 + Math.random() : 0, burn: 0, poison: 0, slow: 0, root: 0, mark: 0, glitch: 0, pause: 0
  };
}

function fireAwakenedBossAttack(boss, angle) {
  const element = getElement(boss.elementId);
  if (!element?.moves) return;
  const shoot = (offset, speed, radius, damage, options = {}) => {
    state.enemyShots.push({
      x: boss.x, y: boss.y, vx: Math.cos(angle + offset) * speed, vy: Math.sin(angle + offset) * speed,
      r: radius, damage, life: 4, telegraph: 0.3, color: element.color, elementId: element.id, ...options
    });
  };
  if (element.id === 'fire') {
    for (const offset of [-0.22, 0, 0.22]) shoot(offset, 185, 9, 14, { splash: 7 });
  } else if (element.id === 'ice') {
    for (const offset of [-0.48, -0.24, 0, 0.24, 0.48]) shoot(offset, 175, 6, 9, { slow: 1.4 });
  } else if (element.id === 'nature') {
    for (const offset of [-0.3, 0, 0.3]) shoot(offset, 240, 5, 11, { root: 0.7 });
  } else if (element.id === 'water') {
    for (const offset of [-0.62, -0.31, 0, 0.31, 0.62]) shoot(offset, 155, 8, 8, { knockback: 44 });
  } else if (element.id === 'light') {
    shoot(0, 420, 5, 18, { pierce: true });
  } else if (element.id === 'dark') {
    shoot(0, 115, 12, 22, { homing: true, healBoss: 0.35 });
  } else if (element.id === 'poison') {
    for (const offset of [-0.24, 0, 0.24]) shoot(offset, 165, 7, 8, { poison: 2 });
  } else if (element.id === 'electric') {
    shoot(-0.06, 350, 5, 12, { stun: 0.35 });
    shoot(0.06, 350, 5, 12, { stun: 0.35 });
  } else if (element.id === 'crystal') {
    for (let i = 0; i < 8; i++) shoot(i * Math.PI / 4 - angle, 195, 6, 9, { pierce: true });
  } else if (element.id === 'metal') {
    shoot(-0.08, 290, 8, 16, { pierce: true });
    shoot(0.08, 290, 8, 16, { pierce: true });
  }
}

function update(dt) {
  if (!controlsChosen || state.health <= 0) return;
  const { w, h } = size();
  const hero = state.player;
  state.runTime += dt;
  state.playerSlow = Math.max(0, state.playerSlow - dt);
  state.playerRoot = Math.max(0, state.playerRoot - dt);
  state.playerStun = Math.max(0, state.playerStun - dt);
  state.playerPoison = Math.max(0, state.playerPoison - dt);
  state.playerGlitch = Math.max(0, state.playerGlitch - dt);
  if (state.playerPoison > 0) state.health -= 7 * dt;
  let dx = 0;
  let dy = 0;
  if (state.keys.has('w') || state.keys.has('arrowup')) dy--;
  if (state.keys.has('s') || state.keys.has('arrowdown')) dy++;
  if (state.keys.has('a') || state.keys.has('arrowleft')) dx--;
  if (state.keys.has('d') || state.keys.has('arrowright')) dx++;
  dx += joystick.x;
  dy += joystick.y;
  if (state.playerStun > 0 || state.playerRoot > 0) {
    dx = 0;
    dy = 0;
  } else if (state.playerGlitch > 0) {
    dx *= -1;
    dy *= -1;
  }
  if (dx || dy) {
    const length = Math.hypot(dx, dy);
    const speedScale = state.playerSlow > 0 ? 0.5 : 1;
    hero.x += dx / length * state.moveSpeed * speedScale * dt;
    hero.y += dy / length * state.moveSpeed * speedScale * dt;
  }
  hero.x = Math.max(25, Math.min(w - 25, hero.x));
  hero.y = Math.max(25, Math.min(h - 25, hero.y));
  state.historySampleTimer += dt;
  if (state.historySampleTimer >= 0.1) {
    state.playerHistory.push({ x: hero.x, y: hero.y, time: state.runTime });
    state.historySampleTimer %= 0.1;
    while (state.playerHistory.length > 1 && state.playerHistory[1].time < state.runTime - 3) state.playerHistory.shift();
  }
  state.rangedTimer = Math.max(0, state.rangedTimer - dt);
  state.meleeTimer = Math.max(0, state.meleeTimer - dt);
  state.dashTimer = Math.max(0, state.dashTimer - dt);
  state.abilityTimers = state.abilityTimers.map(timer => Math.max(0, timer - dt));
  state.autosaveTimer += dt;
  state.reflectTimer = Math.max(0, state.reflectTimer - dt);
  for (const effect of state.abilityEffects) effect.life -= dt;
  state.abilityEffects = state.abilityEffects.filter(effect => effect.life > 0);
  state.shield = Math.max(0, state.shield - dt);
  state.shake = Math.max(0, state.shake - dt);
  state.comboTimer = Math.max(0, state.comboTimer - dt);
  if (state.comboTimer === 0) state.combo = 0;
  for (const enemy of state.entities) {
    if (enemy.type === 'fragment') {
      enemy.spin += dt * 3;
      if (dist(hero, enemy) < hero.r + enemy.r + 5) {
        profile.fragments += enemy.value;
        saveProfile();
        burst(enemy.x, enemy.y, colors.loot, 10);
        addLog('FRAGMENT', `+${enemy.value} · ${profile.fragments} held.`);
        enemy.dead = true;
        renderElementShop();
        renderAbilities();
      }
      continue;
    }
    enemy.burn = Math.max(0, enemy.burn - dt);
    enemy.poison = Math.max(0, enemy.poison - dt);
    enemy.slow = Math.max(0, enemy.slow - dt);
    enemy.root = Math.max(0, enemy.root - dt);
    enemy.mark = Math.max(0, enemy.mark - dt);
    enemy.stun = Math.max(0, (enemy.stun || 0) - dt);
    enemy.glitch = Math.max(0, (enemy.glitch || 0) - dt);
    enemy.pause = Math.max(0, (enemy.pause || 0) - dt);
    if (enemy.burn > 0) damageEnemy(enemy, (enemy.type === 'enemy' ? 9 : 14) * dt);
    if (enemy.poison > 0) damageEnemy(enemy, (enemy.type === 'enemy' ? 12 : 17) * dt);
    if (enemy.dead) continue;
    if (enemy.pause > 0) continue;
    const angle = Math.atan2(hero.y - enemy.y, hero.x - enemy.x);
    const glitchAngle = angle + Math.sin(performance.now() / 45 + enemy.x) * 1.1;
    const speed = enemy.speed * (enemy.slow > 0 ? 0.45 : 1) * (enemy.root > 0 ? 0.12 : 1) * (enemy.stun > 0 ? 0.05 : 1) * (enemy.glitch > 0 ? 0.65 : 1);
    enemy.x += Math.cos(enemy.glitch > 0 ? glitchAngle : angle) * speed * dt;
    enemy.y += Math.sin(enemy.glitch > 0 ? glitchAngle : angle) * speed * dt;
    enemy.hit = Math.max(0, enemy.hit - dt);
    if (enemy.type !== 'enemy') {
      enemy.fireTimer -= dt * (enemy.slow > 0 ? 0.5 : 1) * (enemy.stun > 0 ? 0 : 1);
      if (enemy.fireTimer <= 0) {
        const aimAngle = Math.atan2(hero.y - enemy.y, hero.x - enemy.x);
        if (enemy.type === 'awakenedBoss') {
          fireAwakenedBossAttack(enemy, aimAngle);
        } else {
          state.enemyShots.push({ x: enemy.x, y: enemy.y, vx: Math.cos(aimAngle) * 155, vy: Math.sin(aimAngle) * 155, r: 7, life: 4, telegraph: 0.4 });
        }
        enemy.fireTimer = enemy.type === 'awakenedBoss' ? 1.15 : 1.3;
      }
    }
    if (dist(hero, enemy) < hero.r + enemy.r && enemy.hit === 0) {
      takeDamage(enemy.type === 'awakenedBoss' ? 18 : enemy.type === 'miniboss' ? 14 : 8);
      state.combo = 0;
      state.comboTimer = 0;
      enemy.hit = 0.7;
      state.shake = 0.18;
      burst(hero.x, hero.y, colors.enemy, 5);
    }
  }
  for (const blade of state.orbitingBlades) {
    blade.life -= dt;
    blade.angle += dt * 4.5;
    blade.x = hero.x + Math.cos(blade.angle) * blade.orbitRadius;
    blade.y = hero.y + Math.sin(blade.angle) * blade.orbitRadius;
    for (const enemy of state.entities) {
      if (enemy.type === 'fragment' || enemy.dead || blade.hitTargets.includes(enemy)) continue;
      if (dist(blade, enemy) < enemy.r + 7) {
        applyElementalHit(enemy, blade.damage, 'metal', 1, false);
        blade.hitTargets.push(enemy);
        burst(enemy.x, enemy.y, blade.color, 5);
      }
    }
  }
  state.orbitingBlades = state.orbitingBlades.filter(blade => blade.life > 0);
  for (const shot of state.shots) {
    shot.x += shot.vx * dt;
    shot.y += shot.vy * dt;
    for (const enemy of state.entities) {
      if (enemy.type !== 'fragment' && !enemy.dead && !(shot.hitTargets || []).includes(enemy) && dist(shot, enemy) < shot.r + enemy.r) {
        if (shot.healthCost) state.health = Math.max(1, state.health - shot.healthCost);
        if (shot.style === 'dark') {
          const distance = dist(enemy, state.player) || 1;
          enemy.x += (state.player.x - enemy.x) / distance * 44;
          enemy.y += (state.player.y - enemy.y) / distance * 44;
        }
        applyElementalHit(enemy, shot.damage, shot.elementId, shot.abilityIndex, shot.awakened);
        if (shot.style === 'fire') {
          for (const nearby of state.entities) {
            if (nearby !== enemy && nearby.type !== 'fragment' && !nearby.dead && dist(enemy, nearby) < 48) {
              applyElementalHit(nearby, shot.splashDamage, shot.elementId, shot.abilityIndex, shot.awakened);
              burst(nearby.x, nearby.y, shot.color, 4);
            }
          }
        }
        if (shot.style === 'electric') chainLightning(enemy, shot.chainDamage, 2);
        if (shot.style === 'time') enemy.pause = Math.max(enemy.pause || 0, 1.1);
        shot.hitTargets = shot.hitTargets || [];
        shot.hitTargets.push(enemy);
        if (shot.pierce > 0) shot.pierce--;
        else shot.dead = true;
        burst(shot.x, shot.y, shot.color || colors.shot, 3);
        break;
      }
    }
  }
  for (const shot of state.enemyShots) {
    if (shot.homing) {
      const speed = Math.hypot(shot.vx, shot.vy);
      const angle = Math.atan2(hero.y - shot.y, hero.x - shot.x);
      shot.vx += (Math.cos(angle) * speed - shot.vx) * dt * 1.4;
      shot.vy += (Math.sin(angle) * speed - shot.vy) * dt * 1.4;
    }
    shot.x += shot.vx * dt;
    shot.y += shot.vy * dt;
    shot.life -= dt;
    shot.telegraph = Math.max(0, (shot.telegraph || 0) - dt);
    if (!shot.hitPlayer && dist(hero, shot) < hero.r + shot.r) {
      shot.hitPlayer = true;
      if (!shot.pierce) shot.dead = true;
      if (state.reflectTimer > 0) {
        const target = nearestEnemy();
        if (target) {
          const angle = Math.atan2(target.y - shot.y, target.x - shot.x);
          state.shots.push({
            x: shot.x, y: shot.y, vx: Math.cos(angle) * 500, vy: Math.sin(angle) * 500,
            r: 7, damage: 36 * state.damageBoost, color: getElement('crystal').color,
            elementId: 'crystal', abilityIndex: 2, awakened: profile.awakened.includes('crystal') && Boolean(profile.moves.crystal?.[2])
          });
        }
        burst(hero.x, hero.y, getElement('crystal').color, 8);
      } else {
        takeDamage(shot.damage || 12);
        if (shot.elementId === 'water' && shot.knockback) {
          const angle = Math.atan2(shot.vy, shot.vx);
          hero.x = Math.max(25, Math.min(w - 25, hero.x + Math.cos(angle) * shot.knockback));
          hero.y = Math.max(25, Math.min(h - 25, hero.y + Math.sin(angle) * shot.knockback));
        }
        if (shot.elementId === 'fire' && shot.splash) {
          takeDamage(shot.splash);
          state.shake = Math.max(state.shake, 0.12);
        }
        if (shot.elementId === 'dark' && shot.healBoss) {
          const boss = state.entities.find(entity => entity.type === 'awakenedBoss' && !entity.dead);
          if (boss) boss.hp = Math.min(boss.maxHp, boss.hp + shot.damage * shot.healBoss);
        }
        if (shot.elementId === 'poison') state.playerPoison = Math.max(state.playerPoison || 0, shot.poison || 0);
        if (shot.elementId === 'ice') state.playerSlow = Math.max(state.playerSlow || 0, shot.slow || 0);
        if (shot.elementId === 'nature') state.playerRoot = Math.max(state.playerRoot || 0, shot.root || 0);
        if (shot.elementId === 'electric') state.playerStun = Math.max(state.playerStun || 0, shot.stun || 0);
        if (shot.elementId === 'time') state.playerSlow = Math.max(state.playerSlow || 0, 1.2);
        if (shot.elementId === 'digital') state.playerGlitch = Math.max(state.playerGlitch || 0, 1.4);
        state.combo = 0;
        state.comboTimer = 0;
        state.shake = 0.18;
        burst(hero.x, hero.y, colors.boss, 6);
      }
    }
  }
  state.shots = state.shots.filter(shot => !shot.dead && shot.x > -20 && shot.x < w + 20 && shot.y > -20 && shot.y < h + 20);
  state.enemyShots = state.enemyShots.filter(shot => !shot.dead && shot.life > 0 && shot.x > -20 && shot.x < w + 20 && shot.y > -20 && shot.y < h + 20);
  state.entities = state.entities.filter(entity => !entity.dead);
  if (!state.roomCleared && !state.entities.some(entity => entity.type !== 'fragment')) {
    state.roomCleared = true;
    state.score += 500;
    document.getElementById('wave-status').textContent = 'ROOM CLEARED';
    document.getElementById('upgrade-modal').classList.remove('hidden');
    addLog('ROOM CLEAR', 'Choose an upgrade before the next room.');
  }
  if (state.gateOpen && dist(hero, { x: w / 2, y: 25 }) < 32) {
    state.room++;
    generateRoom();
    updateHud();
    saveRun();
  }
  if (state.autosaveTimer >= 1) {
    state.autosaveTimer %= 1;
    saveRun();
  }
  updateHud();
  for (const particle of state.particles) {
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.life -= dt;
  }
  state.particles = state.particles.filter(particle => particle.life > 0);
}

function defeatEnemy(enemy) {
  enemy.dead = true;
  state.combo++;
  state.comboTimer = 2.2;
  const isAwakenedBoss = enemy.type === 'awakenedBoss';
  const isMiniboss = enemy.type === 'miniboss';
  const value = isAwakenedBoss ? 20 : isMiniboss ? 5 : 1;
  state.entities.push({ type: 'fragment', x: enemy.x, y: enemy.y, r: 9, value: value + state.fragmentBonus, spin: 0 });
  state.score += isAwakenedBoss ? 2000 : isMiniboss ? 600 : 150;
  state.shake = isBoss(enemy) ? 0.35 : 0.06;
  burst(enemy.x, enemy.y, isBoss(enemy) ? colors.boss : colors.enemy, isBoss(enemy) ? 24 : 8);
  addLog(isAwakenedBoss ? 'AWAKENED BOSS DOWN' : isMiniboss ? 'MINIBOSS DOWN' : 'FOE DOWN', `Drops ${value} ${value === 1 ? 'fragment' : 'fragments'}.`);
  if (isAwakenedBoss && state.bossElement) {
    const element = getElement(state.bossElement);
    if (element && !profile.awakened.includes(element.id)) {
      profile.awakened.push(element.id);
      saveProfile();
      renderElementShop();
      renderAbilities();
      addLog('ELEMENT AWAKENED', `${element.awakenedName} moves are now available to buy.`);
    }
  }
}

function damageEnemy(enemy, amount) {
  if (enemy.dead) return;
  enemy.hp -= amount;
  if (enemy.hp <= 0) defeatEnemy(enemy);
}

function takeDamage(amount) {
  if (state.shield > 0) {
    state.shield = 0;
    const element = getElement();
    burst(state.player.x, state.player.y, element ? element.color : '#61c9a2', 12);
    return;
  }
  state.health -= amount;
}

function applyElementalHit(enemy, damage, elementId, abilityIndex, awakened) {
  if (enemy.dead) return;
  const element = getElement(elementId);
  const markedDamage = enemy.mark > 0 ? 1.35 : 1;
  const dealt = Math.min(enemy.hp, damage * markedDamage);
  damageEnemy(enemy, dealt);
  if (elementId === 'blood') {
    const lifeSteal = abilityIndex === 3 ? 0.24 : 0.16;
    state.health = Math.min(state.maxHealth, state.health + dealt * lifeSteal);
  }
  if (enemy.dead || !element) return;
  const bonus = awakened ? 1.5 : 1;
  if (element.id === 'fire') enemy.burn = Math.max(enemy.burn, (abilityIndex === 3 ? 5 : 2.5) * bonus);
  if (element.id === 'ice') enemy.slow = Math.max(enemy.slow, (abilityIndex === 3 ? 4 : 1.8) * bonus);
  if (element.id === 'nature') enemy.root = Math.max(enemy.root, (abilityIndex === 1 || abilityIndex === 3 ? 2.5 : 1.2) * bonus);
  if (element.id === 'water' && abilityIndex === 0) {
    const angle = Math.atan2(enemy.y - state.player.y, enemy.x - state.player.x);
    enemy.x += Math.cos(angle) * 30 * bonus;
    enemy.y += Math.sin(angle) * 30 * bonus;
  }
  if (element.id === 'light') enemy.mark = Math.max(enemy.mark, (abilityIndex === 3 ? 6 : 3) * bonus);
  if (element.id === 'dark') state.health = Math.min(state.maxHealth, state.health + damage * 0.06 * bonus);
  if (element.id === 'poison') enemy.poison = Math.max(enemy.poison, (abilityIndex === 1 || abilityIndex === 3 ? 6 : 3) * bonus);
  if (element.id === 'crystal' && abilityIndex === 0) enemy.hit = Math.max(enemy.hit, 0.16);
  if (element.id === 'digital') enemy.glitch = Math.max(enemy.glitch || 0, awakened ? 4 : 2.5);
  if (element.id === 'time') enemy.slow = Math.max(enemy.slow, (awakened ? 5 : 3) * bonus);
}

function chainLightning(firstEnemy, damage, maxTargets) {
  const hit = new Set([firstEnemy]);
  let current = firstEnemy;
  for (let hop = 0; hop < maxTargets; hop++) {
    const next = state.entities
      .filter(enemy => enemy.type !== 'fragment' && !enemy.dead && !hit.has(enemy) && dist(current, enemy) < 145)
      .sort((a, b) => dist(current, a) - dist(current, b))[0];
    if (!next) break;
    hit.add(next);
    burst(next.x, next.y, getElement('electric').color, 8);
    damageEnemy(next, damage);
    current = next;
  }
}

function isBoss(enemy) {
  return enemy.type !== 'enemy' && enemy.type !== 'fragment';
}

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function burst(x, y, color, count) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 30 + Math.random() * 80;
    state.particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 0.35 + Math.random() * 0.35, color });
  }
}

function rangedAttack() {
  if (!controlsChosen || state.health <= 0 || state.rangedTimer > 0) return;
  if (state.playerStun > 0) return;
  const enemies = state.entities.filter(entity => entity.type !== 'fragment' && !entity.dead);
  if (!enemies.length) return;
  const target = enemies.reduce((nearest, enemy) => dist(state.player, enemy) < dist(state.player, nearest) ? enemy : nearest);
  const angle = Math.atan2(target.y - state.player.y, target.x - state.player.x);
  const element = getElement();
  const origin = state.player;
  const boost = state.damageBoost;
  const makeShot = (offset, speed, radius, damage, style, pierce = 0, extras = {}) => {
    state.shots.push({
      x: origin.x, y: origin.y, vx: Math.cos(angle + offset) * speed, vy: Math.sin(angle + offset) * speed,
      r: radius, damage: damage * boost, color: element ? element.color : colors.shot,
      elementId: element?.id || null, abilityIndex: -1, style, pierce, ...extras
    });
  };
  if (!element) {
    makeShot(0, 440, 4, 20, 'plain');
  } else if (element.id === 'fire') {
    makeShot(0, 370, 8, 27, 'fire', 0, { splashDamage: 12 * boost });
  } else if (element.id === 'ice') {
    makeShot(0, 310, 10, 24, 'ice');
  } else if (element.id === 'nature') {
    makeShot(0, 340, 7, 22, 'nature', 1);
  } else if (element.id === 'water') {
    for (const offset of [-0.16, 0, 0.16]) makeShot(offset, 500, 4, 12, 'water', 1);
  } else if (element.id === 'light') {
    for (const offset of [-0.045, 0.045]) makeShot(offset, 760, 3, 14, 'light', 2);
  } else if (element.id === 'dark') {
    makeShot(0, 260, 12, 31, 'dark');
  } else if (element.id === 'poison') {
    for (const offset of [-0.2, 0, 0.2]) makeShot(offset, 430, 5, 13, 'poison');
  } else if (element.id === 'electric') {
    makeShot(0, 620, 6, 20, 'electric', 0, { chainDamage: 11 * boost });
  } else if (element.id === 'crystal') {
    for (const offset of [-0.32, -0.16, 0, 0.16, 0.32]) makeShot(offset, 560, 5, 11, 'crystal', 2);
  } else if (element.id === 'metal') {
    makeShot(0, 530, 10, 33, 'metal', 4);
  } else if (element.id === 'blood') {
    makeShot(0, 370, 7, 24, 'blood', 0, { healthCost: 2 });
  } else if (element.id === 'time') {
    makeShot(0, 370, 6, 18, 'time');
  } else if (element.id === 'digital') {
    for (const enemy of enemies) {
      const along = (enemy.x - origin.x) * Math.cos(angle) + (enemy.y - origin.y) * Math.sin(angle);
      const across = Math.abs((enemy.x - origin.x) * Math.sin(angle) - (enemy.y - origin.y) * Math.cos(angle));
      if (along > 0 && across < enemy.r + 9) applyElementalHit(enemy, 21 * boost, element.id, -1, false);
    }
    burst(target.x, target.y, element.color, 8);
  }
  state.rangedTimer = (element?.id === 'light' ? 0.16 : element?.id === 'dark' || element?.id === 'metal' ? 0.34 : 0.24) * state.fireBoost;
}

function meleeAttack(event) {
  if (!controlsChosen || state.health <= 0 || state.playerStun > 0 || state.meleeTimer > 0) return;
  if (event) {
    const rect = canvas.getBoundingClientRect();
    aim.x = event.clientX - rect.left;
    aim.y = event.clientY - rect.top;
  }
  const hero = state.player;
  const angle = Math.atan2(aim.y - hero.y, aim.x - hero.x);
  let target = null;
  let bestDistance = state.meleeRange;
  for (const enemy of state.entities) {
    if (enemy.type === 'fragment' || enemy.dead) continue;
    const distance = dist(hero, enemy);
    const enemyAngle = Math.atan2(enemy.y - hero.y, enemy.x - hero.x);
    const difference = Math.atan2(Math.sin(enemyAngle - angle), Math.cos(enemyAngle - angle));
    if (distance < bestDistance && Math.abs(difference) < 1.05) {
      target = enemy;
      bestDistance = distance;
    }
  }
  if (target) {
    const element = getElement();
    if (element) applyElementalHit(target, 34 * state.damageBoost, element.id, -1, false);
    else damageEnemy(target, 34 * state.damageBoost);
    target.hit = 0.18;
    burst(target.x, target.y, element ? element.color : colors.shot, 7);
  }
  state.meleeTimer = 0.5 * state.attackSpeed;
}

function useAbility(index) {
  const element = getElement();
  if (!controlsChosen || state.health <= 0 || state.playerStun > 0 || !element || state.abilityTimers[index] > 0) return;
  if (index < 0 || index > 3) return;
  const awakened = Boolean(element.moves && profile.awakened.includes(element.id) && profile.moves[element.id]?.[index]);
  const hero = state.player;
  const color = element.color;
  const enemies = state.entities.filter(enemy => enemy.type !== 'fragment' && !enemy.dead);
  const target = nearestEnemy();
  const castOrigin = { x: hero.x, y: hero.y };
  const targetPoint = target ? { x: target.x, y: target.y } : null;
  const bonus = awakened ? 1.65 : 1;
  const damage = value => value * bonus * state.damageBoost;
  if (element.id === 'time') {
    const slowDuration = awakened ? 7 : 4;
    for (const enemy of enemies) enemy.slow = Math.max(enemy.slow, slowDuration);
  }
  const projectile = (enemy, amount, options = {}) => {
    if (!enemy) return;
    const angle = Math.atan2(enemy.y - hero.y, enemy.x - hero.x);
    for (const offset of options.offsets || [0]) {
      state.shots.push({
        x: hero.x, y: hero.y, vx: Math.cos(angle + offset) * (options.speed || 350),
        vy: Math.sin(angle + offset) * (options.speed || 350), r: options.radius || 7,
        damage: damage(amount), color, elementId: element.id, abilityIndex: index, awakened,
        pierce: options.pierce || 0
      });
    }
  };
  const hitArea = (radius, amount) => {
    for (const enemy of enemies) {
      if (dist(hero, enemy) <= radius) {
        applyElementalHit(enemy, damage(amount), element.id, index, awakened);
        burst(enemy.x, enemy.y, color, 5);
      }
    }
    burst(hero.x, hero.y, color, 18);
  };
  if (index === 0) {
    if (element.id === 'electric') {
      if (target) {
        applyElementalHit(target, damage(awakened ? 82 : 58), element.id, index, awakened);
        target.stun = Math.max(target.stun || 0, awakened ? 0.7 : 0.35);
      }
    } else if (element.id === 'digital') {
      if (target) {
        const angle = Math.atan2(target.y - hero.y, target.x - hero.x);
        for (const enemy of enemies) {
          const along = (enemy.x - hero.x) * Math.cos(angle) + (enemy.y - hero.y) * Math.sin(angle);
          const across = Math.abs((enemy.x - hero.x) * Math.sin(angle) - (enemy.y - hero.y) * Math.cos(angle));
          if (along > 0 && across < (awakened ? 30 : 22)) applyElementalHit(enemy, damage(awakened ? 82 : 48), element.id, index, awakened);
        }
        burst(target.x, target.y, color, 12);
      }
    } else if (element.id === 'metal') {
      projectile(target, awakened ? 88 : 54, { speed: awakened ? 560 : 390, radius: awakened ? 10 : 7, pierce: awakened ? 5 : 2 });
    } else {
      const options = {
        fire: { offsets: awakened ? [-0.18, 0, 0.18] : [0], speed: 430, radius: 6 },
        ice: { speed: 290, radius: 9 },
        nature: { speed: 320, radius: 8 },
        water: { speed: 390, radius: 6, pierce: 2 },
        light: { offsets: awakened ? [-0.12, 0, 0.12] : [-0.08, 0.08], speed: 520, radius: 4 },
        dark: { speed: 250, radius: 11 },
        poison: { offsets: [-0.2, 0, 0.2], speed: 360, radius: 5 },
        crystal: { speed: 480, radius: 5, pierce: 3 },
        blood: { speed: 310, radius: 8 },
        time: { speed: 370, radius: 6 }
      }[element.id];
      projectile(target, element.id === 'dark' ? 92 : element.id === 'crystal' ? 36 : 54, options || {});
      if (element.id === 'blood' && target) state.health = Math.max(1, state.health - (awakened ? 4 : 2));
      if (element.id === 'time' && target) target.slow = Math.max(target.slow, awakened ? 4 : 2);
    }
  } else if (index === 1) {
    if (element.id === 'metal') {
      if (awakened) {
        for (let i = 0; i < 12; i++) {
          const angle = i * Math.PI / 6;
          state.shots.push({ x: hero.x, y: hero.y, vx: Math.cos(angle) * 390, vy: Math.sin(angle) * 390, r: 9, damage: damage(40), color, elementId: element.id, abilityIndex: index, awakened, pierce: 2 });
        }
      } else {
        for (let i = 0; i < 3; i++) {
          const angle = i * Math.PI * 2 / 3;
          state.orbitingBlades.push({
            angle, color, damage: damage(26), hitTargets: [], life: 4.5, orbitRadius: 42,
            x: hero.x + Math.cos(angle) * 42, y: hero.y + Math.sin(angle) * 42
          });
        }
      }
      burst(hero.x, hero.y, color, awakened ? 24 : 16);
    } else if (element.id === 'digital') {
      const center = target || hero;
      for (const enemy of enemies) {
        const dx = Math.abs(enemy.x - center.x);
        const dy = Math.abs(enemy.y - center.y);
        if ((dx < 72 && dy < 210) || (dy < 72 && dx < 210)) applyElementalHit(enemy, damage(42), element.id, index, awakened);
      }
      burst(center.x, center.y, color, 22);
    } else if (element.id === 'fire') {
      const center = target || hero;
      for (const enemy of enemies) if (dist(center, enemy) < (awakened ? 105 : 72)) {
        const storedBurn = enemy.burn;
        if (storedBurn > 0) {
          enemy.burn = 0;
          damageEnemy(enemy, damage(awakened ? 72 : 42) + storedBurn * (awakened ? 12 : 8));
        } else {
          applyElementalHit(enemy, damage(62), element.id, index, awakened);
        }
      }
      burst(center.x, center.y, color, awakened ? 26 : 17);
    } else if (element.id === 'ice') {
      if (awakened) {
        projectile(target, 31, { offsets: [-0.42, -0.21, 0, 0.21, 0.42], speed: 390, radius: 5 });
      } else {
        const center = target || hero;
        for (const enemy of enemies) if (dist(center, enemy) < 105) {
          applyElementalHit(enemy, damage(34), element.id, index, awakened);
          enemy.slow = Math.max(enemy.slow, 5);
        }
        burst(center.x, center.y, color, 24);
      }
    } else if (element.id === 'nature') {
      if (target) {
        applyElementalHit(target, damage(75), element.id, index, awakened);
        target.root = Math.max(target.root, awakened ? 5 : 3);
        for (const enemy of enemies) if (enemy !== target && dist(enemy, target) < 55) applyElementalHit(enemy, damage(32), element.id, index, awakened);
        burst(target.x, target.y, color, 16);
      }
    } else if (element.id === 'water') {
      const direction = movementDirection();
      const angle = Math.atan2(direction.y, direction.x);
      for (const enemy of enemies) {
        const distance = dist(hero, enemy);
        const enemyAngle = Math.atan2(enemy.y - hero.y, enemy.x - hero.x);
        const difference = Math.atan2(Math.sin(enemyAngle - angle), Math.cos(enemyAngle - angle));
        if (distance < (awakened ? 200 : 145) && Math.abs(difference) < 0.75) {
          applyElementalHit(enemy, damage(53), element.id, index, awakened);
          const knockback = Math.atan2(enemy.y - hero.y, enemy.x - hero.x);
          enemy.x += Math.cos(knockback) * 105;
          enemy.y += Math.sin(knockback) * 105;
        }
      }
      burst(hero.x + direction.x * 55, hero.y + direction.y * 55, color, 20);
    } else if (element.id === 'light') {
      for (const enemy of enemies) {
        enemy.mark = Math.max(enemy.mark, awakened ? 8 : 5);
        if (awakened) applyElementalHit(enemy, damage(48), element.id, index, awakened);
        else enemy.stun = Math.max(enemy.stun || 0, 0.8);
      }
      burst(hero.x, hero.y, color, 20);
    } else if (element.id === 'dark') {
      if (target) {
        const distance = dist(hero, target) || 1;
        target.x += (hero.x - target.x) / distance * 72;
        target.y += (hero.y - target.y) / distance * 72;
        applyElementalHit(target, damage(96), element.id, index, awakened);
        state.health = Math.min(state.maxHealth, state.health + (awakened ? 28 : 16));
        burst(target.x, target.y, color, 16);
      }
    } else if (element.id === 'poison') {
      const center = target || hero;
      for (const enemy of enemies) if (dist(center, enemy) < (awakened ? 115 : 82)) {
        enemy.poison = Math.max(enemy.poison, awakened ? 10 : 7);
        enemy.slow = Math.max(enemy.slow, 1.5);
        burst(enemy.x, enemy.y, color, 5);
      }
      burst(center.x, center.y, color, 18);
    } else if (element.id === 'electric') {
      if (target) {
        applyElementalHit(target, damage(awakened ? 42 : 28), element.id, index, awakened);
        chainLightning(target, damage(awakened ? 58 : 48), awakened ? 8 : 5);
      }
    } else if (element.id === 'crystal') {
      projectile(target, 28, { offsets: awakened ? [-0.55, -0.36, -0.18, 0, 0.18, 0.36, 0.55] : [-0.42, -0.14, 0.14, 0.42], speed: 470, radius: 6, pierce: 1 });
    } else if (element.id === 'blood') {
      const radius = awakened ? 125 : 92;
      let hitCount = 0;
      for (const enemy of enemies) if (dist(hero, enemy) < radius) {
        applyElementalHit(enemy, damage(42), element.id, index, awakened);
        hitCount++;
      }
      if (hitCount > 0) burst(hero.x, hero.y, color, 20);
    } else if (element.id === 'time') {
      const center = target || hero;
      const radius = awakened ? 220 : 165;
      const pauseDuration = awakened ? 4 : 2.5;
      for (const enemy of enemies) {
        if (dist(center, enemy) <= radius) {
          applyElementalHit(enemy, damage(awakened ? 60 : 42), element.id, index, awakened);
          enemy.pause = Math.max(enemy.pause || 0, pauseDuration);
          burst(enemy.x, enemy.y, color, 10);
        }
      }
      burst(center.x, center.y, color, 26);
    } else {
      for (const enemy of enemies) enemy.slow = Math.max(enemy.slow, awakened ? 9 : 6);
      if (target) applyElementalHit(target, damage(62), element.id, index, awakened);
      burst(hero.x, hero.y, color, 20);
    }
  } else if (index === 2) {
    if (element.id === 'metal') {
      state.shield = awakened ? 20 : 12;
      for (const enemy of enemies) if (dist(hero, enemy) < (awakened ? 105 : 72)) {
        applyElementalHit(enemy, damage(awakened ? 52 : 28), element.id, index, awakened);
        enemy.stun = Math.max(enemy.stun || 0, awakened ? 1.1 : 0.45);
      }
      burst(hero.x, hero.y, color, awakened ? 28 : 18);
    } else if (element.id === 'digital') {
      const center = target || hero;
      for (const enemy of enemies) if (dist(center, enemy) < 150) {
        const oldX = enemy.x;
        const oldY = enemy.y;
        enemy.x = Math.max(35, Math.min(size().w - 35, hero.x + (Math.random() - 0.5) * 110));
        enemy.y = Math.max(35, Math.min(size().h - 35, hero.y + (Math.random() - 0.5) * 110));
        applyElementalHit(enemy, damage(35), element.id, index, awakened);
        burst(oldX, oldY, color, 5);
      }
      burst(hero.x, hero.y, color, 22);
    } else if (element.id === 'fire') {
      const direction = movementDirection();
      hero.x = Math.max(25, Math.min(size().w - 25, hero.x + direction.x * 100));
      hero.y = Math.max(25, Math.min(size().h - 25, hero.y + direction.y * 100));
      hitArea(55, 48);
    } else if (element.id === 'ice') {
      state.shield = 8;
      for (const enemy of enemies) if (dist(hero, enemy) < 105) {
        enemy.slow = Math.max(enemy.slow, awakened ? 5 : 3);
        enemy.pause = Math.max(enemy.pause || 0, awakened ? 1.4 : 0.8);
      }
      burst(hero.x, hero.y, color, 22);
    } else if (element.id === 'nature') {
      state.health = Math.min(state.maxHealth, state.health + (awakened ? 48 : 30));
      for (const enemy of enemies) if (dist(hero, enemy) < 95) {
        enemy.root = Math.max(enemy.root, awakened ? 4 : 2);
        applyElementalHit(enemy, damage(awakened ? 32 : 18), element.id, index, awakened);
      }
      burst(hero.x, hero.y, color, 20);
    } else if (element.id === 'water') {
      let pulled = 0;
      for (const enemy of enemies) {
        const distance = dist(hero, enemy) || 1;
        if (distance < (awakened ? 175 : 125)) {
          enemy.x += (hero.x - enemy.x) / distance * (awakened ? 110 : 80);
          enemy.y += (hero.y - enemy.y) / distance * (awakened ? 110 : 80);
          applyElementalHit(enemy, damage(awakened ? 28 : 18), element.id, index, awakened);
          pulled++;
        }
      }
      state.health = Math.min(state.maxHealth, state.health + pulled * (awakened ? 5 : 3));
      burst(hero.x, hero.y, color, 20);
    } else if (element.id === 'light') {
      const direction = movementDirection();
      hero.x = Math.max(25, Math.min(size().w - 25, hero.x + direction.x * 130));
      hero.y = Math.max(25, Math.min(size().h - 25, hero.y + direction.y * 130));
      for (const enemy of enemies) if (dist(hero, enemy) < 85) enemy.mark = Math.max(enemy.mark, 5);
      burst(hero.x, hero.y, color, 18);
    } else if (element.id === 'dark') {
      for (const enemy of enemies) if (dist(hero, enemy) < 125) applyElementalHit(enemy, damage(38), element.id, index, awakened);
      state.health = Math.min(state.maxHealth, state.health + (awakened ? 35 : 20));
      burst(hero.x, hero.y, color, 20);
    } else if (element.id === 'poison') {
      let toxin = 0;
      for (const enemy of enemies) {
        if (dist(hero, enemy) < (awakened ? 190 : 140) && enemy.poison > 0) {
          toxin += enemy.poison;
          enemy.poison = 0;
        }
      }
      state.shield = Math.max(state.shield, Math.min(18, (awakened ? 7 : 4) + toxin * 0.45));
      burst(hero.x, hero.y, color, 20);
    } else if (element.id === 'electric') {
      const direction = movementDirection();
      const start = { x: hero.x, y: hero.y };
      hero.x = Math.max(25, Math.min(size().w - 25, hero.x + direction.x * 145));
      hero.y = Math.max(25, Math.min(size().h - 25, hero.y + direction.y * 145));
      const dashX = hero.x - start.x;
      const dashY = hero.y - start.y;
      const dashLength = Math.hypot(dashX, dashY) || 1;
      for (const enemy of enemies) {
        const along = ((enemy.x - start.x) * dashX + (enemy.y - start.y) * dashY) / dashLength;
        const across = Math.abs((enemy.x - start.x) * dashY - (enemy.y - start.y) * dashX) / dashLength;
        if (along >= 0 && along <= dashLength && across < enemy.r + 18) {
          applyElementalHit(enemy, damage(awakened ? 88 : 58), element.id, index, awakened);
          enemy.stun = Math.max(enemy.stun || 0, 0.35);
        }
      }
      burst(start.x, start.y, color, 8);
      burst(hero.x, hero.y, color, 20);
    } else if (element.id === 'crystal') {
      state.shield = Math.max(state.shield, awakened ? 18 : 12);
      state.reflectTimer = Math.max(state.reflectTimer, awakened ? 14 : 9);
      burst(hero.x, hero.y, color, awakened ? 32 : 24);
    } else if (element.id === 'blood') {
      state.health = Math.max(1, Math.min(state.maxHealth, state.health + (awakened ? 45 : 28)) - 8);
      burst(hero.x, hero.y, color, 18);
    } else if (element.id === 'time') {
      const rewindTime = state.runTime - 2;
      let destination = state.playerHistory.find(position => position.time >= rewindTime);
      if (!destination) destination = state.playerHistory[0];
      if (destination) {
        const oldX = hero.x;
        const oldY = hero.y;
        hero.x = Math.max(25, Math.min(size().w - 25, destination.x));
        hero.y = Math.max(25, Math.min(size().h - 25, destination.y));
        burst(oldX, oldY, color, 14);
        burst(hero.x, hero.y, color, 24);
      }
    } else {
      state.health = Math.min(state.maxHealth, state.health + (awakened ? 42 : 26));
      state.abilityTimers = state.abilityTimers.map((timer, i) => i === 2 ? timer : Math.max(0, timer - (awakened ? 4 : 2)));
      burst(hero.x, hero.y, color, 18);
    }
  } else {
    if (element.id === 'metal') {
      const radius = awakened ? 260 : 180;
      for (const enemy of enemies) {
        const distance = dist(hero, enemy) || 1;
        if (distance < radius) {
          enemy.x += (hero.x - enemy.x) / distance * (awakened ? 105 : 70);
          enemy.y += (hero.y - enemy.y) / distance * (awakened ? 105 : 70);
          applyElementalHit(enemy, damage(awakened ? 125 : 78), element.id, index, awakened);
          enemy.stun = Math.max(enemy.stun || 0, awakened ? 1.2 : 0.6);
        }
      }
      burst(hero.x, hero.y, color, awakened ? 36 : 26);
    } else if (element.id === 'digital') {
      for (const enemy of enemies) {
        applyElementalHit(enemy, damage(awakened ? 115 : 72), element.id, index, awakened);
        enemy.stun = Math.max(enemy.stun || 0, awakened ? 1.2 : 0.7);
        burst(enemy.x, enemy.y, color, 8);
      }
      burst(hero.x, hero.y, color, 32);
    } else if (element.id === 'fire') {
      const direction = movementDirection();
      const center = target || { x: hero.x + direction.x * 180, y: hero.y + direction.y * 180 };
      const angle = Math.atan2(center.y - hero.y, center.x - hero.x);
      for (const enemy of enemies) {
        const along = (enemy.x - hero.x) * Math.cos(angle) + (enemy.y - hero.y) * Math.sin(angle);
        const across = Math.abs((enemy.x - hero.x) * Math.sin(angle) - (enemy.y - hero.y) * Math.cos(angle));
        if (along > 0 && along < (awakened ? 360 : 250) && across < (awakened ? 60 : 38)) applyElementalHit(enemy, damage(awakened ? 115 : 78), element.id, index, awakened);
      }
      burst(center.x, center.y, color, 30);
    } else if (element.id === 'ice') {
      for (const enemy of enemies) {
        enemy.slow = Math.max(enemy.slow, awakened ? 12 : 8);
        if (dist(hero, enemy) < (awakened ? 250 : 180)) applyElementalHit(enemy, damage(70), element.id, index, awakened);
      }
      burst(hero.x, hero.y, color, 30);
    } else if (element.id === 'nature') {
      const direction = movementDirection();
      const angle = Math.atan2(direction.y, direction.x);
      for (const enemy of enemies) {
        const along = (enemy.x - hero.x) * Math.cos(angle) + (enemy.y - hero.y) * Math.sin(angle);
        const across = Math.abs((enemy.x - hero.x) * Math.sin(angle) - (enemy.y - hero.y) * Math.cos(angle));
        if (along > 0 && along < 270 && across < 34) {
          const rootBonus = enemy.root > 0 ? 1.6 : 1;
          applyElementalHit(enemy, damage(awakened ? 120 : 90) * rootBonus, element.id, index, awakened);
          enemy.root = Math.max(enemy.root, awakened ? 9 : 6);
        }
      }
      burst(hero.x + direction.x * 120, hero.y + direction.y * 120, color, 24);
    } else if (element.id === 'water') {
      const direction = movementDirection();
      const angle = Math.atan2(direction.y, direction.x);
      for (const enemy of enemies) {
        const distance = dist(hero, enemy);
        const enemyAngle = Math.atan2(enemy.y - hero.y, enemy.x - hero.x);
        const difference = Math.atan2(Math.sin(enemyAngle - angle), Math.cos(enemyAngle - angle));
        if (distance < (awakened ? 270 : 200) && Math.abs(difference) < 0.8) {
          applyElementalHit(enemy, damage(awakened ? 95 : 62), element.id, index, awakened);
          const knockback = Math.atan2(enemy.y - hero.y, enemy.x - hero.x);
          enemy.x += Math.cos(knockback) * 140;
          enemy.y += Math.sin(knockback) * 140;
        }
      }
      burst(hero.x + direction.x * 100, hero.y + direction.y * 100, color, 34);
    } else if (element.id === 'light') {
      for (const enemy of enemies) if (enemy.mark > 0 || dist(hero, enemy) < (awakened ? 240 : 170)) {
        applyElementalHit(enemy, damage(awakened ? 122 : 85), element.id, index, awakened);
        burst(enemy.x, enemy.y, color, 12);
      }
      state.health = Math.min(state.maxHealth, state.health + (awakened ? 22 : 10));
    } else if (element.id === 'dark') {
      if (target) {
        const distance = dist(hero, target) || 1;
        hero.x = Math.max(25, Math.min(size().w - 25, target.x + (target.x - hero.x) / distance * 48));
        hero.y = Math.max(25, Math.min(size().h - 25, target.y + (target.y - hero.y) / distance * 48));
        for (const enemy of enemies) if (dist(target, enemy) < (awakened ? 155 : 105)) applyElementalHit(enemy, damage(95), element.id, index, awakened);
        burst(hero.x, hero.y, color, 28);
      }
      state.health = Math.min(state.maxHealth, state.health + (awakened ? 32 : 18));
    } else if (element.id === 'poison') {
      const center = target || hero;
      for (const enemy of enemies) if (enemy.poison > 0) {
        if (dist(center, enemy) < (awakened ? 250 : 185)) {
          const storedPoison = enemy.poison;
          enemy.poison = 0;
          damageEnemy(enemy, damage(awakened ? 58 : 40) + storedPoison * (awakened ? 8 : 6));
          burst(enemy.x, enemy.y, color, 14);
          for (const nearby of enemies) {
            if (nearby !== enemy && dist(enemy, nearby) < 72) {
              nearby.poison = Math.max(nearby.poison, awakened ? 5 : 3);
            }
          }
        }
      }
      burst(center.x, center.y, color, 34);
    } else if (element.id === 'electric') {
      const center = target || hero;
      const radius = awakened ? 185 : 135;
      for (const enemy of enemies) {
        if (dist(center, enemy) < radius) {
          applyElementalHit(enemy, damage(awakened ? 112 : 78), element.id, index, awakened);
          enemy.stun = Math.max(enemy.stun || 0, awakened ? 1.8 : 1);
          burst(enemy.x, enemy.y, color, 10);
        }
      }
    } else if (element.id === 'crystal') {
      for (let i = 0; i < 16; i++) {
        const angle = i * Math.PI / 8;
        state.shots.push({ x: hero.x, y: hero.y, vx: Math.cos(angle) * 340, vy: Math.sin(angle) * 340, r: 8, damage: damage(42), color, elementId: element.id, abilityIndex: index, awakened, pierce: 3 });
      }
      state.shield = awakened ? 14 : 9;
    } else if (element.id === 'blood') {
      const weakest = enemies.slice().sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
      if (weakest) {
        const threshold = awakened ? 0.35 : 0.2;
        const strike = weakest.hp / weakest.maxHp < threshold ? weakest.hp + 1 : damage(awakened ? 155 : 105);
        applyElementalHit(weakest, strike, element.id, index, awakened);
        burst(weakest.x, weakest.y, color, 25);
      }
    } else {
      for (const enemy of enemies) {
        enemy.slow = Math.max(enemy.slow, awakened ? 12 : 8);
        if (dist(hero, enemy) < (awakened ? 260 : 190)) applyElementalHit(enemy, damage(awakened ? 110 : 68), element.id, index, awakened);
      }
      burst(hero.x, hero.y, color, 26);
    }
  }
  const castDestination = { x: hero.x, y: hero.y };
  const moved = dist(castOrigin, castDestination) > 20;
  state.abilityEffects.push({
    kind: moved ? 'teleport' : ['projectile', 'area', 'guard', 'ultimate'][index],
    x: (index === 0 || index === 1 || index === 3) && targetPoint ? targetPoint.x : castDestination.x,
    y: (index === 0 || index === 1 || index === 3) && targetPoint ? targetPoint.y : castDestination.y,
    fromX: castOrigin.x,
    fromY: castOrigin.y,
    toX: castDestination.x,
    toY: castDestination.y,
    color,
    elementId: element.id,
    label: element.moves && profile.awakened.includes(element.id) && profile.moves[element.id]?.[index]
      ? element.awakeMoves[index]
      : element.baseMoves[index],
    key: moveKeys[index].toUpperCase(),
    life: moved ? 0.85 : 0.7,
    duration: moved ? 0.85 : 0.7,
    angle: targetPoint ? Math.atan2(targetPoint.y - castOrigin.y, targetPoint.x - castOrigin.x) : Math.atan2(movementDirection().y, movementDirection().x)
  });
  state.abilityTimers[index] = [5, 8, 12, 16][index] * (awakened ? 1.25 : 1) * state.attackSpeed;
  updateHud();
}

function movementDirection() {
  let x = (state.keys.has('d') ? 1 : state.keys.has('a') ? -1 : 0) + joystick.x;
  let y = (state.keys.has('s') ? 1 : state.keys.has('w') ? -1 : 0) + joystick.y;
  const length = Math.hypot(x, y);
  if (length) return { x: x / length, y: y / length };
  const target = nearestEnemy();
  if (!target) return { x: 0, y: -1 };
  x = target.x - state.player.x;
  y = target.y - state.player.y;
  const aimLength = Math.hypot(x, y) || 1;
  return { x: x / aimLength, y: y / aimLength };
}

function nearestEnemy() {
  const enemies = state.entities.filter(entity => entity.type !== 'fragment' && !entity.dead);
  return enemies.length ? enemies.reduce((nearest, enemy) => dist(state.player, enemy) < dist(state.player, nearest) ? enemy : nearest) : null;
}

function drawElementMotif(effect, progress) {
  const { x, y, color, elementId } = effect;
  const radius = 18 + progress * 42;
  context.strokeStyle = color;
  context.fillStyle = color;
  context.lineWidth = 2;
  context.beginPath();
  if (elementId === 'fire') {
    for (let i = 0; i < 3; i++) {
      const offset = i * Math.PI * 2 / 3 + progress * 3;
      context.moveTo(x + Math.cos(offset) * 8, y + Math.sin(offset) * 8);
      context.quadraticCurveTo(x + Math.cos(offset + 0.35) * radius, y + Math.sin(offset + 0.35) * radius, x + Math.cos(offset + 0.7) * 8, y + Math.sin(offset + 0.7) * 8);
    }
    context.stroke();
  } else if (elementId === 'ice') {
    for (let i = 0; i < 6; i++) {
      const angle = i * Math.PI / 3 + progress * 0.5;
      context.moveTo(x, y);
      context.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
      context.lineTo(x + Math.cos(angle + 0.18) * radius * 0.48, y + Math.sin(angle + 0.18) * radius * 0.48);
    }
    context.stroke();
  } else if (elementId === 'nature') {
    for (let i = 0; i < 4; i++) {
      const angle = i * Math.PI / 2 + progress;
      const tipX = x + Math.cos(angle) * radius;
      const tipY = y + Math.sin(angle) * radius;
      context.moveTo(x, y);
      context.lineTo(tipX, tipY);
      context.moveTo(x + Math.cos(angle) * radius * 0.55, y + Math.sin(angle) * radius * 0.55);
      context.lineTo(x + Math.cos(angle + 0.55) * radius * 0.78, y + Math.sin(angle + 0.55) * radius * 0.78);
    }
    context.stroke();
  } else if (elementId === 'water') {
    for (let i = 0; i < 3; i++) {
      const yOffset = (i - 1) * 10;
      context.moveTo(x - radius, y + yOffset);
      context.quadraticCurveTo(x - radius * 0.45, y + yOffset - 12, x, y + yOffset);
      context.quadraticCurveTo(x + radius * 0.45, y + yOffset + 12, x + radius, y + yOffset);
    }
    context.stroke();
  } else if (elementId === 'light') {
    for (let i = 0; i < 12; i++) {
      const angle = i * Math.PI / 6;
      context.moveTo(x + Math.cos(angle) * 10, y + Math.sin(angle) * 10);
      context.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
    }
    context.stroke();
  } else if (elementId === 'dark') {
    for (let i = 0; i < 3; i++) {
      const start = progress * 5 + i * Math.PI * 2 / 3;
      context.moveTo(x + Math.cos(start) * radius, y + Math.sin(start) * radius);
      for (let step = 1; step <= 12; step++) {
        const t = step / 12;
        const angle = start + t * Math.PI * 1.5;
        const r = radius * (1 - t * 0.88);
        context.lineTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r);
      }
    }
    context.stroke();
  } else if (elementId === 'poison') {
    for (let i = 0; i < 7; i++) {
      const angle = i * 2.4 + progress * 2;
      const bubbleRadius = 2 + (i % 3) * 1.5;
      context.moveTo(x + Math.cos(angle) * radius + bubbleRadius, y + Math.sin(angle) * radius);
      context.arc(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius, bubbleRadius, 0, Math.PI * 2);
    }
    context.stroke();
  } else if (elementId === 'electric') {
    for (let i = 0; i < 4; i++) {
      const angle = i * Math.PI / 2 + progress;
      for (let step = 0; step <= 4; step++) {
        const distance = radius * step / 4;
        const jitter = step === 0 || step === 4 ? 0 : (step % 2 ? 7 : -7);
        const px = x + Math.cos(angle) * distance - Math.sin(angle) * jitter;
        const py = y + Math.sin(angle) * distance + Math.cos(angle) * jitter;
        if (step === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }
    }
    context.stroke();
  } else if (elementId === 'blood') {
    for (let i = 0; i < 5; i++) {
      const angle = i * Math.PI * 2 / 5 + progress;
      const px = x + Math.cos(angle) * radius * 0.72;
      const py = y + Math.sin(angle) * radius * 0.72;
      context.moveTo(px, py - 6);
      context.quadraticCurveTo(px + 5, py, px, py + 5);
      context.quadraticCurveTo(px - 5, py, px, py - 6);
    }
    context.stroke();
  } else if (elementId === 'digital') {
    for (let i = -2; i <= 2; i++) {
      const lineY = y + i * 8;
      const shift = Math.sin(progress * 18 + i) * 12;
      context.rect(x - radius + shift, lineY, radius * 0.75, 2);
      context.rect(x + radius * 0.25 - shift, lineY + 3, radius * 0.4, 2);
    }
    context.stroke();
  }
}

function draw() {
  const { w, h } = size();
  const now = Date.now();
  context.clearRect(0, 0, w, h);
  context.save();
  if (state.shake) context.translate((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5);
  context.fillStyle = colors.field;
  context.fillRect(0, 0, w, h);
  context.strokeStyle = 'rgba(193,174,204,.18)';
  context.lineWidth = 2;
  context.strokeRect(24, 24, w - 48, h - 48);
  const torchGlow = context.createRadialGradient(48, 48, 4, 48, 48, Math.min(w, h) * 0.5);
  torchGlow.addColorStop(0, 'rgba(225,139,76,.12)');
  torchGlow.addColorStop(1, 'rgba(225,139,76,0)');
  context.fillStyle = torchGlow;
  context.fillRect(24, 24, w - 48, h - 48);
  for (const decoration of state.decorations) {
    const glow = 0.08 + Math.sin(now / 500 + decoration.phase) * 0.03;
    context.fillStyle = `rgba(142,113,157,${glow})`;
    context.beginPath();
    context.arc(decoration.x, decoration.y, decoration.r, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = 'rgba(194,174,207,.17)';
    context.stroke();
  }
  if (state.gateOpen) {
    context.strokeStyle = colors.loot;
    context.lineWidth = 3;
    context.beginPath();
    context.arc(w / 2, 25, 16 + Math.sin(now / 150) * 4, 0, Math.PI * 2);
    context.stroke();
    context.fillStyle = colors.loot;
    context.font = '9px DM Mono';
    context.fillText('EXIT', w / 2 - 11, 56);
  }
  for (const effect of state.abilityEffects) {
    const progress = 1 - effect.life / effect.duration;
    const fade = Math.max(0, 1 - progress);
    const radius = 24 + progress * 108;
    context.save();
    context.globalAlpha = fade;
    context.strokeStyle = effect.color;
    context.fillStyle = effect.color;
    context.lineWidth = 3;
    context.shadowColor = effect.color;
    context.shadowBlur = 14;
    if (effect.kind === 'projectile') {
      const length = Math.hypot(effect.x - effect.fromX, effect.y - effect.fromY);
      const endX = effect.fromX + Math.cos(effect.angle) * Math.min(length, 150);
      const endY = effect.fromY + Math.sin(effect.angle) * Math.min(length, 150);
      context.beginPath();
      context.moveTo(effect.fromX, effect.fromY);
      context.lineTo(endX, endY);
      context.stroke();
      context.beginPath();
      context.arc(endX, endY, 8 + progress * 5, 0, Math.PI * 2);
      context.fill();
    } else if (effect.kind === 'area' || effect.kind === 'ultimate') {
      context.beginPath();
      context.arc(effect.x, effect.y, effect.kind === 'ultimate' ? radius * 1.25 : radius, 0, Math.PI * 2);
      context.stroke();
      if (effect.kind === 'ultimate') {
        context.beginPath();
        context.arc(effect.x, effect.y, Math.max(8, radius * 0.62), 0, Math.PI * 2);
        context.stroke();
      }
    } else if (effect.kind === 'teleport') {
      for (const point of [{ x: effect.fromX, y: effect.fromY }, { x: effect.toX, y: effect.toY }]) {
        context.beginPath();
        context.ellipse(point.x, point.y, 17 + progress * 22, 10 + progress * 11, effect.angle, 0, Math.PI * 2);
        context.stroke();
      }
    } else {
      context.beginPath();
      context.arc(effect.x, effect.y, 22 + progress * 15, 0, Math.PI * 2);
      context.stroke();
      context.beginPath();
      for (let side = 0; side < 6; side++) {
        const angle = effect.angle + side * Math.PI / 3 + progress * 0.5;
        const x = effect.x + Math.cos(angle) * 38;
        const y = effect.y + Math.sin(angle) * 38;
        if (side === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.closePath();
      context.stroke();
    }
    drawElementMotif(effect, progress);
    context.shadowBlur = 0;
    context.font = '600 9px DM Mono';
    context.textAlign = 'center';
    context.fillText(`${effect.key} · ${effect.label}`, effect.x, effect.y - 27 - progress * 12);
    context.restore();
  }
  for (const shot of state.shots) {
    context.strokeStyle = shot.color || 'rgba(247,233,180,.35)';
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(shot.x - shot.vx * 0.035, shot.y - shot.vy * 0.035);
    context.lineTo(shot.x, shot.y);
    context.stroke();
    context.fillStyle = shot.color || colors.shot;
    context.beginPath();
    context.arc(shot.x, shot.y, shot.r, 0, Math.PI * 2);
    context.fill();
  }
  for (const blade of state.orbitingBlades) {
    context.save();
    context.translate(blade.x, blade.y);
    context.rotate(blade.angle);
    context.fillStyle = blade.color;
    context.strokeStyle = '#e0e5ec';
    context.lineWidth = 1.5;
    context.beginPath();
    context.moveTo(0, -12);
    context.lineTo(5, -2);
    context.lineTo(0, 12);
    context.lineTo(-5, -2);
    context.closePath();
    context.fill();
    context.stroke();
    context.restore();
  }
  for (const shot of state.enemyShots) {
    context.strokeStyle = shot.color || 'rgba(191,82,98,.38)';
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(shot.x - shot.vx * 0.06, shot.y - shot.vy * 0.06);
    context.lineTo(shot.x, shot.y);
    context.stroke();
    context.fillStyle = shot.color || colors.boss;
    context.strokeStyle = shot.color || '#edb394';
    context.lineWidth = 2;
    context.beginPath();
    context.arc(shot.x, shot.y, shot.r, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  }
  for (const entity of state.entities) {
    if (entity.type === 'fragment') {
      context.save();
      context.translate(entity.x, entity.y);
      context.rotate(entity.spin);
      context.fillStyle = colors.loot;
      context.beginPath();
      context.moveTo(0, -entity.r);
      context.lineTo(entity.r, 0);
      context.lineTo(0, entity.r);
      context.lineTo(-entity.r, 0);
      context.closePath();
      context.fill();
      context.restore();
      if (entity.value > 1) {
        context.fillStyle = colors.text;
        context.font = '9px DM Mono';
        context.textAlign = 'center';
        context.fillText(`+${entity.value}`, entity.x, entity.y - 13);
      }
      continue;
    }
    const boss = isBoss(entity);
    const enemyElement = entity.type === 'awakenedBoss' ? getElement(entity.elementId || state.bossElement) : null;
    context.fillStyle = enemyElement ? enemyElement.color : boss ? colors.boss : colors.enemy;
    context.globalAlpha = entity.hit ? 0.5 : 1;
    context.beginPath();
    context.arc(entity.x, entity.y, entity.r, 0, Math.PI * 2);
    context.fill();
    context.globalAlpha = 1;
    if (boss) {
      const bossElement = enemyElement;
      context.strokeStyle = entity.type === 'awakenedBoss' && bossElement ? bossElement.color : '#edb394';
      context.lineWidth = 3;
      context.stroke();
      context.fillStyle = colors.text;
      context.font = '9px DM Mono';
      context.textAlign = 'center';
      context.fillText(entity.type === 'awakenedBoss' && bossElement ? bossElement.awakenedName : entity.type === 'awakenedBoss' ? 'AWAKENED' : 'MINIBOSS', entity.x, entity.y + 3);
      context.fillStyle = '#392b3a';
      context.fillRect(entity.x - 32, entity.y - entity.r - 10, 64, 4);
      context.fillStyle = colors.loot;
      context.fillRect(entity.x - 32, entity.y - entity.r - 10, 64 * Math.max(0, entity.hp / entity.maxHp), 4);
    }
  }
  const hero = state.player;
  const element = getElement();
  context.shadowColor = element ? element.color : '#54a89b';
  context.shadowBlur = 18;
  context.fillStyle = element ? element.color : '#54a89b';
  context.beginPath();
  context.arc(hero.x, hero.y, hero.r, 0, Math.PI * 2);
  context.fill();
  context.shadowBlur = 0;
  context.strokeStyle = '#d6f2dc';
  context.lineWidth = 3;
  context.stroke();
  if (state.shield > 0) {
    context.strokeStyle = element ? element.color : '#61c9a2';
    context.lineWidth = 2;
    context.beginPath();
    context.arc(hero.x, hero.y, hero.r + 7 + Math.sin(now / 90) * 2, 0, Math.PI * 2);
    context.stroke();
  }
  if (state.combo > 1 && state.comboTimer > 0) {
    context.fillStyle = colors.loot;
    context.font = '600 16px Space Grotesk';
    context.textAlign = 'center';
    context.fillText(`x${state.combo} COMBO`, hero.x, hero.y - 28);
  }
  for (const particle of state.particles) {
    context.globalAlpha = Math.max(0, particle.life * 2);
    context.fillStyle = particle.color;
    context.beginPath();
    context.arc(particle.x, particle.y, 2.5, 0, Math.PI * 2);
    context.fill();
    context.globalAlpha = 1;
  }
  const vignette = context.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.25, w / 2, h / 2, Math.max(w, h) * 0.72);
  vignette.addColorStop(0, 'transparent');
  vignette.addColorStop(1, 'rgba(3,12,13,.42)');
  context.fillStyle = vignette;
  context.fillRect(0, 0, w, h);
  context.restore();
}

function updateHud() {
  const element = getElement();
  document.getElementById('health-value').textContent = Math.max(0, Math.ceil(state.health));
  document.getElementById('health-meter').style.width = `${Math.max(0, state.health / state.maxHealth * 100)}%`;
  document.getElementById('fragments-value').textContent = String(profile.fragments).padStart(2, '0');
  document.getElementById('depth-value').textContent = String(state.room).padStart(2, '0');
  document.getElementById('room-label').textContent = `ROOM ${String(state.room).padStart(2, '0')}`;
  document.getElementById('element-name').textContent = elementName(element);
  document.getElementById('element-name').style.color = element ? element.color : '';
  document.getElementById('element-orb').style.color = element ? element.color : '';
  document.getElementById('element-orb').style.borderColor = element ? element.color : '';
  document.getElementById('element-desc').textContent = element ? (profile.awakened.includes(element.id) ? 'AWAKENED ELEMENT' : element.moves ? 'ELEMENT EQUIPPED' : 'NO AWAKENING · BASE MOVES') : 'NO ELEMENT · NO ABILITIES';
  if (state.health <= 0) endRun();
}

function renderElementShop() {
  const list = document.getElementById('element-list');
  list.replaceChildren();
  for (const element of elements) {
    const owned = profile.unlocked.includes(element.id);
    const equipped = profile.equipped === element.id;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `element-option${owned ? '' : ' locked'}${equipped ? ' selected' : ''}`;
    button.dataset.element = element.id;
    const name = document.createElement('strong');
    name.textContent = elementName(element);
    const cost = document.createElement('span');
    cost.textContent = owned ? (equipped ? 'EQUIPPED' : 'SWAP FREE') : `${element.cost} FRAGMENTS`;
    button.append(name, cost);
    list.append(button);
  }
}

function renderAbilities() {
  const element = getElement();
  const list = document.getElementById('ability-list');
  list.replaceChildren();
  for (let index = 0; index < 4; index++) {
    const row = document.createElement('div');
    row.className = 'ability-row';
    const key = document.createElement('kbd');
    key.textContent = moveKeys[index].toUpperCase();
    const name = document.createElement('span');
    const hasAwakenedMove = Boolean(element && element.moves && profile.awakened.includes(element.id) && profile.moves[element.id]?.[index]);
    const moveName = element ? hasAwakenedMove ? element.awakeMoves[index] : element.baseMoves[index] : `ELEMENT MOVE ${index + 1}`;
    name.textContent = element ? `${elementName(element)} · ${moveName}` : moveName;
    const mobileButton = document.querySelector(`[data-mobile-ability="${index}"]`);
    mobileButton.dataset.castMove = String(index);
    mobileButton.querySelector('kbd').textContent = moveKeys[index].toUpperCase();
    mobileButton.querySelector('span').textContent = element ? moveName : 'LOCKED';
    mobileButton.setAttribute('aria-label', element ? `${moveKeys[index].toUpperCase()}: ${moveName}` : `Element move ${index + 1}: locked`);
    mobileButton.disabled = !element;
    mobileButton.classList.toggle('ready', hasAwakenedMove);
    const castButton = document.createElement('button');
    castButton.type = 'button';
    castButton.textContent = element ? 'READY' : 'LOCKED';
    castButton.disabled = !element;
    castButton.dataset.castMove = String(index);
    if (hasAwakenedMove) castButton.classList.add('ready');
    row.append(key, name, castButton);
    if (element?.moves) {
      const awakenButton = document.createElement('button');
      awakenButton.type = 'button';
      if (!profile.awakened.includes(element.id)) {
        awakenButton.textContent = 'BOSS 10';
        awakenButton.disabled = true;
      } else if (hasAwakenedMove) {
        awakenButton.textContent = 'AWAKENED';
        awakenButton.disabled = true;
        awakenButton.classList.add('ready');
      } else {
        awakenButton.textContent = `${element.moves[index]} FRAG`;
        awakenButton.dataset.move = String(index);
      }
      row.append(awakenButton);
    }
    list.append(row);
  }
}

function addLog(label, message) {
  const log = document.getElementById('log-lines');
  const item = document.createElement('p');
  const title = document.createElement('span');
  title.textContent = label;
  item.append(title, document.createTextNode(` ${message}`));
  log.prepend(item);
  while (log.children.length > 3) log.lastElementChild.remove();
}

function endRun() {
  localStorage.removeItem(runSaveKey);
  document.getElementById('run-state').textContent = 'RUN ENDED';
  document.getElementById('end-title').textContent = 'THE CIRCLE FADES';
  document.getElementById('end-copy').textContent = `You reached room ${state.room} with ${profile.fragments} fragments.`;
  document.getElementById('end-modal').classList.remove('hidden');
}

function loop(time) {
  const dt = Math.min(0.04, (time - state.lastTime) / 1000 || 0);
  state.lastTime = time;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

function dash() {
  if (!controlsChosen || state.health <= 0 || state.playerStun > 0 || state.dashTimer > 0) return;
  state.dashTimer = state.dashCooldown;
  const hero = state.player;
  let dx = (state.keys.has('d') ? 1 : state.keys.has('a') ? -1 : 0) + joystick.x;
  let dy = (state.keys.has('s') ? 1 : state.keys.has('w') ? -1 : 0) + joystick.y;
  const length = Math.hypot(dx, dy);
  if (length) {
    hero.x = Math.max(25, Math.min(size().w - 25, hero.x + dx / length * 70));
    hero.y = Math.max(25, Math.min(size().h - 25, hero.y + dy / length * 70));
  }
  const element = getElement();
  burst(hero.x, hero.y, element ? element.color : '#54a89b', 10);
}

function handleElementClick(event) {
  const button = event.target.closest('[data-element], [data-move], [data-cast-move]');
  if (!button) return;
  if (button.dataset.castMove !== undefined) {
    useAbility(Number(button.dataset.castMove));
    return;
  }
  if (button.dataset.element) {
    const element = getElement(button.dataset.element);
    if (!element) return;
    if (!profile.unlocked.includes(element.id)) {
      if (profile.fragments < element.cost) return;
      profile.fragments -= element.cost;
      profile.unlocked.push(element.id);
      profile.moves[element.id] = [false, false, false, false];
      addLog('ELEMENT UNLOCKED', `${element.name} joins your collection.`);
    }
    profile.equipped = element.id;
    saveProfile();
    renderElementShop();
    renderAbilities();
    updateHud();
    return;
  }
  const element = getElement();
  const index = Number(button.dataset.move);
  if (!element?.moves || !profile.awakened.includes(element.id) || !Number.isInteger(index)) return;
  if (profile.moves[element.id]?.[index] || profile.fragments < element.moves[index]) return;
  profile.fragments -= element.moves[index];
  if (!profile.moves[element.id]) profile.moves[element.id] = [false, false, false, false];
  profile.moves[element.id][index] = true;
  saveProfile();
  addLog('MOVE LEARNED', `${moveKeys[index].toUpperCase()} · ${element.awakeMoves[index]}.`);
  renderElementShop();
  renderAbilities();
  updateHud();
}

document.addEventListener('keydown', event => {
  if (!controlsChosen) return;
  const key = event.key.toLowerCase();
  if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) event.preventDefault();
  if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) state.keys.add(key);
  if (event.repeat) return;
  if (key === 'q') rangedAttack();
  if (key === 'z') useAbility(0);
  if (key === 'x') useAbility(1);
  if (key === 'c') useAbility(2);
  if (key === 'v') useAbility(3);
  if (key === 'r') resetRun();
  if (key === ' ') dash();
});
window.addEventListener('keyup', event => state.keys.delete(event.key.toLowerCase()));
window.addEventListener('resize', resize);
canvas.addEventListener('pointermove', event => {
  const rect = canvas.getBoundingClientRect();
  aim.x = event.clientX - rect.left;
  aim.y = event.clientY - rect.top;
});
canvas.addEventListener('pointerdown', event => {
  if (event.button === 0) meleeAttack(event);
});
document.getElementById('element-list').addEventListener('click', handleElementClick);
document.getElementById('ability-list').addEventListener('click', handleElementClick);
document.getElementById('mobile-abilities').addEventListener('click', handleElementClick);
document.querySelectorAll('[data-control-mode]').forEach(button => button.addEventListener('click', () => {
  controlMode = button.dataset.controlMode;
  controlsChosen = true;
  document.getElementById('controls-modal').classList.add('hidden');
  document.getElementById('mobile-controls').classList.toggle('active', controlMode === 'mobile');
  document.getElementById('canvas-hint').textContent = controlMode === 'mobile' ? 'JOYSTICK · Q BUTTON · TAP TO MELEE' : 'WASD / ARROWS TO MOVE · Q RANGED · CLICK MELEE';
  document.getElementById('arena-move-label').textContent = controlMode === 'mobile' ? 'JOYSTICK' : 'WASD';
}));
const moveStick = document.getElementById('move-stick');
const moveKnob = moveStick.querySelector('.virtual-stick-knob');
let stickPointer = null;
function updateJoystick(event) {
  const bounds = moveStick.getBoundingClientRect();
  const limit = bounds.width * 0.34;
  const dx = event.clientX - (bounds.left + bounds.width / 2);
  const dy = event.clientY - (bounds.top + bounds.height / 2);
  const length = Math.hypot(dx, dy);
  const scale = length > limit ? limit / length : 1;
  const x = dx * scale;
  const y = dy * scale;
  moveKnob.style.transform = `translate(calc(-50% + ${x}px),calc(-50% + ${y}px))`;
  joystick.x = x / limit;
  joystick.y = y / limit;
}
function releaseJoystick() {
  stickPointer = null;
  joystick.x = 0;
  joystick.y = 0;
  moveKnob.style.transform = 'translate(-50%,-50%)';
}
moveStick.addEventListener('pointerdown', event => {
  event.preventDefault();
  stickPointer = event.pointerId;
  moveStick.setPointerCapture(stickPointer);
  updateJoystick(event);
});
moveStick.addEventListener('pointermove', event => {
  if (event.pointerId === stickPointer) updateJoystick(event);
});
moveStick.addEventListener('pointerup', releaseJoystick);
moveStick.addEventListener('pointercancel', releaseJoystick);
document.getElementById('mobile-dash').addEventListener('pointerdown', event => {
  event.preventDefault();
  event.stopPropagation();
  dash();
});
document.getElementById('mobile-ranged').addEventListener('pointerdown', event => {
  event.preventDefault();
  event.stopPropagation();
  rangedAttack();
});
document.querySelectorAll('.upgrade-choice').forEach(button => button.addEventListener('click', () => {
  const upgrades = {
    vitality: () => { state.health = Math.min(state.maxHealth, state.health + 25); },
    power: () => { state.damageBoost *= 1.2; },
    haste: () => { state.fireBoost *= 0.88; state.attackSpeed *= 0.88; },
    fleet: () => { state.moveSpeed *= 1.15; },
    reach: () => { state.meleeRange *= 1.25; },
    quickstep: () => { state.dashCooldown = Math.max(0.3, state.dashCooldown * 0.8); },
    scavenger: () => { state.fragmentBonus++; }
  };
  const applyUpgrade = upgrades[button.dataset.upgrade];
  if (!applyUpgrade) return;
  applyUpgrade();
  state.gateOpen = true;
  document.getElementById('upgrade-modal').classList.add('hidden');
  document.getElementById('wave-status').textContent = 'GATE OPEN';
  addLog('UPGRADE', `${button.querySelector('strong').textContent} acquired.`);
  updateHud();
  saveRun();
}));
document.getElementById('restart-button').addEventListener('click', () => {
  document.getElementById('run-state').textContent = 'RUN IN PROGRESS';
  resetRun();
});
window.addEventListener('pagehide', saveRun);
profile.equipped = profile.unlocked.includes(profile.equipped) ? profile.equipped : null;
resetRun(true);
requestAnimationFrame(loop);
