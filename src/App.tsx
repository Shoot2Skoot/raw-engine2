import { Game } from './components/Game';
import { yahtzeeGame } from './games/yahtzee';

function App() {
  return <Game definition={yahtzeeGame} />;
}

export default App;
