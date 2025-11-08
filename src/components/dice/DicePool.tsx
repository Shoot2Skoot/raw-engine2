import React from 'react';
import type { DicePool as DicePoolType, DieInstance, DieDefinition } from '../../types';
import { Lock, Unlock, RotateCcw } from 'lucide-react';
import { getStandardDieFaces } from '../../utils/helpers';

interface DicePoolProps {
  pool: DicePoolType;
  dieDefinitions?: DieDefinition[];
  onRoll: (diceIds?: string[]) => void;
  onLockDie: (dieId: string, locked: boolean) => void;
}

export function DicePool({ pool, dieDefinitions, onRoll, onLockDie }: DicePoolProps) {
  const handleRollAll = () => {
    onRoll();
  };

  const handleRollDie = (dieId: string) => {
    onRoll([dieId]);
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-300 p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg">{pool.name}</h3>
        <button
          onClick={handleRollAll}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          <RotateCcw size={16} />
          Roll All
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {pool.dice.map((die) => (
          <Die
            key={die.id}
            die={die}
            definition={dieDefinitions?.find((d) => d.id === die.definitionId)}
            onRoll={() => handleRollDie(die.id)}
            onToggleLock={() => onLockDie(die.id, !die.isLocked)}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// INDIVIDUAL DIE COMPONENT
// ============================================================================

interface DieProps {
  die: DieInstance;
  definition?: DieDefinition;
  onRoll: () => void;
  onToggleLock: () => void;
}

function Die({ die, definition, onRoll, onToggleLock }: DieProps) {
  const isLocked = die.isLocked;
  const isModified = die.isModified;

  // Get current face value
  const getCurrentValue = () => {
    if (definition) {
      const face = definition.faces[die.currentFace];
      return renderCustomFace(face.content);
    } else {
      // Standard die
      const faces = getStandardDieFaces(die.definitionId);
      return faces[die.currentFace];
    }
  };

  const renderCustomFace = (content: any): React.ReactNode => {
    switch (content.type) {
      case 'number':
        return content.value;
      case 'symbol':
        return <span style={{ color: content.color }}>{content.symbol}</span>;
      case 'text':
        return content.text;
      case 'color':
        return (
          <div
            className="w-full h-full rounded"
            style={{ backgroundColor: content.color }}
          />
        );
      case 'combined':
        return (
          <div className="flex flex-col items-center justify-center gap-1">
            {content.items.map((item: any, idx: number) => (
              <div key={idx}>{renderCustomFace(item)}</div>
            ))}
          </div>
        );
      default:
        return '?';
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`
          relative w-16 h-16 rounded-lg border-2 flex items-center justify-center
          font-bold text-2xl cursor-pointer transition-all
          ${isLocked ? 'bg-gray-300 border-gray-500' : 'bg-white border-blue-500 hover:bg-blue-50'}
          ${isModified ? 'ring-2 ring-yellow-400' : ''}
        `}
        onClick={isLocked ? undefined : onRoll}
        title={isLocked ? 'Locked' : 'Click to roll'}
      >
        {getCurrentValue()}

        {isModified && (
          <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full" />
        )}
      </div>

      <button
        onClick={onToggleLock}
        className={`
          p-1 rounded transition-colors
          ${isLocked ? 'bg-gray-500 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
        `}
        title={isLocked ? 'Unlock' : 'Lock'}
      >
        {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
      </button>
    </div>
  );
}
