/**
 * Main App Component
 */

import React from 'react';
import { Undo2, Redo2, Save, Upload, RotateCcw } from 'lucide-react';
import { GameProvider, useGame } from './gameState';
import { Sheet } from './components/Sheet';
import { ToolPanel } from './components/ToolPanel';
import { DicePanel } from './components/DicePanel';
import { CardPanel } from './components/CardPanel';
import type { GameConfig } from './types';

interface GameAppProps {
  config: GameConfig;
}

const GameUI: React.FC = () => {
  const { state, setSheet, undo, redo, canUndo, canRedo, saveGame } = useGame();

  const currentSheet = state.sheets.find((s) => s.id === state.currentSheetId);

  const handleLoadGame = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const saveData = JSON.parse(event.target?.result as string);
            if (saveData.state) {
              // Would need to dispatch LOAD_STATE
              console.log('Load game:', saveData);
            }
          } catch (error) {
            console.error('Failed to load game:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the game? This cannot be undone.')) {
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-800 text-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Roll & Write Engine</h1>
          <div className="flex items-center gap-2">
            {/* Undo/Redo */}
            <button
              onClick={undo}
              disabled={!canUndo}
              className="flex items-center gap-1 px-3 py-2 bg-slate-700 rounded hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={16} />
              <span className="hidden sm:inline">Undo</span>
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="flex items-center gap-1 px-3 py-2 bg-slate-700 rounded hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 size={16} />
              <span className="hidden sm:inline">Redo</span>
            </button>

            {/* Save/Load */}
            <button
              onClick={saveGame}
              className="flex items-center gap-1 px-3 py-2 bg-blue-600 rounded hover:bg-blue-500"
              title="Save Game"
            >
              <Save size={16} />
              <span className="hidden sm:inline">Save</span>
            </button>
            <button
              onClick={handleLoadGame}
              className="flex items-center gap-1 px-3 py-2 bg-blue-600 rounded hover:bg-blue-500"
              title="Load Game"
            >
              <Upload size={16} />
              <span className="hidden sm:inline">Load</span>
            </button>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-2 bg-red-600 rounded hover:bg-red-500"
              title="Reset Game"
            >
              <RotateCcw size={16} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Sheet Tabs */}
        {state.sheets.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {state.sheets.map((sheet, index) => (
              <button
                key={sheet.id}
                onClick={() => setSheet(sheet.id)}
                className={`px-4 py-2 rounded-t whitespace-nowrap ${
                  state.currentSheetId === sheet.id
                    ? 'bg-slate-50 text-slate-800 font-bold'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
                title={`Switch to ${sheet.name} (${index + 1})`}
              >
                {index + 1}. {sheet.name}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Tool Panel (Left Sidebar) */}
        <ToolPanel />

        {/* Sheet Area (Center) */}
        <main className="flex-1 overflow-auto p-4">
          {currentSheet ? (
            <Sheet sheet={currentSheet} showHotspotBorders={false} />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              No sheet selected
            </div>
          )}
        </main>
      </div>

      {/* Bottom Panels (Dice and Cards) */}
      <div className="border-t border-slate-300">
        <DicePanel />
        <CardPanel />
      </div>
    </div>
  );
};

export const App: React.FC<GameAppProps> = ({ config }) => {
  return (
    <GameProvider config={config}>
      <GameUI />
    </GameProvider>
  );
};

export default App;
