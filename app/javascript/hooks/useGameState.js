import { useReducer, useEffect, useCallback, useRef } from "react";
import { getInitialGameState } from "../gameData";
import {
  processTick,
  craft,
  sellPotion,
  sellAllPotions,
  buySeed,
  buyUpgrade,
  unlockRecipe,
  changeFieldSeed,
  setAutoCraftRecipe,
} from "../utils/gameLogic";
import { loadGame, saveGame, resetGame } from "../utils/api";

function getUuid() {
  let uuid = localStorage.getItem("craft_game_uuid");
  if (!uuid) {
    uuid = crypto.randomUUID();
    localStorage.setItem("craft_game_uuid", uuid);
  }
  return uuid;
}

// サーバーのsnake_caseキーをcamelCaseのゲームステートに正規化
function normalizeState(raw) {
  const initial = getInitialGameState();
  return {
    gold: raw.gold ?? initial.gold,
    herbs: raw.herbs ?? initial.herbs,
    water: raw.water ?? initial.water,
    seedsOwned: raw.seedsOwned ?? raw.seeds_owned ?? initial.seedsOwned,
    fields: (raw.fields ?? initial.fields).map((f) => ({
      slot: f.slot,
      seedType: f.seedType ?? f.seed_type ?? "herb",
      unlocked: f.unlocked ?? true,
    })),
    potions: raw.potions ?? initial.potions,
    upgrades: normalizeUpgrades(raw.upgrades ?? initial.upgrades),
    autoCraftSlots: (raw.autoCraftSlots ?? raw.auto_craft_slots ?? initial.autoCraftSlots).map((s) => ({
      recipe: s.recipe ?? null,
      progress: s.progress ?? 0,
    })),
    unlockedRecipes: raw.unlockedRecipes ?? raw.unlocked_recipes ?? initial.unlockedRecipes,
    gameClear: raw.gameClear ?? raw.game_clear ?? initial.gameClear,
    lastTickAt: raw.lastTickAt ?? raw.last_tick_at ?? initial.lastTickAt,
    totalEarned: raw.totalEarned ?? raw.total_earned ?? initial.totalEarned,
  };
}

function normalizeUpgrades(u) {
  return {
    harvest_speed: u.harvest_speed ?? u.harvest_speed_level ?? 0,
    extra_field: u.extra_field ?? u.extra_field_level ?? 0,
    auto_craft_slot: u.auto_craft_slot ?? u.auto_craft_slot_level ?? 0,
    auto_craft_speed: u.auto_craft_speed ?? u.auto_craft_speed_level ?? 0,
  };
}

function gameReducer(state, action) {
  switch (action.type) {
    case "TICK":
      return processTick(state, action.now);
    case "CRAFT":
      return craft(state, action.recipeKey);
    case "SELL":
      return sellPotion(state, action.recipeKey, action.amount);
    case "SELL_ALL":
      return sellAllPotions(state);
    case "BUY_SEED":
      return buySeed(state, action.herbKey);
    case "BUY_UPGRADE":
      return buyUpgrade(state, action.upgradeKey);
    case "UNLOCK_RECIPE":
      return unlockRecipe(state, action.recipeKey);
    case "CHANGE_FIELD_SEED":
      return changeFieldSeed(state, action.slotIndex, action.seedType);
    case "SET_AUTO_CRAFT":
      return setAutoCraftRecipe(state, action.slotIndex, action.recipeKey);
    case "LOAD_STATE":
      return { ...normalizeState(action.state), lastTickAt: Date.now() };
    case "RESET":
      return { ...getInitialGameState(), lastTickAt: Date.now() };
    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, null, getInitialGameState);
  const stateRef = useRef(state);
  const uuid = useRef(getUuid());
  const loaded = useRef(false);

  stateRef.current = state;

  // ゲームループ（100msごと）
  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch({ type: "TICK", now: Date.now() });
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  // 初回ロード（localStorageから復元）
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    loadGame(uuid.current)
      .then((data) => {
        if (data.game_state && Object.keys(data.game_state).length > 0) {
          dispatch({ type: "LOAD_STATE", state: data.game_state });
        }
      })
      .catch((err) => {
        console.warn("Failed to load game:", err);
      });
  }, []);

  // 自動セーブ（30秒ごと）
  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveGame(uuid.current, stateRef.current);
    }, 30000);

    return () => clearInterval(saveInterval);
  }, []);

  // ページ離脱時にセーブ
  useEffect(() => {
    const handleUnload = () => {
      saveGame(uuid.current, stateRef.current);
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  // 手動セーブ
  const manualSave = useCallback(() => {
    return saveGame(uuid.current, stateRef.current);
  }, []);

  // リセット
  const handleReset = useCallback(() => {
    dispatch({ type: "RESET" });
    resetGame(uuid.current);
  }, []);

  return { state, dispatch, manualSave, handleReset };
}
