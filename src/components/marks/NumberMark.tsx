/**
 * Number mark component
 */

import type { NumberMark as NumberMarkType } from '../../types';

interface NumberMarkProps {
  mark: NumberMarkType;
  size?: number;
}

export function NumberMark({ mark, size = 24 }: NumberMarkProps) {
  const opacity = mark.permanence === 'pencil' ? 0.5 : 1;
  const color = mark.permanence === 'pencil' ? '#666' : '#000';
  const fontSize = Math.floor(size * 0.8);

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
