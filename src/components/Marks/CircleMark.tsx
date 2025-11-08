import type { CircleMark as CircleMarkType } from '../../types';

interface CircleMarkProps {
  mark: CircleMarkType;
  size?: number;
}

export function CircleMark({ mark, size = 24 }: CircleMarkProps) {
  const isPencil = mark.style === 'pencil';
  const opacity = isPencil ? 0.5 : 1;
  const color = isPencil ? '#9CA3AF' : '#1F2937';

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <svg width={size} height={size} viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="10"
          fill={mark.state === 'full' ? color : 'none'}
          stroke={color}
          strokeWidth="2"
          opacity={opacity}
        />
        {mark.state === 'half' && (
          <path
            d="M 12 2 A 10 10 0 0 1 12 22 Z"
            fill={color}
            opacity={opacity}
          />
        )}
      </svg>
    </div>
  );
}
