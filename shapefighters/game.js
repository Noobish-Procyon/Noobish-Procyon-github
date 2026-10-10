"use strict";

const SAVE_KEY = "noobish-shapefighters-save-v1";
const shapeData = {
  circle: { name: "Circle", stats: { strength: 100, hp: 100, magic: 100, defense: 100 }, color: "#a99bff" },
  square: { name: "Square", stats: { strength: 100, hp: 125, magic: 75, defense: 150 }, color: "#ffad74" },
  triangle: { name: "Triangle", stats: { strength: 125, hp: 100, magic: 150, defense: 100 }, color: "#6bd4c4" },
  star: { name: "Star", stats: { strength: 125, hp: 125, magic: 100, defense: 100 }, color: "#f1d26e" }
};
const elementData = {
  storm: { name: "Storm", beats: "water", weakTo: "ice", color: "#a99bff", hint: "Storm strikes hardest against Water." },
  fire: { name: "Fire", beats: "ice", weakTo: "water", color: "#ff936d", hint: "Fire burns brightest against Ice." },
  ice: { name: "Ice", beats: "storm", weakTo: "fire", color: "#93e4f5", hint: "Ice freezes Storm in its tracks." },
  water: { name: "Water", beats: "fire", weakTo: "storm", color: "#65c2ef", hint: "Water puts out Fire." }
};
const spells = {
  storm: [
    { name: "Spark Jolt", power: 22, kind: "magic" },
    { name: "Thunderclap", power: 34, kind: "magic" },
    { name: "Tempest Core", power: 48, kind: "magic" },
    { name: "Charged Slam", power: 28, kind: "physical" }
  ],
  fire: [
    { name: "Ember Shot", power: 22, kind: "magic" },
    { name: "Flare Burst", power: 34, kind: "magic" },
    { name: "Inferno Wave", power: 48, kind: "magic" },
    { name: "Blazing Bash", power: 28, kind: "physical" }
  ],
  ice: [
    { name: "Frost Shard", power: 22, kind: "magic" },
    { name: "Glacier Crash", power: 34, kind: "magic" },
    { name: "Whiteout", power: 48, kind: "magic" },
    { name: "Frozen Strike", power: 28, kind: "physical" }
  ],
  water: [
    { name: "Water Dart", power: 22, kind: "magic" },
    { name: "Tidal Surge", power: 34, kind: "magic" },
    { name: "Maelstrom", power: 48, kind: "magic" },
    { name: "Riptide Rush", power: 28, kind: "physical" }
  ]
};
const auraData = [
  { id: "ember", name: "Ember Aura", stat: "strength", bonus: 15, cost: 45, color: "#ff936d", icon: "✹", description: "+15 Strength · heavier physical hits." },
  { id: "tide", name: "Tide Aura", stat: "hp", bonus: 20, cost: 55, color: "#65c2ef", icon: "≈", description: "+20 HP · more room to stay in the fight." },
  { id: "bastion", name: "Bastion Aura", stat: "defense", bonus: 15, cost: 60, color: "#b6ea78", icon: "⬡", description: "+15 Defense · take less damage." },
  { id: "arcane", name: "Arcane Aura", stat: "magic", bonus: 15, cost: 65, color: "#b6aaff", icon: "✦", description: "+15 Magic · more powerful spells." }
];
const shapeCost = 100;
const elementCost = 75;
const statLabels = { strength: "STR", hp: "HP", magic: "MAGIC", defense: "DEF" };
const shapeKeys = Object.keys(shapeData);
const elementKeys = Object.keys(elementData);
const defaultState = () => ({
  shape: "circle",
  element: "storm",
  started: false,
  coins: 0,
  wins: 0,
  losses: 0,
  evolutions: { circle: 0, square: 0, triangle: 0, star: 0 },
  ownedShapes: [],
  ownedElements: [],
  ownedAuras: [],
  equippedAura: null
});

const notice = document.getElementById("notice");

