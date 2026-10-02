let fusionEnergy = 0;
let fusionPity = 0;
const unlockedFusionRecipes = new Set();

const FUSION_PAIR_ORDER = ["fire", "water", "electric", "shadow"];
const FUSION_TIER_NAMES = [
  "Bloom",
  "Pulse",
  "Nova",
  "Aether",
  "Prism"
];

function getFusionCost() {
  return 10 + Math.max(0, fusionPity - 1) * 3;
}

function getFusionComboIndex() {
  const recipes = [];
  const pairNames = [
    ["fire", "water"],
    ["fire", "electric"],
    ["fire", "shadow"],
    ["water", "electric"],
    ["water", "shadow"],
    ["electric", "shadow"]
  ];

  pairNames.forEach(([a, b], pairIndex) => {
    FUSION_TIER_NAMES.forEach((tierName, tierIndex) => {
      const id = pairIndex * FUSION_TIER_NAMES.length + tierIndex + 1;
      recipes.push({
        id,
        name: `${tierName} ${a[0].toUpperCase() + a.slice(1)}-${b[0].toUpperCase() + b.slice(1)}`,
        pair: [a, b],
        pairKey: [a, b].slice().sort().join("-"),
        tier: tierIndex,
        tierName
      });
    });
  });

  return recipes;
}

function getRecipeKeyForPair(c1, c2) {
  return [c1.element, c2.element].slice().sort().join("-");
}

function getTierIndexForLevels(c1, c2) {
  const avgLevel = (c1.level + c2.level) / 2;
  return Math.min(FUSION_TIER_NAMES.length - 1, Math.floor(avgLevel / 2));
}

function registerFusionRecipe(c1, c2, fused) {
  if (!c1 || !c2 || !fused) return null;

  const pairKey = getRecipeKeyForPair(c1, c2);
  const tier = getTierIndexForLevels(c1, c2);
  const recipe = getFusionComboIndex().find((entry) => entry.pairKey === pairKey && entry.tier === tier);

  if (!recipe) return null;

  unlockedFusionRecipes.add(recipe.id);
  fusionEnergy += 12 + tier * 6;
  fusionPity = 0;
  return recipe;
}

function isRecipeUnlocked(recipeId) {
  return unlockedFusionRecipes.has(recipeId);
}

function resolveFusionElement(c1, c2) {
  const elementalResists = {
    fire: { shadow: 1.25, water: 0.9 },
    water: { fire: 1.25, electric: 0.9 },
    electric: { water: 1.25, shadow: 0.9 },
    shadow: { electric: 1.25, fire: 0.9 }
  };

  const first = c1.element;
  const second = c2.element;
  const firstWins = elementalResists[first]?.[second] || 1;
  const secondWins = elementalResists[second]?.[first] || 1;

  if (firstWins > secondWins) return first;
  if (secondWins > firstWins) return second;

  const order = ["fire", "water", "electric", "shadow"];
  return order[(order.indexOf(first) + order.indexOf(second)) % order.length];
}

function buildFusionName(c1, c2) {
  const nameParts = {
    fire: ["Solar", "Volcan", "Ember", "Inferno"],
    water: ["Tide", "Mist", "Coral", "Aqua"],
    electric: ["Volt", "Spark", "Arc", "Storm"],
    shadow: ["Void", "Night", "Shade", "Eclipse"]
  };

  const prefix = nameParts[c1.element][randInt(0, nameParts[c1.element].length - 1)];
  const suffix = nameParts[c2.element][randInt(0, nameParts[c2.element].length - 1)];
  const name = `${prefix}${suffix}`;
  return name.length > 12 ? `${prefix}${randInt(1, 9)}` : name;
}

function fuseCircles(c1, c2) {
  if (!c1 || !c2 || c1 === c2) return null;

  const fused = new Circle(buildFusionName(c1, c2), 0, 0);
  const averageLevel = Math.max(1, Math.round((c1.level + c2.level) / 2) + 1);

  fused.level = averageLevel;
  fused.element = resolveFusionElement(c1, c2);
  fused.hp = Math.max(30, Math.round((c1.maxHp + c2.maxHp) * 0.7) + 15);
  fused.maxHp = fused.hp;
  fused.atk = Math.round((c1.atk + c2.atk) * 0.9) + 4;
  fused.spd = Number(Math.min(9, (c1.spd + c2.spd) * 0.75 + 0.8).toFixed(1));
  fused.crit = Math.min(60, Math.round((c1.crit + c2.crit) / 2 + 6));
  fused.radius = Math.max(20, Math.min(42, Math.round((c1.radius + c2.radius) / 2 + 4)));
  fused.exp = 0;

  fusionPity = 0;
  return fused;
}
