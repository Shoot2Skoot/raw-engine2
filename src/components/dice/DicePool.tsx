/**
 * Dice pool component - Display and interact with dice
 */

import React from 'react';
import type { DicePool as DicePoolType, DieDefinition, DieResult } from '../../types';
import { getDieValue } from '../../lib/dice';
import { Dices, Lock, Unlock, RotateCw } from 'lucide-react';

interface DicePoolProps {
  pool: DicePoolType;
  definitions: Map<string, DieDefinition>;
  onRoll: () => void;
  onToggleLock: (dieId: string) => void;
  onReroll: () => void;
}

export const DicePoolComponent: React.FC<DicePoolProps> = ({
  pool,
  definitions,
  onRoll,
  onToggleLock,
  onReroll,
}) => {
  if (pool.dice.length === 0) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">{pool.name}</h3>
        </div>
        <button
          onClick={onRoll}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Dices size={20} />
          <span>Roll Dice</span>
        </button>
      </div>
    );
  }

  const unlockedCount = pool.dice.filter((d) => !d.locked).length;

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">{pool.name}</h3>
        <button
          onClick={onReroll}
          disabled={unlockedCount === 0}
          className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Reroll unlocked dice"
        >
          <RotateCw size={16} />
          <span>Reroll ({unlockedCount})</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {pool.dice.map((die) => {
          const definition = definitions.get(die.dieDefinitionId);
          if (!definition) return null;

          return (
            <Die
              key={die.id}
              die={die}
              definition={definition}
              onToggleLock={() => onToggleLock(die.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

interface DieProps {
  die: DieResult;
  definition: DieDefinition;
  onToggleLock: () => void;
}

const Die: React.FC<DieProps> = ({ die, definition, onToggleLock }) => {
  const value = getDieValue(die, definition);
  const displayValue = value.type === 'number' ? value.number : value.text || '?';

  return (
    <div className="relative">
      <div
        className={`
          w-16 h-16 flex items-center justify-center rounded-lg shadow-md
          transition-all cursor-pointer select-none
          ${die.locked ? 'bg-gray-300 border-2 border-gray-500' : 'bg-white border-2 border-gray-300 hover:border-blue-400'}
          ${die.modified ? 'ring-2 ring-yellow-400' : ''}
        `}
        onClick={onToggleLock}
        style={{ backgroundColor: definition.color }}
      >
        <span className="text-2xl font-bold text-gray-800">{displayValue}</span>
      </div>

      {die.locked && (
        <div className="absolute -top-1 -right-1 bg-gray-700 rounded-full p-1">
          <Lock size={12} className="text-white" />
        </div>
      )}

      {!die.locked && (
        <div className="absolute -top-1 -right-1 bg-white rounded-full p-1 opacity-0 hover:opacity-100 transition-opacity">
          <Unlock size={12} className="text-gray-600" />
        </div>
      )}
    </div>
  );
};

export { Die };
