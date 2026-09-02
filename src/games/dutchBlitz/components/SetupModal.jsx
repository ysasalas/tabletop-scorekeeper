import { useMemo, useState } from "react";
import Modal from "../../../components/Modal";

const PLAYER_COUNTS = [2, 3, 4, 5, 6, 7, 8];

export default function SetupModal({ isOpen, initialConfig, onStartGame }) {
  const [playerCount, setPlayerCount] = useState(initialConfig?.players?.length ? String(initialConfig.players.length) : "");
  const [playerNames, setPlayerNames] = useState(initialConfig?.players ?? []);
  const [winningScore, setWinningScore] = useState(initialConfig?.winningScore ? String(initialConfig.winningScore) : "");
  const [error, setError] = useState("");

  const activePlayerCount = Number(playerCount || 0);

  const displayNames = useMemo(() => {
    if (!activePlayerCount) {
      return [];
    }

    const existing = [...playerNames];
    while (existing.length < activePlayerCount) {
      existing.push("");
    }
    return existing.slice(0, activePlayerCount);
  }, [playerNames, activePlayerCount]);

  const updatePlayerName = (index, name) => {
    setPlayerNames((current) => {
      const copy = [...current];
      copy[index] = name;
      return copy;
    });
    if (error) {
      setError("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!activePlayerCount) {
      setError("Select the number of players.");
      return;
    }

    const trimmedNames = displayNames.map((name) => name.trim());
    if (trimmedNames.some((name) => !name)) {
      setError("Every player must have a name.");
      return;
    }

    if (new Set(trimmedNames).size !== trimmedNames.length) {
      setError("Player names must be unique.");
      return;
    }

    if (winningScore.trim() === "") {
      setError("Enter a winning score.");
      return;
    }

    const winningScoreValue = Number(winningScore);
    if (!Number.isFinite(winningScoreValue) || winningScoreValue <= 0) {
      setError("Winning score must be greater than 0.");
      return;
    }

    onStartGame({
      players: trimmedNames,
      winningScore: winningScoreValue
    });
  };

  return (
    <Modal isOpen={isOpen} title="Dutch Blitz Setup" onClose={null} width="large">
      <form className="stack gap-12" onSubmit={handleSubmit}>
        <label className="field">
          <span>Number of Players</span>
          <select
            value={playerCount}
            onChange={(event) => {
              setPlayerCount(event.target.value);
              if (error) {
                setError("");
              }
            }}
          >
            <option value="">Select</option>
            {PLAYER_COUNTS.map((count) => (
              <option key={count} value={count}>
                {count} players
              </option>
            ))}
          </select>
        </label>

        {displayNames.map((playerName, index) => (
          <label key={`player-${index + 1}`} className="field">
            <span>Player {index + 1} Name</span>
            <input
              type="text"
              value={playerName}
              onChange={(event) => updatePlayerName(index, event.target.value)}
              placeholder={`Player ${index + 1}`}
            />
          </label>
        ))}

        <label className="field">
          <span>Winning Score</span>
          <input
            type="number"
            min="1"
            value={winningScore}
            onChange={(event) => {
              setWinningScore(event.target.value);
              if (error) {
                setError("");
              }
            }}
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <div className="action-row">
          <button type="submit" className="primary-button">
            Start Game
          </button>
        </div>
      </form>
    </Modal>
  );
}
