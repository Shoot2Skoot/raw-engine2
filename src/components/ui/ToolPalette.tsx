import type { MarkType } from '../../types';
import {
  CheckSquare,
  Hash,
  Palette,
  Circle,
  Star,
  Type,
  Minus,
  Undo,
  Redo,
} from 'lucide-react';

interface ToolPaletteProps {
  availableTools: MarkType[];
  selectedTool: MarkType | null;
  onSelectTool: (tool: MarkType) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export function ToolPalette({
  availableTools,
  selectedTool,
  onSelectTool,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: ToolPaletteProps) {
  const tools: { type: MarkType; icon: any; label: string }[] = [
    { type: 'checkbox', icon: CheckSquare, label: 'Checkbox' },
    { type: 'number', icon: Hash, label: 'Number' },
    { type: 'color', icon: Palette, label: 'Color' },
    { type: 'circle', icon: Circle, label: 'Circle' },
    { type: 'symbol', icon: Star, label: 'Symbol' },
    { type: 'text', icon: Type, label: 'Text' },
    { type: 'line', icon: Minus, label: 'Line' },
  ];

  const visibleTools = tools.filter((t) => availableTools.includes(t.type));

  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg p-3 shadow-md">
      <h3 className="font-bold text-sm mb-2 text-gray-700">Tools</h3>

      <div className="grid grid-cols-2 gap-2 mb-3">
        {visibleTools.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => onSelectTool(type)}
            className={`
              flex flex-col items-center gap-1 p-2 rounded transition-all
              ${
                selectedTool === type
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
            title={label}
          >
            <Icon size={20} />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>

      {(onUndo || onRedo) && (
        <>
          <div className="border-t border-gray-300 my-2" />

          <div className="grid grid-cols-2 gap-2">
            {onUndo && (
              <button
                onClick={onUndo}
                disabled={!canUndo}
                className={`
                  flex items-center justify-center gap-1 p-2 rounded text-sm
                  ${
                    canUndo
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  }
                `}
                title="Undo (Ctrl+Z)"
              >
                <Undo size={16} />
                Undo
              </button>
            )}

            {onRedo && (
              <button
                onClick={onRedo}
                disabled={!canRedo}
                className={`
                  flex items-center justify-center gap-1 p-2 rounded text-sm
                  ${
                    canRedo
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  }
                `}
                title="Redo (Ctrl+Shift+Z)"
              >
                <Redo size={16} />
                Redo
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
