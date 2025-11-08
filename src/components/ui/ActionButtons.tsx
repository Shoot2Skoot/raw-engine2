/**
 * Action buttons for undo, redo, reset, save, etc.
 */

import { Undo2, Redo2, RotateCcw, Save, FolderOpen } from 'lucide-react';
import { useGame } from '../../engine/GameContext';

export function ActionButtons() {
  const { canUndo, canRedo, undo, redo, saveToFile, loadFromFile, dispatch } = useGame();

  const handleResetAll = () => {
    if (confirm('Are you sure you want to reset the entire game? This cannot be undone.')) {
      dispatch({ type: 'RESET_GAME' });
    }
  };

  const handleLoadFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          await loadFromFile(file);
        } catch (error) {
          alert('Failed to load file. Please ensure it is a valid game save file.');
        }
      }
    };
    input.click();
  };

  return (
    <div className="action-buttons flex gap-2">
      {/* Undo/Redo */}
      <button
        onClick={undo}
        disabled={!canUndo}
        className={`
          flex items-center gap-1 px-3 py-2 rounded text-sm font-medium transition-colors
          ${canUndo
            ? 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
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
          flex items-center gap-1 px-3 py-2 rounded text-sm font-medium transition-colors
          ${canRedo
            ? 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }
        `}
        title="Redo (Ctrl+Shift+Z)"
      >
        <Redo2 size={16} />
        Redo
      </button>

      {/* Save/Load */}
      <button
        onClick={saveToFile}
        className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded text-sm font-medium text-gray-700 transition-colors"
        title="Save to file"
      >
        <Save size={16} />
        Save
      </button>

      <button
        onClick={handleLoadFile}
        className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded text-sm font-medium text-gray-700 transition-colors"
        title="Load from file"
      >
        <FolderOpen size={16} />
        Load
      </button>

      {/* Reset */}
      <button
        onClick={handleResetAll}
        className="flex items-center gap-1 px-3 py-2 bg-red-50 border border-red-300 hover:bg-red-100 rounded text-sm font-medium text-red-700 transition-colors"
        title="Reset entire game"
      >
        <RotateCcw size={16} />
        Reset
      </button>
    </div>
  );
}
