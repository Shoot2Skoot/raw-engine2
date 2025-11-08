import React from 'react';
import type { DicePool as DicePoolType, Die as DieType } from '../types';
import { useGame } from '../context/GameContext';
import { Dices, Lock, Unlock } from 'lucide-react';

interface DicePoolProps {
  pool: DicePoolType;
}

export const DicePool: React.FC<DicePoolProps> = ({ pool }) => {
  const { rollDice, lockDie } = useGame();

  if (!pool.visible) return null;

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">{pool.label}</h3>
        <button
          onClick={() => rollDice(pool.id)}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Dices className="w-4 h-4" />
          Roll
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {pool.dice.map((die) => (
          <DieComponent
            key={die.id}
            die={die}
            onLockToggle={(locked) => lockDie(pool.id, die.id, locked)}
          />
        ))}
      </div>
    </div>
  );
};

interface DieComponentProps {
  die: DieType;
  onLockToggle: (locked: boolean) => void;
}

const DieComponent: React.FC<DieComponentProps> = ({ die, onLockToggle }) => {
  const getValue = () => {
    if (die.type === 'numeric') {
      return die.currentValue?.toString() || '?';
    } else {
      if (die.currentFaceIndex !== undefined) {
        const face = die.faces[die.currentFaceIndex];
        return face.value.toString();
      }
      return '?';
    }
  };

  const getColor = () => {
    if (die.type === 'custom' && die.currentFaceIndex !== undefined) {
      return die.faces[die.currentFaceIndex].color;
    }
    return undefined;
  };

  const isRolled = die.type === 'numeric' ? die.currentValue !== undefined : die.currentFaceIndex !== undefined;

  return (
    <div className="relative">
      <div
        className={`
          w-16 h-16 rounded-lg border-2 flex items-center justify-center
          font-bold text-2xl transition-all
          ${die.locked ? 'border-green-600 bg-green-50' : 'border-gray-300 bg-white'}
          ${isRolled ? '' : 'opacity-50'}
        `}
        style={{
          backgroundColor: getColor() || (die.locked ? '#f0fdf4' : '#fff'),
        }}
      >
        {getValue()}
      </div>

      {isRolled && (
        <button
          onClick={() => onLockToggle(!die.locked)}
          className={`
            absolute -top-1 -right-1 p-1 rounded-full
            ${die.locked ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-700'}
            hover:scale-110 transition-transform
            focus:outline-none focus:ring-2 focus:ring-blue-500
          `}
          title={die.locked ? 'Unlock' : 'Lock'}
        >
          {die.locked ? (
            <Lock className="w-3 h-3" />
          ) : (
            <Unlock className="w-3 h-3" />
          )}
        </button>
      )}
    </div>
  );
};
