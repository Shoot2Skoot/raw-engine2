/**
 * Tool Palette - UI for selecting marking tools
 */

import { useGame } from '../../context/GameContext';
import type { ToolConfig } from '../../types';
import {
  CheckSquare,
  Hash,
  Palette,
  Circle,
  Star,
  Type,
  Minus,
  Pencil,
  Pen,
} from 'lucide-react';

const TOOL_ICONS: Record<string, any> = {
  checkbox: CheckSquare,
  number: Hash,
  color: Palette,
  circle: Circle,
  symbol: Star,
  text: Type,
  line: Minus,
};

export function ToolPalette() {
  const { state, setActiveTool } = useGame();
  const tools = getToolsFromConfig();

  const handleToolClick = (tool: ToolConfig) => {
    setActiveTool({
      config: tool,
      permanence: state.activeTool.permanence,
    });
  };

  const togglePermanence = () => {
    setActiveTool({
      ...state.activeTool,
      permanence: state.activeTool.permanence === 'pen' ? 'pencil' : 'pen',
    });
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Tools</h3>

      <div className="space-y-2">
        {/* Tool buttons */}
        {tools.map((tool) => {
          const Icon = TOOL_ICONS[tool.type] || Hash;
          const isActive = state.activeTool.config.type === tool.type;

          return (
            <button
              key={tool.type}
              onClick={() => handleToolClick(tool)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-colors ${
                isActive
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{tool.label}</span>
            </button>
          );
        })}

        {/* Permanence toggle */}
        <div className="pt-3 border-t border-gray-200">
          <button
            onClick={togglePermanence}
            className="w-full flex items-center justify-between px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            <span className="text-sm font-medium">
              {state.activeTool.permanence === 'pen' ? 'Pen (Permanent)' : 'Pencil (Temporary)'}
            </span>
            {state.activeTool.permanence === 'pen' ? (
              <Pen size={20} />
            ) : (
              <Pencil size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper to get tools - in a real app, this would come from game config
function getToolsFromConfig(): ToolConfig[] {
  return [
    {
      type: 'checkbox',
      label: 'Checkbox',
      icon: 'checkbox',
      defaultPermanence: 'pen',
    },
    {
      type: 'number',
      label: 'Number',
      icon: 'number',
      defaultPermanence: 'pen',
    },
    {
      type: 'color',
      label: 'Color Fill',
      icon: 'color',
      defaultPermanence: 'pen',
    },
    {
      type: 'circle',
      label: 'Circle',
      icon: 'circle',
      defaultPermanence: 'pen',
    },
  ];
}
