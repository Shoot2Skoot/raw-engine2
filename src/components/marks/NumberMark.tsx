/**
 * Number mark renderer - displays numeric values
 */

import type { NumberMark as NumberMarkType } from '../../types';

interface NumberMarkProps {
  mark: NumberMarkType;
  size: number;
}

export function NumberMark({ mark, size }: NumberMarkProps) {
  const fontSize = size * 0.5;

  return (
    <div
      className="flex items-center justify-center w-full h-full font-bold"
      style={{
        fontSize: `${fontSize}px`,
        color: mark.temporary ? '#999' : '#000',
      }}
    >
      {mark.value}
    </div>
  );
}
