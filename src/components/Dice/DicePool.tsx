
import { Dices } from 'lucide-react';
import type { DicePoolState } from '../../types';
import { DiceDisplay } from './DiceDisplay';

interface DicePoolProps {
  pool: DicePoolState;
  label: string;
  onRollAll: () => void;
  onLockToggle: (dieId: string) => void;
  onRerollDie: (dieId: string) => void;
  canReroll?: boolean;
}

export function DicePool({
  pool,
  label,
  onRollAll,
  onLockToggle,
  onRerollDie,
  canReroll = true,
}: DicePoolProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">{label}</h2>
        <button
          onClick={onRollAll}
          disabled={!canReroll}
          className="
            flex items-center gap-2 px-4 py-2 rounded-lg
            bg-green-500 text-white font-semibold
            hover:bg-green-600 disabled:bg-gray-300
            transition-colors shadow
          "
        >
          <Dices size={18} />
          Roll All
        </button>
      </div>

      {pool.rerollsRemaining !== undefined && (
        <div className="text-sm text-gray-600">
          Rerolls remaining: {pool.rerollsRemaining}
        </div>
      )}

      <DiceDisplay
        dice={pool.dice}
        onLockToggle={onLockToggle}
        onReroll={onRerollDie}
        showControls={canReroll}
      />
    </div>
  );
}
