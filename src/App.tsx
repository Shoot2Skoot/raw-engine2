/**
 * Main application entry point
 */

import { useState } from 'react';
import { GameApp } from './components/GameApp';
import { yahtzeeConfig } from './examples/yahtzee';
import { welcomeToTheMoonConfig } from './examples/welcomeToTheMoon';
import type { GameConfig } from './types';

const availableGames: Record<string, GameConfig> = {
  yahtzee: yahtzeeConfig,
  welcomeToTheMoon: welcomeToTheMoonConfig,
};

function App() {
  const [selectedGame, setSelectedGame] = useState<string>('yahtzee');

  const config = availableGames[selectedGame];

  return (
    <div className="min-h-screen">
      {/* Game selector */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">
            Roll & Write Game Engine
          </h1>
          <div className="ml-auto flex gap-2">
            {Object.keys(availableGames).map(gameId => (
              <button
                key={gameId}
                onClick={() => setSelectedGame(gameId)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedGame === gameId
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {availableGames[gameId].name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Current game */}
      <GameApp key={selectedGame} config={config} autoSave={true} />
    </div>
  );
}

export default App;
