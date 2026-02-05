import React from "react";
import { useGame } from "../context/GameContext";
import { HERBS } from "../gameData";
import { getHarvestSpeedMultiplier } from "../utils/gameLogic";

const HerbFields = () => {
  const { state, dispatch } = useGame();

  return (
    <div className="panel">
      <h2>薬草畑</h2>
      <div className="fields-grid">
        {state.fields.map((field, index) => {
          if (!field.unlocked) return null;
          const herbDef = HERBS[field.seedType];
          const herbCount = state.herbs[field.seedType] || 0;
          const speedMultiplier = getHarvestSpeedMultiplier(state);
          const harvestRate = herbDef ? (1 / herbDef.growTime) * speedMultiplier : 0;

          // 進捗バー（1サイクル内の進捗）
          const fractional = herbCount - Math.floor(herbCount);

          return (
            <div key={index} className="field-card">
              <div className="field-header">
                <span className="field-label">畑 {field.slot}</span>
                <select
                  value={field.seedType}
                  onChange={(e) =>
                    dispatch({
                      type: "CHANGE_FIELD_SEED",
                      slotIndex: index,
                      seedType: e.target.value,
                    })
                  }
                >
                  {[...state.seedsOwned]
                    .sort((a, b) => (HERBS[a]?.seedCost || 0) - (HERBS[b]?.seedCost || 0))
                    .map((seed) => (
                    <option key={seed} value={seed}>
                      {HERBS[seed]?.name || seed}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field-info">
                <span>{herbDef?.name}: {Math.floor(herbCount)}</span>
                <span className="harvest-rate">{harvestRate.toFixed(1)}/秒</span>
              </div>
              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{ width: `${fractional * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HerbFields;
