/**
 * Color fill mark renderer - displays colored fills
 */

import type { ColorMark as ColorMarkType } from '../../types';

interface ColorMarkProps {
  mark: ColorMarkType;
}

export function ColorMark({ mark }: ColorMarkProps) {
  const opacity = mark.opacity ?? 0.5;

  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundColor: mark.color,
        opacity,
      }}
    />
  );
}
