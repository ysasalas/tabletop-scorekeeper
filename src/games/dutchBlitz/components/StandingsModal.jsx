import { useEffect } from "react";
import Modal from "../../../components/Modal";

export default function StandingsModal({ isOpen, rankings, onClose }) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return undefined;
    }

    const audioContext = new AudioContextClass();
    const notes = [392, 523.25];

    audioContext.resume().then(() => {
      const startTime = audioContext.currentTime;

      notes.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const noteStart = startTime + index * 0.16;
        const noteEnd = noteStart + 0.36;

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, noteStart);
        gain.gain.setValueAtTime(0.0001, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.1, noteStart + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);
        oscillator.connect(gain).connect(audioContext.destination);
        oscillator.start(noteStart);
        oscillator.stop(noteEnd);
      });
    }).catch(() => {});

    return () => {
      window.setTimeout(() => audioContext.close(), 750);
    };
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} title="Current Standings" onClose={onClose} hideCloseButton width="small">
      <ol className="standings-list">
        {rankings.map((entry) => (
          <li key={entry.name}>
            <span>#{entry.rank} {entry.name}</span>
            <strong>{entry.score}</strong>
          </li>
        ))}
      </ol>
      <div className="action-row">
        <button type="button" className="primary-button" onClick={onClose}>
          Continue
        </button>
      </div>
    </Modal>
  );
}
