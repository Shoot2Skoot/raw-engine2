/**
 * Tool palette for selecting mark types
 */

import {
  CheckSquare,
  Hash,
  Droplet,
  Circle,
  Star,
  Type,
  Minus,
  Edit3,
  PenTool,
} from 'lucide-react';
import type { MarkType } from '../../types';
import { useGame } from '../../engine/GameContext';

const MARK_TOOLS: Array<{
  type: MarkType;
  icon: React.ElementType;
  label: string;
  shortcut: string;
}> = [
  { type: 'checkbox', icon: CheckSquare, label: 'Checkbox', shortcut: '1' },
  { type: 'number', icon: Hash, label: 'Number', shortcut: '2' },
  { type: 'color', icon: Droplet, label: 'Color', shortcut: '3' },
  { type: 'circle', icon: Circle, label: 'Circle', shortcut: '4' },
  { type: 'symbol', icon: Star, label: 'Symbol', shortcut: '5' },
  { type: 'text', icon: Type, label: 'Text', shortcut: '6' },
  { type: 'line', icon: Minus, label: 'Line', shortcut: '7' },
];

export function ToolPalette() {
  const { toolState, setToolState } = useGame();

  const handleToolSelect = (type: MarkType) => {
    setToolState(prev => ({ ...prev, currentMarkType: type }));
  };

  const handlePermanenceToggle = () => {
    setToolState(prev => ({
      ...prev,
      permanence: prev.permanence === 'pen' ? 'pencil' : 'pen',
    }));
  };

  return (
    <div className="tool-palette bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Tools</h3>

      {/* Mark type tools */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {MARK_TOOLS.map(tool => {
          const Icon = tool.icon;
          const isSelected = toolState.currentMarkType === tool.type;

          return (
            <button
              key={tool.type}
              onClick={() => handleToolSelect(tool.type)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium
                transition-colors
                ${isSelected
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
              title={`${tool.label} (${tool.shortcut})`}
            >
              <Icon size={18} />
              <span className="flex-1 text-left">{tool.label}</span>
              <span className="text-xs opacity-60">{tool.shortcut}</span>
            </button>
          );
        })}
      </div>

      {/* Permanence toggle */}
      <div className="border-t border-gray-200 pt-3">
        <button
          onClick={handlePermanenceToggle}
          className={`
            w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium
            transition-colors
            ${toolState.permanence === 'pen'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-200 text-gray-700'
            }
          `}
          title="Toggle between pen (permanent) and pencil (temporary)"
        >
          {toolState.permanence === 'pen' ? (
            <>
              <PenTool size={18} />
              <span>Pen (Permanent)</span>
            </>
          ) : (
            <>
              <Edit3 size={18} />
              <span>Pencil (Temporary)</span>
            </>
          )}
        </button>
      </div>

      {/* Number input (when number tool is selected) */}
      {toolState.currentMarkType === 'number' && (
        <div className="mt-3 border-t border-gray-200 pt-3">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Number Value
          </label>
          <input
            type="number"
            value={toolState.numberValue || 0}
            onChange={e => setToolState(prev => ({
              ...prev,
              numberValue: parseInt(e.target.value) || 0,
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            min={0}
            max={999}
          />
        </div>
      )}

      {/* Color picker (when color tool is selected) */}
      {toolState.currentMarkType === 'color' && (
        <div className="mt-3 border-t border-gray-200 pt-3">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Color
          </label>
          <ColorPicker
            value={toolState.selectedColor || '#3b82f6'}
            onChange={color => setToolState(prev => ({
              ...prev,
              selectedColor: color,
            }))}
          />
        </div>
      )}

      {/* Symbol picker (when symbol tool is selected) */}
      {toolState.currentMarkType === 'symbol' && (
        <div className="mt-3 border-t border-gray-200 pt-3">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Symbol
          </label>
          <SymbolPicker
            value={toolState.selectedSymbol || 'star'}
            onChange={symbol => setToolState(prev => ({
              ...prev,
              selectedSymbol: symbol,
            }))}
          />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// COLOR PICKER
// ============================================================================

const DEFAULT_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#64748b', // gray
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {DEFAULT_COLORS.map(color => (
        <button
          key={color}
          onClick={() => onChange(color)}
          className={`
            w-10 h-10 rounded-md border-2 transition-all
            ${value === color ? 'border-gray-900 scale-110' : 'border-gray-300'}
          `}
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}
    </div>
  );
}

// ============================================================================
// SYMBOL PICKER
// ============================================================================

const DEFAULT_SYMBOLS = [
  { id: 'star', label: '★' },
  { id: 'diamond', label: '◆' },
  { id: 'heart', label: '❤' },
  { id: 'square', label: '■' },
  { id: 'circle', label: '●' },
  { id: 'triangle', label: '▲' },
  { id: 'water', label: '💧' },
  { id: 'plant', label: '🌱' },
];

interface SymbolPickerProps {
  value: string;
  onChange: (symbol: string) => void;
}

function SymbolPicker({ value, onChange }: SymbolPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {DEFAULT_SYMBOLS.map(symbol => (
        <button
          key={symbol.id}
          onClick={() => onChange(symbol.id)}
          className={`
            w-10 h-10 rounded-md border-2 text-2xl transition-all
            ${value === symbol.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-white hover:bg-gray-50'
            }
          `}
          title={symbol.id}
        >
          {symbol.label}
        </button>
      ))}
    </div>
  );
}
