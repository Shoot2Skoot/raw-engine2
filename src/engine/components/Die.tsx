/**
 * Die Component
 * Renders a single die with its current value
 */

import React from 'react';
import { Lock, Unlock } from 'lucide-react';
import type { DieInstance, FaceValue } from '../types';

interface DieProps {
  die: DieInstance;
  size?: number;
  onLockToggle?: (dieId: string) => void;
  onReroll?: (dieId: string) => void;
}

export const Die: React.FC<DieProps> = ({
  die,
  size = 60,
  onLockToggle,
  onReroll,
}) => {
  const renderValue = (value: FaceValue) => {
    if (typeof value === 'number') {
      return <div className="text-2xl font-bold">{value}</div>;
    }

    if (typeof value === 'string') {
      return <div className="text-sm font-medium">{value}</div>;
    }

    if (typeof value === 'object' && value !== null && 'symbol' in value) {
      return (
        <div className="text-sm font-medium" style={{ color: value.color }}>
          {value.symbol}
        </div>
      );
    }

    return <div className="text-sm">?</div>;
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Die face */}
      <div
        className={`
          flex items-center justify-center rounded-lg border-2 shadow-md transition-all
          ${die.isLocked ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300 bg-white'}
          ${die.isModified ? 'ring-2 ring-blue-500' : ''}
          ${!die.isLocked && onReroll ? 'hover:border-blue-400 cursor-pointer' : ''}
        `}
        style={{ width: size, height: size }}
        onClick={() => !die.isLocked && onReroll && onReroll(die.id)}
      >
        {die.currentValue !== null ? renderValue(die.currentValue) : (
          <div className="text-gray-400">-</div>
        )}
      </div>

      {/* Lock button */}
      {onLockToggle && (
        <button
          onClick={() => onLockToggle(die.id)}
          className={`
            p-1 rounded transition-colors
            ${die.isLocked ? 'text-yellow-600 hover:text-yellow-700' : 'text-gray-400 hover:text-gray-600'}
          `}
          aria-label={die.isLocked ? 'Unlock die' : 'Lock die'}
        >
          {die.isLocked ? <Lock size={16} /> : <Unlock size={16} />}
        </button>
      )}
    </div>
  );
};
