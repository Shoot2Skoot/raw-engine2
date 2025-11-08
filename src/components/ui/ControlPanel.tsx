/**
 * Control Panel Component
 * Displays game controls (undo, redo, reset, save, load)
 */

import { useRef } from 'react';
import { Undo, Redo, RotateCcw, Save, Upload } from 'lucide-react';
import { exportGameState, importGameState } from '../../utils/gameEngine';
import { GameState } from '../../types';

interface ControlPanelProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onResetGame: () => void;
  onResetSheet: () => void;
  gameState: GameState;
  onLoadGame: (state: GameState) => void;
}

export function ControlPanel({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onResetGame,
  onResetSheet,
  gameState,
  onLoadGame,
}: ControlPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportGameState(gameState);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const state = await importGameState(file);
        onLoadGame(state);
      } catch (error) {
        alert('Failed to load game state. Please check the file and try again.');
      }
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm px-4 py-2">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`
              flex items-center gap-1 px-3 py-2 rounded-lg transition-colors touch-manipulation no-tap-highlight
              ${
                canUndo
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  : 'bg-gray-50 text-gray-300 cursor-not-allowed'
              }
            `}
            title="Undo (Ctrl+Z)"
          >
            <Undo size={18} />
            <span className="text-sm font-medium">Undo</span>
          </button>

          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`
              flex items-center gap-1 px-3 py-2 rounded-lg transition-colors touch-manipulation no-tap-highlight
              ${
                canRedo
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  : 'bg-gray-50 text-gray-300 cursor-not-allowed'
              }
            `}
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo size={18} />
            <span className="text-sm font-medium">Redo</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors touch-manipulation no-tap-highlight"
            title="Export game state"
          >
            <Save size={18} />
            <span className="text-sm font-medium">Save</span>
          </button>

          <button
            onClick={handleImport}
            className="flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors touch-manipulation no-tap-highlight"
            title="Import game state"
          >
            <Upload size={18} />
            <span className="text-sm font-medium">Load</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={onResetSheet}
            className="flex items-center gap-1 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors touch-manipulation no-tap-highlight"
            title="Reset current sheet"
          >
            <RotateCcw size={18} />
            <span className="text-sm font-medium">Reset Sheet</span>
          </button>

          <button
            onClick={onResetGame}
            className="flex items-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors touch-manipulation no-tap-highlight"
            title="Reset entire game"
          >
            <RotateCcw size={18} />
            <span className="text-sm font-medium">Reset Game</span>
          </button>
        </div>
      </div>
    </div>
  );
}
