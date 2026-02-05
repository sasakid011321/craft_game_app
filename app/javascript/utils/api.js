const API_BASE = "/api/v1/game";

export async function loadGame(uuid) {
  const response = await fetch(`${API_BASE}/load?uuid=${encodeURIComponent(uuid)}`);
  if (!response.ok) throw new Error("Failed to load game");
  return response.json();
}

export async function saveGame(uuid, gameState) {
  const response = await fetch(`${API_BASE}/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uuid, game_state: gameState }),
  });
  if (!response.ok) throw new Error("Failed to save game");
  return response.json();
}

export async function resetGame(uuid) {
  const response = await fetch(`${API_BASE}/reset?uuid=${encodeURIComponent(uuid)}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to reset game");
  return response.json();
}
