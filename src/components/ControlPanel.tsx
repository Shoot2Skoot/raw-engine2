/**
 * Control panel - undo, redo, reset, save/load buttons
 */

import { Undo, Redo, RotateCcw, Save, FolderOpen } from 'lucide-react';

interface ControlPanelProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onSave?: () => void;
  onLoad?: () => void;
}

export function ControlPanel({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReset,
  onSave,
  onLoad,
}: ControlPanelProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2">
      {/* Undo/Redo */}
      <div className="flex items-center gap-1">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <Undo size={20} />
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo size={20} />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* Reset */}
      <button
        onClick={onReset}
        className="p-2 rounded hover:bg-red-50 hover:text-red-600 transition-colors"
        title="Reset game"
      >
        <RotateCcw size={20} />
      </button>

      {/* Save/Load */}
      {(onSave || onLoad) && (
        <>
          <div className="w-px h-6 bg-gray-300 mx-2" />

          {onSave && (
            <button
              onClick={onSave}
              className="flex items-center gap-2 px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors text-sm font-medium"
              title="Save game"
            >
              <Save size={16} />
              Save
            </button>
          )}

          {onLoad && (
            <button
              onClick={onLoad}
              className="flex items-center gap-2 px-3 py-2 rounded border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium"
              title="Load game"
            >
              <FolderOpen size={16} />
              Load
            </button>
          )}
        </>
      )}
    </div>
  );
}
