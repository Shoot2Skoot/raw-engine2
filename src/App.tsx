/**
 * Main Application Component
 * Showcases the roll-and-write game engine with example games
 */

import { useState } from 'react';
import { Yahtzee } from './games/yahtzee/Yahtzee';

type GameSelection = 'yahtzee' | 'welcome' | 'twilight';

function App() {
  const [selectedGame, setSelectedGame] = useState<GameSelection>('yahtzee');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Game selector */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Roll & Write Game Engine
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedGame('yahtzee')}
              className={`
                px-6 py-3 rounded-lg font-medium transition-all
                ${
                  selectedGame === 'yahtzee'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }
              `}
            >
              Yahtzee (Simple)
            </button>
            <button
              onClick={() => setSelectedGame('welcome')}
              disabled
              className="px-6 py-3 rounded-lg font-medium bg-gray-100 text-gray-400 cursor-not-allowed"
            >
              Welcome to the Moon (Coming Soon)
            </button>
            <button
              onClick={() => setSelectedGame('twilight')}
              disabled
              className="px-6 py-3 rounded-lg font-medium bg-gray-100 text-gray-400 cursor-not-allowed"
            >
              Twilight Inscription (Coming Soon)
            </button>
          </div>
        </div>
      </div>

      {/* Game display */}
      <div className="py-6">
        {selectedGame === 'yahtzee' && <Yahtzee />}
        {selectedGame === 'welcome' && (
          <div className="text-center text-gray-500 mt-20">Coming Soon...</div>
        )}
        {selectedGame === 'twilight' && (
          <div className="text-center text-gray-500 mt-20">Coming Soon...</div>
        )}
      </div>
    </div>
  );
}

export default App;
