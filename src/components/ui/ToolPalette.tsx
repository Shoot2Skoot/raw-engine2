/**
 * Tool palette for selecting mark types
 */

import {
  Square,
  Hash,
  Palette,
  Circle,
  Star,
  Type,
  Minus,
  Edit3,
} from 'lucide-react';
import { MarkType } from '../../types';
import { useGame } from '../../store/GameContext';

interface Tool {
  type: MarkType;
  name: string;
  icon: React.ReactNode;
  shortcut?: string;
}

const TOOLS: Tool[] = [
  {
    type: MarkType.Checkbox,
    name: 'Checkbox',
    icon: <Square size={20} />,
    shortcut: '1',
  },
  {
    type: MarkType.Number,
    name: 'Number',
    icon: <Hash size={20} />,
    shortcut: '2',
  },
  {
    type: MarkType.ColorFill,
    name: 'Color Fill',
    icon: <Palette size={20} />,
    shortcut: '3',
  },
  {
    type: MarkType.Circle,
    name: 'Circle',
    icon: <Circle size={20} />,
    shortcut: '4',
  },
  {
    type: MarkType.Symbol,
    name: 'Symbol',
    icon: <Star size={20} />,
    shortcut: '5',
  },
  {
    type: MarkType.Text,
    name: 'Text',
    icon: <Type size={20} />,
    shortcut: '6',
  },
  {
    type: MarkType.Line,
    name: 'Line',
    icon: <Minus size={20} />,
    shortcut: '7',
  },
];

export function ToolPalette() {
  const { state, setActiveTool, togglePencilMode } = useGame();

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
      <h3 className="font-bold text-lg">Tools</h3>

      {/* Tool buttons */}
      <div className="grid grid-cols-2 gap-2">
        {TOOLS.map((tool) => (
          <button
            key={tool.type}
            onClick={() => setActiveTool(tool.type)}
            className={`
              flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all
              hover:bg-blue-50 hover:border-blue-300
              ${
                state.activeTool?.markType === tool.type
                  ? 'bg-blue-100 border-blue-500'
                  : 'bg-gray-50 border-gray-200'
              }
            `}
            title={`${tool.name}${tool.shortcut ? ` (${tool.shortcut})` : ''}`}
          >
            <div className="mb-1">{tool.icon}</div>
            <span className="text-xs text-center">{tool.name}</span>
            {tool.shortcut && (
              <span className="text-xs text-gray-400 mt-1">{tool.shortcut}</span>
            )}
          </button>
        ))}
      </div>

      {/* Pencil mode toggle */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={togglePencilMode}
          className={`
            w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all
            ${
              state.pencilMode
                ? 'bg-gray-700 text-white border-gray-800'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }
          `}
        >
          <Edit3 size={20} />
          <span className="font-medium">
            {state.pencilMode ? 'Pencil Mode' : 'Pen Mode'}
          </span>
        </button>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Pencil marks are temporary and appear lighter
        </p>
      </div>
    </div>
  );
}
