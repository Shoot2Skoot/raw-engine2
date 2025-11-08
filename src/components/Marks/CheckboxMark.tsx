import { Check, X } from 'lucide-react';
import type { CheckboxMark as CheckboxMarkType } from '../../types';

interface CheckboxMarkProps {
  mark: CheckboxMarkType;
  size?: number;
}

export function CheckboxMark({ mark, size = 24 }: CheckboxMarkProps) {
  const isPencil = mark.style === 'pencil';
  const opacity = isPencil ? 0.5 : 1;
  const color = isPencil ? '#9CA3AF' : '#1F2937';

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {mark.state === 'checked' && (
        <Check
          size={size}
          color={color}
          strokeWidth={3}
          style={{ opacity }}
        />
      )}
      {mark.state === 'crossed' && (
        <X
          size={size}
          color={color}
          strokeWidth={3}
          style={{ opacity }}
        />
      )}
    </div>
  );
}
