/**
 * Line Mark Component - renders connection lines between points
 */

import type { LineMark as LineMarkType } from '../../types';

interface LineMarkProps {
  mark: LineMarkType;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

export function LineMark({ mark, fromX, fromY, toX, toY }: LineMarkProps) {
  const isPencil = mark.mode === 'pencil';
  const opacity = isPencil ? 0.5 : 1;
  const color = mark.color || '#374151';

  // Calculate stroke dash array for different styles
  const strokeDasharray = {
    solid: 'none',
    dashed: `${mark.thickness * 3} ${mark.thickness * 2}`,
    dotted: `${mark.thickness} ${mark.thickness}`,
  }[mark.style];

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ opacity }}
    >
      <line
        x1={fromX}
        y1={fromY}
        x2={toX}
        y2={toY}
        stroke={color}
        strokeWidth={mark.thickness}
        strokeDasharray={strokeDasharray}
        strokeLinecap="round"
      />
    </svg>
  );
}
