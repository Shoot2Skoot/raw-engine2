/**
 * Tool palette - allows players to select marking tools
 */

import React, { useState } from 'react';
import {
  Check,
  Hash,
  Palette,
  Circle,
  Star,
  Type,
  Minus,
  Pencil
} from 'lucide-react';
import type { MarkType, ToolState } from '../types';

interface ToolPaletteProps {
  currentTool: ToolState;
  onToolChange: (tool: ToolState) => void;
  availableTools?: MarkType[];
}

const TOOL_ICONS: Record<MarkType, React.ReactNode> = {
  checkbox: <Check className="w-5 h-5" />,
  number: <Hash className="w-5 h-5" />,
  color: <Palette className="w-5 h-5" />,
  circle: <Circle className="w-5 h-5" />,
  symbol: <Star className="w-5 h-5" />,
  text: <Type className="w-5 h-5" />,
  line: <Minus className="w-5 h-5" />,
  pencil: <Pencil className="w-5 h-5" />
};

const TOOL_LABELS: Record<MarkType, string> = {
  checkbox: 'Checkbox',
  number: 'Number',
  color: 'Color',
  circle: 'Circle',
  symbol: 'Symbol',
  text: 'Text',
  line: 'Line',
  pencil: 'Pencil'
};

const DEFAULT_COLORS = [
  '#EF4444', // red
  '#F59E0B', // orange
  '#10B981', // green
  '#3B82F6', // blue
  '#8B5CF6', // purple
  '#EC4899'  // pink
];

const DEFAULT_SYMBOLS = ['★', '♠', '♥', '♦', '♣', '●', '■', '▲'];

export function ToolPalette({ currentTool, onToolChange, availableTools }: ToolPaletteProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSymbolPicker, setShowSymbolPicker] = useState(false);
  const [showNumberPad, setShowNumberPad] = useState(false);

  const tools = availableTools ?? ['checkbox', 'number', 'color', 'circle', 'symbol', 'text'];

  const handleToolClick = (markType: MarkType) => {
    if (markType === 'color') {
      setShowColorPicker(!showColorPicker);
      setShowSymbolPicker(false);
      setShowNumberPad(false);
    } else if (markType === 'symbol') {
      setShowSymbolPicker(!showSymbolPicker);
      setShowColorPicker(false);
      setShowNumberPad(false);
    } else if (markType === 'number') {
      setShowNumberPad(!showNumberPad);
      setShowColorPicker(false);
      setShowSymbolPicker(false);
    } else {
      setShowColorPicker(false);
      setShowSymbolPicker(false);
      setShowNumberPad(false);
    }

    onToolChange({ ...currentTool, markType });
  };

  const handleColorSelect = (color: string) => {
    onToolChange({ ...currentTool, markType: 'color', colorValue: color });
    setShowColorPicker(false);
  };

  const handleSymbolSelect = (symbol: string) => {
    onToolChange({ ...currentTool, markType: 'symbol', symbolValue: symbol });
    setShowSymbolPicker(false);
  };

  const handleNumberSelect = (num: number) => {
    onToolChange({ ...currentTool, markType: 'number', numberValue: num });
    setShowNumberPad(false);
  };

  const togglePencilMode = () => {
    onToolChange({ ...currentTool, isPencilMode: !currentTool.isPencilMode });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
        Tools
      </h3>

      {/* Tool buttons */}
      <div className="grid grid-cols-2 gap-2">
        {tools.map(tool => (
          <button
            key={tool}
            onClick={() => handleToolClick(tool)}
            className={`
              flex items-center justify-center gap-2 px-3 py-2 rounded-md
              transition-colors duration-150
              ${currentTool.markType === tool
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {TOOL_ICONS[tool]}
            <span className="text-sm font-medium">{TOOL_LABELS[tool]}</span>
          </button>
        ))}
      </div>

      {/* Pencil mode toggle */}
      <button
        onClick={togglePencilMode}
        className={`
          w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md
          transition-colors duration-150
          ${currentTool.isPencilMode
            ? 'bg-yellow-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }
        `}
      >
        <Pencil className="w-5 h-5" />
        <span className="text-sm font-medium">
          {currentTool.isPencilMode ? 'Pencil Mode (ON)' : 'Pen Mode'}
        </span>
      </button>

      {/* Color picker */}
      {showColorPicker && (
        <div className="grid grid-cols-3 gap-2 p-2 bg-gray-50 rounded-md">
          {DEFAULT_COLORS.map(color => (
            <button
              key={color}
              onClick={() => handleColorSelect(color)}
              className="w-full h-10 rounded border-2 border-gray-300 hover:border-gray-500"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      )}

      {/* Symbol picker */}
      {showSymbolPicker && (
        <div className="grid grid-cols-4 gap-2 p-2 bg-gray-50 rounded-md">
          {DEFAULT_SYMBOLS.map(symbol => (
            <button
              key={symbol}
              onClick={() => handleSymbolSelect(symbol)}
              className="w-full h-10 rounded bg-white border-2 border-gray-300 hover:border-gray-500 text-xl"
            >
              {symbol}
            </button>
          ))}
        </div>
      )}

      {/* Number pad */}
      {showNumberPad && (
        <div className="grid grid-cols-3 gap-2 p-2 bg-gray-50 rounded-md">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleNumberSelect(num)}
              className="w-full h-10 rounded bg-white border-2 border-gray-300 hover:border-gray-500 font-bold"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleNumberSelect(0)}
            className="col-span-3 w-full h-10 rounded bg-white border-2 border-gray-300 hover:border-gray-500 font-bold"
          >
            0
          </button>
        </div>
      )}

      {/* Current selection display */}
      <div className="text-xs text-gray-600 pt-2 border-t border-gray-200">
        <div>Tool: <span className="font-semibold">{TOOL_LABELS[currentTool.markType]}</span></div>
        {currentTool.numberValue !== undefined && (
          <div>Value: <span className="font-semibold">{currentTool.numberValue}</span></div>
        )}
        {currentTool.colorValue && (
          <div className="flex items-center gap-2">
            Color:
            <div
              className="w-4 h-4 rounded border border-gray-300"
              style={{ backgroundColor: currentTool.colorValue }}
            />
          </div>
        )}
        {currentTool.symbolValue && (
          <div>Symbol: <span className="font-semibold text-lg">{currentTool.symbolValue}</span></div>
        )}
      </div>
    </div>
  );
}
