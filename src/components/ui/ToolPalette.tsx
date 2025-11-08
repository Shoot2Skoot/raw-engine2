/**
 * Tool Palette Component
 * Displays available tools for marking the sheet
 */

import { Tool } from '../../types';
import {
  CheckSquare,
  Hash,
  Palette,
  Circle,
  Star,
  Type,
  Minus,
  LucideIcon,
} from 'lucide-react';

interface ToolPaletteProps {
  tools: Tool[];
  currentTool: Tool | null;
  onSelectTool: (tool: Tool) => void;
}

const iconMap: Record<string, LucideIcon> = {
  CheckSquare,
  Hash,
  Palette,
  Circle,
  Star,
  Type,
  Minus,
};

export function ToolPalette({ tools, currentTool, onSelectTool }: ToolPaletteProps) {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Tools</h3>
        <div className="flex flex-wrap gap-2">
          {tools.map((tool) => {
            const Icon = iconMap[tool.icon] || Hash;
            const isActive = currentTool?.type === tool.type;

            return (
              <button
                key={tool.type}
                onClick={() => onSelectTool(tool)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all
                  touch-manipulation no-tap-highlight
                  ${
                    isActive
                      ? 'bg-blue-500 text-white border-blue-600 shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }
                `}
                title={tool.label}
              >
                <Icon size={20} />
                <span className="font-medium text-sm">{tool.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