function loadState() {
  let saved;
  try {
    saved = localStorage.getItem(SAVE_KEY);
  } catch (error) {
    showNotice(`Your progress could not be read from this browser: ${error.message}`);
    return defaultState();
  }
  if (saved === null) return defaultState();
  try {
    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new SyntaxError("Invalid save data");
    const fresh = defaultState();
    const ownedAuras = Array.isArray(parsed.ownedAuras) ? [...new Set(parsed.ownedAuras.filter(id => auraData.some(aura => aura.id === id)))] : [];
    const started = typeof parsed.started === "boolean" ? parsed.started : true;
    const ownedShapes = Array.isArray(parsed.ownedShapes) ? [...new Set(parsed.ownedShapes.filter(key => shapeKeys.includes(key)))] : [];
    const ownedElements = Array.isArray(parsed.ownedElements) ? [...new Set(parsed.ownedElements.filter(key => elementKeys.includes(key)))] : [];
    if (started) {
      if (!ownedShapes.includes(parsed.shape)) ownedShapes.push(shapeKeys.includes(parsed.shape) ? parsed.shape : fresh.shape);
      if (!ownedElements.includes(parsed.element)) ownedElements.push(elementKeys.includes(parsed.element) ? parsed.element : fresh.element);
    }
    return {
      ...fresh,
      shape: shapeKeys.includes(parsed.shape) ? parsed.shape : fresh.shape,
      element: elementKeys.includes(parsed.element) ? parsed.element : fresh.element,
      started,
      coins: Number.isSafeInteger(parsed.coins) && parsed.coins >= 0 ? parsed.coins : 0,
      wins: Number.isSafeInteger(parsed.wins) && parsed.wins >= 0 ? parsed.wins : 0,
      losses: Number.isSafeInteger(parsed.losses) && parsed.losses >= 0 ? parsed.losses : 0,
      evolutions: Object.fromEntries(shapeKeys.map(key => [key, Number.isInteger(parsed.evolutions?.[key]) ? Math.max(0, Math.min(2, parsed.evolutions[key])) : 0])),
      ownedShapes,
      ownedElements,
      ownedAuras,
      equippedAura: ownedAuras.includes(parsed.equippedAura) ? parsed.equippedAura : null
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      showNotice("Your saved game could not be read. A fresh ShapeFighters save has started.");
      return defaultState();
    }
    throw error;
  }
}

let state = loadState();
let battle = null;

function showNotice(message) {
  notice.textContent = message;
  notice.hidden = false;
}

function saveState() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    notice.hidden = true;
  } catch (error) {
    showNotice(`Your progress could not be saved in this browser: ${error.message}`);
  }
}

function currentAura() {
  return auraData.find(aura => aura.id === state.equippedAura) ?? null;
}

function statsFor(shape, stage, includeAura = true) {
  const base = shapeData[shape].stats;
  const stats = Object.fromEntries(Object.entries(base).map(([key, value]) => [key, value + stage * 25]));
  const aura = includeAura && shape === state.shape ? currentAura() : null;
  if (aura) stats[aura.stat] += aura.bonus;
  return stats;
}

function playerStage(shape = state.shape) {
  return state.evolutions[shape];
}

function renderStats(container, stats) {
  container.replaceChildren(...Object.entries(statLabels).map(([key, label]) => {
    const chip = document.createElement("div");
    chip.className = "stat-chip";
    const value = document.createElement("strong");
    value.textContent = String(stats[key]);
    const name = document.createElement("small");
    name.textContent = label;
    chip.append(value, name);
    return chip;
  }));
}

function setShapeEmblem(element, shape, color) {
  element.dataset.shape = shape;
  element.style.setProperty("--shape-color", color);
}

function fighterName(shape, element, stage) {
  const prefix = ["", "Evolved ", "Ascended "][stage];
  return `${prefix}${elementData[element].name} ${shapeData[shape].name}`;
}

function renderHeader() {
  document.getElementById("coins").textContent = String(state.coins);
  document.getElementById("record").textContent = `${state.wins} W`;
  document.getElementById("losses").textContent = `${state.losses} L`;
}

function renderPlayerCard() {
  const stage = playerStage();
  const stats = statsFor(state.shape, stage);
  const color = elementData[state.element].color;
  const hp = battle?.playerHp ?? stats.hp;
  document.getElementById("player-name").textContent = fighterName(state.shape, state.element, stage);
  document.getElementById("player-element").textContent = `${elementData[state.element].name} · ${shapeData[state.shape].name}`;
  document.getElementById("player-stage").textContent = ["BASE", "EVOLVED", "ASCENDED"][stage];
  document.getElementById("player-hp-label").textContent = `${hp} / ${stats.hp}`;
  document.getElementById("player-hp-bar").style.width = `${Math.max(0, hp / stats.hp * 100)}%`;
  setShapeEmblem(document.getElementById("player-emblem"), state.shape, color);
  renderStats(document.getElementById("player-stats"), stats);
  const aura = currentAura();
  document.getElementById("equipped-aura").textContent = aura ? `✧ ${aura.name} equipped · +${aura.bonus} ${statLabels[aura.stat]}` : "No aura equipped";
}

