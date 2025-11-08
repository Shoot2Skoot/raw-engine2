/**
 * Tool palette - allows players to select marking tools
 */

import type { Tool } from '../types';
import * as Icons from 'lucide-react';

interface ToolPaletteProps {
  tools: Tool[];
  currentTool: Tool;
  onSelectTool: (tool: Tool) => void;
}

export function ToolPalette({ tools, currentTool, onSelectTool }: ToolPaletteProps) {
  return (
    <div className="bg-white border-r border-gray-200 p-4 flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Tools</h3>

      <div className="flex flex-col gap-1">
        {tools.map((tool) => {
          const isSelected = tool.type === currentTool.type;
          const IconComponent = (Icons as any)[tool.icon] || Icons.Circle;

          return (
            <button
              key={tool.type}
              onClick={() => onSelectTool(tool)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
                ${
                  isSelected
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                    : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                }
              `}
              title={tool.shortcut ? `Shortcut: ${tool.shortcut}` : undefined}
            >
              <IconComponent size={20} />
              <span className="text-sm font-medium">{tool.name}</span>
            </button>
          );
        })}
      </div>

      {/* Show tool settings if applicable */}
      {currentTool.settings && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-xs font-semibold text-gray-600 mb-2">Settings</h4>

          {currentTool.type === 'number' && (
            <div className="text-sm text-gray-700">
              Number: {currentTool.settings.number ?? 0}
            </div>
          )}

          {currentTool.type === 'color' && currentTool.settings.color && (
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded border border-gray-300"
                style={{ backgroundColor: currentTool.settings.color }}
              />
              <span className="text-xs text-gray-600">{currentTool.settings.color}</span>
            </div>
          )}

          {currentTool.type === 'symbol' && currentTool.settings.symbol && (
            <div className="text-sm text-gray-700">
              Symbol: {currentTool.settings.symbol}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
