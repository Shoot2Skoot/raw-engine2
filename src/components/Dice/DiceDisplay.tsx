
import { Lock, Unlock, RotateCw } from 'lucide-react';
import type { DieInstance } from '../../types';
import { formatDieFace } from '../../utils/dice';

interface DiceDisplayProps {
  dice: DieInstance[];
  onLockToggle?: (dieId: string) => void;
  onReroll?: (dieId: string) => void;
  showControls?: boolean;
}

export function DiceDisplay({
  dice,
  onLockToggle,
  onReroll,
  showControls = true,
}: DiceDisplayProps) {
  if (dice.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg p-4 shadow-lg">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Dice</h3>
      <div className="flex flex-wrap gap-3">
        {dice.map(die => (
          <div
            key={die.id}
            className={`
              relative flex flex-col items-center gap-2 p-3 rounded-lg
              ${die.isLocked ? 'bg-gray-200' : 'bg-blue-50'}
              ${die.isModified ? 'border-2 border-orange-400' : 'border-2 border-gray-300'}
            `}
          >
            {/* Die face value */}
            <div className="w-16 h-16 flex items-center justify-center bg-white rounded-lg shadow text-2xl font-bold">
              {formatDieFace(die.currentFace)}
            </div>

            {/* Controls */}
            {showControls && (
              <div className="flex gap-1">
                {onLockToggle && (
                  <button
                    onClick={() => onLockToggle(die.id)}
                    className={`
                      p-1 rounded transition-colors
                      ${die.isLocked ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-700'}
                      hover:opacity-80
                    `}
                    title={die.isLocked ? 'Unlock' : 'Lock'}
                  >
                    {die.isLocked ? <Lock size={14} /> : <Unlock size={14} />}
                  </button>
                )}

                {onReroll && !die.isLocked && (
                  <button
                    onClick={() => onReroll(die.id)}
                    className="p-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    title="Reroll"
                  >
                    <RotateCw size={14} />
                  </button>
                )}
              </div>
            )}

            {/* Modification indicator */}
            {die.isModified && (
              <span className="text-xs text-orange-600 font-medium">Modified</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
