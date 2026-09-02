import { useMemo, useState } from "react";
import ScoreInput from "../../components/ScoreInput";
import ScoreSheet from "../../components/ScoreSheet";
import { startGame, submitRound } from "../../services/gameLogicService";
import { GAME_ID } from "./dutchBlitzService";
import SetupModal from "./components/SetupModal";
import StandingsModal from "./components/StandingsModal";
import WinnerModal from "./components/WinnerModal";

export default function DutchBlitz() {
  const [setupConfig, setSetupConfig] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [isSetupOpen, setIsSetupOpen] = useState(true);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [isStandingsOpen, setIsStandingsOpen] = useState(false);
  const [isWinnerOpen, setIsWinnerOpen] = useState(false);
  const [error, setError] = useState("");

  const standings = useMemo(() => gameState?.rankings ?? [], [gameState]);

  const handleStartGame = async (config) => {
    try {
      const nextState = await startGame(GAME_ID, config);
      setSetupConfig(config);
      setGameState(nextState);
      setIsSetupOpen(false);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmitScores = async (roundScores) => {
    if (!gameState) {
      return;
    }

    try {
      const { state, events } = await submitRound(GAME_ID, gameState, roundScores);
      setGameState(state);
      setIsScoreModalOpen(false);
      setError("");

      if (events.winner) {
        setIsWinnerOpen(true);
      } else if (events.showStandings) {
        setIsStandingsOpen(true);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePlayAgain = async () => {
    if (!setupConfig) {
      return;
    }

    try {
      const nextState = await startGame(GAME_ID, setupConfig);
      setGameState(nextState);
      setIsWinnerOpen(false);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNewGame = () => {
    setGameState(null);
    setIsSetupOpen(true);
    setIsWinnerOpen(false);
    setIsStandingsOpen(false);
    setIsScoreModalOpen(false);
    setError("");
  };

  return (
    <section className="game-panel">
      <div className="panel-title-row">
        <h1>Dutch Blitz</h1>
        {gameState ? <p>Round {gameState.roundNumber}</p> : null}
      </div>

      {gameState ? (
        <>
          <div className="meta-row">
            <span>Winning Score: {gameState.winningScore}</span>
            <span>Completed Rounds: {gameState.rounds.length}</span>
          </div>

          <ScoreSheet
            players={gameState.players}
            rounds={gameState.rounds}
            totals={gameState.totals}
            rankings={gameState.rankings}
          />

          {!gameState.isFinished ? (
            <div className="action-row action-row-left">
              <button type="button" className="primary-button" onClick={() => setIsScoreModalOpen(true)}>
                Add Scores
              </button>
            </div>
          ) : (
            <div className="action-row action-row-left">
              <button type="button" className="primary-button" onClick={handlePlayAgain}>
                Play Again
              </button>
              <button type="button" className="ghost-button" onClick={handleNewGame}>
                New Game
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="section-subtitle">Configure the game to start tracking scores.</p>
      )}

      {error ? <p className="form-error">{error}</p> : null}

      <SetupModal isOpen={isSetupOpen} initialConfig={setupConfig} onStartGame={handleStartGame} />

      <ScoreInput
        isOpen={isScoreModalOpen}
        players={gameState?.players ?? []}
        onSubmit={handleSubmitScores}
        onCancel={() => setIsScoreModalOpen(false)}
      />

      <StandingsModal
        isOpen={isStandingsOpen}
        rankings={standings}
        onClose={() => setIsStandingsOpen(false)}
      />

      <WinnerModal
        isOpen={isWinnerOpen}
        winner={gameState?.winner}
        rankings={gameState?.rankings ?? []}
        rounds={gameState?.rounds ?? []}
        onClose={() => setIsWinnerOpen(false)}
      />
    </section>
  );
}
