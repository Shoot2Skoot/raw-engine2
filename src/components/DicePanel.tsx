/**
 * DicePanel - displays and manages dice rolling
 */

import React from 'react';
import { Dices, Lock, Unlock } from 'lucide-react';
import type { DicePool, Die } from '../types';

interface DicePanelProps {
  pool: DicePool;
  onRoll: (dieIds?: string[]) => void;
  onToggleLock: (dieId: string) => void;
}

export const DicePanel: React.FC<DicePanelProps> = ({
  pool,
  onRoll,
  onToggleLock,
}) => {
  const renderDieValue = (die: Die) => {
    if (die.type === 'standard') {
      return die.currentValue || '?';
    } else {
      if (die.currentFaceIndex !== undefined) {
        const face = die.faces[die.currentFaceIndex];
        return face.value;
      }
      return '?';
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900">{pool.name}</h3>
        <button
          onClick={() => onRoll()}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          <Dices className="w-4 h-4" />
          Roll All
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {pool.dice.map((die) => (
          <div key={die.id} className="relative">
            <div
              className={`
                aspect-square border-2 rounded-lg flex items-center justify-center text-xl font-bold
                ${die.locked ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300 bg-white'}
              `}
            >
              {renderDieValue(die)}
            </div>
            <button
              onClick={() => onToggleLock(die.id)}
              className="absolute -top-1 -right-1 p-0.5 bg-white border border-gray-300 rounded-full hover:bg-gray-50"
              title={die.locked ? 'Unlock' : 'Lock'}
            >
              {die.locked ? (
                <Lock className="w-3 h-3 text-yellow-600" />
              ) : (
                <Unlock className="w-3 h-3 text-gray-600" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
