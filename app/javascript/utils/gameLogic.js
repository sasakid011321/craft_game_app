import { HERBS, RECIPES, UPGRADES, getUpgradeCost, getInitialGameState } from "../gameData";

// 採取速度の倍率を取得
export function getHarvestSpeedMultiplier(state) {
  const level = state.upgrades.harvest_speed || 0;
  return UPGRADES.harvest_speed.effect(level);
}

// 自動調合速度の倍率を取得
export function getAutoCraftSpeedMultiplier(state) {
  const level = state.upgrades.auto_craft_speed || 0;
  return UPGRADES.auto_craft_speed.effect(level);
}

// 調合可能かチェック
export function canCraft(state, recipeKey) {
  const recipe = RECIPES[recipeKey];
  if (!recipe) return false;
  if (!state.unlockedRecipes.includes(recipeKey)) return false;

  for (const [ingredient, amount] of Object.entries(recipe.ingredients)) {
    if (ingredient === "water") {
      if ((state.water || 0) < amount) return false;
    } else {
      if (Math.floor(state.herbs[ingredient] || 0) < amount) return false;
    }
  }
  return true;
}

// 素材を消費
function consumeIngredients(state, recipeKey) {
  const recipe = RECIPES[recipeKey];
  for (const [ingredient, amount] of Object.entries(recipe.ingredients)) {
    if (ingredient === "water") {
      state.water -= amount;
    } else {
      state.herbs[ingredient] = (state.herbs[ingredient] || 0) - amount;
    }
  }
}

// 手動調合
export function craft(state, recipeKey) {
  if (!canCraft(state, recipeKey)) return state;

  const newState = JSON.parse(JSON.stringify(state));
  consumeIngredients(newState, recipeKey);
  newState.potions[recipeKey] = (newState.potions[recipeKey] || 0) + 1;

  // エリクサー完成チェック
  if (RECIPES[recipeKey].isGameClear) {
    newState.gameClear = true;
  }

  return newState;
}

// ポーション売却
export function sellPotion(state, recipeKey, amount) {
  const currentAmount = state.potions[recipeKey] || 0;
  const sellAmount = Math.min(amount, currentAmount);
  if (sellAmount <= 0) return state;

  const recipe = RECIPES[recipeKey];
  const newState = JSON.parse(JSON.stringify(state));
  newState.potions[recipeKey] -= sellAmount;
  const earned = recipe.sellPrice * sellAmount;
  newState.gold += earned;
  newState.totalEarned += earned;

  return newState;
}

// 全ポーション売却
export function sellAllPotions(state) {
  let newState = JSON.parse(JSON.stringify(state));
  for (const [key, amount] of Object.entries(newState.potions)) {
    if (amount > 0 && RECIPES[key] && RECIPES[key].sellPrice > 0) {
      const earned = RECIPES[key].sellPrice * amount;
      newState.gold += earned;
      newState.totalEarned += earned;
      newState.potions[key] = 0;
    }
  }
  return newState;
}

// 種を購入
export function buySeed(state, herbKey) {
  const herb = HERBS[herbKey];
  if (!herb || state.seedsOwned.includes(herbKey)) return state;
  if (state.gold < herb.seedCost) return state;

  const newState = JSON.parse(JSON.stringify(state));
  newState.gold -= herb.seedCost;
  newState.seedsOwned.push(herbKey);
  newState.herbs[herbKey] = newState.herbs[herbKey] || 0;

  return newState;
}

// アップグレード購入
export function buyUpgrade(state, upgradeKey) {
  const upgrade = UPGRADES[upgradeKey];
  if (!upgrade) return state;

  const currentLevel = state.upgrades[upgradeKey] || 0;
  if (currentLevel >= upgrade.maxLevel) return state;

  const cost = getUpgradeCost(upgradeKey, currentLevel);
  if (state.gold < cost) return state;

  const newState = JSON.parse(JSON.stringify(state));
  newState.gold -= cost;
  newState.upgrades[upgradeKey] = currentLevel + 1;

  // 畑拡張の場合、新しいフィールドを追加
  if (upgradeKey === "extra_field") {
    const newSlot = newState.fields.length + 1;
    newState.fields.push({ slot: newSlot, seedType: "herb", unlocked: true });
  }

  // 自動調合機の場合、スロットを追加
  if (upgradeKey === "auto_craft_slot") {
    newState.autoCraftSlots.push({ recipe: null, progress: 0 });
  }

  return newState;
}

