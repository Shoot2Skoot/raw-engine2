/**
 * Control Bar Component
 * Undo/redo, save/load, reset controls
 */

import React from 'react';
import { Undo2, Redo2, Save, Upload, RotateCcw, Download } from 'lucide-react';

interface ControlBarProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
  onReset: () => void;
  gameName: string;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSave,
  onLoad,
  onExport,
  onReset,
  gameName,
}) => {
  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">{gameName}</h3>

      {/* Undo/Redo */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Undo"
          title="Undo (Ctrl/Cmd + Z)"
        >
          <Undo2 size={18} />
          <span className="text-sm font-medium">Undo</span>
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Redo"
          title="Redo (Ctrl/Cmd + Shift + Z)"
        >
          <Redo2 size={18} />
          <span className="text-sm font-medium">Redo</span>
        </button>
      </div>

      {/* Save/Load */}
      <div className="flex flex-col gap-2 mb-3">
        <button
          onClick={onSave}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          aria-label="Save to localStorage"
        >
          <Save size={18} />
          <span className="text-sm font-medium">Save</span>
        </button>

        <button
          onClick={onLoad}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          aria-label="Load from localStorage"
        >
          <Upload size={18} />
          <span className="text-sm font-medium">Load</span>
        </button>

        <button
          onClick={onExport}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          aria-label="Export to file"
        >
          <Download size={18} />
          <span className="text-sm font-medium">Export</span>
        </button>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        aria-label="Reset game"
      >
        <RotateCcw size={18} />
        <span className="text-sm font-medium">Reset</span>
      </button>

      <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
        <p>Auto-saves after each action</p>
      </div>
    </div>
  );
};
