import React from 'react';
import {
  CheckSquare,
  Hash,
  Palette,
  Circle,
  Type,
  Trash2,
  Pencil,
  Pen,
} from 'lucide-react';
import { Tool, ToolType } from '../../types';

interface ToolPaletteProps {
  currentTool: Tool;
  onToolChange: (tool: Partial<Tool>) => void;
}

const toolIcons: Record<ToolType, React.ComponentType<{ size?: number }>> = {
  checkbox: CheckSquare,
  number: Hash,
  color: Palette,
  circle: Circle,
  symbol: Circle, // TODO: Better icon
  text: Type,
  line: Type, // TODO: Better icon
  erase: Trash2,
};

const toolLabels: Record<ToolType, string> = {
  checkbox: 'Checkbox',
  number: 'Number',
  color: 'Color',
  circle: 'Circle',
  symbol: 'Symbol',
  text: 'Text',
  line: 'Line',
  erase: 'Erase',
};

/**
 * Tool palette for selecting marking tools
 */
export function ToolPalette({ currentTool, onToolChange }: ToolPaletteProps) {
  const tools: ToolType[] = ['checkbox', 'number', 'color', 'circle', 'text', 'erase'];

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-md">
      <div className="flex flex-col gap-2">
        {/* Tool buttons */}
        <div className="grid grid-cols-3 gap-2">
          {tools.map((tool) => {
            const Icon = toolIcons[tool];
            const isActive = currentTool.type === tool;

            return (
              <button
                key={tool}
                onClick={() => onToolChange({ type: tool })}
                className={`
                  flex flex-col items-center gap-1 p-2 rounded transition-colors
                  ${isActive
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }
                `}
                title={toolLabels[tool]}
              >
                <Icon size={20} />
                <span className="text-xs">{toolLabels[tool]}</span>
              </button>
            );
          })}
        </div>

        {/* Permanence toggle */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onToolChange({ permanence: 'pen' })}
            className={`
              flex-1 flex items-center justify-center gap-1 p-2 rounded text-sm
              ${currentTool.permanence === 'pen'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }
            `}
            title="Permanent marks"
          >
            <Pen size={16} />
            Pen
          </button>

          <button
            onClick={() => onToolChange({ permanence: 'pencil' })}
            className={`
              flex-1 flex items-center justify-center gap-1 p-2 rounded text-sm
              ${currentTool.permanence === 'pencil'
                ? 'bg-gray-400 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }
            `}
            title="Temporary marks (lighter)"
          >
            <Pencil size={16} />
            Pencil
          </button>
        </div>

        {/* Number input for number tool */}
        {currentTool.type === 'number' && (
          <div className="mt-2">
            <label className="block text-xs text-gray-600 mb-1">
              Number Value:
            </label>
            <input
              type="number"
              min="0"
              max="999"
              value={currentTool.numberValue || 0}
              onChange={(e) => onToolChange({ numberValue: parseInt(e.target.value) || 0 })}
              className="w-full px-2 py-1 border border-gray-300 rounded"
            />
          </div>
        )}

        {/* Color picker for color tool */}
        {currentTool.type === 'color' && (
          <div className="mt-2">
            <label className="block text-xs text-gray-600 mb-1">
              Color:
            </label>
            <div className="grid grid-cols-4 gap-1">
              {['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#64748b'].map(color => (
                <button
                  key={color}
                  onClick={() => onToolChange({ color })}
                  className={`
                    w-8 h-8 rounded border-2 transition-all
                    ${currentTool.color === color ? 'border-gray-800 scale-110' : 'border-gray-300'}
                  `}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
