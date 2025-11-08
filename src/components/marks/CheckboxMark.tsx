/**
 * Checkbox mark renderer
 */

import { Check, X } from 'lucide-react';
import type { CheckboxMark as CheckboxMarkType } from '../../types';
import { CheckboxState } from '../../types';

interface CheckboxMarkProps {
  mark: CheckboxMarkType;
  size?: number;
}

export function CheckboxMark({ mark, size = 24 }: CheckboxMarkProps) {
  const opacity = mark.temporary ? 0.5 : 1;

  return (
    <div
      className="flex items-center justify-center"
      style={{ width: size, height: size, opacity }}
    >
      {mark.state === CheckboxState.Empty && (
        <div
          className="border-2 border-gray-400 rounded"
          style={{ width: size * 0.8, height: size * 0.8 }}
        />
      )}
      {mark.state === CheckboxState.Checked && (
        <div className="relative" style={{ width: size, height: size }}>
          <div
            className="absolute border-2 border-gray-400 rounded"
            style={{
              width: size * 0.8,
              height: size * 0.8,
              left: size * 0.1,
              top: size * 0.1,
            }}
          />
          <Check
            size={size * 0.7}
            className="absolute text-green-600"
            strokeWidth={3}
            style={{ left: size * 0.15, top: size * 0.15 }}
          />
        </div>
      )}
      {mark.state === CheckboxState.Crossed && (
        <div className="relative" style={{ width: size, height: size }}>
          <div
            className="absolute border-2 border-gray-400 rounded"
            style={{
              width: size * 0.8,
              height: size * 0.8,
              left: size * 0.1,
              top: size * 0.1,
            }}
          />
          <X
            size={size * 0.7}
            className="absolute text-red-600"
            strokeWidth={3}
            style={{ left: size * 0.15, top: size * 0.15 }}
          />
        </div>
      )}
    </div>
  );
}
