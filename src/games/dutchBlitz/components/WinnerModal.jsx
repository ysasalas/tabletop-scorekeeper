import { useEffect } from "react";
import Modal from "../../../components/Modal";

const CONFETTI_COLORS = ["#e52320", "#2e5b88", "#f3e03b", "#3a8847"];
const CONFETTI_POSITIONS = [
  [12, 3], [24, 7], [36, 3], [48, 8], [60, 3], [72, 7], [84, 3],
  [4, 16], [8, 29], [3, 42], [8, 55], [4, 68], [8, 81],
  [96, 16], [92, 29], [97, 42], [92, 55], [96, 68], [92, 81],
  [12, 97], [24, 93], [36, 97], [48, 92], [60, 97], [72, 93], [84, 97],
  [4, 8], [96, 8], [4, 92], [96, 92], [18, 5], [82, 5], [18, 95], [82, 95],
  [6, 35], [94, 35]
];

export default function WinnerModal({ isOpen, winner, rankings, rounds, onClose }) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return undefined;
    }

    const audioContext = new AudioContextClass();
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];

    audioContext.resume().then(() => {
      const startTime = audioContext.currentTime;

      notes.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const noteStart = startTime + index * 0.42;
        const noteEnd = noteStart + 0.56;

        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(frequency, noteStart);
        gain.gain.setValueAtTime(0.0001, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.13, noteStart + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);
        oscillator.connect(gain).connect(audioContext.destination);
        oscillator.start(noteStart);
        oscillator.stop(noteEnd);
      });
    }).catch(() => {});

    return () => {
      window.setTimeout(() => audioContext.close(), 2500);
    };
  }, [isOpen]);

  const winnerNames = winner?.winners ?? [];
  const winnerLabel = winnerNames.length > 1 ? winnerNames.join(", ") : winnerNames[0];
  const confetti = (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: 36 }, (_, index) => (
        <span
          key={index}
          className="confetti-piece"
          style={{
            "--confetti-color": CONFETTI_COLORS[index % CONFETTI_COLORS.length],
            "--confetti-delay": `${(index % 9) * 55}ms`,
            "--confetti-left": `${CONFETTI_POSITIONS[index][0]}%`,
            "--confetti-top": `${CONFETTI_POSITIONS[index][1]}%`,
            "--confetti-x": `${(CONFETTI_POSITIONS[index][0] - 50) * 3}px`,
            "--confetti-y": `${(CONFETTI_POSITIONS[index][1] - 50) * 3}px`,
            "--confetti-rotation": `${(index * 47) % 360}deg`
          }}
        />
      ))}
    </div>
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        title="Game Finished"
        onClose={onClose}
        hideCloseButton
        overlayDecoration={confetti}
        width="small"
      >
        <div className="stack gap-12">
          <p className="winner-line">
            {winnerNames.length > 1
              ? `Tie game between ${winnerLabel} at ${winner?.score} points.`
              : `${winnerLabel} wins with ${winner?.score} points!`}
          </p>

          <section>
            <h3>Final Rankings</h3>
            <ol className="standings-list">
              {rankings.map((entry) => (
                <li key={entry.name}>
                  <span>#{entry.rank} {entry.name}</span>
                  <strong>{entry.score}</strong>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h3>Score Summary</h3>
            <p>{rounds.length} rounds completed.</p>
          </section>

          <div className="action-row">
            <button type="button" className="primary-button" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
