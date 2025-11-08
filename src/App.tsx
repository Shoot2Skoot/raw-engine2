/**
 * Main App Component
 */

import { GameProvider } from './hooks/useGameState';
import { Game } from './components/Game';
import { buildGameFromDefinition } from './lib/gameBuilder';
import { yahtzeeGame } from './games/yahtzee';

function App() {
  // Build the initial game state from the Yahtzee definition
  const initialGameState = buildGameFromDefinition(yahtzeeGame);

  return (
    <GameProvider initialState={initialGameState} autoSave={true}>
      <Game />
    </GameProvider>
  );
}

export default App;
