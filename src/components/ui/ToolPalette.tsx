/**
 * Tool Palette - shows available marking tools
 */

import * as Icons from 'lucide-react';
import type { ToolState } from '../../types';

interface ToolPaletteProps {
  toolState: ToolState;
  onSelectTool: (toolIndex: number) => void;
  onToggleMode?: () => void;
}

export function ToolPalette({
  toolState,
  onSelectTool,
  onToggleMode,
}: ToolPaletteProps) {
  const { currentTool, availableTools, markMode } = toolState;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Tools</h3>
        {onToggleMode && (
          <button
            onClick={onToggleMode}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              markMode === 'pen'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {markMode === 'pen' ? 'Pen' : 'Pencil'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {availableTools.map((tool, index) => {
          const Icon = (Icons as any)[tool.icon] || Icons.Circle;
          const isActive = currentTool.type === tool.type;

          return (
            <button
              key={tool.type}
              onClick={() => onSelectTool(index)}
              className={`
                flex flex-col items-center gap-1 p-3 rounded-lg transition-all
                ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
              title={tool.shortcut ? `Shortcut: ${tool.shortcut}` : undefined}
            >
              <Icon size={24} />
              <span className="text-xs font-medium">{tool.name}</span>
              {tool.shortcut && (
                <span className="text-xs opacity-70">{tool.shortcut}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
