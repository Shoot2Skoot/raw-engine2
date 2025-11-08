/**
 * Main application component
 */

import { useEffect } from 'react';
import { GameProvider, useGame } from './engine/GameContext';
import { Sheet } from './components/sheet/Sheet';
import { ToolPalette } from './components/ui/ToolPalette';
import { DicePanel } from './components/dice/DicePanel';
import { CardDisplay } from './components/cards/CardDisplay';
import { ActionButtons } from './components/ui/ActionButtons';
import { yahtzeeConfig } from './games/yahtzee/config';

function GameApp() {
  const { state, addMark, removeMark, switchSheet, undo, redo } = useGame();

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

  if (!state.config) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Roll-and-Write Game Engine
          </h1>
          <p className="text-gray-600">Loading game...</p>
        </div>
      </div>
    );
  }

  const currentSheet = state.config.sheets.find(s => s.id === state.currentSheetId);
  const currentMarks = state.marks[state.currentSheetId] || [];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{state.config.name}</h1>
            {state.config.description && (
              <p className="text-sm text-gray-600 mt-1">{state.config.description}</p>
            )}
          </div>
          <ActionButtons />
        </div>

        {/* Sheet tabs (if multiple sheets) */}
        {state.config.sheets.length > 1 && (
          <div className="flex gap-2 mt-4">
            {state.config.sheets.map(sheet => (
              <button
                key={sheet.id}
                onClick={() => switchSheet(sheet.id)}
                className={`
                  px-4 py-2 rounded-t-lg text-sm font-medium transition-colors
                  ${state.currentSheetId === sheet.id
                    ? 'bg-gray-100 text-gray-900 border-t-2 border-x-2 border-blue-500'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
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
      <div className="flex gap-6 p-6">
        {/* Left sidebar - Tools */}
        <aside className="flex-shrink-0 w-80 space-y-4">
          <ToolPalette />

          {/* Dice pools */}
          {state.dicePools.map(pool => (
            <DicePanel key={pool.id} pool={pool} />
          ))}

          {/* Card decks */}
          {state.decks.map(deck => (
            <CardDisplay key={deck.id} deck={deck} />
          ))}
        </aside>

        {/* Center - Sheet */}
        <main className="flex-1 bg-white rounded-lg shadow-lg p-6">
          {currentSheet ? (
            <Sheet
              sheet={currentSheet}
              marks={currentMarks}
              onMarkAdd={(mark) => addMark(state.currentSheetId, mark)}
              onMarkRemove={(markId) => removeMark(state.currentSheetId, markId)}
            />
          ) : (
            <div className="text-center text-gray-400 py-12">
              No sheet selected
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider initialConfig={yahtzeeConfig}>
      <GameApp />
    </GameProvider>
  );
}
