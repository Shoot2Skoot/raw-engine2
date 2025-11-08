/**
 * Game controls component - undo/redo, save/load, reset
 */

import React, { useRef } from 'react';
import { Undo, Redo, Save, Upload, RotateCcw, Download } from 'lucide-react';
import { useGame } from '../../state/GameContext';
import { exportGameState, importGameState } from '../../utils/storage';

export function Controls() {
  const { undo, redo, canUndo, canRedo, reset, state, dispatch } = useGame();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportGameState(state);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedState = await importGameState(file);
      dispatch({ type: 'LOAD_STATE', state: importedState });
    } catch (error) {
      alert('Failed to import game state. Please check the file.');
      console.error(error);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the game? All progress will be lost.')) {
      reset();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Controls</h3>

      <div className="space-y-2">
        {/* Undo/Redo */}
        <div className="flex gap-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-gray-300 bg-white text-gray-700 hover:border-gray-400 disabled:hover:border-gray-300"
            title="Undo (Ctrl/Cmd+Z)"
          >
            <Undo size={18} />
            <span className="text-sm font-medium">Undo</span>
          </button>

          <button
            onClick={redo}
            disabled={!canRedo}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-gray-300 bg-white text-gray-700 hover:border-gray-400 disabled:hover:border-gray-300"
            title="Redo (Ctrl/Cmd+Shift+Z)"
          >
            <Redo size={18} />
            <span className="text-sm font-medium">Redo</span>
          </button>
        </div>

        {/* Save/Load */}
        <div className="pt-3 border-t border-gray-200 space-y-2">
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-colors border-blue-500 bg-blue-500 text-white hover:bg-blue-600"
            title="Export game to file"
          >
            <Download size={18} />
            <span className="text-sm font-medium">Export Game</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-colors border-green-500 bg-green-500 text-white hover:bg-green-600"
            title="Import game from file"
          >
            <Upload size={18} />
            <span className="text-sm font-medium">Import Game</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>

        {/* Reset */}
        <div className="pt-3 border-t border-gray-200">
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-colors border-red-500 bg-white text-red-600 hover:bg-red-50"
            title="Reset game"
          >
            <RotateCcw size={18} />
            <span className="text-sm font-medium">Reset Game</span>
          </button>
        </div>
      </div>

      {/* Auto-save indicator */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Save size={14} />
          <span>Auto-save enabled</span>
        </div>
      </div>
    </div>
  );
}
