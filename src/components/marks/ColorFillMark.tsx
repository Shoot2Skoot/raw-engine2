/**
 * Color fill mark renderer
 */

import type { ColorFillMark as ColorFillMarkType } from '../../types';

interface ColorFillMarkProps {
  mark: ColorFillMarkType;
  width?: number;
  height?: number;
}

export function ColorFillMark({
  mark,
  width = 40,
  height = 40,
}: ColorFillMarkProps) {
  const opacity = mark.temporary ? 0.3 : mark.opacity || 0.6;

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundColor: mark.color,
        opacity,
        width,
        height,
      }}
    />
  );
}
