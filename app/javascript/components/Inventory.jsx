import React from "react";
import { useGame } from "../context/GameContext";
import { HERBS, RECIPES } from "../gameData";

const Inventory = () => {
  const { state, dispatch } = useGame();

  const herbEntries = Object.entries(state.herbs || {})
    .filter(([key]) => state.seedsOwned.includes(key) && HERBS[key])
    .sort(([a], [b]) => HERBS[a].seedCost - HERBS[b].seedCost);

  const potionEntries = Object.entries(state.potions || {}).filter(
    ([key, amount]) => amount > 0 && RECIPES[key]
  );

  return (
    <div className="panel">
      <h2>所持品</h2>

      <div className="gold-display">
        <span className="gold-icon">💰</span>
        <span className="gold-amount">{Math.floor(state.gold)} G</span>
      </div>

      <h3>薬草</h3>
      <div className="inventory-list">
        {herbEntries.map(([key, amount]) => (
          <div key={key} className="inventory-item">
            <span>{HERBS[key].name}</span>
            <span className="item-count">{Math.floor(amount)}</span>
          </div>
        ))}
      </div>

      <h3>ポーション</h3>
      {potionEntries.length === 0 ? (
        <p className="empty-message">まだポーションがありません</p>
      ) : (
        <div className="inventory-list">
          {potionEntries
            .sort(([a], [b]) => RECIPES[a].sellPrice - RECIPES[b].sellPrice)
            .map(([key, amount]) => (
            <div key={key} className="inventory-item">
              <span>{RECIPES[key].name}</span>
              <span className="item-count">{amount}</span>
              {RECIPES[key].sellPrice > 0 && (
                <button
                  className="btn btn-sell"
                  onClick={() =>
                    dispatch({ type: "SELL", recipeKey: key, amount: 1 })
                  }
                >
                  売る ({RECIPES[key].sellPrice}G)
                </button>
              )}
            </div>
          ))}
          <button
            className="btn btn-sell-all"
            onClick={() => dispatch({ type: "SELL_ALL" })}
          >
            全て売る
          </button>
        </div>
      )}
    </div>
  );
};

export default Inventory;
