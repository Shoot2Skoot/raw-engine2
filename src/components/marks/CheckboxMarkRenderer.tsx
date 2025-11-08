import React from 'react';
import { Check, X } from 'lucide-react';
import { CheckboxMark } from '../../types';

interface CheckboxMarkRendererProps {
  mark: CheckboxMark;
  size: number;
}

/**
 * Renders a checkbox mark (empty, checked, or crossed)
 */
export function CheckboxMarkRenderer({ mark, size }: CheckboxMarkRendererProps) {
  const opacity = mark.permanence === 'pencil' ? 0.5 : 1.0;
  const strokeWidth = Math.max(2, size / 20);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="pointer-events-none"
      style={{ opacity }}
    >
      {/* Border */}
      <rect
        x="10"
        y="10"
        width="80"
        height="80"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        rx="5"
      />

      {/* Check mark */}
      {mark.state === 'checked' && (
        <Check
          x="20"
          y="20"
          width="60"
          height="60"
          strokeWidth={strokeWidth * 1.5}
        />
      )}

      {/* X mark */}
      {mark.state === 'crossed' && (
        <X
          x="20"
          y="20"
          width="60"
          height="60"
          strokeWidth={strokeWidth * 1.5}
        />
      )}
    </svg>
  );
}
