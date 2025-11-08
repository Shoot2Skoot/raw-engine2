import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Sheet } from './Sheet';
import { ToolPalette } from './ToolPalette';
import { DicePool } from './DicePool';
import { DeckDisplay } from './DeckDisplay';
import { Save, Upload, RotateCcw } from 'lucide-react';

export const Game: React.FC = () => {
  const { state, undo, redo, resetGame, saveToFile, loadFromFile } = useGame();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Redo: Ctrl+Shift+Z or Cmd+Shift+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const currentSheet = state.sheets.find((s) => s.id === state.currentSheetId);

  const handleLoadFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        loadFromFile(file);
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{state.name}</h1>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={saveToFile}
              className="flex items-center gap-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
              title="Save to file"
            >
              <Save className="w-4 h-4" />
              Save
            </button>

            <button
              onClick={handleLoadFile}
              className="flex items-center gap-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
              title="Load from file"
            >
              <Upload className="w-4 h-4" />
              Load
            </button>

            <button
              onClick={() => {
                if (confirm('Reset the game? This will clear all progress.')) {
                  resetGame();
                }
              }}
              className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm font-medium"
              title="Reset game"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Sheet tabs (if multiple sheets) */}
        {state.sheets.length > 1 && (
          <div className="max-w-7xl mx-auto px-4 flex gap-2 overflow-x-auto">
            {state.sheets.map((sheet) => (
              <button
                key={sheet.id}
                onClick={() => {
                  /* setCurrentSheet would be called here */
                }}
                className={`
                  px-4 py-2 text-sm font-medium whitespace-nowrap
                  ${
                    sheet.id === state.currentSheetId
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                {sheet.name}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex gap-4">
          {/* Left sidebar - Tools */}
          <aside className="flex-shrink-0">
            <ToolPalette />
          </aside>

          {/* Main sheet area */}
          <main className="flex-1">
            {currentSheet ? (
              <Sheet sheet={currentSheet} />
            ) : (
              <div className="text-center text-gray-500 p-8">No sheet selected</div>
            )}
          </main>

          {/* Right sidebar - Dice & Cards */}
          <aside className="flex-shrink-0 space-y-4 w-64">
            {/* Dice pools */}
            {state.dicePools.map((pool) => (
              <DicePool key={pool.id} pool={pool} />
            ))}

            {/* Decks */}
            {state.decks.map((deck) => (
              <DeckDisplay key={deck.id} deck={deck} />
            ))}
          </aside>
        </div>
      </div>
    </div>
  );
};
