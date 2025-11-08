import React from 'react';
import { CircleMark } from '../../types';

interface CircleMarkRendererProps {
  mark: CircleMark;
  size: number;
}

/**
 * Renders a circle mark (empty, half, or full)
 */
export function CircleMarkRenderer({ mark, size }: CircleMarkRendererProps) {
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
      {/* Circle outline */}
      <circle
        cx="50"
        cy="50"
        r="40"
        fill={mark.state === 'full' ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />

      {/* Half fill */}
      {mark.state === 'half' && (
        <path
          d="M 50 10 A 40 40 0 0 1 50 90 Z"
          fill="currentColor"
        />
      )}
    </svg>
  );
}
