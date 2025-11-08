import { Dices, Lock, Unlock } from 'lucide-react';
import type { DicePool as DicePoolType } from '../../types';

interface DicePoolProps {
  pool: DicePoolType;
  onRoll: () => void;
  onToggleLock: (dieId: string) => void;
}

export function DicePoolComponent({ pool, onRoll, onToggleLock }: DicePoolProps) {
  const getDieValue = (die: DicePoolType['dice'][0]) => {
    if (!die.currentFace) return '?';
    if (typeof die.currentFace === 'number') return die.currentFace;
    return die.currentFace.display || die.currentFace.value;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">{pool.name}</h3>
        <button
          onClick={onRoll}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          <Dices size={20} />
          Roll
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {pool.dice.map((die) => (
          <div
            key={die.id}
            className={`relative flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
              die.locked
                ? 'border-yellow-500 bg-yellow-50'
                : 'border-gray-300 bg-white hover:border-blue-300'
            }`}
          >
            <div
              className={`text-3xl font-bold mb-2 ${
                die.modified ? 'text-purple-600' : 'text-gray-900'
              }`}
            >
              {getDieValue(die)}
            </div>
            <button
              onClick={() => onToggleLock(die.id)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              {die.locked ? <Lock size={16} /> : <Unlock size={16} />}
              {die.locked ? 'Locked' : 'Lock'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
