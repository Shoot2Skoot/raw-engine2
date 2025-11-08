/**
 * Checkbox Mark Component - renders checkbox marks (empty/checked/crossed)
 */

import { Check, X } from 'lucide-react';
import type { CheckboxMark as CheckboxMarkType } from '../../types';

interface CheckboxMarkProps {
  mark: CheckboxMarkType;
  size?: number;
}

export function CheckboxMark({ mark, size = 24 }: CheckboxMarkProps) {
  const isPencil = mark.mode === 'pencil';
  const opacity = isPencil ? 0.5 : 1;

  return (
    <div
      className="flex items-center justify-center"
      style={{ width: size, height: size, opacity }}
    >
      {mark.state === 'empty' && (
        <div
          className="border-2 border-gray-700 rounded"
          style={{ width: size * 0.8, height: size * 0.8 }}
        />
      )}
      {mark.state === 'checked' && (
        <div className="relative">
          <div
            className="border-2 border-gray-700 rounded"
            style={{ width: size * 0.8, height: size * 0.8 }}
          />
          <Check
            size={size * 0.6}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-green-600"
            strokeWidth={3}
          />
        </div>
      )}
      {mark.state === 'crossed' && (
        <div className="relative">
          <div
            className="border-2 border-gray-700 rounded"
            style={{ width: size * 0.8, height: size * 0.8 }}
          />
          <X
            size={size * 0.6}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-600"
            strokeWidth={3}
          />
        </div>
      )}
    </div>
  );
}
