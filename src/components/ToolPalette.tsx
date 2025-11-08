/**
 * ToolPalette - tool selection interface for marking
 */

import React, { useState } from 'react';
import {
  CheckSquare,
  Hash,
  Palette,
  Circle,
  Star,
  Type,
  Pencil,
  Pen,
} from 'lucide-react';
import type { Tool, MarkType } from '../types';

interface ToolPaletteProps {
  currentTool: Tool;
  onToolChange: (tool: Tool) => void;
  colorPalette?: string[];
  symbolPalette?: string[];
  availableTools?: MarkType[];
}

const toolIcons: Record<MarkType, React.FC<{ className?: string }>> = {
  checkbox: CheckSquare,
  number: Hash,
  color: Palette,
  circle: Circle,
  symbol: Star,
  text: Type,
  line: Type,
  'region-fill': Palette,
};

const toolLabels: Record<MarkType, string> = {
  checkbox: 'Checkbox',
  number: 'Number',
  color: 'Color',
  circle: 'Circle',
  symbol: 'Symbol',
  text: 'Text',
  line: 'Line',
  'region-fill': 'Fill Region',
};

export const ToolPalette: React.FC<ToolPaletteProps> = ({
  currentTool,
  onToolChange,
  colorPalette = [],
  symbolPalette = [],
  availableTools = ['checkbox', 'number', 'color', 'circle', 'symbol', 'text'],
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSymbolPicker, setShowSymbolPicker] = useState(false);
  const [numberValue, setNumberValue] = useState<string>('');

  const handleToolSelect = (type: MarkType) => {
    if (type === 'color') {
      setShowColorPicker(!showColorPicker);
      if (colorPalette.length > 0) {
        onToolChange({ type, value: colorPalette[0] });
      }
    } else if (type === 'symbol') {
      setShowSymbolPicker(!showSymbolPicker);
      if (symbolPalette.length > 0) {
        onToolChange({ type, value: symbolPalette[0] });
      }
    } else if (type === 'number') {
      onToolChange({ type, value: undefined });
    } else {
      onToolChange({ type });
    }
  };

  const handleColorSelect = (color: string) => {
    onToolChange({ type: 'color', value: color });
    setShowColorPicker(false);
  };

  const handleSymbolSelect = (symbol: string) => {
    onToolChange({ type: 'symbol', value: symbol });
    setShowSymbolPicker(false);
  };

  const togglePencilMode = () => {
    onToolChange({
      ...currentTool,
      isPencilMode: !currentTool.isPencilMode,
    });
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-sm">
      <div className="flex flex-col gap-2">
        {/* Tool buttons */}
        <div className="flex flex-wrap gap-2">
          {availableTools.map((tool) => {
            const Icon = toolIcons[tool];
            const isActive = currentTool.type === tool;

            return (
              <button
                key={tool}
                onClick={() => handleToolSelect(tool)}
                className={`
                  flex items-center gap-1.5 px-3 py-2 rounded-md
                  border transition-all
                  ${
                    isActive
                      ? 'bg-blue-500 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }
                `}
                title={toolLabels[tool]}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{toolLabels[tool]}</span>
              </button>
            );
          })}
        </div>

        {/* Number input */}
        {currentTool.type === 'number' && (
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            <label className="text-sm font-medium text-gray-700">Value:</label>
            <input
              type="number"
              value={numberValue}
              onChange={(e) => {
                setNumberValue(e.target.value);
                onToolChange({
                  type: 'number',
                  value: parseInt(e.target.value, 10) || undefined,
                });
              }}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              placeholder="Enter #"
            />
          </div>
        )}

        {/* Color picker */}
        {showColorPicker && currentTool.type === 'color' && colorPalette.length > 0 && (
          <div className="grid grid-cols-6 gap-2 p-2 bg-gray-50 rounded">
            {colorPalette.map((color) => (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                className={`
                  w-8 h-8 rounded border-2 transition-all
                  ${currentTool.value === color ? 'border-gray-900 scale-110' : 'border-gray-300'}
                `}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        )}

        {/* Symbol picker */}
        {showSymbolPicker && currentTool.type === 'symbol' && symbolPalette.length > 0 && (
          <div className="grid grid-cols-6 gap-2 p-2 bg-gray-50 rounded">
            {symbolPalette.map((symbol) => (
              <button
                key={symbol}
                onClick={() => handleSymbolSelect(symbol)}
                className={`
                  w-8 h-8 rounded border-2 transition-all flex items-center justify-center
                  ${currentTool.value === symbol ? 'border-gray-900 scale-110' : 'border-gray-300'}
                `}
                title={symbol}
              >
                <span className="text-lg">{symbol}</span>
              </button>
            ))}
          </div>
        )}

        {/* Pencil/Pen mode toggle */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
          <button
            onClick={togglePencilMode}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm
              ${
                currentTool.isPencilMode
                  ? 'bg-gray-300 text-gray-700 border-gray-400'
                  : 'bg-gray-800 text-white border-gray-900'
              }
            `}
          >
            {currentTool.isPencilMode ? (
              <>
                <Pencil className="w-3 h-3" />
                <span>Pencil (Temporary)</span>
              </>
            ) : (
              <>
                <Pen className="w-3 h-3" />
                <span>Pen (Permanent)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
