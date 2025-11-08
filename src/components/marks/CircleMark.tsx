/**
 * Circle mark renderer - displays empty, half, or full circles
 */

import type { CircleMark as CircleMarkType } from '../../types';

interface CircleMarkProps {
  mark: CircleMarkType;
  size: number;
}

export function CircleMark({ mark, size }: CircleMarkProps) {
  const radius = size * 0.35;
  const center = size / 2;

  return (
    <svg width={size} height={size} className="absolute inset-0">
      {/* Empty circle outline */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#333"
        strokeWidth="2"
      />

      {/* Half fill */}
      {mark.state === 'half' && (
        <path
          d={`M ${center},${center - radius}
              A ${radius},${radius} 0 0,1 ${center},${center + radius}
              Z`}
          fill="#333"
        />
      )}

      {/* Full fill */}
      {mark.state === 'full' && (
        <circle cx={center} cy={center} r={radius} fill="#333" />
      )}
    </svg>
  );
}
