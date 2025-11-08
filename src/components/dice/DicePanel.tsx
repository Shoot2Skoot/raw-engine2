/**
 * Dice panel for rolling and displaying dice
 */

import { Dices, Lock, RotateCw } from 'lucide-react';
import type { DicePool, DieResult } from '../../types';
import { rollDice, rerollDice, formatDieResult } from '../../engine/dice';
import { useGame } from '../../engine/GameContext';

interface DicePanelProps {
  pool: DicePool;
}

export function DicePanel({ pool }: DicePanelProps) {
  const { dispatch } = useGame();

  const handleRoll = () => {
    const results = rollDice(pool.dice);
    dispatch({
      type: 'ROLL_DICE',
      payload: { poolId: pool.id, results },
    });
  };

  const handleReroll = (indices?: number[]) => {
    const results = rerollDice(pool.dice, pool.results, indices);
    dispatch({
      type: 'ROLL_DICE',
      payload: { poolId: pool.id, results },
    });
  };

  const handleToggleLock = (index: number) => {
    dispatch({
      type: 'LOCK_DIE',
      payload: {
        poolId: pool.id,
        dieIndex: index,
        locked: !pool.results[index]?.locked,
      },
    });
  };

  const hasResults = pool.results.length > 0;

  return (
    <div className="dice-panel bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">{pool.name}</h3>
        <div className="flex gap-2">
          {hasResults && (
            <button
              onClick={() => handleReroll()}
              className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700 transition-colors"
              title="Reroll unlocked dice"
            >
              <RotateCw size={14} />
              Reroll
            </button>
          )}
          <button
            onClick={handleRoll}
            className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-xs font-medium text-white transition-colors"
          >
            <Dices size={14} />
            Roll
          </button>
        </div>
      </div>

      {/* Dice results */}
      {hasResults ? (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {pool.results.map((result, index) => (
            <DieDisplay
              key={`${result.dieId}-${index}`}
              result={result}
              onToggleLock={() => handleToggleLock(index)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400 text-sm">
          No dice rolled yet
        </div>
      )}

      {/* Dice configuration info */}
      <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600">
        {pool.dice.map((die, i) => (
          <div key={i}>
            {die.quantity}× {die.type === 'custom' ? die.customDie?.name : die.type}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// DIE DISPLAY
// ============================================================================

interface DieDisplayProps {
  result: DieResult;
  onToggleLock: () => void;
}

function DieDisplay({ result, onToggleLock }: DieDisplayProps) {
  const isLocked = result.locked || false;

  // Get die face value for display
  const displayValue = formatDieResult(result);

  return (
    <div
      className={`
        relative aspect-square rounded-lg border-2 flex items-center justify-center
        font-bold text-lg transition-all cursor-pointer select-none
        ${isLocked
          ? 'border-yellow-500 bg-yellow-50 text-yellow-900'
          : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400'
        }
      `}
      onClick={onToggleLock}
      title={isLocked ? 'Click to unlock' : 'Click to lock'}
    >
      {/* Die value */}
      <div className="text-center">
        {typeof result.face === 'number' ? (
          <DieD6Face value={result.face} />
        ) : (
          <div className="text-sm">{displayValue}</div>
        )}
      </div>

      {/* Lock indicator */}
      {isLocked && (
        <div className="absolute top-1 right-1">
          <Lock size={12} className="text-yellow-600" />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// DIE FACE (D6 visualization)
// ============================================================================

interface DieD6FaceProps {
  value: number;
}

function DieD6Face({ value }: DieD6FaceProps) {
  // Simple number display
  // In a full implementation, you could render actual die pips
  return <span className="text-2xl">{value}</span>;
}

// Note: DieD6Pips function removed - can be re-implemented if needed for visual die pips
