/**
 * Main App Component
 * Demonstrates the Roll-and-Write Game Engine with Yahtzee
 */

import { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { SheetRenderer } from './components/sheets/SheetRenderer';
import { yahtzeeConfig } from './games/yahtzee/config';
import { Dices, Undo2, Redo2, Save, RotateCcw } from 'lucide-react';
import type { NumberMark } from './types';

function YahtzeeGame() {
  const {
    gameState,
    currentSheet,
    placeMark,
    rollDice,
    toggleDieLock,
    undo,
    redo,
    canUndo,
    canRedo,
    saveGame,
    resetGame,
  } = useGame();

  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  const mainPool = gameState.current.dicePools['main-pool'];
  const hasRolled = mainPool?.dice.some((die) => die.type === 'standard' && die.value !== null);

  const handleHotspotSelect = (hotspotId: string) => {
    setSelectedHotspotId(hotspotId);
  };

  const handlePlaceNumber = () => {
    if (!selectedHotspotId || !currentSheet || !inputValue) return;

    const value = parseInt(inputValue, 10);
    if (isNaN(value)) return;

    const mark: NumberMark = {
      id: `mark-${Date.now()}`,
      type: 'number',
      mode: 'pen',
      timestamp: Date.now(),
      value,
    };

    placeMark(currentSheet.id, selectedHotspotId, mark);
    setInputValue('');
    setSelectedHotspotId(null);
  };

  const handleRollDice = () => {
    rollDice('main-pool');
  };

  const handleSaveGame = () => {
    const data = saveGame();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yahtzee-save-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {yahtzeeConfig.metadata.name}
          </h1>
          <p className="text-gray-600">{yahtzeeConfig.metadata.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Sheet */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Score Sheet</h2>
            {currentSheet && (
              <div className="border border-gray-200 rounded overflow-hidden">
                <SheetRenderer
                  sheet={currentSheet}
                  selectedHotspotId={selectedHotspotId || undefined}
                  onHotspotSelect={handleHotspotSelect}
                  debug={false}
                />
              </div>
            )}

            {/* Input for placing numbers */}
            {selectedHotspotId && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">
                  Enter score for selected cell:
                </p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter score..."
                    autoFocus
                  />
                  <button
                    onClick={handlePlaceNumber}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Place
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dice and Controls */}
          <div className="space-y-4">
            {/* Dice Pool */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Dice</h2>

              <button
                onClick={handleRollDice}
                className="w-full mb-4 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-semibold"
              >
                <Dices size={20} />
                Roll Dice
              </button>

              {hasRolled && (
                <div className="grid grid-cols-5 gap-2">
                  {mainPool.dice.map((die) => (
                    <div key={die.id} className="flex flex-col items-center">
                      <button
                        onClick={() => toggleDieLock('main-pool', die.id)}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl transition-all ${
                          die.locked
                            ? 'bg-yellow-400 text-yellow-900 ring-2 ring-yellow-600'
                            : 'bg-white border-2 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {die.type === 'standard' ? (die.value || '?') : '?'}
                      </button>
                      <span className="text-xs text-gray-500 mt-1">
                        {die.locked ? 'Locked' : 'Click to lock'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Controls</h2>

              <div className="space-y-2">
                <button
                  onClick={undo}
                  disabled={!canUndo}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <Undo2 size={16} />
                  Undo
                </button>

                <button
                  onClick={redo}
                  disabled={!canRedo}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <Redo2 size={16} />
                  Redo
                </button>

                <button
                  onClick={handleSaveGame}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  Save Game
                </button>

                <button
                  onClick={resetGame}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw size={16} />
                  Reset Game
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-2">How to Play</h2>
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>Click "Roll Dice" to roll all dice</li>
                <li>Click dice to lock/unlock them</li>
                <li>Re-roll unlocked dice up to 3 times</li>
                <li>Click a score cell to select it</li>
                <li>Enter your score and click "Place"</li>
                <li>Use Undo if you make a mistake</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <GameProvider config={yahtzeeConfig}>
      <YahtzeeGame />
    </GameProvider>
  );
}

export default App;
