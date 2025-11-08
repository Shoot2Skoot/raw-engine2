/**
 * Dice roller component
 */

import { Dices, Lock, Unlock } from 'lucide-react';
import type { DicePoolConfig } from '../../types';
import { useGame } from '../../store/GameContext';
import { rollDice, rerollDice, lockDie, unlockDie } from '../../utils/dice';

interface DiceRollerProps {
  poolConfig: DicePoolConfig;
}

export function DiceRoller({ poolConfig }: DiceRollerProps) {
  const { state, dispatch } = useGame();
  const poolState = state.dicePools[poolConfig.id];

  const handleRoll = () => {
    const results = poolState?.results.length > 0
      ? rerollDice(poolConfig.dice, poolState.results)
      : rollDice(poolConfig.dice);

    dispatch({
      type: 'ROLL_DICE',
      payload: {
        poolId: poolConfig.id,
        results: {
          poolId: poolConfig.id,
          results,
          rollCount: (poolState?.rollCount || 0) + 1,
        },
      },
    });
  };

  const handleToggleLock = (dieId: string) => {
    if (!poolState) return;

    const result = poolState.results.find((r) => r.dieId === dieId);
    if (!result) return;

    const newResults = result.locked
      ? unlockDie(poolState.results, dieId)
      : lockDie(poolState.results, dieId);

    dispatch({
      type: 'ROLL_DICE',
      payload: {
        poolId: poolConfig.id,
        results: {
          ...poolState,
          results: newResults,
        },
      },
    });
  };

  const results = poolState?.results || [];

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">{poolConfig.name}</h3>
        <button
          onClick={handleRoll}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Dices size={20} />
          <span>Roll</span>
        </button>
      </div>

      {/* Dice results */}
      {results.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {results.map((result, index) => (
            <div
              key={`${result.dieId}-${index}`}
              className="relative"
            >
              <div
                className={`
                  aspect-square rounded-lg border-4 flex items-center justify-center text-2xl font-bold
                  transition-all cursor-pointer
                  ${
                    result.locked
                      ? 'bg-gray-200 border-gray-400'
                      : 'bg-white border-blue-400 hover:border-blue-600'
                  }
                `}
                onClick={() => handleToggleLock(result.dieId)}
              >
                <span>
                  {typeof result.value === 'object' && result.value !== null
                    ? JSON.stringify(result.value)
                    : String(result.value)}
                </span>
              </div>
              <button
                onClick={() => handleToggleLock(result.dieId)}
                className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                title={result.locked ? 'Unlock' : 'Lock'}
              >
                {result.locked ? (
                  <Lock size={16} className="text-gray-600" />
                ) : (
                  <Unlock size={16} className="text-blue-600" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Roll count */}
      {poolState && (
        <div className="text-sm text-gray-500 text-center">
          Rolls: {poolState.rollCount}
        </div>
      )}
    </div>
  );
}
