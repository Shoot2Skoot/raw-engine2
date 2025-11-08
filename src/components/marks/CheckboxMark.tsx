/**
 * Checkbox mark renderer - displays empty, checked, or crossed states
 */

import type { CheckboxMark as CheckboxMarkType } from '../../types';
import { Check, X } from 'lucide-react';

interface CheckboxMarkProps {
  mark: CheckboxMarkType;
  size: number;
}

export function CheckboxMark({ mark, size }: CheckboxMarkProps) {
  const iconSize = size * 0.7;

  return (
    <div className="flex items-center justify-center w-full h-full">
      {mark.state === 'checked' && (
        <Check size={iconSize} className="text-green-600" strokeWidth={3} />
      )}
      {mark.state === 'crossed' && (
        <X size={iconSize} className="text-red-600" strokeWidth={3} />
      )}
      {/* empty state shows nothing */}
    </div>
  );
}
