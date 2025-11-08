/**
 * Circle Mark Renderer
 * Displays circle marks with empty, half, or full states
 */

import React from 'react';
import { CircleMark } from '../../types';

interface CircleMarkRendererProps {
  mark: CircleMark;
  size: number;
}

export const CircleMarkRenderer: React.FC<CircleMarkRendererProps> = ({
  mark,
  size,
}) => {
  const opacity = mark.isPermanent ? 1 : 0.5;
  const radius = (size * 0.8) / 2;
  const center = size / 2;
  const strokeWidth = size / 20;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="pointer-events-none"
    >
      {/* Circle outline */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        opacity={opacity}
      />

      {/* Half fill */}
      {mark.state === 'half' && (
        <path
          d={`
            M ${center} ${center - radius}
            A ${radius} ${radius} 0 0 1 ${center} ${center + radius}
            L ${center} ${center - radius}
            Z
          `}
          fill="currentColor"
          opacity={opacity * 0.7}
        />
      )}

      {/* Full fill */}
      {mark.state === 'full' && (
        <circle
          cx={center}
          cy={center}
          r={radius - strokeWidth / 2}
          fill="currentColor"
          opacity={opacity * 0.7}
        />
      )}
    </svg>
  );
};
