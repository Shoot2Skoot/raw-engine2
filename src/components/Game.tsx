/**
 * Main Game Component - Orchestrates all game UI elements
 */

import { useGame } from '../context/GameContext';
import { Sheet } from './sheets/Sheet';
import { ToolPalette } from './tools/ToolPalette';
import { DicePool } from './dice/DicePool';
import { useAutoSave } from '../hooks/useAutoSave';
import { useKeyboardShortcuts, getDefaultShortcuts } from '../hooks/useKeyboardShortcuts';
import { Undo2, Redo2, RotateCcw } from 'lucide-react';

export function Game() {
  const {
    state,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
    switchSheet,
  } = useGame();

  // Auto-save game state
  useAutoSave(state);

  // Set up keyboard shortcuts
  const shortcuts = getDefaultShortcuts({
    undo,
    redo,
    switchSheet: (index) => {
      if (state.sheets[index]) {
        switchSheet(state.sheets[index].id);
      }
    },
  });

  useKeyboardShortcuts(shortcuts);

  const currentSheet = state.sheets.find((s) => s.id === state.currentSheetId);
  const currentSheetMarks = state.marks.filter((m) => {
    return currentSheet?.hotspots.some((h) => h.id === m.hotspotId);
  });

  if (!currentSheet) {
    return <div>No sheet available</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{state.name}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {currentSheet.name}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={undo}
                disabled={!canUndo}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 size={18} />
                <span className="hidden sm:inline">Undo</span>
              </button>

              <button
                onClick={redo}
                disabled={!canRedo}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                title="Redo (Ctrl+Shift+Z)"
              >
                <Redo2 size={18} />
                <span className="hidden sm:inline">Redo</span>
              </button>

              <button
                onClick={() => reset()}
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
                title="Reset Game"
              >
                <RotateCcw size={18} />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left sidebar - Tools */}
          <div className="lg:col-span-2">
            <ToolPalette />
          </div>

          {/* Center - Sheet */}
          <div className="lg:col-span-7">
            <Sheet sheet={currentSheet} marks={currentSheetMarks} />
          </div>

          {/* Right sidebar - Dice and other game elements */}
          <div className="lg:col-span-3 space-y-4">
            {state.dicePools.map((pool) => (
              <DicePool key={pool.id} poolId={pool.id} />
            ))}

            {/* Stats */}
            <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Stats</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div>Marks: {state.marks.length}</div>
                <div>History: {state.history.length} actions</div>
                <div>
                  Last modified:{' '}
                  {new Date(state.lastModified).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sheet navigation (if multiple sheets) */}
        {state.sheets.length > 1 && (
          <div className="mt-4 bg-white border border-gray-300 rounded-lg shadow-sm p-2">
            <div className="flex gap-2">
              {state.sheets.map((sheet, index) => (
                <button
                  key={sheet.id}
                  onClick={() => switchSheet(sheet.id)}
                  className={`px-4 py-2 rounded transition-colors ${
                    sheet.id === state.currentSheetId
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {sheet.name} <span className="text-xs opacity-75">({index + 1})</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
