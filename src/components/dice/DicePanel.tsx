import React from 'react';
import { Dices, Lock, Unlock } from 'lucide-react';
import { DicePool, DieResult, StandardDieType } from '../../types';

interface DicePanelProps {
  pool: DicePool;
  onRoll: () => void;
  onLockDie: (index: number) => void;
  onUnlockDie: (index: number) => void;
}

/**
 * Displays a dice pool with roll and lock controls
 */
export function DicePanel({ pool, onRoll, onLockDie, onUnlockDie }: DicePanelProps) {
  if (!pool.visible) return null;

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Dices size={20} />
          {pool.name}
        </h3>

        <button
          onClick={onRoll}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-medium"
        >
          Roll
        </button>
      </div>

      {/* Dice results */}
      {pool.results && pool.results.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
          {pool.results.map((result, index) => (
            <DieDisplay
              key={index}
              result={result}
              onToggleLock={() =>
                result.locked ? onUnlockDie(index) : onLockDie(index)
              }
            />
          ))}
        </div>
      )}

      {/* Show dice count if not rolled yet */}
      {(!pool.results || pool.results.length === 0) && (
        <div className="text-center text-gray-500 py-4">
          {pool.dice.length} dice - Click Roll to start
        </div>
      )}
    </div>
  );
}

/**
 * Displays a single die result
 */
function DieDisplay({
  result,
  onToggleLock,
}: {
  result: DieResult;
  onToggleLock: () => void;
}) {
  const value = typeof result.face === 'number' ? result.face : result.face.value;

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`
          relative w-12 h-12 rounded border-2 flex items-center justify-center font-bold text-xl
          transition-all cursor-pointer
          ${result.locked
            ? 'bg-gray-200 border-gray-400'
            : 'bg-white border-blue-500 hover:bg-blue-50'
          }
          ${result.modified ? 'ring-2 ring-yellow-400' : ''}
        `}
        onClick={onToggleLock}
      >
        {value}

        {/* Lock indicator */}
        <div className="absolute -top-1 -right-1">
          {result.locked ? (
            <Lock size={14} className="text-gray-600" />
          ) : (
            <Unlock size={14} className="text-gray-400" />
          )}
        </div>
      </div>
    </div>
  );
}
