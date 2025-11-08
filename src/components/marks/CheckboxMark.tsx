/**
 * Checkbox mark component
 */

import type { CheckboxMark as CheckboxMarkType } from '../../types';
import { Check, X } from 'lucide-react';

interface CheckboxMarkProps {
  mark: CheckboxMarkType;
  size?: number;
}

export function CheckboxMark({ mark, size = 24 }: CheckboxMarkProps) {
  const opacity = mark.permanence === 'pencil' ? 0.5 : 1;

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ opacity }}>
      {/* Box outline */}
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        rx="2"
      />

      {/* Check mark */}
      {mark.state === 'checked' && (
        <Check
          size={size * 0.7}
          strokeWidth={3}
          className="absolute"
          style={{ left: '15%', top: '15%' }}
        />
      )}

      {/* X mark */}
      {mark.state === 'crossed' && (
        <X
          size={size * 0.7}
          strokeWidth={3}
          className="absolute"
          style={{ left: '15%', top: '15%' }}
        />
      )}
    </svg>
  );
}
