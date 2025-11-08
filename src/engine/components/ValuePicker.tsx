/**
 * Value Picker Component
 * Modal for selecting values (numbers, colors, symbols)
 */

import React, { useState } from 'react';
import { Star, Diamond, Heart, Square, Circle as CircleIcon } from 'lucide-react';
import type { ToolType } from '../types';

interface ValuePickerProps {
  tool: ToolType;
  onSelect: (value: number | string) => void;
  onCancel: () => void;
  numberRange?: { min: number; max: number };
  availableColors?: string[];
  availableSymbols?: string[];
}

export const ValuePicker: React.FC<ValuePickerProps> = ({
  tool,
  onSelect,
  onCancel,
  numberRange = { min: 0, max: 9 },
  availableColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'],
  availableSymbols = ['star', 'diamond', 'heart', 'square', 'circle'],
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleNumberSelect = (num: number) => {
    onSelect(num);
  };

  const handleColorSelect = (color: string) => {
    onSelect(color);
  };

  const handleSymbolSelect = (symbol: string) => {
    onSelect(symbol);
  };

  const handleTextSubmit = () => {
    if (inputValue.trim()) {
      onSelect(inputValue.trim());
    }
  };

  const symbolIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    star: Star,
    diamond: Diamond,
    heart: Heart,
    square: Square,
    circle: CircleIcon,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        {/* Number picker */}
        {tool === 'number' && (
          <>
            <h3 className="text-lg font-semibold mb-4">Select Number</h3>
            <div className="grid grid-cols-5 gap-2">
              {Array.from(
                { length: numberRange.max - numberRange.min + 1 },
                (_, i) => numberRange.min + i
              ).map((num) => (
                <button
                  key={num}
                  onClick={() => handleNumberSelect(num)}
                  className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-bold"
                >
                  {num}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Color picker */}
        {tool === 'color' && (
          <>
            <h3 className="text-lg font-semibold mb-4">Select Color</h3>
            <div className="grid grid-cols-4 gap-3">
              {availableColors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className="w-16 h-16 rounded-lg border-2 border-gray-300 hover:border-gray-500 transition-colors"
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Symbol picker */}
        {tool === 'symbol' && (
          <>
            <h3 className="text-lg font-semibold mb-4">Select Symbol</h3>
            <div className="grid grid-cols-5 gap-3">
              {availableSymbols.map((symbol) => {
                const Icon = symbolIcons[symbol] || Star;
                return (
                  <button
                    key={symbol}
                    onClick={() => handleSymbolSelect(symbol)}
                    className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg border-2 border-gray-300 hover:bg-blue-100 hover:border-blue-500 transition-colors"
                    aria-label={`Select ${symbol} symbol`}
                  >
                    <Icon size={32} />
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Text input */}
        {tool === 'text' && (
          <>
            <h3 className="text-lg font-semibold mb-4">Enter Text</h3>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleTextSubmit();
                } else if (e.key === 'Escape') {
                  onCancel();
                }
              }}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="Type text..."
              maxLength={50}
              autoFocus
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleTextSubmit}
                disabled={!inputValue.trim()}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                OK
              </button>
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {/* Cancel button for color/symbol/number pickers */}
        {(tool === 'color' || tool === 'symbol' || tool === 'number') && (
          <button
            onClick={onCancel}
            className="mt-4 w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};
