import { useMemo, useState } from "react";
import Modal from "./components/Modal";
import GameSelector from "./components/GameSelector";
import Navigation from "./components/Navigation";
import { gameRegistry, getGameById } from "./games/gameRegistry";

export default function App() {
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [isSelectorOpen, setIsSelectorOpen] = useState(true);

  const selectedGame = useMemo(() => getGameById(selectedGameId), [selectedGameId]);

  const handleSelectGame = (gameId) => {
    setSelectedGameId(gameId);
    setIsSelectorOpen(false);
  };

  const handleReturnToSelector = () => {
    setIsSelectorOpen(true);
  };

  const ActiveGame = selectedGame?.component ?? null;

  return (
    <div className="app-shell">
      <Navigation
        games={gameRegistry}
        selectedGameId={selectedGameId}
        onSelectGame={handleSelectGame}
        onReturnToSelector={handleReturnToSelector}
      />

      <main className="app-main">
        {ActiveGame ? (
          <ActiveGame />
        ) : (
          <section className="empty-state">
            <h1>Select a game to start</h1>
            <p>Use the game selection modal or the navigation bar to begin.</p>
          </section>
        )}
      </main>

      <Modal isOpen={isSelectorOpen} title="Select a Game" onClose={null} width="large">
        <GameSelector games={gameRegistry} onSelectGame={handleSelectGame} />
      </Modal>
    </div>
  );
}
