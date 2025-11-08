/**
 * Dice Pool Component
 * Renders a collection of dice with roll functionality
 */

import React from 'react';
import { Dices, RotateCcw } from 'lucide-react';
import type { DicePool as DicePoolType } from '../types';
import { Die } from './Die';

interface DicePoolProps {
  pool: DicePoolType;
  onRoll: (poolId: string) => void;
  onLockToggle: (dieId: string) => void;
  onRerollDie: (dieId: string) => void;
}

export const DicePool: React.FC<DicePoolProps> = ({
  pool,
  onRoll,
  onLockToggle,
  onRerollDie,
}) => {
  const canReroll = pool.maxRerolls === undefined || (pool.currentRerolls || 0) < pool.maxRerolls;
  const rerollsLeft = pool.maxRerolls !== undefined
    ? pool.maxRerolls - (pool.currentRerolls || 0)
    : undefined;

  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4">
      {/* Pool header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{pool.name}</h3>
        {rerollsLeft !== undefined && (
          <span className="text-sm text-gray-500">
            {rerollsLeft} reroll{rerollsLeft !== 1 ? 's' : ''} left
          </span>
        )}
      </div>

      {/* Dice */}
      <div className="flex flex-wrap gap-3 mb-4">
        {pool.dice.map((die) => (
          <Die
            key={die.id}
            die={die}
            onLockToggle={onLockToggle}
            onReroll={onRerollDie}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onRoll(pool.id)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          disabled={!canReroll}
        >
          <Dices size={20} />
          <span className="font-medium">Roll All</span>
        </button>

        <button
          onClick={() => {
            // Reset all locks
            pool.dice.forEach((die) => {
              if (die.isLocked) {
                onLockToggle(die.id);
              }
            });
          }}
          className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          aria-label="Unlock all dice"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {/* Sum for numeric dice */}
      {pool.dice.length > 0 && pool.dice.every(d => typeof d.currentValue === 'number') && (
        <div className="mt-3 pt-3 border-t border-gray-200 text-center">
          <span className="text-sm text-gray-500">Total: </span>
          <span className="text-lg font-bold text-gray-700">
            {pool.dice.reduce((sum, d) => sum + (Number(d.currentValue) || 0), 0)}
          </span>
        </div>
      )}
    </div>
  );
};