// レシピ解放
export function unlockRecipe(state, recipeKey) {
  const recipe = RECIPES[recipeKey];
  if (!recipe || state.unlockedRecipes.includes(recipeKey)) return state;
  if (state.gold < recipe.unlockGold) return state;

  // 必要な素材の種を全て持っているかチェック
  for (const ingredient of Object.keys(recipe.ingredients)) {
    if (ingredient === "water") continue;
    if (!state.seedsOwned.includes(ingredient)) return state;
  }

  const newState = JSON.parse(JSON.stringify(state));
  newState.gold -= recipe.unlockGold;
  newState.unlockedRecipes.push(recipeKey);

  return newState;
}

// 畑の薬草変更
export function changeFieldSeed(state, slotIndex, seedType) {
  if (!state.seedsOwned.includes(seedType)) return state;
  if (slotIndex < 0 || slotIndex >= state.fields.length) return state;

  const newState = JSON.parse(JSON.stringify(state));
  newState.fields[slotIndex].seedType = seedType;

  return newState;
}

// 自動調合スロットのレシピ設定
export function setAutoCraftRecipe(state, slotIndex, recipeKey) {
  if (slotIndex < 0 || slotIndex >= state.autoCraftSlots.length) return state;
  if (recipeKey && !state.unlockedRecipes.includes(recipeKey)) return state;

  const newState = JSON.parse(JSON.stringify(state));
  newState.autoCraftSlots[slotIndex].recipe = recipeKey;
  newState.autoCraftSlots[slotIndex].progress = 0;

  return newState;
}

// ゲームティック処理（毎100msに呼ばれる）
export function processTick(state, now) {
  const deltaMs = now - state.lastTickAt;
  // 最大8時間分のオフライン進捗
  const deltaSeconds = Math.min(deltaMs / 1000, 8 * 3600);
  if (deltaSeconds <= 0) return state;

  const newState = JSON.parse(JSON.stringify(state));
  newState.lastTickAt = now;

  const speedMultiplier = getHarvestSpeedMultiplier(newState);

  // 薬草の成長
  for (const field of newState.fields) {
    if (!field.unlocked || !field.seedType) continue;
    const herbDef = HERBS[field.seedType];
    if (!herbDef) continue;

    const harvestRate = (1 / herbDef.growTime) * speedMultiplier;
    const harvested = harvestRate * deltaSeconds;
    newState.herbs[field.seedType] = (newState.herbs[field.seedType] || 0) + harvested;
  }

  // 自動調合
  const craftSpeedMultiplier = getAutoCraftSpeedMultiplier(newState);
  for (const slot of newState.autoCraftSlots) {
    if (!slot.recipe) continue;
    const recipe = RECIPES[slot.recipe];
    if (!recipe) continue;

    slot.progress += deltaSeconds * craftSpeedMultiplier;
    while (slot.progress >= recipe.craftTime && canCraft(newState, slot.recipe)) {
      consumeIngredients(newState, slot.recipe);
      newState.potions[slot.recipe] = (newState.potions[slot.recipe] || 0) + 1;
      slot.progress -= recipe.craftTime;

      if (recipe.isGameClear) {
        newState.gameClear = true;
      }
    }
    // 素材不足時はprogressをcraftTimeで上限
    if (slot.progress > recipe.craftTime) {
      slot.progress = recipe.craftTime;
    }
  }

  return newState;
}

// 購入可能な種のリスト
export function getAvailableSeeds(state) {
  return Object.entries(HERBS)
    .filter(([key, herb]) => !state.seedsOwned.includes(key) && herb.seedCost > 0)
    .filter(([key, herb]) => state.totalEarned >= herb.unlockGold * 0.5)
    .map(([key, herb]) => ({ key, ...herb }));
}

// 解放可能なレシピのリスト
export function getAvailableRecipes(state) {
  return Object.entries(RECIPES)
    .filter(([key]) => !state.unlockedRecipes.includes(key))
    .filter(([key, recipe]) => {
      // 素材の種を全て持っているか
      for (const ingredient of Object.keys(recipe.ingredients)) {
        if (ingredient === "water") continue;
        if (!state.seedsOwned.includes(ingredient)) return false;
      }
      return true;
    })
    .map(([key, recipe]) => ({ key, ...recipe }));
}
