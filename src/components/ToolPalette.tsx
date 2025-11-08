/**
 * Tool Palette Component
 *
 * Allows players to select marking tools
 */

import {
  CheckSquare,
  Hash,
  Palette,
  Circle,
  Star,
  Type,
  Minus,
  Pencil,
} from 'lucide-react';
import type { MarkType } from '../types';
import { useGameState } from '../hooks/useGameState';

export function ToolPalette() {
  const { state, setSelectedTool } = useGameState();
  const { selectedTool } = state;

  const tools: Array<{
    type: MarkType;
    icon: React.ReactNode;
    label: string;
    shortcut?: string;
  }> = [
    { type: 'checkbox', icon: <CheckSquare size={20} />, label: 'Checkbox', shortcut: '1' },
    { type: 'number', icon: <Hash size={20} />, label: 'Number', shortcut: '2' },
    { type: 'color', icon: <Palette size={20} />, label: 'Color', shortcut: '3' },
    { type: 'circle', icon: <Circle size={20} />, label: 'Circle', shortcut: '4' },
    { type: 'symbol', icon: <Star size={20} />, label: 'Symbol', shortcut: '5' },
    { type: 'text', icon: <Type size={20} />, label: 'Text', shortcut: '6' },
    { type: 'line', icon: <Minus size={20} />, label: 'Line', shortcut: '7' },
  ];

  const handleToolSelect = (type: MarkType) => {
    setSelectedTool({
      ...selectedTool,
      markType: type,
    });
  };

  const togglePencilMode = () => {
    setSelectedTool({
      ...selectedTool,
      isPencilMode: !selectedTool.isPencilMode,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
        Tools
      </h3>

      {/* Tool buttons */}
      <div className="grid grid-cols-2 gap-2">
        {tools.map(tool => (
          <button
            key={tool.type}
            onClick={() => handleToolSelect(tool.type)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-md transition-all
              ${
                selectedTool.markType === tool.type
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
            title={`${tool.label} ${tool.shortcut ? `(${tool.shortcut})` : ''}`}
          >
            {tool.icon}
            <span className="text-sm font-medium">{tool.label}</span>
          </button>
        ))}
      </div>

      {/* Pencil mode toggle */}
      <div className="pt-2 border-t border-gray-200">
        <button
          onClick={togglePencilMode}
          className={`
            w-full flex items-center gap-2 px-3 py-2 rounded-md transition-all
            ${
              selectedTool.isPencilMode
                ? 'bg-yellow-100 text-yellow-900 border-2 border-yellow-400'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          <Pencil size={20} />
          <span className="text-sm font-medium">
            {selectedTool.isPencilMode ? 'Pencil Mode (ON)' : 'Pencil Mode (OFF)'}
          </span>
        </button>
        <p className="text-xs text-gray-500 mt-1 px-1">
          Pencil marks appear lighter and can be easily erased
        </p>
      </div>

      {/* Color picker (shown when color tool is selected) */}
      {selectedTool.markType === 'color' && (
        <div className="pt-2 border-t border-gray-200">
          <ColorPicker
            selected={selectedTool.selectedColor || '#3b82f6'}
            onSelect={color =>
              setSelectedTool({ ...selectedTool, selectedColor: color })
            }
          />
        </div>
      )}

      {/* Symbol picker (shown when symbol tool is selected) */}
      {selectedTool.markType === 'symbol' && (
        <div className="pt-2 border-t border-gray-200">
          <SymbolPicker
            selected={selectedTool.selectedSymbol || 'star'}
            onSelect={symbol =>
              setSelectedTool({ ...selectedTool, selectedSymbol: symbol })
            }
          />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// COLOR PICKER
// ============================================================================

function ColorPicker({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (color: string) => void;
}) {
  const colors = [
    { id: 'blue', hex: '#3b82f6', name: 'Blue' },
    { id: 'green', hex: '#10b981', name: 'Green' },
    { id: 'red', hex: '#ef4444', name: 'Red' },
    { id: 'yellow', hex: '#f59e0b', name: 'Yellow' },
    { id: 'purple', hex: '#8b5cf6', name: 'Purple' },
    { id: 'pink', hex: '#ec4899', name: 'Pink' },
    { id: 'orange', hex: '#f97316', name: 'Orange' },
    { id: 'teal', hex: '#14b8a6', name: 'Teal' },
  ];

  return (
    <div>
      <h4 className="text-xs font-semibold text-gray-600 mb-2">Select Color</h4>
      <div className="grid grid-cols-4 gap-2">
        {colors.map(color => (
          <button
            key={color.id}
            onClick={() => onSelect(color.hex)}
            className={`
              w-10 h-10 rounded-md transition-all
              ${selected === color.hex ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
            `}
            style={{ backgroundColor: color.hex }}
            title={color.name}
            aria-label={color.name}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// SYMBOL PICKER
// ============================================================================

function SymbolPicker({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (symbol: string) => void;
}) {
  const symbols = [
    { id: 'star', label: '★' },
    { id: 'heart', label: '♥' },
    { id: 'diamond', label: '♦' },
    { id: 'club', label: '♣' },
    { id: 'spade', label: '♠' },
    { id: 'circle', label: '●' },
    { id: 'square', label: '■' },
    { id: 'triangle', label: '▲' },
  ];

  return (
    <div>
      <h4 className="text-xs font-semibold text-gray-600 mb-2">Select Symbol</h4>
      <div className="grid grid-cols-4 gap-2">
        {symbols.map(symbol => (
          <button
            key={symbol.id}
            onClick={() => onSelect(symbol.id)}
            className={`
              w-10 h-10 rounded-md flex items-center justify-center text-xl transition-all
              ${
                selected === symbol.id
                  ? 'bg-blue-500 text-white ring-2 ring-offset-2 ring-blue-500'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
            title={symbol.id}
          >
            {symbol.label}
          </button>
        ))}
      </div>
    </div>
  );
}
