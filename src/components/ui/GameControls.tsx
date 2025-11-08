/**
 * Game Controls - undo/redo, save/load, reset buttons
 */

import { Undo, Redo, RotateCcw, Save, Upload } from 'lucide-react';

interface GameControlsProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onSave: () => void;
  onLoad: () => void;
}

export function GameControls({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReset,
  onSave,
  onLoad,
}: GameControlsProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-bold text-gray-900 mb-3">Controls</h3>

      <div className="flex flex-wrap gap-2">
        {/* Undo */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`
            flex items-center gap-2 px-3 py-2 rounded font-medium transition-colors
            ${
              canUndo
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
          title="Undo (Cmd/Ctrl+Z)"
        >
          <Undo size={18} />
          Undo
        </button>

        {/* Redo */}
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`
            flex items-center gap-2 px-3 py-2 rounded font-medium transition-colors
            ${
              canRedo
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
          title="Redo (Cmd/Ctrl+Shift+Z)"
        >
          <Redo size={18} />
          Redo
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors"
        >
          <RotateCcw size={18} />
          Reset
        </button>

        {/* Save */}
        <button
          onClick={onSave}
          className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition-colors"
        >
          <Save size={18} />
          Save
        </button>

        {/* Load */}
        <button
          onClick={onLoad}
          className="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-medium transition-colors"
        >
          <Upload size={18} />
          Load
        </button>
      </div>
    </div>
  );
}
