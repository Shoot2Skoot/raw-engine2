/**
 * Main game layout component
 */

import { Undo2, Redo2, Save, RotateCcw } from 'lucide-react';
import { useGame } from '../store/GameContext';
import { SheetRenderer } from './sheet/SheetRenderer';
import { ToolPalette } from './ui/ToolPalette';
import { DiceRoller } from './dice/DiceRoller';

export function GameLayout() {
  const {
    definition,
    state,
    setActiveSheet,
    undo,
    redo,
    canUndo,
    canRedo,
    saveGame,
    resetGame,
  } = useGame();

  const activeSheet = definition.sheets.find(
    (s) => s.id === state.activeSheetId
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {definition.name}
          </h1>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={20} />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 size={20} />
            </button>
            <button
              onClick={saveGame}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              title="Save Game"
            >
              <Save size={20} />
              <span className="hidden sm:inline">Save</span>
            </button>
            <button
              onClick={() => {
                if (
                  confirm(
                    'Are you sure you want to reset the game? This cannot be undone.'
                  )
                ) {
                  resetGame();
                }
              }}
              className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              title="Reset Game"
            >
              <RotateCcw size={20} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Sheet tabs */}
        {definition.sheets.length > 1 && (
          <div className="max-w-7xl mx-auto mt-4 flex gap-2 overflow-x-auto">
            {definition.sheets.map((sheet) => (
              <button
                key={sheet.id}
                onClick={() => setActiveSheet(sheet.id)}
                className={`
                  px-4 py-2 rounded-t-lg font-medium transition-colors whitespace-nowrap
                  ${
                    state.activeSheetId === sheet.id
                      ? 'bg-gray-100 text-blue-600 border-b-2 border-blue-600'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
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
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left sidebar - Tools */}
            <div className="lg:col-span-3">
              <ToolPalette />
            </div>

            {/* Center - Sheet */}
            <div className="lg:col-span-6">
              {activeSheet ? (
                <SheetRenderer sheet={activeSheet} />
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-500">
                  No active sheet
                </div>
              )}
            </div>

            {/* Right sidebar - Dice/Cards */}
            <div className="lg:col-span-3 space-y-4">
              {/* Dice pools */}
              {definition.dice?.map((pool) => (
                <DiceRoller key={pool.id} poolConfig={pool} />
              ))}

              {/* Card decks */}
              {/* TODO: Add card deck components */}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-4 py-2">
        <div className="max-w-7xl mx-auto text-sm text-gray-500 text-center">
          Roll-and-Write Game Engine
        </div>
      </footer>
    </div>
  );
}
