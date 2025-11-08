import { useState, useCallback } from 'react';
import { Undo, Redo, Save, RotateCcw } from 'lucide-react';
import type { GameDefinition, Hotspot, NumberMark } from '../types';
import { GameProvider, useGame } from '../context/GameContext';
import { Sheet } from './Sheet';
import { ToolPalette } from './Tools';
import { generateId } from '../utils/hotspots';

interface GameProps {
  definition: GameDefinition;
}

function GameContent() {
  const { definition, state, addMark, undo, redo, canUndo, canRedo, saveGame } = useGame();
  const [selectedHotspotId] = useState<string | undefined>();

  // Handle hotspot click - add a mark
  const handleHotspotClick = useCallback(
    (hotspot: Hotspot) => {
      // For now, simplified number entry
      if (state.currentTool === 'number') {
        const value = prompt('Enter a number:');
        if (value !== null && !isNaN(Number(value))) {
          const mark: NumberMark = {
            id: generateId(),
            hotspotId: hotspot.id,
            type: 'number',
            value: Number(value),
            timestamp: Date.now(),
            isPencil: state.ui.isPencilMode,
          };
          addMark(mark);
        }
      }
    },
    [state.currentTool, state.ui.isPencilMode, addMark]
  );

  const currentSheet = definition.sheets.find(s => s.id === state.currentSheetId);
  if (!currentSheet) {
    return <div>No sheet found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{definition.name}</h1>
        {definition.description && (
          <p className="text-gray-600">{definition.description}</p>
        )}
      </header>

      <div className="flex gap-6">
        {/* Left sidebar - Tools */}
        <aside className="flex-shrink-0">
          <div className="sticky top-6 space-y-4">
            <ToolPalette
              tools={definition.tools}
              currentTool={state.currentTool}
              onToolSelect={() => {}}
            />

            {/* Undo/Redo Controls */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-2 shadow-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 px-1">Actions</h3>
              <div className="flex flex-col gap-1">
                <button
                  onClick={undo}
                  disabled={!canUndo}
                  className="flex items-center gap-2 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Undo (Ctrl+Z)"
                >
                  <Undo size={18} />
                  <span className="text-sm font-medium">Undo</span>
                </button>

                <button
                  onClick={redo}
                  disabled={!canRedo}
                  className="flex items-center gap-2 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Redo (Ctrl+Shift+Z)"
                >
                  <Redo size={18} />
                  <span className="text-sm font-medium">Redo</span>
                </button>

                <button
                  onClick={saveGame}
                  className="flex items-center gap-2 px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                  title="Save game to file"
                >
                  <Save size={18} />
                  <span className="text-sm font-medium">Save</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm('Reset game? This cannot be undone.')) {
                      window.location.reload();
                    }
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                  title="Reset game"
                >
                  <RotateCcw size={18} />
                  <span className="text-sm font-medium">Reset</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content - Sheet */}
        <main className="flex-1">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {currentSheet.name}
            </h2>
            <Sheet
              definition={currentSheet}
              marks={state.marks}
              selectedHotspotId={selectedHotspotId}
              onHotspotClick={handleHotspotClick}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

/**
 * Main Game Component with Provider
 */
export function Game({ definition }: GameProps) {
  return (
    <GameProvider definition={definition}>
      <GameContent />
    </GameProvider>
  );
}
