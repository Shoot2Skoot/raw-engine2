/**
 * Dice pool component - displays and manages a pool of dice
 */

import type { DicePool as DicePoolType } from '../../types';
import { useGame } from '../../state/GameContext';
import { Dices, Lock, Unlock } from 'lucide-react';

interface DicePoolProps {
  pool: DicePoolType;
}

export function DicePool({ pool }: DicePoolProps) {
  const { dispatch } = useGame();

  const handleRoll = () => {
    dispatch({ type: 'ROLL_DICE', poolId: pool.id });
  };

  const handleRollDie = (dieId: string) => {
    dispatch({ type: 'ROLL_DICE', poolId: pool.id, diceIds: [dieId] });
  };

  const handleToggleLock = (dieId: string, isLocked: boolean) => {
    if (isLocked) {
      dispatch({ type: 'UNLOCK_DIE', poolId: pool.id, dieId });
    } else {
      dispatch({ type: 'LOCK_DIE', poolId: pool.id, dieId });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">{pool.name}</h3>
        <button
          onClick={handleRoll}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <Dices size={18} />
          <span className="text-sm font-medium">Roll All</span>
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {pool.dice.map(die => {
          const isStandard = 'type' in die;
          const value = die.currentValue;
          const displayValue = isStandard
            ? String(value ?? '?')
            : typeof value === 'object' && value
            ? String(value.display)
            : '?';

          return (
            <div
              key={die.id}
              className={`relative aspect-square rounded-lg border-2 flex flex-col items-center justify-center p-2 transition-all ${
                die.locked
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              {/* Die value */}
              <button
                onClick={() => handleRollDie(die.id)}
                disabled={die.locked}
                className="text-2xl font-bold text-gray-900 disabled:opacity-50"
              >
                {displayValue}
              </button>

              {/* Lock toggle */}
              <button
                onClick={() => handleToggleLock(die.id, die.locked ?? false)}
                className="absolute top-1 right-1 p-1 rounded bg-white shadow-sm hover:bg-gray-100 transition-colors"
                title={die.locked ? 'Unlock' : 'Lock'}
              >
                {die.locked ? <Lock size={12} /> : <Unlock size={12} />}
              </button>

              {/* Modified indicator */}
              {die.modified && (
                <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-blue-500" title="Modified" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
