import React, { useState } from "react";
import { useGame } from "../context/GameContext";
import HerbFields from "./HerbFields";
import Inventory from "./Inventory";
import CraftingPanel from "./CraftingPanel";
import Shop from "./Shop";
import AutoCraftPanel from "./AutoCraftPanel";
import GameClearModal from "./GameClearModal";
import SaveLoadBar from "./SaveLoadBar";

const GameScreen = () => {
  const { state, manualSave, handleReset } = useGame();
  const [showClear, setShowClear] = useState(false);
  const [clearDismissed, setClearDismissed] = useState(false);
  const [activeTab, setActiveTab] = useState("craft");

  // エリクサー完成時にモーダル表示
  if (state.gameClear && !showClear && !clearDismissed) {
    setShowClear(true);
  }

  return (
    <div className="game-container">
      <header className="game-header">
        <h1>Craft Game</h1>
        <SaveLoadBar onSave={manualSave} onReset={handleReset} />
      </header>

      <div className="game-layout">
        <div className="game-left">
          <Inventory />
          <HerbFields />
        </div>

        <div className="game-right">
          <div className="tab-bar">
            <button
              className={`tab ${activeTab === "craft" ? "active" : ""}`}
              onClick={() => setActiveTab("craft")}
            >
              調合
            </button>
            <button
              className={`tab ${activeTab === "shop" ? "active" : ""}`}
              onClick={() => setActiveTab("shop")}
            >
              ショップ
            </button>
            {(state.autoCraftSlots || []).length > 0 && (
              <button
                className={`tab ${activeTab === "auto" ? "active" : ""}`}
                onClick={() => setActiveTab("auto")}
              >
                自動調合
              </button>
            )}
          </div>

          {activeTab === "craft" && <CraftingPanel />}
          {activeTab === "shop" && <Shop />}
          {activeTab === "auto" && <AutoCraftPanel />}
        </div>
      </div>

      {showClear && (
        <GameClearModal
          onClose={() => {
            setShowClear(false);
            setClearDismissed(true);
          }}
        />
      )}
    </div>
  );
};

export default GameScreen;