function renderBattle() {
  renderPlayerCard();
  const rivalCard = document.getElementById("rival-card");
  const controls = document.getElementById("moves");
  const startButton = document.getElementById("start-battle");
  const prompt = document.getElementById("battle-prompt");
  const stateLabel = document.getElementById("battle-state");
  if (!battle) {
    rivalCard.classList.remove("in-match");
    document.getElementById("rival-name").textContent = "No rival yet";
    document.getElementById("rival-element").textContent = "Start a battle to meet your opponent.";
    document.getElementById("rival-stage").textContent = "—";
    document.getElementById("rival-hp-label").textContent = "—";
    document.getElementById("rival-hp-bar").style.width = "0%";
    document.getElementById("rival-quote").textContent = "Your next challenger is waiting in the arena.";
    controls.hidden = true;
    startButton.hidden = !state.started;
    startButton.textContent = "Find an opponent  →";
    stateLabel.textContent = "YOUR TURN";
    prompt.textContent = state.started ? "Start a match to choose an attack." : "Choose your free starter shape and element first.";
    return;
  }
  rivalCard.classList.add("in-match");
  const rival = battle.rival;
  document.getElementById("rival-name").textContent = fighterName(rival.shape, rival.element, rival.stage);
  document.getElementById("rival-element").textContent = `${elementData[rival.element].name} · ${shapeData[rival.shape].name}`;
  document.getElementById("rival-stage").textContent = ["BASE", "EVOLVED", "ASCENDED"][rival.stage];
  document.getElementById("rival-hp-label").textContent = `${battle.rivalHp} / ${rival.stats.hp}`;
  document.getElementById("rival-hp-bar").style.width = `${Math.max(0, battle.rivalHp / rival.stats.hp * 100)}%`;
  setShapeEmblem(document.getElementById("rival-emblem"), rival.shape, elementData[rival.element].color);
  document.getElementById("rival-quote").textContent = "A challenger from the elemental league.";
  if (battle.result) {
    controls.hidden = true;
    startButton.hidden = false;
    startButton.textContent = battle.result === "win" ? "Battle again  →" : "Try again  →";
    stateLabel.textContent = battle.result === "win" ? "VICTORY" : "DEFEAT";
    prompt.textContent = battle.result === "win" ? "You won the match and earned 25 coins." : "The match is over. You earned 8 coins for fighting.";
    return;
  }
  controls.hidden = false;
  startButton.hidden = true;
  stateLabel.textContent = "YOUR TURN";
  prompt.textContent = `Choose an attack for ${fighterName(state.shape, state.element, playerStage())}.`;
  renderMoves();
}

function renderMoves() {
  const container = document.getElementById("moves");
  const moveSet = spells[state.element];
  container.replaceChildren(...moveSet.map((spell, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `move-button${spell.kind === "physical" ? " physical" : ""}`;
    button.dataset.move = String(index);
    const info = document.createElement("span");
    const name = document.createElement("span");
    name.className = "move-name";
    name.textContent = spell.name;
    const kind = document.createElement("span");
    kind.className = "move-kind";
    kind.textContent = spell.kind === "magic" ? "Magic spell" : "Physical spell";
    info.append(name, kind);
    const power = document.createElement("span");
    power.className = "move-power";
    power.textContent = `${spell.power} PWR`;
    button.append(info, power);
    button.addEventListener("click", () => playerAttack(index));
    return button;
  }));
}

