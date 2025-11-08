/**
 * Dice rolling and management component
 */

import React from 'react';
import { Dices, Lock, Unlock, RefreshCw } from 'lucide-react';
import type { DicePool, Die } from '../types';
import { useGame } from '../gameState';

interface DieDisplayProps {
  die: Die;
  onLockToggle: () => void;
}

const DieDisplay: React.FC<DieDisplayProps> = ({ die, onLockToggle }) => {
  const displayValue = die.currentValue !== undefined ? die.currentValue : '?';
  const isLocked = die.locked;
  const isModified = die.modified;

  return (
    <div
      className={`relative flex flex-col items-center justify-center w-16 h-16 rounded-lg border-2 font-bold text-xl ${
        isLocked
          ? 'bg-amber-100 border-amber-400'
          : 'bg-white border-slate-300'
      } ${isModified ? 'ring-2 ring-purple-500' : ''}`}
    >
      <div className="text-2xl">{displayValue}</div>
      <button
        onClick={onLockToggle}
        className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-slate-100"
        title={isLocked ? 'Unlock' : 'Lock'}
      >
        {isLocked ? <Lock size={12} /> : <Unlock size={12} />}
      </button>
      {die.currentValue === undefined && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Dices size={24} className="text-slate-300" />
        </div>
      )}
    </div>
  );
};

interface DicePoolDisplayProps {
  pool: DicePool;
}

const DicePoolDisplay: React.FC<DicePoolDisplayProps> = ({ pool }) => {
  const { rollDice, lockDie } = useGame();

  const handleRollAll = () => {
    rollDice(pool.id);
  };

  const handleRollUnlocked = () => {
    const unlockedDiceIds = pool.dice.filter((d) => !d.locked).map((d) => d.id);
    if (unlockedDiceIds.length > 0) {
      rollDice(pool.id, unlockedDiceIds);
    }
  };

  const handleLockToggle = (dieId: string) => {
    const die = pool.dice.find((d) => d.id === dieId);
    if (die) {
      lockDie(pool.id, dieId, !die.locked);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-300 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-lg">{pool.name}</h4>
        <div className="flex gap-2">
          <button
            onClick={handleRollUnlocked}
            className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            title="Roll unlocked dice"
          >
            <RefreshCw size={14} />
            <span>Roll</span>
          </button>
          <button
            onClick={handleRollAll}
            className="flex items-center gap-1 px-3 py-1 bg-slate-600 text-white rounded hover:bg-slate-700 text-sm"
            title="Roll all dice (unlock all)"
          >
            <Dices size={14} />
            <span>All</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {pool.dice.map((die) => (
          <DieDisplay key={die.id} die={die} onLockToggle={() => handleLockToggle(die.id)} />
        ))}
      </div>

      {pool.dice.length === 0 && (
        <div className="text-center text-slate-400 py-4">No dice in this pool</div>
      )}
    </div>
  );
};

export const DicePanel: React.FC = () => {
  const { state } = useGame();

  if (state.dicePools.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-50 border-t border-slate-300 p-4">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Dices size={20} />
        Dice
      </h3>
      <div className="space-y-4">
        {state.dicePools.map((pool) => (
          <DicePoolDisplay key={pool.id} pool={pool} />
        ))}
      </div>
    </div>
  );
};
