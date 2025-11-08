/**
 * Dice Display Component
 * Shows current dice results with lock/unlock controls
 */

import React from 'react';
import { Lock, Unlock } from 'lucide-react';
import { DicePoolInstance, DieConfig } from '../../types';
import { getDieFaceContent } from '../../engine/dice/diceEngine';

interface DiceDisplayProps {
  pool: DicePoolInstance;
  configs: DieConfig[];
  onRoll: () => void;
  onLock: (dieId: string) => void;
  onUnlock: (dieId: string) => void;
}

export const DiceDisplay: React.FC<DiceDisplayProps> = ({
  pool,
  configs,
  onRoll,
  onLock,
  onUnlock,
}) => {
  const getDieValue = (dieId: string, configId: string) => {
    const die = pool.dice.find((d) => d.id === dieId);
    const config = configs.find((c) => c.id === configId);

    if (!die || !config) return '?';

    const content = getDieFaceContent(die, config);

    if (content.type === 'number') {
      return content.value;
    }
    return '?';
  };

  return (
    <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Dice</h3>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={onRoll}
        >
          Roll Dice
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {pool.dice.map((die) => {
          const config = configs.find((c) => c.id === die.configId);
          if (!config) return null;

          const value = getDieValue(die.id, die.configId);

          return (
            <div
              key={die.id}
              className={`relative w-16 h-16 border-2 rounded-lg flex items-center justify-center text-2xl font-bold ${
                die.isLocked
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-gray-400 bg-white'
              }`}
            >
              {value}

              {/* Lock/Unlock button */}
              <button
                className={`absolute -top-2 -right-2 p-1 rounded-full ${
                  die.isLocked
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-300 text-gray-700'
                }`}
                onClick={() =>
                  die.isLocked ? onUnlock(die.id) : onLock(die.id)
                }
                title={die.isLocked ? 'Unlock' : 'Lock'}
              >
                {die.isLocked ? <Lock size={12} /> : <Unlock size={12} />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
