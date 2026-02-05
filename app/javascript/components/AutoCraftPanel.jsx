import React from "react";
import { useGame } from "../context/GameContext";
import { RECIPES } from "../gameData";
import { getAutoCraftSpeedMultiplier } from "../utils/gameLogic";

const AutoCraftPanel = () => {
  const { state, dispatch } = useGame();

  if (state.autoCraftSlots.length === 0) return null;

  const speedMultiplier = getAutoCraftSpeedMultiplier(state);

  return (
    <div className="panel">
      <h2>自動調合機 <span style={{ fontSize: "0.75rem", color: "#53d769" }}>x{speedMultiplier.toFixed(1)}</span></h2>
      <div className="auto-craft-list">
        {state.autoCraftSlots.map((slot, index) => {
          const recipe = slot.recipe ? RECIPES[slot.recipe] : null;
          const progress = recipe
            ? Math.min((slot.progress / recipe.craftTime) * 100, 100)
            : 0;

          return (
            <div key={index} className="auto-craft-slot">
              <div className="auto-craft-header">
                <span>スロット {index + 1}</span>
                <select
                  value={slot.recipe || ""}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_AUTO_CRAFT",
                      slotIndex: index,
                      recipeKey: e.target.value || null,
                    })
                  }
                >
                  <option value="">-- 選択 --</option>
                  {state.unlockedRecipes
                    .filter((key) => RECIPES[key] && !RECIPES[key].isGameClear)
                    .sort((a, b) => RECIPES[a].sellPrice - RECIPES[b].sellPrice)
                    .map((key) => (
                      <option key={key} value={key}>
                        {RECIPES[key].name}
                      </option>
                    ))}
                </select>
              </div>
              {recipe && (
                <div className="progress-bar-container">
                  <div
                    className="progress-bar progress-bar-craft"
                    style={{ width: `${progress}%` }}
                  />
                  <span className="progress-label">
                    {slot.progress.toFixed(1)}s / {recipe.craftTime}s
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AutoCraftPanel;
