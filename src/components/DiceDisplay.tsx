/**
 * Dice display component - shows dice pools, results, and controls
 */


import { Dices, Lock, Unlock, RotateCcw } from 'lucide-react';
import type { DicePool, Die } from '../types';
import { formatDieFace } from '../utils/dice';

interface DiceDisplayProps {
  pools: DicePool[];
  onRollPool: (poolId: string) => void;
  onLockDie: (poolId: string, dieId: string) => void;
  onUnlockDie: (poolId: string, dieId: string) => void;
}

export function DiceDisplay({ pools, onRollPool, onLockDie, onUnlockDie }: DiceDisplayProps) {
  if (pools.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide flex items-center gap-2">
        <Dices className="w-5 h-5" />
        Dice
      </h3>

      {pools.map(pool => (
        <DicePoolDisplay
          key={pool.id}
          pool={pool}
          onRoll={() => onRollPool(pool.id)}
          onLockDie={(dieId) => onLockDie(pool.id, dieId)}
          onUnlockDie={(dieId) => onUnlockDie(pool.id, dieId)}
        />
      ))}
    </div>
  );
}

interface DicePoolDisplayProps {
  pool: DicePool;
  onRoll: () => void;
  onLockDie: (dieId: string) => void;
  onUnlockDie: (dieId: string) => void;
}

function DicePoolDisplay({ pool, onRoll, onLockDie, onUnlockDie }: DicePoolDisplayProps) {
  if (!pool.visible) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-800">{pool.name}</h4>
        <button
          onClick={onRoll}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          Roll
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {pool.dice.map(die => (
          <DieDisplay
            key={die.id}
            die={die}
            onLock={() => onLockDie(die.id)}
            onUnlock={() => onUnlockDie(die.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface DieDisplayProps {
  die: Die;
  onLock: () => void;
  onUnlock: () => void;
}

function DieDisplay({ die, onLock, onUnlock }: DieDisplayProps) {
  const value = die.currentFace !== undefined
    ? formatDieFace(die.currentFace)
    : '?';

  const isLocked = die.locked ?? false;

  return (
    <div
      className={`
        relative flex flex-col items-center justify-center
        h-16 rounded-lg border-2 transition-all
        ${isLocked
          ? 'border-yellow-500 bg-yellow-50'
          : 'border-gray-300 bg-white hover:border-gray-400'
        }
      `}
    >
      <div className="text-2xl font-bold text-gray-800">{value}</div>

      {/* Lock/Unlock button */}
      <button
        onClick={isLocked ? onUnlock : onLock}
        className="absolute top-1 right-1 p-0.5 rounded hover:bg-gray-100"
      >
        {isLocked ? (
          <Lock className="w-3 h-3 text-yellow-600" />
        ) : (
          <Unlock className="w-3 h-3 text-gray-400" />
        )}
      </button>

      {/* Die type label */}
      <div className="text-xs text-gray-500 mt-0.5">
        {die.config.type === 'standard' ? die.config.sides : 'custom'}
      </div>
    </div>
  );
}
