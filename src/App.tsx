import { GameProvider } from './context/GameContext';
import { Game } from './components/Game';
import { yahtzeeConfig } from './games/yahtzee';

function App() {
  return (
    <GameProvider initialConfig={yahtzeeConfig}>
      <Game />
    </GameProvider>
  );
}

export default App;
