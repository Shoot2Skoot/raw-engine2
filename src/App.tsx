/**
 * Main App Component
 * Entry point for the Roll-and-Write Game Engine
 */

import React from 'react';
import { Game } from './components/Game';
import { yahtzeeConfig } from './games/yahtzee/yahtzeeConfig';

function App() {
  return (
    <div className="w-full h-screen">
      <Game config={yahtzeeConfig} />
    </div>
  );
}

export default App;
