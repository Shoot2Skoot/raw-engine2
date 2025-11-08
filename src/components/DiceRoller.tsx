/**
 * Dice Roller Component
 *
 * Displays and rolls dice pools
 */

import { Dices, Lock, LockOpen, RotateCcw } from 'lucide-react';
import type { DicePool, DieResult } from '../types';
import { useGameState } from '../hooks/useGameState';
import { rollDie, rerollDie, formatDieValue, isStandardDie } from '../utils/dice';
import { generateDieResultId } from '../utils/helpers';

interface DiceRollerProps {
  pool: DicePool;
}

export function DiceRoller({ pool }: DiceRollerProps) {
  const { rollDicePool, lockDie } = useGameState();

  const handleRollAll = () => {
    const results = pool.dice.map((die, index) => {
      const existingResult = pool.results[index];

      // Don't reroll locked dice
      if (existingResult?.isLocked) {
        return existingResult;
      }

      return rollDie(die, generateDieResultId(pool.id, index));
    });

    rollDicePool(pool.id, results);
  };

  const handleRerollDie = (index: number) => {
    const result = pool.results[index];
    if (!result || result.isLocked) return;

    const newResult = rerollDie(result);
    const newResults = [...pool.results];
    newResults[index] = newResult;

    rollDicePool(pool.id, newResults);
  };

  const hasResults = pool.results.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          {pool.name}
        </h3>
        <button
          onClick={handleRollAll}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
        >
          <Dices size={16} />
          Roll All
        </button>
      </div>

      {/* Dice display */}
      {hasResults ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {pool.results.map((result, index) => (
            <DieDisplay
              key={result.id}
              result={result}
              onLock={() => lockDie(pool.id, result.id)}
              onReroll={() => handleRerollDie(index)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <Dices size={48} className="mx-auto mb-2" />
          <p className="text-sm">Click "Roll All" to roll the dice</p>
        </div>
      )}

      {/* Roll history (last 3 rolls) */}
      {pool.history.length > 0 && (
        <div className="pt-3 border-t border-gray-200">
          <h4 className="text-xs font-semibold text-gray-600 mb-2">Recent Rolls</h4>
          <div className="space-y-1">
            {pool.history.slice(-3).reverse().map((roll, index) => (
              <div key={index} className="text-xs text-gray-500 flex items-center gap-2">
                <span className="text-gray-400">•</span>
                {roll.results.map(r => formatDieValue(r.value)).join(', ')}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// DIE DISPLAY
// ============================================================================

function DieDisplay({
  result,
  onLock,
  onReroll,
}: {
  result: DieResult;
  onLock: () => void;
  onReroll: () => void;
}) {
  const value = formatDieValue(result.value);
  const dieName = isStandardDie(result.die) ? result.die : result.die.name;

  return (
    <div
      className={`
        relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3
        border-2 transition-all
        ${result.isLocked ? 'border-yellow-400 shadow-md' : 'border-gray-200'}
        ${result.wasModified ? 'ring-2 ring-purple-400' : ''}
      `}
    >
      {/* Die type label */}
      <div className="text-xs text-gray-500 mb-1">{dieName}</div>

      {/* Die value */}
      <div className="text-3xl font-bold text-gray-800 text-center mb-2">
        {value}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-1">
        <button
          onClick={onReroll}
          disabled={result.isLocked}
          className={`
            flex items-center justify-center p-1.5 rounded transition-colors
            ${
              result.isLocked
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-200'
            }
          `}
          title="Reroll"
        >
          <RotateCcw size={14} />
        </button>

        <button
          onClick={onLock}
          className={`
            flex items-center justify-center p-1.5 rounded transition-colors
            ${
              result.isLocked
                ? 'text-yellow-600 hover:bg-yellow-50'
                : 'text-gray-600 hover:bg-gray-200'
            }
          `}
          title={result.isLocked ? 'Unlock' : 'Lock'}
        >
          {result.isLocked ? <Lock size={14} /> : <LockOpen size={14} />}
        </button>
      </div>

      {/* Modified indicator */}
      {result.wasModified && (
        <div className="absolute top-1 right-1 w-2 h-2 bg-purple-400 rounded-full" title="Modified" />
      )}
    </div>
  );
}
