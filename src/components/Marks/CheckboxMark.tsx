import { Check, X } from 'lucide-react';
import type { CheckboxMark as CheckboxMarkType } from '../../types';

interface CheckboxMarkProps {
  mark: CheckboxMarkType;
  size?: number;
}

export function CheckboxMark({ mark, size = 24 }: CheckboxMarkProps) {
  const opacity = mark.isPencil ? 0.5 : 1;

  return (
    <div
      className="mark-center absolute inset-0"
      style={{ opacity }}
    >
      {mark.state === 'checked' && (
        <Check
          size={size}
          className="text-green-600"
          strokeWidth={3}
        />
      )}
      {mark.state === 'crossed' && (
        <X
          size={size}
          className="text-red-600"
          strokeWidth={3}
        />
      )}
      {mark.state === 'empty' && (
        <div
          className="border-2 border-gray-400 rounded"
          style={{ width: size * 0.8, height: size * 0.8 }}
        />
      )}
    </div>
  );
}
