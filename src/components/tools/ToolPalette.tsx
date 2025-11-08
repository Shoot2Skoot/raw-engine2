/**
 * Tool palette - Select marking tools
 */

import React from 'react';
import {
  Check,
  Hash,
  Palette,
  Circle,
  Star,
  Type,
  Minus,
  Edit3,
} from 'lucide-react';
import type { MarkType, ToolState } from '../../types';

interface ToolPaletteProps {
  toolState: ToolState;
  availableTools: MarkType[];
  onToolChange: (tool: MarkType) => void;
  onPencilToggle: () => void;
}

export const ToolPalette: React.FC<ToolPaletteProps> = ({
  toolState,
  availableTools,
  onToolChange,
  onPencilToggle,
}) => {
  const tools: Array<{ type: MarkType; icon: React.ReactNode; label: string }> = [
    { type: 'checkbox', icon: <Check size={20} />, label: 'Checkbox' },
    { type: 'number', icon: <Hash size={20} />, label: 'Number' },
    { type: 'color', icon: <Palette size={20} />, label: 'Color' },
    { type: 'circle', icon: <Circle size={20} />, label: 'Circle' },
    { type: 'symbol', icon: <Star size={20} />, label: 'Symbol' },
    { type: 'text', icon: <Type size={20} />, label: 'Text' },
    { type: 'line', icon: <Minus size={20} />, label: 'Line' },
    { type: 'fill', icon: <Palette size={20} />, label: 'Fill' },
  ];

  const visibleTools = tools.filter((tool) => availableTools.includes(tool.type));

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-2">
      <div className="flex flex-col gap-1">
        <div className="text-xs font-semibold text-gray-600 px-2 py-1">Tools</div>

        {/* Tool buttons */}
        <div className="flex flex-wrap gap-1">
          {visibleTools.map((tool) => (
            <button
              key={tool.type}
              onClick={() => onToolChange(tool.type)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-md transition-all
                ${
                  toolState.selectedTool === tool.type
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
              title={tool.label}
            >
              {tool.icon}
              <span className="text-sm hidden sm:inline">{tool.label}</span>
            </button>
          ))}
        </div>

        {/* Pencil mode toggle */}
        <div className="border-t border-gray-200 mt-2 pt-2">
          <button
            onClick={onPencilToggle}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-md transition-all w-full
              ${
                toolState.isPencilMode
                  ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-400'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            <Edit3 size={18} />
            <span className="text-sm">
              {toolState.isPencilMode ? 'Pencil Mode' : 'Pen Mode'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