function renderShapeMenu() {
  const shapes = document.getElementById("shape-options");
  shapes.replaceChildren(...shapeKeys.map(key => {
    const shape = shapeData[key];
    const owned = !state.started || state.ownedShapes.includes(key);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `shape-option${state.shape === key ? " selected" : ""}${owned ? "" : " locked"}`;
    button.setAttribute("aria-pressed", String(state.shape === key));
    button.disabled = Boolean(battle && !battle.result);
    const emblem = document.createElement("span");
    emblem.className = "shape-emblem";
    emblem.setAttribute("aria-hidden", "true");
    setShapeEmblem(emblem, key, shape.color);
    const copy = document.createElement("span");
    const name = document.createElement("strong");
    name.textContent = shape.name;
    const stage = document.createElement("small");
    stage.textContent = !state.started ? "Free starter" : owned ? ["Base form", "Evolved", "Ascended"][state.evolutions[key]] : `🔒 ${shapeCost} coins`;
    copy.append(name, stage);
    button.append(emblem, copy);
    button.addEventListener("click", () => {
      if (battle && !battle.result) return;
      if (!state.started || owned) {
        battle = null;
        state.shape = key;
        saveState();
        renderAll();
      } else {
        buyShape(key);
      }
    });
    return button;
  }));
  const elementOptions = document.getElementById("element-options");
  elementOptions.replaceChildren(...elementKeys.map(key => {
    const owned = !state.started || state.ownedElements.includes(key);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `element-button${state.element === key ? " selected" : ""}${owned ? "" : " locked"}`;
    button.dataset.element = key;
    button.setAttribute("aria-pressed", String(state.element === key));
    button.disabled = Boolean(battle && !battle.result);
    button.textContent = `${owned ? "" : "🔒 "}${elementData[key].name}${owned || !state.started ? "" : ` · ${elementCost}◈`}`;
    button.addEventListener("click", () => {
      if (battle && !battle.result) return;
      if (!state.started || owned) {
        battle = null;
        state.element = key;
        saveState();
        renderAll();
      } else {
        buyElement(key);
      }
    });
    return button;
  }));
  const element = elementData[state.element];
  const loadoutLocked = Boolean(battle && !battle.result);
  const starterBanner = document.getElementById("starter-banner");
  starterBanner.hidden = state.started;
  document.getElementById("lock-starter").textContent = `Lock in ${element.name} ${shapeData[state.shape].name}  →`;
  document.getElementById("loadout-feedback").textContent = "";
  document.getElementById("element-heading").textContent = `${shapeData[state.shape].name} of ${element.name}`;
  document.getElementById("element-hint").textContent = `${element.hint} Strong against ${elementData[element.beats].name}; vulnerable to ${elementData[element.weakTo].name}.${loadoutLocked ? " Loadout changes unlock after the match." : ""}`;
  document.getElementById("evolution-heading").textContent = `${shapeData[state.shape].name} evolution`;
  document.getElementById("wins-until-evolution").textContent = `${state.wins} TOTAL WINS`;
  renderEvolution();
  renderStats(document.getElementById("shape-stats"), statsFor(state.shape, state.evolutions[state.shape], false));
  document.getElementById("evolution-panel").hidden = !state.started;
}

function renderEvolution() {
  const container = document.getElementById("evolution-list");
  const stage = playerStage();
  const unlocks = [3, 8];
  container.replaceChildren(...unlocks.map((winsNeeded, index) => {
    const nextStage = index + 1;
    const row = document.createElement("div");
    row.className = "evolution-step";
    const info = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = nextStage === 1 ? "Evolved form" : "Ascended form";
    const detail = document.createElement("small");
    detail.textContent = `+25 to every base stat · ${winsNeeded} league wins`;
    info.append(name, detail);
    const button = document.createElement("button");
    button.type = "button";
    button.disabled = Boolean(battle && !battle.result);
    const unlocked = state.wins >= winsNeeded;
    if (stage >= nextStage) {
      button.textContent = "UNLOCKED";
      button.disabled = true;
    } else if (unlocked) {
      button.textContent = "EVOLVE";
      button.addEventListener("click", () => evolve(nextStage));
    } else {
      button.textContent = `${winsNeeded - state.wins} WINS`;
      button.disabled = true;
    }
    row.append(info, button);
    return row;
  }));
}

