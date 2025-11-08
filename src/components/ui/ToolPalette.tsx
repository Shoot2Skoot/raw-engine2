/**
 * Tool Palette - Select marking tools
 */

import React from 'react';
import { useGameEngine } from '../../core/GameEngine';
import type { Tool } from '../../types';
import { Square, Hash, Circle, Star, Type, Palette } from 'lucide-react';

const AVAILABLE_TOOLS: { tool: Tool; label: string; icon: React.ReactNode }[] = [
  {
    tool: { type: 'checkbox' },
    label: 'Checkbox',
    icon: <Square className="w-5 h-5" />,
  },
  {
    tool: { type: 'number' },
    label: 'Number',
    icon: <Hash className="w-5 h-5" />,
  },
  {
    tool: { type: 'circle' },
    label: 'Circle',
    icon: <Circle className="w-5 h-5" />,
  },
  {
    tool: { type: 'color', config: { color: '#3b82f6' } },
    label: 'Color',
    icon: <Palette className="w-5 h-5" />,
  },
  {
    tool: { type: 'symbol', config: { symbol: '⭐' } },
    label: 'Symbol',
    icon: <Star className="w-5 h-5" />,
  },
  {
    tool: { type: 'text' },
    label: 'Text',
    icon: <Type className="w-5 h-5" />,
  },
];

export function ToolPalette() {
  const { state, setCurrentTool } = useGameEngine();

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-2">
      <div className="text-xs font-semibold text-gray-600 mb-2 px-2">Tools</div>
      <div className="flex flex-col gap-1">
        {AVAILABLE_TOOLS.map(({ tool, label, icon }) => {
          const isActive = state.currentTool.type === tool.type;
          return (
            <button
              key={tool.type}
              onClick={() => setCurrentTool(tool)}
              className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
                isActive
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {icon}
              <span className="text-sm font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
