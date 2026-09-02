export default function ScoreSheet({ players, rounds, totals, rankings }) {
  return (
    <section className="score-sheet">
      <div className="sheet-header">
        <h2>Score History</h2>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Round</th>
              {players.map((player) => (
                <th key={player}>{player}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rounds.length === 0 ? (
              <tr>
                <td colSpan={players.length + 1} className="empty-row">
                  No rounds recorded yet.
                </td>
              </tr>
            ) : (
              rounds.map((roundEntry) => (
                <tr key={`round-${roundEntry.round}`}>
                  <td>{roundEntry.round}</td>
                  {players.map((player) => (
                    <td key={`${roundEntry.round}-${player}`}>{roundEntry.scores[player]}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr>
              <th>Total</th>
              {players.map((player) => (
                <th key={`total-${player}`}>{totals[player]}</th>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="rankings-panel">
        <h3>Current Rankings</h3>
        <ol>
          {rankings.map((entry) => (
            <li key={entry.name}>
              <span>{entry.name}</span>
              <span>{entry.score}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
