/**
 * Main Application Component
 * Demonstrates the Roll-and-Write Game Engine with Yahtzee
 */

import { GameEngine } from './engine';
import { yahtzeeConfig } from './examples/yahtzee/yahtzee-config';
import './App.css';

function App() {
  return (
    <div className="App">
      <GameEngine config={yahtzeeConfig} />
    </div>
  );
}

export default App;
