/**
 * Main App - Roll-and-Write Game Engine
 */

import { useState } from 'react';
import { GameContainer } from './components/GameContainer';
import { yahtzeeConfig, welcomeToTheMoonConfig } from './examples';
import type { GameConfig } from './types';
import { Gamepad2 } from 'lucide-react';

function App() {
  const [selectedGame, setSelectedGame] = useState<GameConfig | null>(null);

  const games = [yahtzeeConfig, welcomeToTheMoonConfig];

  if (selectedGame) {
    return <GameContainer config={selectedGame} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gamepad2 size={48} className="text-blue-600" />
            <h1 className="text-5xl font-bold text-gray-900">
              Roll-and-Write Engine
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            A comprehensive web-based engine for roll-and-write board games
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => setSelectedGame(game)}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:-translate-y-1 text-left"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {game.name}
              </h2>
              <p className="text-gray-600 mb-4">{game.description}</p>
              <div className="flex gap-2 flex-wrap">
                {game.sheets.length > 0 && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {game.sheets.length} Sheet{game.sheets.length > 1 ? 's' : ''}
                  </span>
                )}
                {game.diceDefinitions && game.diceDefinitions.length > 0 && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Dice
                  </span>
                )}
                {game.deckDefinitions && game.deckDefinitions.length > 0 && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    Cards
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p className="text-sm">
            Built with React, TypeScript, and Tailwind CSS
          </p>
          <p className="text-sm mt-2">
            Features: Grid layouts, Dice rolling, Card decks, Undo/Redo, Auto-save
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
