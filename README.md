# tabletop-scorekeeper
A score tracking app designed for multiplayer card games, making it easy to keep score during gameplay.

## Run the App

1. Install dependencies:

	npm install

2. Start development server:

	npm run dev

3. Build for production:

	npm run build

## Current Games

- Dutch Blitz

## Modular Architecture

- Game registry: `src/games/gameRegistry.js`
- Shared UI components: `src/components/`
- Shared game logic API boundary: `src/services/gameLogicService.js`
- Dutch Blitz feature module: `src/games/dutchBlitz/`

To add another game, create a new folder in `src/games/` with its own React component and logic service, then register it in `src/games/gameRegistry.js`.

## Dutch Blitz Logic Source of Truth

The Python module `prototype/dutch_blitz_game.py` now exposes reusable logic functions:

- `start_game(players, winning_score)`
- `submit_round(state, round_scores)`
- `build_rankings(totals)`

The React Dutch Blitz service mirrors this behavior and uses a provider model:

- `local` provider (default): in-browser logic implementation.
- `python-api` provider: calls a Python backend API layer.

Optional env vars:

- `VITE_DUTCH_BLITZ_LOGIC_PROVIDER` (`local` or `python-api`)
- `VITE_DUTCH_BLITZ_API_BASE_URL` (default: `http://localhost:8000`)
