import React from "react";
import { useGame } from "../context/GameContext";
import { HERBS, RECIPES, UPGRADES, getUpgradeCost } from "../gameData";
import { getAvailableSeeds, getAvailableRecipes } from "../utils/gameLogic";

const Shop = () => {
  const { state, dispatch } = useGame();

  const availableSeeds = getAvailableSeeds(state);
  const availableRecipes = getAvailableRecipes(state);

  const upgradeEntries = Object.entries(UPGRADES).map(([key, upgrade]) => {
    const currentLevel = state.upgrades[key] || 0;
    const cost = getUpgradeCost(key, currentLevel);
    const maxed = currentLevel >= upgrade.maxLevel;
    return { key, ...upgrade, currentLevel, cost, maxed };
  });

  return (
    <div className="panel">
      <h2>ショップ</h2>

      {availableSeeds.length > 0 && (
        <>
          <h3>種を購入</h3>
          <div className="shop-list">
            {availableSeeds.map((seed) => (
              <div key={seed.key} className="shop-item">
                <span>{seed.name}の種</span>
                <button
                  className="btn btn-buy"
                  disabled={state.gold < seed.seedCost}
                  onClick={() =>
                    dispatch({ type: "BUY_SEED", herbKey: seed.key })
                  }
                >
                  {seed.seedCost} G
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {availableRecipes.length > 0 && (
        <>
          <h3>レシピ解放</h3>
          <div className="shop-list">
            {availableRecipes.map((recipe) => (
              <div key={recipe.key} className="shop-item">
                <span>{recipe.name}</span>
                <button
                  className="btn btn-buy"
                  disabled={state.gold < recipe.unlockGold}
                  onClick={() =>
                    dispatch({ type: "UNLOCK_RECIPE", recipeKey: recipe.key })
                  }
                >
                  {recipe.unlockGold} G
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <h3>アップグレード</h3>
      <div className="shop-list">
        {upgradeEntries.map((upgrade) => (
          <div key={upgrade.key} className="shop-item">
            <div>
              <span>{upgrade.name}</span>
              <span className="upgrade-level">
                Lv.{upgrade.currentLevel}/{upgrade.maxLevel}
              </span>
              <p className="upgrade-desc">{upgrade.description}</p>
            </div>
            <button
              className="btn btn-buy"
              disabled={upgrade.maxed || state.gold < upgrade.cost}
              onClick={() =>
                dispatch({ type: "BUY_UPGRADE", upgradeKey: upgrade.key })
              }
            >
              {upgrade.maxed ? "MAX" : `${upgrade.cost} G`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
