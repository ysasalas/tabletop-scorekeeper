function playUiTone(frequency, duration, volume) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return;
  }

  const audioContext = new AudioContextClass();

  audioContext.resume().then(() => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const startTime = audioContext.currentTime;
    const endTime = startTime + duration;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, startTime);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, endTime);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(startTime);
    oscillator.stop(endTime);
  }).catch(() => {});

  window.setTimeout(() => audioContext.close(), (duration + 0.2) * 1000);
}

export default function GameSelector({ games, onSelectGame }) {
  const handleSelectGame = (gameId) => {
    playUiTone(659.25, 0.18, 0.09);
    onSelectGame(gameId);
  };

  return (
    <div>
      <p className="section-subtitle">Choose a game to begin keeping score.</p>
      <div className="game-grid">
        {games.map((game) => (
          <button
            key={game.id}
            type="button"
            className="game-tile"
            onMouseEnter={() => playUiTone(523.25, 0.08, 0.035)}
            onClick={() => handleSelectGame(game.id)}
          >
            {game.image ? (
              <span className="game-tile-artwork">
                <img src={game.image} alt="" />
              </span>
            ) : null}
            <span className="game-tile-copy">
              <span className="game-tile-title">{game.name}</span>
              <span className="game-tile-description">{game.description}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
