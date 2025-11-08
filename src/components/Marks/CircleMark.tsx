import type { CircleMark as CircleMarkType } from '../../types';

interface CircleMarkProps {
  mark: CircleMarkType;
  size?: number;
}

export function CircleMark({ mark, size = 24 }: CircleMarkProps) {
  const opacity = mark.isPencil ? 0.5 : 1;
  const radius = size * 0.4;

  return (
    <div className="mark-center absolute inset-0" style={{ opacity }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Empty circle outline */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#333"
          strokeWidth="2"
        />

        {/* Half fill */}
        {mark.state === 'half' && (
          <path
            d={`
              M ${size / 2} ${size / 2 - radius}
              A ${radius} ${radius} 0 0 1 ${size / 2} ${size / 2 + radius}
              Z
            `}
            fill="#4CAF50"
          />
        )}

        {/* Full fill */}
        {mark.state === 'full' && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="#4CAF50"
          />
        )}
      </svg>
    </div>
  );
}
