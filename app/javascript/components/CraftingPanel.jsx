import React from "react";
import { useGame } from "../context/GameContext";
import { RECIPES, HERBS } from "../gameData";
import { canCraft } from "../utils/gameLogic";

const CraftingPanel = () => {
  const { state, dispatch } = useGame();

  const unlockedRecipes = state.unlockedRecipes
    .filter((key) => RECIPES[key])
    .map((key) => ({ key, ...RECIPES[key] }))
    .sort((a, b) => {
      if (a.isGameClear) return 1;
      if (b.isGameClear) return -1;
      return a.sellPrice - b.sellPrice;
    });

  return (
    <div className="panel">
      <h2>調合</h2>
      <div className="recipe-list">
        {unlockedRecipes.map((recipe) => {
          const craftable = canCraft(state, recipe.key);
          return (
            <div key={recipe.key} className="recipe-card">
              <div className="recipe-header">
                <span className="recipe-name">{recipe.name}</span>
                {recipe.isGameClear && (
                  <span className="badge badge-special">最終目標</span>
                )}
              </div>
              <div className="recipe-ingredients">
                {Object.entries(recipe.ingredients).map(([ing, amount]) => {
                  const currentAmount =
                    ing === "water"
                      ? state.water || 0
                      : Math.floor(state.herbs[ing] || 0);
                  const sufficient = currentAmount >= amount;
                  const ingName =
                    ing === "water" ? "水" : HERBS[ing]?.name || ing;
                  return (
                    <span
                      key={ing}
                      className={`ingredient ${sufficient ? "sufficient" : "insufficient"}`}
                    >
                      {ingName}: {ing === "water" ? `∞` : `${currentAmount}/${amount}`}
                    </span>
                  );
                })}
              </div>
              <div className="recipe-actions">
                {recipe.sellPrice > 0 && (
                  <span className="sell-price">売値: {recipe.sellPrice}G</span>
                )}
                <button
                  className="btn btn-craft"
                  disabled={!craftable}
                  onClick={() =>
                    dispatch({ type: "CRAFT", recipeKey: recipe.key })
                  }
                >
                  調合する
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CraftingPanel;
