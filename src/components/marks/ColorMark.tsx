/**
 * Color Mark Component - renders color fill marks
 */

import type { ColorMark as ColorMarkType } from '../../types';

interface ColorMarkProps {
  mark: ColorMarkType;
  width: number;
  height: number;
}

export function ColorMark({ mark, width, height }: ColorMarkProps) {
  const isPencil = mark.mode === 'pencil';
  const finalOpacity = isPencil ? mark.opacity * 0.5 : mark.opacity;

  return (
    <div
      className="absolute inset-0"
      style={{
        width,
        height,
        backgroundColor: mark.color,
        opacity: finalOpacity,
        pointerEvents: 'none',
      }}
    />
  );
}
