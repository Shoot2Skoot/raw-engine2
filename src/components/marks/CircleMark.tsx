/**
 * Circle Mark Component - renders circle marks (empty/half/full)
 */

import type { CircleMark as CircleMarkType } from '../../types';

interface CircleMarkProps {
  mark: CircleMarkType;
  size?: number;
}

export function CircleMark({ mark, size = 24 }: CircleMarkProps) {
  const isPencil = mark.mode === 'pencil';
  const opacity = isPencil ? 0.5 : 1;
  const radius = size * 0.4;

  return (
    <svg
      width={size}
      height={size}
      className="flex items-center justify-center"
      style={{ opacity }}
    >
      {mark.state === 'empty' && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#374151"
          strokeWidth={2}
        />
      )}
      {mark.state === 'half' && (
        <>
          <defs>
            <clipPath id={`half-${mark.id}`}>
              <rect x={size / 2} y={0} width={size / 2} height={size} />
            </clipPath>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#374151"
            strokeWidth={2}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="#3B82F6"
            clipPath={`url(#half-${mark.id})`}
          />
        </>
      )}
      {mark.state === 'full' && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="#3B82F6"
          stroke="#374151"
          strokeWidth={2}
        />
      )}
    </svg>
  );
}
