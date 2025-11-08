/**
 * Circle mark renderer
 */

import type { CircleMark as CircleMarkType } from '../../types';
import { CircleState } from '../../types';

interface CircleMarkProps {
  mark: CircleMarkType;
  size?: number;
}

export function CircleMark({ mark, size = 24 }: CircleMarkProps) {
  const opacity = mark.temporary ? 0.5 : 1;
  const radius = size / 2;

  return (
    <svg width={size} height={size} style={{ opacity }}>
      {mark.state === CircleState.Empty && (
        <circle
          cx={radius}
          cy={radius}
          r={radius * 0.8}
          fill="none"
          stroke="#6b7280"
          strokeWidth={2}
        />
      )}
      {mark.state === CircleState.Half && (
        <>
          <circle
            cx={radius}
            cy={radius}
            r={radius * 0.8}
            fill="none"
            stroke="#6b7280"
            strokeWidth={2}
          />
          {mark.halfFillDirection === 'left' && (
            <path
              d={`M ${radius} ${radius * 0.2} A ${radius * 0.8} ${
                radius * 0.8
              } 0 0 0 ${radius} ${radius * 1.8} Z`}
              fill="#3b82f6"
            />
          )}
          {mark.halfFillDirection === 'right' && (
            <path
              d={`M ${radius} ${radius * 0.2} A ${radius * 0.8} ${
                radius * 0.8
              } 0 0 1 ${radius} ${radius * 1.8} Z`}
              fill="#3b82f6"
            />
          )}
          {(mark.halfFillDirection === 'top' || !mark.halfFillDirection) && (
            <path
              d={`M ${radius * 0.2} ${radius} A ${radius * 0.8} ${
                radius * 0.8
              } 0 0 1 ${radius * 1.8} ${radius} Z`}
              fill="#3b82f6"
            />
          )}
          {mark.halfFillDirection === 'bottom' && (
            <path
              d={`M ${radius * 0.2} ${radius} A ${radius * 0.8} ${
                radius * 0.8
              } 0 0 0 ${radius * 1.8} ${radius} Z`}
              fill="#3b82f6"
            />
          )}
        </>
      )}
      {mark.state === CircleState.Full && (
        <>
          <circle
            cx={radius}
            cy={radius}
            r={radius * 0.8}
            fill="#3b82f6"
          />
          <circle
            cx={radius}
            cy={radius}
            r={radius * 0.8}
            fill="none"
            stroke="#6b7280"
            strokeWidth={2}
          />
        </>
      )}
    </svg>
  );
}