function renderAuraShop() {
  document.getElementById("shop-coins").textContent = String(state.coins);
  const container = document.getElementById("aura-grid");
  container.replaceChildren(...auraData.map(aura => {
    const owned = state.ownedAuras.includes(aura.id);
    const equipped = state.equippedAura === aura.id;
    const card = document.createElement("article");
    card.className = "aura-card";
    const gem = document.createElement("span");
    gem.className = "aura-gem";
    gem.style.setProperty("--aura-color", aura.color);
    gem.setAttribute("aria-hidden", "true");
    gem.textContent = aura.icon;
    const copy = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = aura.name;
    const description = document.createElement("p");
    description.textContent = aura.description;
    copy.append(title, description);
    const button = document.createElement("button");
    button.type = "button";
    if (equipped) {
      button.textContent = "EQUIPPED";
      button.disabled = true;
    } else if (owned) {
      button.textContent = "EQUIP";
      button.disabled = Boolean(battle && !battle.result);
      button.addEventListener("click", () => {
        if (battle && !battle.result) return;
        battle = null;
        state.equippedAura = aura.id;
        saveState();
        renderAll();
      });
    } else {
      button.textContent = `◈ ${aura.cost}`;
      button.disabled = state.coins < aura.cost || Boolean(battle && !battle.result);
      button.setAttribute("aria-label", `Buy ${aura.name} for ${aura.cost} coins`);
      button.addEventListener("click", () => buyAura(aura));
    }
    card.append(gem, copy, button);
    return card;
  }));
}

function renderAll() {
  renderHeader();
  renderBattle();
  renderShapeMenu();
  renderAuraShop();
}

function showScreen(name) {
  if (!state.started && name !== "shapes") {
    showNotice("Choose and lock in your free starter shape and element first.");
    return;
  }
  document.querySelectorAll(".screen").forEach(screen => {
    const active = screen.id === `screen-${name}`;
    screen.hidden = !active;
    screen.classList.toggle("active", active);
  });
  document.querySelectorAll(".nav-button").forEach(button => {
    const active = button.dataset.screen === name;
    button.classList.toggle("active", active);
    button.setAttribute("aria-current", active ? "page" : "false");
  });
}

function setLog(message) {
  const log = document.getElementById("battle-log");
  const text = document.createElement("p");
  text.textContent = message;
  const marker = document.createElement("span");
  marker.className = "log-marker";
  marker.textContent = "✦";
  marker.setAttribute("aria-hidden", "true");
  log.replaceChildren(marker, text);
}

function chooseRival() {
  const shape = shapeKeys[Math.floor(Math.random() * shapeKeys.length)];
  const element = elementKeys[Math.floor(Math.random() * elementKeys.length)];
  const stage = playerStage();
  const stats = statsFor(shape, stage, false);
  return { shape, element, stage, stats };
}

function startBattle() {
  if (!state.started) {
    showNotice("Choose and lock in your free starter shape and element first.");
    return;
  }
  const stats = statsFor(state.shape, playerStage());
  battle = { rival: chooseRival(), playerHp: stats.hp, rivalHp: 0, result: null };
  battle.rivalHp = battle.rival.stats.hp;
  setLog(`A ${elementData[battle.rival.element].name} ${shapeData[battle.rival.shape].name} enters the arena. Choose a spell.`);
  renderAll();
}

function affinityMultiplier(attackerElement, defenderElement) {
  if (elementData[attackerElement].beats === defenderElement) return 1.5;
  if (elementData[defenderElement].beats === attackerElement) return 0.75;
  return 1;
}

function calculateDamage(spell, attackerStats, attackerElement, defenderStats, defenderElement) {
  const offense = spell.kind === "magic" ? attackerStats.magic : attackerStats.strength;
  const base = spell.power * offense / 100;
  const defenseFactor = 100 / (100 + defenderStats.defense);
  return Math.max(1, Math.floor(base * defenseFactor * affinityMultiplier(attackerElement, defenderElement)));
}

