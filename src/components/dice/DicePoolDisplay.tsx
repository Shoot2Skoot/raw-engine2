/**
 * Dice Pool Display - Shows and controls a dice pool
 */

import { useGameEngine, useDicePool } from '../../core/GameEngine';
import { Dices, Lock, Unlock } from 'lucide-react';
import type { Die } from '../../types';

interface DicePoolDisplayProps {
  poolId: string;
}

export function DicePoolDisplay({ poolId }: DicePoolDisplayProps) {
  const pool = useDicePool(poolId);
  const { rollDicePool, lockDie, unlockDie } = useGameEngine();

  if (!pool) return null;

  const handleRoll = () => {
    rollDicePool(poolId);
  };

  const handleToggleLock = (dieId: string, isLocked: boolean) => {
    if (isLocked) {
      unlockDie(poolId, dieId);
    } else {
      lockDie(poolId, dieId);
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">{pool.label}</h3>
        <button
          onClick={handleRoll}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          <Dices className="w-4 h-4" />
          Roll
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {pool.dice.map((die) => (
          <DieDisplay
            key={die.id}
            die={die}
            onToggleLock={() => handleToggleLock(die.id, die.isLocked || false)}
          />
        ))}
      </div>
    </div>
  );
}

interface DieDisplayProps {
  die: Die;
  onToggleLock: () => void;
}

function DieDisplay({ die, onToggleLock }: DieDisplayProps) {
  const value =
    die.type === 'standard'
      ? die.currentValue || '?'
      : die.currentFace?.value || '?';

  const isLocked = die.isLocked || false;

  return (
    <div
      className={`relative w-16 h-16 flex items-center justify-center border-2 rounded-lg font-bold text-xl transition-all ${
        isLocked
          ? 'border-yellow-500 bg-yellow-50'
          : 'border-gray-400 bg-white hover:border-blue-500'
      }`}
    >
      <div>{value}</div>
      <button
        onClick={onToggleLock}
        className="absolute -top-2 -right-2 p-1 bg-white border border-gray-300 rounded-full hover:bg-gray-100"
      >
        {isLocked ? (
          <Lock className="w-3 h-3 text-yellow-600" />
        ) : (
          <Unlock className="w-3 h-3 text-gray-400" />
        )}
      </button>
    </div>
  );
}
