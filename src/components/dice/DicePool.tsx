/**
 * Dice Pool Component - renders a pool of dice with controls
 */

import { Dices, RotateCcw } from 'lucide-react';
import type { DicePoolState } from '../../types';
import { Die } from './Die';

interface DicePoolProps {
  poolState: DicePoolState;
  onRoll?: () => void;
  onReroll?: () => void;
  onToggleLock?: (dieIndex: number) => void;
}

export function DicePool({
  poolState,
  onRoll,
  onReroll,
  onToggleLock,
}: DicePoolProps) {
  const { pool, results } = poolState;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">{pool.name}</h3>
        <div className="flex gap-2">
          <button
            onClick={onRoll}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
          >
            <Dices size={18} />
            Roll
          </button>
          {results.length > 0 && (
            <button
              onClick={onReroll}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded font-medium transition-colors"
            >
              <RotateCcw size={18} />
              Reroll
            </button>
          )}
        </div>
      </div>

      {/* Dice Results */}
      {results.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {results.map((result, index) => (
            <Die
              key={index}
              result={result}
              onToggleLock={
                onToggleLock ? () => onToggleLock(index) : undefined
              }
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {results.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Click "Roll" to roll {pool.dice.length} dice
        </div>
      )}
    </div>
  );
}
