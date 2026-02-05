import React from "react";
import { GameProvider } from "./context/GameContext";
import { useGameState } from "./hooks/useGameState";
import GameScreen from "./components/GameScreen";

const AppContent = () => {
  const { state, dispatch, manualSave, handleReset } = useGameState();

  return (
    <GameProvider value={{ state, dispatch, manualSave, handleReset }}>
      <GameScreen />
    </GameProvider>
  );
};

const App = () => {
  return <AppContent />;
};

export default App;
