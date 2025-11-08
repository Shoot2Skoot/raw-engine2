/**
 * Toolbar Component
 * Tool selection and game controls
 */

import React from 'react';
import {
  Square,
  Hash,
  Circle,
  Eraser,
  Undo2,
  Redo2,
  RotateCcw,
} from 'lucide-react';
import { Tool } from '../../types';

interface ToolbarProps {
  tools: Tool[];
  selectedTool: Tool;
  onToolSelect: (tool: Tool) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  tools,
  selectedTool,
  onToolSelect,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReset,
}) => {
  const getToolIcon = (toolType: string) => {
    switch (toolType) {
      case 'checkbox':
        return <Square size={20} />;
      case 'number':
        return <Hash size={20} />;
      case 'circle':
        return <Circle size={20} />;
      case 'eraser':
        return <Eraser size={20} />;
      default:
        return <Square size={20} />;
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 bg-gray-100 border-b border-gray-300">
      {/* Tools */}
      <div className="flex items-center gap-1">
        {tools.map((tool) => (
          <button
            key={tool.type}
            className={`p-2 rounded transition-colors ${
              selectedTool.type === tool.type
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onToolSelect(tool)}
            title={tool.label}
          >
            {getToolIcon(tool.type)}
          </button>
        ))}
      </div>

      <div className="w-px h-8 bg-gray-300" />

      {/* Undo/Redo */}
      <div className="flex items-center gap-1">
        <button
          className={`p-2 rounded transition-colors ${
            canUndo
              ? 'bg-white text-gray-700 hover:bg-gray-200'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={20} />
        </button>
        <button
          className={`p-2 rounded transition-colors ${
            canRedo
              ? 'bg-white text-gray-700 hover:bg-gray-200'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 size={20} />
        </button>
      </div>

      <div className="w-px h-8 bg-gray-300" />

      {/* Reset */}
      <button
        className="p-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
        onClick={onReset}
        title="Reset Game"
      >
        <RotateCcw size={20} />
      </button>

      {/* Tool info */}
      <div className="ml-auto text-sm text-gray-600">
        Selected: <span className="font-semibold">{selectedTool.label}</span>
        {selectedTool.isPermanent ? ' (Pen)' : ' (Pencil)'}
      </div>
    </div>
  );
};
