
import {
  Square,
  Hash,
  Palette,
  Circle,
  Type,
  CheckSquare,
} from 'lucide-react';
import type { ToolConfig } from '../../types';

interface ToolPaletteProps {
  tools: ToolConfig[];
  currentTool: string;
  onToolSelect: (toolType: string) => void;
}

const TOOL_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  checkbox: CheckSquare,
  number: Hash,
  color: Palette,
  circle: Circle,
  text: Type,
  fill: Square,
};

export function ToolPalette({ tools, currentTool, onToolSelect }: ToolPaletteProps) {
  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg p-2 shadow-lg">
      <h3 className="text-sm font-semibold text-gray-700 mb-2 px-1">Tools</h3>
      <div className="flex flex-col gap-1">
        {tools.map(tool => {
          const Icon = TOOL_ICONS[tool.type] || Hash;
          const isSelected = currentTool === tool.type;

          return (
            <button
              key={tool.type}
              onClick={() => onToolSelect(tool.type)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded
                transition-all duration-150
                ${
                  isSelected
                    ? 'bg-blue-500 text-white shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
              title={tool.label}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{tool.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
