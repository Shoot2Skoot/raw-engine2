/**
 * Tool palette component - allows players to select marking tools
 */

import type { MarkType } from '../../types';
import {
  CheckSquare,
  Hash,
  Palette,
  Circle,
  Star,
  Type,
  Minus,
  Edit3,
  Edit,
} from 'lucide-react';
import { useGame } from '../../state/GameContext';

const toolIcons: Record<MarkType, React.ComponentType<{ size?: number }>> = {
  checkbox: CheckSquare,
  number: Hash,
  color: Palette,
  circle: Circle,
  symbol: Star,
  text: Type,
  line: Minus,
};

const toolLabels: Record<MarkType, string> = {
  checkbox: 'Checkbox',
  number: 'Number',
  color: 'Color',
  circle: 'Circle',
  symbol: 'Symbol',
  text: 'Text',
  line: 'Line',
};

const toolShortcuts: Record<MarkType, string> = {
  checkbox: '1',
  number: '2',
  color: '3',
  circle: '4',
  symbol: '5',
  text: '6',
  line: '7',
};

interface ToolPaletteProps {
  availableTools?: MarkType[];
  colorPalette?: string[];
  symbolSet?: string[];
}

export function ToolPalette({
  availableTools = ['checkbox', 'number', 'color', 'circle', 'symbol', 'text', 'line'],
  colorPalette = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#ec4899'],
  symbolSet = ['star', 'heart', 'square', 'circle', 'triangle', 'diamond'],
}: ToolPaletteProps) {
  const { state, dispatch } = useGame();

  const handleToolSelect = (tool: MarkType) => {
    dispatch({ type: 'SELECT_TOOL', tool });
  };

  const handleColorSelect = (color: string) => {
    dispatch({ type: 'SELECT_COLOR', color });
  };

  const handleSymbolSelect = (symbol: string) => {
    dispatch({ type: 'SELECT_SYMBOL', symbol });
  };

  const handlePermanenceToggle = () => {
    dispatch({
      type: 'SET_PERMANENCE',
      permanence: state.permanence === 'pen' ? 'pencil' : 'pen',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
      <h3 className="text-lg font-bold text-gray-900">Tools</h3>

      {/* Tool buttons */}
      <div className="grid grid-cols-2 gap-2">
        {availableTools.map(tool => {
          const Icon = toolIcons[tool];
          const isSelected = state.selectedTool === tool;

          return (
            <button
              key={tool}
              onClick={() => handleToolSelect(tool)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-colors ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
              title={`${toolLabels[tool]} (${toolShortcuts[tool]})`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{toolLabels[tool]}</span>
              <span className="ml-auto text-xs text-gray-500">{toolShortcuts[tool]}</span>
            </button>
          );
        })}
      </div>

      {/* Color palette */}
      {state.selectedTool === 'color' && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Select Color</h4>
          <div className="grid grid-cols-6 gap-2">
            {colorPalette.map(color => (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                className={`w-10 h-10 rounded-lg border-2 transition-all ${
                  state.selectedColor === color ? 'border-gray-900 scale-110' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Symbol set */}
      {state.selectedTool === 'symbol' && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Select Symbol</h4>
          <div className="grid grid-cols-6 gap-2">
            {symbolSet.map(symbol => (
              <button
                key={symbol}
                onClick={() => handleSymbolSelect(symbol)}
                className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all ${
                  state.selectedSymbol === symbol
                    ? 'border-blue-500 bg-blue-50 scale-110'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
                title={symbol}
              >
                <span className="text-lg">{symbol}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Permanence toggle */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={handlePermanenceToggle}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-colors ${
            state.permanence === 'pen'
              ? 'border-gray-900 bg-gray-900 text-white'
              : 'border-gray-400 bg-gray-100 text-gray-700'
          }`}
          title="Toggle Pencil/Pen (P)"
        >
          {state.permanence === 'pen' ? <Edit size={20} /> : <Edit3 size={20} />}
          <span className="text-sm font-medium">
            {state.permanence === 'pen' ? 'Pen (Permanent)' : 'Pencil (Temporary)'}
          </span>
          <span className="ml-auto text-xs opacity-70">P</span>
        </button>
      </div>
    </div>
  );
}
