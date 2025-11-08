import { GameProvider } from './contexts/GameContext';
import { Game } from './components/Game';
import { yahtzeeConfig } from './games/yahtzee';

function App() {
  return (
    <GameProvider config={yahtzeeConfig} autoSave={true}>
      <Game />
    </GameProvider>
  );
}

export default App;
