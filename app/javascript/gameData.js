// 薬草の定義
export const HERBS = {
  herb: {
    name: "薬草",
    tier: 1,
    growTime: 1.0,
    seedCost: 0,
    unlockGold: 0,
  },
  poison_herb: {
    name: "毒草",
    tier: 2,
    growTime: 2.0,
    seedCost: 100,
    unlockGold: 200,
  },
  magic_herb: {
    name: "魔草",
    tier: 2,
    growTime: 2.5,
    seedCost: 150,
    unlockGold: 300,
  },
  holy_herb: {
    name: "聖草",
    tier: 2,
    growTime: 3.0,
    seedCost: 200,
    unlockGold: 400,
  },
  dragon_herb: {
    name: "竜草",
    tier: 3,
    growTime: 5.0,
    seedCost: 1000,
    unlockGold: 2000,
  },
  celestial_herb: {
    name: "天草",
    tier: 3,
    growTime: 6.0,
    seedCost: 1500,
    unlockGold: 3000,
  },
  phantom_herb: {
    name: "幻草",
    tier: 3,
    growTime: 8.0,
    seedCost: 2000,
    unlockGold: 5000,
  },
};

// レシピの定義
export const RECIPES = {
  recovery_potion: {
    name: "回復ポーション",
    ingredients: { herb: 3, water: 1 },
    sellPrice: 10,
    unlockGold: 0,
    craftTime: 2.0,
  },
  antidote: {
    name: "解毒ポーション",
    ingredients: { herb: 2, poison_herb: 2, water: 1 },
    sellPrice: 50,
    unlockGold: 500,
    craftTime: 4.0,
  },
  mana_potion: {
    name: "マナポーション",
    ingredients: { herb: 2, magic_herb: 2 },
    sellPrice: 40,
    unlockGold: 400,
    craftTime: 3.0,
  },
  purification_water: {
    name: "浄化の水",
    ingredients: { holy_herb: 2, water: 1 },
    sellPrice: 60,
    unlockGold: 600,
    craftTime: 5.0,
  },
  dragon_elixir: {
    name: "竜の霊薬",
    ingredients: { dragon_herb: 3, herb: 2, water: 2 },
    sellPrice: 200,
    unlockGold: 3000,
    craftTime: 8.0,
  },
  celestial_tonic: {
    name: "天の強壮剤",
    ingredients: { celestial_herb: 3, holy_herb: 2, water: 2 },
    sellPrice: 300,
    unlockGold: 5000,
    craftTime: 10.0,
  },
  elixir: {
    name: "エリクサー",
    ingredients: {
      herb: 5,
      poison_herb: 5,
      magic_herb: 5,
      holy_herb: 5,
      dragon_herb: 5,
      celestial_herb: 5,
      phantom_herb: 5,
      water: 10,
    },
    sellPrice: 0,
    unlockGold: 10000,
    craftTime: 30.0,
    isGameClear: true,
  },
};

// アップグレードの定義
export const UPGRADES = {
  harvest_speed: {
    name: "採取速度アップ",
    description: "薬草の採取速度が上がる",
    baseCost: 50,
    costMultiplier: 1.5,
    maxLevel: 20,
    effect: (level) => 1 + level * 0.5,
  },
  extra_field: {
    name: "畑拡張",
    description: "薬草畑を1つ追加",
    baseCost: 100,
    costMultiplier: 2.0,
    maxLevel: 6,
  },
  auto_craft_slot: {
    name: "自動調合機",
    description: "自動調合スロットを1つ追加",
    baseCost: 500,
    costMultiplier: 3.0,
    maxLevel: 3,
  },
  auto_craft_speed: {
    name: "調合速度アップ",
    description: "自動調合の速度が上がる",
    baseCost: 300,
    costMultiplier: 1.8,
    maxLevel: 15,
    effect: (level) => 1 + level * 0.3,
  },
};

// アップグレードコスト計算
export function getUpgradeCost(upgradeKey, currentLevel) {
  const upgrade = UPGRADES[upgradeKey];
  return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));
}

// 初期ゲームステート
export function getInitialGameState() {
  return {
    gold: 0,
    herbs: { herb: 0.0 },
    water: 999999,
    seedsOwned: ["herb"],
    fields: [{ slot: 1, seedType: "herb", unlocked: true }],
    potions: {},
    upgrades: {
      harvest_speed: 0,
      extra_field: 0,
      auto_craft_slot: 0,
      auto_craft_speed: 0,
    },
    autoCraftSlots: [],
    unlockedRecipes: ["recovery_potion"],
    gameClear: false,
    lastTickAt: Date.now(),
    totalEarned: 0,
  };
}
