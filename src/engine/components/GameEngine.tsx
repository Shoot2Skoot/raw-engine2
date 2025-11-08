/**
 * Game Engine - Main component that orchestrates the entire game
 */

import React, { useEffect } from 'react';
import type { GameConfig } from '../types';
import { useGameState } from '../hooks/useGameState';
import { SheetRenderer } from './SheetRenderer';
import { ToolPalette } from './ToolPalette';

interface GameEngineProps {
  config: GameConfig;
}

export const GameEngine: React.FC<GameEngineProps> = ({ config }) => {
  const {
    state,
    placeMark,
    removeMark,
    selectTool,
    switchSheet,
    undo,
    redo,
    canUndo,
    canRedo,
    resetGame,
    saveToFile,
  } = useGameState(config);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Ctrl/Cmd + Shift + Z for redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }
      // Number keys 1-9 for sheet switching
      if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key, 10) - 1;
        if (index < state.sheets.length) {
          switchSheet(state.sheets[index].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, state.sheets, switchSheet]);

  const activeSheet = state.sheets.find((s) => s.id === state.activeSheetId);
  if (!activeSheet) {
    return <div className="p-4">No active sheet found</div>;
  }

  const sheetMarks = state.marks[state.activeSheetId] || {};

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{state.gameName}</h1>
        <div className="flex gap-2">
          <button
            onClick={saveToFile}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Game
          </button>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Tool Palette */}
      <ToolPalette
        tools={config.tools}
        selectedTool={state.selectedTool}
        onSelectTool={selectTool}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      {/* Sheet Navigation (if multiple sheets) */}
      {state.sheets.length > 1 && (
        <div className="bg-white border-b flex gap-2 p-2">
          {state.sheets.map((sheet) => (
            <button
              key={sheet.id}
              onClick={() => switchSheet(sheet.id)}
              className={`
                px-4 py-2 rounded transition-colors
                ${
                  state.activeSheetId === sheet.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }
              `}
            >
              {sheet.name}
            </button>
          ))}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-8">
        <div className="flex justify-center">
          <SheetRenderer
            sheet={activeSheet}
            marks={sheetMarks}
            selectedTool={state.selectedTool}
            onPlaceMark={(hotspotId, mark) =>
              placeMark(state.activeSheetId, hotspotId, mark)
            }
            onRemoveMark={(hotspotId, markIndex) =>
              removeMark(state.activeSheetId, hotspotId, markIndex)
            }
          />
        </div>
      </div>
    </div>
  );
};
