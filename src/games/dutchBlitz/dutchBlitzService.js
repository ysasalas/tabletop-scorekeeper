import { registerGameLogic } from "../../services/gameLogicService";

const GAME_ID = "dutch-blitz";

function buildRankings(totals) {
  const ordered = Object.entries(totals).sort((a, b) => {
    if (b[1] !== a[1]) {
      return b[1] - a[1];
    }
    return a[0].localeCompare(b[0]);
  });

  return ordered.map(([name, score], index) => ({
    rank: index + 1,
    name,
    score
  }));
}

function validateStartConfig({ players, winningScore }) {
  if (!Array.isArray(players) || players.length < 2 || players.length > 8) {
    throw new Error("Dutch Blitz requires 2 to 8 players.");
  }

  const cleanedPlayers = players.map((name) => name.trim());
  if (cleanedPlayers.some((name) => name.length === 0)) {
    throw new Error("All players must have names.");
  }

  if (new Set(cleanedPlayers).size !== cleanedPlayers.length) {
    throw new Error("Player names must be unique.");
  }

  const parsedWinningScore = Number(winningScore);
  if (!Number.isFinite(parsedWinningScore) || parsedWinningScore <= 0) {
    throw new Error("Winning score must be greater than 0.");
  }

  return {
    players: cleanedPlayers,
    winningScore: parsedWinningScore
  };
}

function startGameLocal(config) {
  const { players, winningScore } = validateStartConfig(config);

  const totals = players.reduce((acc, player) => ({ ...acc, [player]: 0 }), {});

  return {
    gameId: GAME_ID,
    players,
    winningScore,
    roundNumber: 1,
    rounds: [],
    totals,
    rankings: buildRankings(totals),
    winner: null,
    isFinished: false
  };
}

function submitRoundLocal(currentState, roundScores) {
  if (!currentState || currentState.isFinished) {
    throw new Error("Cannot add scores to a finished game.");
  }

  const scoreEntries = {};

  for (const player of currentState.players) {
    const value = roundScores[player];
    if (value === "" || value === undefined || value === null) {
      throw new Error("Scores are required for every player.");
    }

    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
      throw new Error(`Score for ${player} must be numeric.`);
    }

    scoreEntries[player] = numericValue;
  }

  const totals = { ...currentState.totals };
  for (const player of currentState.players) {
    totals[player] += scoreEntries[player];
  }

  const nextRounds = [
    ...currentState.rounds,
    {
      round: currentState.roundNumber,
      scores: scoreEntries
    }
  ];

  const rankings = buildRankings(totals);
  const playersOverWinningScore = Object.entries(totals).filter(([, score]) => score >= currentState.winningScore);

  let winner = null;
  let isFinished = false;

  if (playersOverWinningScore.length > 0) {
    const highestScore = Math.max(...playersOverWinningScore.map(([, score]) => score));
    const winners = playersOverWinningScore
      .filter(([, score]) => score === highestScore)
      .map(([player]) => player);

    winner = {
      winners,
      score: highestScore
    };
    isFinished = true;
  }

  const completedRounds = nextRounds.length;
  const showStandings = !isFinished && completedRounds % 5 === 0;

  return {
    state: {
      ...currentState,
      roundNumber: currentState.roundNumber + 1,
      rounds: nextRounds,
      totals,
      rankings,
      winner,
      isFinished
    },
    events: {
      showStandings,
      standings: rankings,
      winner
    }
  };
}

function createPythonApiLogic(baseUrl) {
  return {
    async startGame(config) {
      const response = await fetch(`${baseUrl}/api/games/dutch-blitz/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(config)
      });

      if (!response.ok) {
        throw new Error("Python game service failed to start the game.");
      }

      return await response.json();
    },

    async submitRound(currentState, roundScores) {
      const response = await fetch(`${baseUrl}/api/games/dutch-blitz/round`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          state: currentState,
          roundScores
        })
      });

      if (!response.ok) {
        throw new Error("Python game service failed to submit scores.");
      }

      return await response.json();
    }
  };
}

const localDutchBlitzLogic = {
  startGame: startGameLocal,
  submitRound: submitRoundLocal
};

const provider = import.meta.env.VITE_DUTCH_BLITZ_LOGIC_PROVIDER ?? "local";
const apiBaseUrl = import.meta.env.VITE_DUTCH_BLITZ_API_BASE_URL ?? "http://localhost:8000";

const dutchBlitzLogic = provider === "python-api" ? createPythonApiLogic(apiBaseUrl) : localDutchBlitzLogic;

registerGameLogic(GAME_ID, dutchBlitzLogic);

export { GAME_ID, dutchBlitzLogic };
