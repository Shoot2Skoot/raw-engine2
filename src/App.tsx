/**
 * Main App - Roll-and-Write Game Engine Demo
 */

import { useState } from 'react';
import { GameEngine } from './components/GameEngine';
import { yahtzeeGame } from './games/yahtzee';
import type { GameDefinition } from './types';

// Import additional games when available
// import { welcomeToTheMoonGame } from './games/welcome-to-the-moon';
// import { twilightInscriptionGame } from './games/twilight-inscription';

function App() {
  const [selectedGame, setSelectedGame] = useState<GameDefinition>(yahtzeeGame);

  const availableGames: GameDefinition[] = [
    yahtzeeGame,
    // Add more games here as they are created
  ];

  return (
    <div className="w-full h-screen">
      {/* Game selector */}
      {availableGames.length > 1 && (
        <div className="absolute top-4 right-4 z-50">
          <select
            value={selectedGame.id}
            onChange={(e) => {
              const game = availableGames.find((g) => g.id === e.target.value);
              if (game) setSelectedGame(game);
            }}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm"
          >
            {availableGames.map((game) => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Game engine */}
      <GameEngine key={selectedGame.id} gameDefinition={selectedGame} />
    </div>
  );
}

export default App;
