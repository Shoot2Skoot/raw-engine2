/**
 * Main App component
 */

import { GameEngine } from './components/GameEngine';
import { yahtzeeConfig } from './games/yahtzee';

function App() {
  return <GameEngine config={yahtzeeConfig} />;
}

export default App;
