import React from 'react';
import type { MarkType } from '../types';
import { useGame } from '../context/GameContext';
import {
  CheckSquare,
  Hash,
  Palette,
  Circle,
  Star,
  Type,
  Minus,
  Undo2,
  Redo2,
} from 'lucide-react';

const TOOL_ICONS: Record<MarkType, React.FC<{ className?: string }>> = {
  checkbox: CheckSquare,
  number: Hash,
  color: Palette,
  circle: Circle,
  symbol: Star,
  text: Type,
  line: Minus,
};

const TOOL_LABELS: Record<MarkType, string> = {
  checkbox: 'Checkbox',
  number: 'Number',
  color: 'Color',
  circle: 'Circle',
  symbol: 'Symbol',
  text: 'Text',
  line: 'Line',
};

const TOOL_SHORTCUTS: Record<MarkType, string> = {
  checkbox: '1',
  number: '2',
  color: '3',
  circle: '4',
  symbol: '5',
  text: '6',
  line: '7',
};

export const ToolPalette: React.FC = () => {
  const { state, setCurrentTool, undo, redo } = useGame();

  // Get available tools from current sheet
  const availableTools: MarkType[] = ['checkbox', 'number', 'color', 'circle'];

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-2 shadow-lg">
      <div className="text-xs font-semibold text-gray-600 mb-2 px-1">Tools</div>

      {/* Tool buttons */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {availableTools.map((tool) => {
          const Icon = TOOL_ICONS[tool];
          const isActive = state.currentTool === tool;

          return (
            <button
              key={tool}
              onClick={() => setCurrentTool(tool)}
              className={`
                flex flex-col items-center justify-center p-3 rounded-md
                transition-all duration-150
                ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              `}
              title={`${TOOL_LABELS[tool]} (${TOOL_SHORTCUTS[tool]})`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{TOOL_LABELS[tool]}</span>
              <span className="text-xs opacity-70">{TOOL_SHORTCUTS[tool]}</span>
            </button>
          );
        })}
      </div>

      {/* Undo/Redo buttons */}
      <div className="flex gap-2 pt-2 border-t border-gray-200">
        <button
          onClick={undo}
          disabled={state.historyIndex < 0}
          className={`
            flex items-center justify-center flex-1 p-2 rounded-md
            ${
              state.historyIndex >= 0
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          `}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4 mr-1" />
          <span className="text-sm">Undo</span>
        </button>

        <button
          onClick={redo}
          disabled={state.historyIndex >= state.history.length - 1}
          className={`
            flex items-center justify-center flex-1 p-2 rounded-md
            ${
              state.historyIndex < state.history.length - 1
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          `}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 className="w-4 h-4 mr-1" />
          <span className="text-sm">Redo</span>
        </button>
      </div>
    </div>
  );
};
