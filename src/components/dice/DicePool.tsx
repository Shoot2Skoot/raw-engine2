/**
 * Dice Pool Component
 * Displays and manages a pool of dice
 */

import { DicePool as DicePoolType, DieResult, DieConfig } from '../../types';
import { Dices, Lock } from 'lucide-react';

interface DicePoolProps {
  pool: DicePoolType;
  onRoll: () => void;
  onLockDie: (dieId: string) => void;
  onUnlockDie: (dieId: string) => void;
}

export function DicePool({ pool, onRoll, onLockDie, onUnlockDie }: DicePoolProps) {
  const getDieResult = (dieId: string): DieResult | undefined => {
    return pool.results.find((r) => r.dieId === dieId);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">{pool.label}</h3>
        <button
          onClick={onRoll}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors touch-manipulation no-tap-highlight"
        >
          <Dices size={18} />
          <span className="font-medium">Roll</span>
        </button>
      </div>
      <div className="flex flex-wrap gap-3">
        {pool.dice.map((die) => {
          const result = getDieResult(die.id);
          return (
            <Die
              key={die.id}
              die={die}
              result={result}
              onLock={() => onLockDie(die.id)}
              onUnlock={() => onUnlockDie(die.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

interface DieProps {
  die: DieConfig;
  result?: DieResult;
  onLock: () => void;
  onUnlock: () => void;
}

function Die({ die, result, onLock, onUnlock }: DieProps) {
  const displayValue = result
    ? typeof result.value === 'number'
      ? result.value.toString()
      : result.value
    : '?';

  const isLocked = result?.isLocked || false;
  const dieColor = die.color || '#3b82f6';

  return (
    <div className="relative">
      <button
        onClick={isLocked ? onUnlock : onLock}
        disabled={!result}
        className={`
          w-16 h-16 rounded-lg border-2 font-bold text-xl transition-all
          touch-manipulation no-tap-highlight
          ${
            isLocked
              ? 'bg-gray-300 border-gray-500 cursor-pointer'
              : 'bg-white border-gray-300 hover:border-blue-400'
          }
          ${!result ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        style={
          !isLocked && result
            ? { backgroundColor: `${dieColor}20`, borderColor: dieColor, color: dieColor }
            : {}
        }
        title={isLocked ? 'Click to unlock' : 'Click to lock'}
      >
        {displayValue}
      </button>
      {isLocked && (
        <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
          <Lock size={12} className="text-white" />
        </div>
      )}
    </div>
  );
}
