/**
 * Tool Palette Component
 * UI for selecting marking tools
 */

import React from 'react';
import {
  Check,
  Hash,
  Palette,
  Circle,
  Star,
  Type,
  Slash,
  Eraser,
  Pencil,
  Pen,
} from 'lucide-react';
import type { ToolType } from '../types';

interface ToolPaletteProps {
  currentTool: ToolType;
  isPencilMode: boolean;
  onToolChange: (tool: ToolType) => void;
  onPencilModeToggle: () => void;
  availableTools?: ToolType[];
}

export const ToolPalette: React.FC<ToolPaletteProps> = ({
  currentTool,
  isPencilMode,
  onToolChange,
  onPencilModeToggle,
  availableTools = ['checkbox', 'number', 'color', 'circle', 'symbol', 'text', 'line', 'eraser'],
}) => {
  const tools: Array<{ type: ToolType; icon: React.ComponentType<{ size?: number }>; label: string }> = [
    { type: 'checkbox', icon: Check, label: 'Checkbox' },
    { type: 'number', icon: Hash, label: 'Number' },
    { type: 'color', icon: Palette, label: 'Color' },
    { type: 'circle', icon: Circle, label: 'Circle' },
    { type: 'symbol', icon: Star, label: 'Symbol' },
    { type: 'text', icon: Type, label: 'Text' },
    { type: 'line', icon: Slash, label: 'Line' },
    { type: 'eraser', icon: Eraser, label: 'Eraser' },
  ];

  const filteredTools = tools.filter((tool) => availableTools.includes(tool.type));

  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Tools</h3>

      {/* Tool buttons */}
      <div className="flex flex-col gap-2">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          const isActive = currentTool === tool.type;

          return (
            <button
              key={tool.type}
              onClick={() => onToolChange(tool.type)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${
                  isActive
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
              aria-label={`Select ${tool.label} tool`}
              aria-pressed={isActive}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* Pencil mode toggle */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={onPencilModeToggle}
          className={`
            w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
            ${
              isPencilMode
                ? 'bg-gray-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
          aria-label="Toggle pencil mode"
          aria-pressed={isPencilMode}
        >
          {isPencilMode ? <Pencil size={20} /> : <Pen size={20} />}
          <span className="text-sm font-medium">
            {isPencilMode ? 'Pencil Mode' : 'Pen Mode'}
          </span>
        </button>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
        <p className="font-medium mb-1">Keyboard Shortcuts:</p>
        <p>Ctrl/Cmd + Z: Undo</p>
        <p>Ctrl/Cmd + Shift + Z: Redo</p>
        <p>P: Toggle Pencil Mode</p>
      </div>
    </div>
  );
};
