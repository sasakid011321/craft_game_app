const STORAGE_KEY = "craft_game_state";

export async function loadGame(uuid) {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return { game_state: JSON.parse(saved) };
  }
  return { game_state: {} };
}

export async function saveGame(uuid, gameState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  return { success: true, last_saved_at: new Date().toISOString() };
}

export async function resetGame(uuid) {
  localStorage.removeItem(STORAGE_KEY);
  return { success: true };
}
