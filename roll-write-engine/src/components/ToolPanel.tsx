/**
 * Tool selection panel component
 */

import React, { useState } from 'react';
import {
  CheckSquare,
  Hash,
  Palette,
  Circle,
  Star,
  Type,
  Minus,
  Edit3,
  Pen,
} from 'lucide-react';
import type { MarkType } from '../types';
import { useGame } from '../gameState';

export const ToolPanel: React.FC = () => {
  const { state, setTool } = useGame();
  const [showNumberInput, setShowNumberInput] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [numberValue, setNumberValue] = useState<string>('1');

  const currentTool = state.currentTool;

  const handleToolSelect = (type: MarkType) => {
    if (type === 'number') {
      setShowNumberInput(true);
    } else if (type === 'color') {
      setShowColorPalette(true);
    } else {
      setTool({ type, isPermanent: currentTool.isPermanent });
    }
  };

  const handleNumberSubmit = () => {
    setTool({
      type: 'number',
      isPermanent: currentTool.isPermanent,
      value: parseInt(numberValue) || 0,
    });
    setShowNumberInput(false);
  };

  const handleColorSelect = (color: string) => {
    setTool({
      type: 'color',
      isPermanent: currentTool.isPermanent,
      color,
    });
    setShowColorPalette(false);
  };

  const togglePermanent = () => {
    setTool({
      ...currentTool,
      isPermanent: !currentTool.isPermanent,
    });
  };

  const tools: Array<{ type: MarkType; icon: React.ReactNode; label: string }> = [
    { type: 'checkbox', icon: <CheckSquare size={20} />, label: 'Checkbox' },
    { type: 'number', icon: <Hash size={20} />, label: 'Number' },
    { type: 'color', icon: <Palette size={20} />, label: 'Color' },
    { type: 'circle', icon: <Circle size={20} />, label: 'Circle' },
    { type: 'symbol', icon: <Star size={20} />, label: 'Symbol' },
    { type: 'text', icon: <Type size={20} />, label: 'Text' },
    { type: 'line', icon: <Minus size={20} />, label: 'Line' },
  ];

  return (
    <div className="bg-slate-100 border-r border-slate-300 p-4 min-w-[200px]">
      <h3 className="text-lg font-bold mb-4">Tools</h3>

      {/* Pen/Pencil Toggle */}
      <div className="mb-4 p-3 bg-white rounded-lg border border-slate-300">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Mode:</span>
          <button
            onClick={togglePermanent}
            className={`flex items-center gap-2 px-3 py-1 rounded ${
              currentTool.isPermanent
                ? 'bg-slate-800 text-white'
                : 'bg-slate-300 text-slate-700'
            }`}
          >
            {currentTool.isPermanent ? <Pen size={16} /> : <Edit3 size={16} />}
            <span className="text-xs">{currentTool.isPermanent ? 'Pen' : 'Pencil'}</span>
          </button>
        </div>
      </div>

      {/* Tool Buttons */}
      <div className="space-y-2">
        {tools.map((tool) => (
          <button
            key={tool.type}
            onClick={() => handleToolSelect(tool.type)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentTool.type === tool.type
                ? 'bg-blue-500 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            {tool.icon}
            <span className="font-medium">{tool.label}</span>
          </button>
        ))}
      </div>

      {/* Number Input Modal */}
      {showNumberInput && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h4 className="text-lg font-bold mb-4">Enter Number</h4>
            <input
              type="number"
              value={numberValue}
              onChange={(e) => setNumberValue(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded mb-4"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNumberSubmit();
                if (e.key === 'Escape') setShowNumberInput(false);
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={handleNumberSubmit}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                OK
              </button>
              <button
                onClick={() => setShowNumberInput(false)}
                className="flex-1 bg-slate-300 text-slate-700 px-4 py-2 rounded hover:bg-slate-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Color Palette Modal */}
      {showColorPalette && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h4 className="text-lg font-bold mb-4">Select Color</h4>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {state.colorPalette.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className="w-12 h-12 rounded border-2 border-slate-300 hover:border-slate-500"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <button
              onClick={() => setShowColorPalette(false)}
              className="w-full bg-slate-300 text-slate-700 px-4 py-2 rounded hover:bg-slate-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Current Tool Info */}
      <div className="mt-4 p-3 bg-white rounded-lg border border-slate-300 text-sm">
        <div className="font-medium text-slate-600">Current:</div>
        <div className="font-bold">{currentTool.type}</div>
        {currentTool.type === 'number' && currentTool.value !== undefined && (
          <div className="text-slate-600">Value: {currentTool.value}</div>
        )}
        {currentTool.type === 'color' && currentTool.color && (
          <div className="flex items-center gap-2 mt-1">
            <div
              className="w-6 h-6 rounded border border-slate-300"
              style={{ backgroundColor: currentTool.color }}
            />
            <span className="text-slate-600">{currentTool.color}</span>
          </div>
        )}
      </div>
    </div>
  );
};
