/**
 * Dice Pool Component - Displays and manages a pool of dice
 */

import { useGame } from '../../context/GameContext';
import { Dices, Lock, Unlock, RefreshCw } from 'lucide-react';

interface DicePoolProps {
  poolId: string;
}

export function DicePool({ poolId }: DicePoolProps) {
  const { state, rollDicePool, lockDie, unlockDie } = useGame();
  const pool = state.dicePools.find((p) => p.id === poolId);

  if (!pool) return null;

  const handleRollAll = () => {
    rollDicePool(poolId);
  };

  const handleRerollUnlocked = () => {
    const unlockedIndices = pool.results
      .map((r, i) => (!r.locked ? i : -1))
      .filter((i) => i !== -1);
    rollDicePool(poolId, unlockedIndices);
  };

  const toggleLock = (index: number) => {
    if (pool.results[index]?.locked) {
      unlockDie(poolId, index);
    } else {
      lockDie(poolId, index);
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">{pool.label}</h3>
        <div className="flex gap-2">
          <button
            onClick={handleRerollUnlocked}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 flex items-center gap-1"
            disabled={pool.results.length === 0}
          >
            <RefreshCw size={14} />
            Reroll
          </button>
          <button
            onClick={handleRollAll}
            className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 flex items-center gap-1"
          >
            <Dices size={14} />
            Roll All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {pool.results.map((result, index) => (
          <DieDisplay
            key={index}
            result={result}
            locked={result.locked}
            onToggleLock={() => toggleLock(index)}
          />
        ))}
      </div>

      {pool.results.length === 0 && (
        <div className="text-center text-gray-400 text-sm py-4">
          Click "Roll All" to start
        </div>
      )}
    </div>
  );
}

interface DieDisplayProps {
  result: any;
  locked: boolean;
  onToggleLock: () => void;
}

function DieDisplay({ result, locked, onToggleLock }: DieDisplayProps) {
  const value = typeof result.result === 'number' ? result.result : result.result.display;

  return (
    <div className="relative">
      <button
        onClick={onToggleLock}
        className={`w-full aspect-square flex flex-col items-center justify-center rounded-lg border-2 text-2xl font-bold transition-all ${
          locked
            ? 'bg-blue-100 border-blue-500 text-blue-700'
            : 'bg-white border-gray-300 text-gray-900 hover:border-blue-400'
        }`}
      >
        <span>{value}</span>
        {result.modified && (
          <span className="text-xs text-orange-600 font-normal">modified</span>
        )}
      </button>
      <div className="absolute -top-1 -right-1">
        {locked ? (
          <Lock size={16} className="text-blue-600" />
        ) : (
          <Unlock size={16} className="text-gray-400" />
        )}
      </div>
    </div>
  );
}
