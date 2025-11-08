import {
  CheckSquare,
  Hash,
  Palette,
  Circle,
  Type,
  Eraser,
  Pencil,
  Pen,
} from 'lucide-react';
import type { MarkType, MarkStyle } from '../../types';

interface ToolPaletteProps {
  selectedTool: MarkType | 'erase';
  markStyle: MarkStyle;
  onToolSelect: (tool: MarkType | 'erase') => void;
  onMarkStyleToggle: () => void;
  availableTools?: (MarkType | 'erase')[];
}

const TOOL_ICONS: Record<MarkType | 'erase', React.ComponentType<{ size?: number }>> = {
  checkbox: CheckSquare,
  number: Hash,
  color: Palette,
  circle: Circle,
  text: Type,
  symbol: Circle,
  line: Circle,
  erase: Eraser,
};

const TOOL_LABELS: Record<MarkType | 'erase', string> = {
  checkbox: 'Checkbox',
  number: 'Number',
  color: 'Color',
  circle: 'Circle',
  text: 'Text',
  symbol: 'Symbol',
  line: 'Line',
  erase: 'Erase',
};

export function ToolPalette({
  selectedTool,
  markStyle,
  onToolSelect,
  onMarkStyleToggle,
  availableTools = ['checkbox', 'number', 'color', 'circle', 'text', 'erase'],
}: ToolPaletteProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
      <h3 className="font-bold text-lg">Tools</h3>

      <div className="grid grid-cols-2 gap-2">
        {availableTools.map((tool) => {
          const Icon = TOOL_ICONS[tool];
          const isSelected = selectedTool === tool;

          return (
            <button
              key={tool}
              onClick={() => onToolSelect(tool)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
                isSelected
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              aria-label={TOOL_LABELS[tool]}
              title={TOOL_LABELS[tool]}
            >
              <Icon size={24} />
              <span className="text-xs mt-1">{TOOL_LABELS[tool]}</span>
            </button>
          );
        })}
      </div>

      {selectedTool !== 'erase' && (
        <div className="border-t pt-4">
          <button
            onClick={onMarkStyleToggle}
            className="flex items-center justify-between w-full p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all"
          >
            <span className="font-medium">Style</span>
            <div className="flex items-center gap-2">
              {markStyle === 'pencil' ? (
                <>
                  <Pencil size={20} />
                  <span>Pencil</span>
                </>
              ) : (
                <>
                  <Pen size={20} />
                  <span>Pen</span>
                </>
              )}
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
