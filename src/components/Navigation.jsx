export default function Navigation({ games, selectedGameId, onSelectGame, onReturnToSelector }) {
  return (
    <header className="app-nav">
      <div className="nav-brand">Tabletop Scorekeeper</div>
      <nav className="nav-links" aria-label="Game navigation">
        <button type="button" className="ghost-button" onClick={onReturnToSelector}>
          Game Selection
        </button>
        {games.map((game) => (
          <button
            key={game.id}
            type="button"
            className={selectedGameId === game.id ? "nav-game-button nav-game-button--active" : "nav-game-button"}
            onClick={() => onSelectGame(game.id)}
          >
            {game.name}
          </button>
        ))}
      </nav>
    </header>
  );
}
