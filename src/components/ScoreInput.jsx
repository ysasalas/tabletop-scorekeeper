import { useMemo, useState } from "react";
import Modal from "./Modal";

export default function ScoreInput({ isOpen, players, onSubmit, onCancel }) {
  const [values, setValues] = useState({});
  const [error, setError] = useState("");

  const initialValues = useMemo(
    () => players.reduce((acc, player) => ({ ...acc, [player]: "" }), {}),
    [players]
  );

  const safeValues = Object.keys(values).length > 0 ? values : initialValues;

  const handleChange = (player, nextValue) => {
    setValues((current) => ({ ...current, [player]: nextValue }));
    if (error) {
      setError("");
    }
  };

  const handleCancel = () => {
    setValues(initialValues);
    setError("");
    onCancel();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const parsedScores = {};

    for (const player of players) {
      const rawValue = safeValues[player];
      if (rawValue === "") {
        setError("All player scores are required.");
        return;
      }

      const numericValue = Number(rawValue);
      if (!Number.isFinite(numericValue)) {
        setError("Scores must be valid numbers.");
        return;
      }

      parsedScores[player] = numericValue;
    }

    onSubmit(parsedScores);
    setValues(initialValues);
  };

  return (
    <Modal isOpen={isOpen} title="Add Scores" onClose={handleCancel} hideCloseButton width="small">
      <form className="stack gap-12" onSubmit={handleSubmit}>
        {players.map((player) => (
          <label key={player} className="field">
            <span>{player}</span>
            <input
              type="number"
              value={safeValues[player] ?? ""}
              onChange={(event) => handleChange(player, event.target.value)}
            />
          </label>
        ))}

        {error ? <p className="form-error">{error}</p> : null}

        <div className="action-row">
          <button type="button" className="ghost-button" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="primary-button">
            Submit Scores
          </button>
        </div>
      </form>
    </Modal>
  );
}