function playerAttack(moveIndex) {
  if (!battle || battle.result) return;
  const move = spells[state.element][moveIndex];
  const playerStats = statsFor(state.shape, playerStage());
  const damage = calculateDamage(move, playerStats, state.element, battle.rival.stats, battle.rival.element);
  battle.rivalHp = Math.max(0, battle.rivalHp - damage);
  const matchup = affinityMultiplier(state.element, battle.rival.element);
  const edge = matchup > 1 ? " Elemental advantage!" : matchup < 1 ? " Elemental disadvantage." : "";
  if (battle.rivalHp === 0) {
    finishBattle("win", `${fighterName(state.shape, state.element, playerStage())} used ${move.name} for ${damage} damage and won!${edge}`);
    return;
  }
  const rivalMove = spells[battle.rival.element][Math.floor(Math.random() * spells[battle.rival.element].length)];
  const incoming = calculateDamage(rivalMove, battle.rival.stats, battle.rival.element, playerStats, state.element);
  battle.playerHp = Math.max(0, battle.playerHp - incoming);
  const rivalAdvantage = affinityMultiplier(battle.rival.element, state.element);
  const rivalEdge = rivalAdvantage > 1 ? " Their element has the advantage!" : rivalAdvantage < 1 ? " Your element resists the hit." : "";
  if (battle.playerHp === 0) {
    finishBattle("loss", `${move.name} dealt ${damage}. The rival answered with ${rivalMove.name} for ${incoming} and won.${rivalEdge}`);
    return;
  }
  setLog(`${move.name} dealt ${damage}.${edge} ${rivalMove.name} hit back for ${incoming}.${rivalEdge}`);
  renderBattle();
}

function finishBattle(result, message) {
  battle.result = result;
  if (result === "win") {
    state.wins += 1;
    state.coins += 25;
  } else {
    state.losses += 1;
    state.coins += 8;
  }
  setLog(message);
  saveState();
  renderAll();
}

function evolve(nextStage) {
  if ((battle && !battle.result) || nextStage !== playerStage() + 1 || state.wins < [0, 3, 8][nextStage]) return;
  state.evolutions[state.shape] = nextStage;
  battle = null;
  saveState();
  setLog(`${shapeData[state.shape].name} evolved! All four base stats gained 25 points.`);
  renderAll();
}

function buyShape(shape) {
  if ((battle && !battle.result) || state.ownedShapes.includes(shape)) return;
  if (state.coins < shapeCost) {
    document.getElementById("loadout-feedback").textContent = `You need ${shapeCost - state.coins} more coins to unlock ${shapeData[shape].name}. Win arena battles to earn coins.`;
    return;
  }
  state.coins -= shapeCost;
  state.ownedShapes.push(shape);
  battle = null;
  state.shape = shape;
  saveState();
  renderAll();
  document.getElementById("loadout-feedback").textContent = `${shapeData[shape].name} unlocked and selected!`;
}

function buyElement(element) {
  if ((battle && !battle.result) || state.ownedElements.includes(element)) return;
  if (state.coins < elementCost) {
    document.getElementById("loadout-feedback").textContent = `You need ${elementCost - state.coins} more coins to unlock ${elementData[element].name}. Win arena battles to earn coins.`;
    return;
  }
  state.coins -= elementCost;
  state.ownedElements.push(element);
  battle = null;
  state.element = element;
  saveState();
  renderAll();
  document.getElementById("loadout-feedback").textContent = `${elementData[element].name} unlocked and selected!`;
}

function lockInStarter() {
  if (state.started) return;
  state.started = true;
  state.ownedShapes = [state.shape];
  state.ownedElements = [state.element];
  saveState();
  showScreen("battle");
  setLog(`Your ${elementData[state.element].name} ${shapeData[state.shape].name} is ready! Win battles to unlock more shapes and elements.`);
  renderAll();
}

function buyAura(aura) {
  if ((battle && !battle.result) || state.ownedAuras.includes(aura.id) || state.coins < aura.cost) return;
  state.coins -= aura.cost;
  state.ownedAuras.push(aura.id);
  state.equippedAura = aura.id;
  battle = null;
  saveState();
  renderAll();
  setLog(`${aura.name} is yours and equipped. ${aura.description}`);
}

document.querySelectorAll(".nav-button").forEach(button => {
  button.addEventListener("click", () => showScreen(button.dataset.screen));
});
document.getElementById("start-battle").addEventListener("click", startBattle);
document.getElementById("lock-starter").addEventListener("click", lockInStarter);

const resetDialog = document.getElementById("reset-dialog");
document.getElementById("reset-save").addEventListener("click", () => resetDialog.showModal());
document.getElementById("confirm-reset").addEventListener("click", event => {
  event.preventDefault();
  state = defaultState();
  battle = null;
  saveState();
  setLog("Choose your free starter shape and element to begin.");
  showScreen("shapes");
  renderAll();
  resetDialog.close();
});

renderAll();
if (!state.started) showScreen("shapes");
