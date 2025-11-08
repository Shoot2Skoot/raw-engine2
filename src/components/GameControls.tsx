/**
 * Game Controls Component
 *
 * Undo, redo, save, load, reset controls
 */

import { Undo2, Redo2, Save, Upload, RotateCcw, Download } from 'lucide-react';
import { useGameState } from '../hooks/useGameState';
import { exportGameState, importGameState } from '../utils/storage';
import { useRef } from 'react';

export function GameControls() {
  const { state, undo, redo, resetGame } = useGameState();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  const handleExport = () => {
    exportGameState(state);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const gameState = await importGameState(file);
      // TODO: Load the imported game state
      console.log('Imported game state:', gameState);
    } catch (error) {
      console.error('Failed to import game:', error);
      alert('Failed to import game file');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the entire game? This cannot be undone.')) {
      resetGame();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
        Game Controls
      </h3>

      <div className="space-y-2">
        {/* Undo/Redo */}
        <div className="flex gap-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`
              flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all text-sm font-medium
              ${
                canUndo
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }
            `}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={16} />
            Undo
          </button>

          <button
            onClick={redo}
            disabled={!canRedo}
            className={`
              flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all text-sm font-medium
              ${
                canRedo
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }
            `}
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 size={16} />
            Redo
          </button>
        </div>

        {/* Save/Load */}
        <div className="pt-2 border-t border-gray-200">
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium"
          >
            <Download size={16} />
            Export Game
          </button>

          <button
            onClick={handleImport}
            className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm font-medium"
          >
            <Upload size={16} />
            Import Game
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Reset */}
        <div className="pt-2 border-t border-gray-200">
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm font-medium"
          >
            <RotateCcw size={16} />
            Reset Game
          </button>
        </div>
      </div>

      {/* Auto-save indicator */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Save size={12} />
          <span>Auto-save enabled</span>
        </div>
        {state.lastSaved && (
          <div className="text-xs text-gray-400 mt-1">
            Last saved: {new Date(state.lastSaved).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}
