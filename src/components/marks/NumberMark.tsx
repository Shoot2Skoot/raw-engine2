/**
 * Number Mark Component - renders numeric marks
 */

import type { NumberMark as NumberMarkType } from '../../types';

interface NumberMarkProps {
  mark: NumberMarkType;
  size?: number;
}

export function NumberMark({ mark, size = 32 }: NumberMarkProps) {
  const isPencil = mark.mode === 'pencil';
  const opacity = isPencil ? 0.5 : 1;
  const color = isPencil ? '#9CA3AF' : '#1F2937';

  return (
    <div
      className="flex items-center justify-center font-bold"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.6,
        opacity,
        color,
      }}
    >
      {mark.value}
    </div>
  );
}
