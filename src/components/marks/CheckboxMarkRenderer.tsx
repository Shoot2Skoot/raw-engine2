/**
 * Checkbox Mark Renderer
 * Displays checkbox marks with empty, checked, or crossed states
 */

import React from 'react';
import { CheckboxMark } from '../../types';

interface CheckboxMarkRendererProps {
  mark: CheckboxMark;
  size: number;
}

export const CheckboxMarkRenderer: React.FC<CheckboxMarkRendererProps> = ({
  mark,
  size,
}) => {
  const opacity = mark.isPermanent ? 1 : 0.5;
  const strokeWidth = size / 20;
  const padding = size * 0.2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="pointer-events-none"
    >
      {/* Box outline */}
      <rect
        x={padding}
        y={padding}
        width={size - padding * 2}
        height={size - padding * 2}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        opacity={opacity}
      />

      {/* Checkmark */}
      {mark.state === 'checked' && (
        <path
          d={`
            M ${size * 0.3} ${size * 0.5}
            L ${size * 0.45} ${size * 0.65}
            L ${size * 0.7} ${size * 0.35}
          `}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth * 1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={opacity}
        />
      )}

      {/* X mark */}
      {mark.state === 'crossed' && (
        <>
          <line
            x1={padding * 1.5}
            y1={padding * 1.5}
            x2={size - padding * 1.5}
            y2={size - padding * 1.5}
            stroke="currentColor"
            strokeWidth={strokeWidth * 1.5}
            strokeLinecap="round"
            opacity={opacity}
          />
          <line
            x1={size - padding * 1.5}
            y1={padding * 1.5}
            x2={padding * 1.5}
            y2={size - padding * 1.5}
            stroke="currentColor"
            strokeWidth={strokeWidth * 1.5}
            strokeLinecap="round"
            opacity={opacity}
          />
        </>
      )}
    </svg>
  );
};
