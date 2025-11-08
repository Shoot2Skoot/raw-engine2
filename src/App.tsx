import { GameContainer } from './components/GameContainer';
import { yahtzeeConfig } from './games/yahtzee';
import './App.css';

function App() {
  return <GameContainer config={yahtzeeConfig} />;
}

export default App;
