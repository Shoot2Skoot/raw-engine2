/**
 * Roll-and-Write Game Engine - Main App
 */

import { GameProvider } from './store/GameContext';
import { GameLayout } from './components/GameLayout';
import { yahtzeeGame } from './games/yahtzee';

function App() {
  return (
    <GameProvider definition={yahtzeeGame} autoSave={true}>
      <GameLayout />
    </GameProvider>
  );
}

export default App;
