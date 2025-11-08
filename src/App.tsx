import { GameProvider } from './context/GameContext';
import { Game } from './components/Game';
import { yahtzeeConfig } from './games/yahtzee';

function App() {
  return (
    <GameProvider config={yahtzeeConfig}>
      <Game />
    </GameProvider>
  );
}

export default App;
