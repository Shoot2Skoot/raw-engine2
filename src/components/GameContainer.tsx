/**
 * Game container - Main component that orchestrates the game
 */

import React, { useEffect } from 'react';
import type { GameConfig } from '../types';
import { useGameState } from '../hooks/useGameState';
import { Sheet } from './sheet/Sheet';
import { ToolPalette } from './tools/ToolPalette';
import { DicePoolComponent } from './dice/DicePool';
import { DeckView } from './cards/DeckView';
import { Undo2, Redo2, RotateCcw, Save, Upload } from 'lucide-react';
import { exportGameState, importGameState } from '../lib/gameState';

interface GameContainerProps {
  config: GameConfig;
}

export const GameContainer: React.FC<GameContainerProps> = ({ config }) => {
  const {
    state,
    handleHotspotClick,
    undo,
    redo,
    switchSheet,
    selectTool,
    togglePencilMode,
    reset,
    rollDice,
    toggleDieLock,
    drawCard,
    discardCard,
    shuffleDeck,
    reshuffleDiscard,
  } = useGameState(config, `game-${config.id}`);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Undo: Ctrl/Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Redo: Ctrl/Cmd + Shift + Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }

      // Sheet navigation: 1-9 keys
      if (e.key >= '1' && e.key <= '9') {
        const sheetIndex = parseInt(e.key) - 1;
        if (sheetIndex < state.config.sheets.length) {
          switchSheet(sheetIndex);
        }
      }

      // Toggle pencil mode: P key
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        togglePencilMode();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [undo, redo, switchSheet, togglePencilMode, state.config.sheets.length]);

  const currentSheet = state.config.sheets[state.currentSheetIndex];
  const canUndo = state.historyIndex >= 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  const definitionsMap = new Map(
    state.config.diceDefinitions?.map((d) => [d.id, d]) || []
  );

  const handleExport = () => {
    exportGameState(state, `${config.name}-${Date.now()}.json`);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          await importGameState(file);
          // This would need to update state - for now just alert
          alert('Import successful! (Reload page to see changes)');
        } catch (error) {
          alert('Failed to import game state');
        }
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{config.name}</h1>
              {config.description && (
                <p className="text-sm text-gray-600">{config.description}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={undo}
                disabled={!canUndo}
                className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 size={18} />
                <span className="hidden sm:inline">Undo</span>
              </button>

              <button
                onClick={redo}
                disabled={!canRedo}
                className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Redo (Ctrl+Shift+Z)"
              >
                <Redo2 size={18} />
                <span className="hidden sm:inline">Redo</span>
              </button>

              <button
                onClick={() => reset(true)}
                className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                title="Reset sheet"
              >
                <RotateCcw size={18} />
                <span className="hidden sm:inline">Reset</span>
              </button>

              <button
                onClick={handleExport}
                className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                title="Export game"
              >
                <Save size={18} />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button
                onClick={handleImport}
                className="flex items-center gap-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                title="Import game"
              >
                <Upload size={18} />
                <span className="hidden sm:inline">Import</span>
              </button>
            </div>
          </div>

          {/* Sheet tabs */}
          {state.config.sheets.length > 1 && (
            <div className="flex gap-2 mt-3">
              {state.config.sheets.map((sheet, index) => (
                <button
                  key={sheet.id}
                  onClick={() => switchSheet(index)}
                  className={`
                    px-4 py-2 rounded-t-lg transition-colors
                    ${
                      index === state.currentSheetIndex
                        ? 'bg-gray-100 border-t-2 border-x-2 border-gray-300 font-semibold'
                        : 'bg-white hover:bg-gray-50 text-gray-600'
                    }
                  `}
                >
                  {sheet.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-50 border-r border-gray-300 p-4 overflow-y-auto">
          <div className="space-y-4">
            {/* Tool palette */}
            <ToolPalette
              toolState={state.tools}
              availableTools={config.defaultTools || ['checkbox', 'number']}
              onToolChange={selectTool}
              onPencilToggle={togglePencilMode}
            />

            {/* Dice pools */}
            {state.dicePools.map((pool) => (
              <DicePoolComponent
                key={pool.id}
                pool={pool}
                definitions={definitionsMap}
                onRoll={() => rollDice(pool.id)}
                onToggleLock={(dieId) => toggleDieLock(pool.id, dieId)}
                onReroll={() => rollDice(pool.id)}
              />
            ))}

            {/* Decks */}
            {state.decks.map((deck) => (
              <DeckView
                key={deck.id}
                deck={deck}
                onDraw={() => drawCard(deck.id)}
                onShuffle={() => shuffleDeck(deck.id)}
                onDiscard={() => discardCard(deck.id)}
                onReshuffle={() => reshuffleDiscard(deck.id)}
              />
            ))}
          </div>
        </aside>

        {/* Sheet area */}
        <main className="flex-1 overflow-auto">
          <Sheet
            sheet={currentSheet}
            marks={state.marks}
            onHotspotClick={handleHotspotClick}
          />
        </main>
      </div>
    </div>
  );
};
