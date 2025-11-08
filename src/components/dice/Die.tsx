/**
 * Die Component - renders a single die with its result
 */

import { Lock } from 'lucide-react';
import type { DieResult } from '../../types';

interface DieProps {
  result: DieResult;
  onToggleLock?: () => void;
  size?: number;
}

export function Die({ result, onToggleLock, size = 60 }: DieProps) {
  const { value, locked, modified } = result;
  const color = result.die.color || '#FFFFFF';

  return (
    <div
      className={`
        relative flex items-center justify-center rounded-lg shadow-lg
        transition-all duration-200 cursor-pointer
        ${locked ? 'ring-2 ring-blue-500' : 'hover:scale-105'}
        ${modified ? 'ring-2 ring-yellow-500' : ''}
      `}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        border: '2px solid #1F2937',
      }}
      onClick={onToggleLock}
    >
      <div className="text-2xl font-bold text-gray-900">{value}</div>

      {/* Lock indicator */}
      {locked && (
        <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-1">
          <Lock size={16} className="text-white" />
        </div>
      )}

      {/* Modified indicator */}
      {modified && !locked && (
        <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1">
          <span className="text-white text-xs font-bold">✓</span>
        </div>
      )}
    </div>
  );
}
