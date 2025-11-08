import { useState } from 'react';
import { GameEngine } from './components/GameEngine';
import { yahtzeeConfig } from './games/yahtzee';
import { welcomeToTheMoonConfig } from './games/welcome-to-the-moon';
import type { GameConfig } from './types';

function App() {
  const [selectedGame, setSelectedGame] = useState<GameConfig>(yahtzeeConfig);

  const games: GameConfig[] = [yahtzeeConfig, welcomeToTheMoonConfig];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Game selector */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold mb-4">Roll & Write Game Engine</h1>
          <div className="flex gap-2 flex-wrap">
            {games.map((game) => (
              <button
                key={game.name}
                onClick={() => setSelectedGame(game)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedGame.name === game.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {game.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Game engine */}
      <GameEngine key={selectedGame.name} config={selectedGame} />
    </div>
  );
}

export default App;
