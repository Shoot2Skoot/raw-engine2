/**
 * Number mark renderer
 */

import type { NumberMark as NumberMarkType } from '../../types';

interface NumberMarkProps {
  mark: NumberMarkType;
  size?: number;
}

export function NumberMark({ mark, size = 32 }: NumberMarkProps) {
  const fontSize = size * 0.6;
  const opacity = mark.temporary ? 0.5 : 1;
  const color = mark.temporary ? '#9ca3af' : '#1f2937';

  return (
    <div
      className="flex items-center justify-center font-bold"
      style={{
        width: size,
        height: size,
        fontSize,
        opacity,
        color,
      }}
    >
      {mark.value}
    </div>
  );
}
