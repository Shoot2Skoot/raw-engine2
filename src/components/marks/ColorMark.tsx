/**
 * Color fill mark component
 */

import type { ColorMark as ColorMarkType } from '../../types';

interface ColorMarkProps {
  mark: ColorMarkType;
  width?: number;
  height?: number;
}

export function ColorMark({ mark, width = 40, height = 40 }: ColorMarkProps) {
  const opacity = mark.permanence === 'pencil' ? (mark.opacity ?? 0.5) * 0.5 : mark.opacity ?? 0.5;

  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundColor: mark.color,
        opacity,
        width,
        height,
      }}
    />
  );
}
