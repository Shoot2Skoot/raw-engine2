/**
 * Main Application Component
 */

import { useState } from 'react';
import { GameEngineProvider, useGameEngine, useCurrentSheet } from './core/GameEngine';
import { SheetRenderer } from './components/sheet/SheetRenderer';
import { ToolPalette } from './components/ui/ToolPalette';
import { DicePoolDisplay } from './components/dice/DicePoolDisplay';
import { DeckDisplay } from './components/cards/DeckDisplay';
import { yahtzeeGame } from './examples/yahtzee';
import { Download, Upload, RotateCcw, Menu } from 'lucide-react';
import { downloadGameState, uploadGameState } from './utils';

// Game selector component
function GameSelector() {
  const [selectedGame, setSelectedGame] = useState<string>('yahtzee');

  const games = [
    { id: 'yahtzee', name: 'Yahtzee', definition: yahtzeeGame },
  ];

  const currentGame = games.find((g) => g.id === selectedGame);

  if (!currentGame) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Menu className="w-6 h-6 text-gray-700" />
              <h1 className="text-2xl font-bold text-gray-900">
                Roll & Write Engine
              </h1>
            </div>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:border-gray-400 transition-colors"
            >
              {games.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <GameEngineProvider definition={currentGame.definition}>
        <GameView />
      </GameEngineProvider>
    </div>
  );
}

// Main game view
function GameView() {
  const { state, resetSheet } = useGameEngine();
  const currentSheet = useCurrentSheet();

  const handleSave = () => {
    downloadGameState(state);
  };

  const handleLoad = async () => {
    const loadedState = await uploadGameState();
    if (loadedState) {
      // In a full implementation, would update state here
      console.log('Loaded state:', loadedState);
    }
  };

  const handleReset = () => {
    if (
      confirm(
        'Are you sure you want to reset the current sheet? This cannot be undone.'
      )
    ) {
      if (currentSheet) {
        resetSheet(currentSheet.id);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex gap-6">
        {/* Left sidebar - Tools and controls */}
        <aside className="w-64 flex-shrink-0 space-y-4">
          <ToolPalette />

          {/* Action buttons */}
          <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-2">
            <div className="text-xs font-semibold text-gray-600 mb-2 px-2">
              Actions
            </div>
            <div className="space-y-1">
              <button
                onClick={handleSave}
                className="w-full flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                Save Game
              </button>
              <button
                onClick={handleLoad}
                className="w-full flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Load Game
              </button>
              <button
                onClick={handleReset}
                className="w-full flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Sheet
              </button>
            </div>
          </div>

          {/* Dice pools */}
          {state.dicePools.map((pool) => (
            <DicePoolDisplay key={pool.id} poolId={pool.id} />
          ))}

          {/* Card decks */}
          {state.decks.map((deck) => (
            <DeckDisplay key={deck.id} deckId={deck.id} />
          ))}
        </aside>

        {/* Main content - Game sheet */}
        <main className="flex-1 bg-white border border-gray-300 rounded-lg shadow-sm p-8 overflow-auto">
          {currentSheet ? (
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                {currentSheet.name}
              </h2>
              <SheetRenderer sheet={currentSheet} />
            </div>
          ) : (
            <div className="text-gray-500 text-center py-12">
              No sheet available
            </div>
          )}
        </main>
      </div>

      {/* Instructions footer */}
      <footer className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">How to Play:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>1. Select a tool from the left sidebar</li>
          <li>2. Roll the dice using the "Roll" button</li>
          <li>3. Click on cells in the score sheet to mark them</li>
          <li>4. Use the action buttons to save, load, or reset your game</li>
        </ul>
      </footer>
    </div>
  );
}

export default GameSelector;
