/**
 * Tool Palette - UI for selecting marking tools
 */

import React from 'react';
import { Check, Type, Square, Circle, Eraser, Undo, Redo } from 'lucide-react';
import type { Tool } from '../types';

interface ToolPaletteProps {
  tools: Tool[];
  selectedTool: Tool;
  onSelectTool: (tool: Tool) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const ToolPalette: React.FC<ToolPaletteProps> = ({
  tools,
  selectedTool,
  onSelectTool,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) => {
  const getToolIcon = (tool: Tool) => {
    switch (tool.type) {
      case 'checkbox':
        return <Check className="w-5 h-5" />;
      case 'number':
        return <Type className="w-5 h-5" />;
      case 'color':
        return <Square className="w-5 h-5" />;
      case 'circle':
        return <Circle className="w-5 h-5" />;
      case 'eraser':
        return <Eraser className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getToolLabel = (tool: Tool) => {
    return tool.type.charAt(0).toUpperCase() + tool.type.slice(1);
  };

  return (
    <div className="flex items-center gap-2 p-4 bg-white border-b shadow-sm">
      {/* Tools */}
      <div className="flex gap-1">
        {tools.map((tool, index) => {
          const isSelected = selectedTool.type === tool.type;
          return (
            <button
              key={index}
              onClick={() => onSelectTool(tool)}
              className={`
                flex flex-col items-center justify-center p-2 rounded transition-colors
                ${
                  isSelected
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
              title={getToolLabel(tool)}
            >
              {getToolIcon(tool)}
              <span className="text-xs mt-1">{getToolLabel(tool)}</span>
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="w-px h-8 bg-gray-300 mx-2"></div>

      {/* Undo/Redo */}
      <div className="flex gap-1">
        {onUndo && (
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-5 h-5" />
          </button>
        )}
        {onRedo && (
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
