const logicRegistry = new Map();

export function registerGameLogic(gameId, logicApi) {
  logicRegistry.set(gameId, logicApi);
}

export function getGameLogic(gameId) {
  const logic = logicRegistry.get(gameId);
  if (!logic) {
    throw new Error(`No game logic registered for ${gameId}`);
  }
  return logic;
}

export async function startGame(gameId, config) {
  const logic = getGameLogic(gameId);
  return await Promise.resolve(logic.startGame(config));
}

export async function submitRound(gameId, currentState, roundScores) {
  const logic = getGameLogic(gameId);
  return await Promise.resolve(logic.submitRound(currentState, roundScores));
}
