/**
 * Circle mark component
 */

import type { CircleMark as CircleMarkType } from '../../types';

interface CircleMarkProps {
  mark: CircleMarkType;
  size?: number;
}

export function CircleMark({ mark, size = 24 }: CircleMarkProps) {
  const opacity = mark.permanence === 'pencil' ? 0.5 : 1;
  const radius = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ opacity }}>
      {/* Circle outline */}
      <circle
        cx={radius}
        cy={radius}
        r={radius - 2}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />

      {/* Half fill */}
      {mark.state === 'half' && (
        <path
          d={`M ${radius} 2 A ${radius - 2} ${radius - 2} 0 0 1 ${radius} ${size - 2} Z`}
          fill="currentColor"
        />
      )}

      {/* Full fill */}
      {mark.state === 'full' && (
        <circle cx={radius} cy={radius} r={radius - 2} fill="currentColor" />
      )}
    </svg>
  );
}
