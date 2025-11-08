import type { NumberMark as NumberMarkType } from '../../types';

interface NumberMarkProps {
  mark: NumberMarkType;
  size?: number;
}

export function NumberMark({ mark, size = 24 }: NumberMarkProps) {
  const opacity = mark.isPencil ? 0.5 : 1;
  const color = mark.isPencil ? '#999' : '#000';
  const fontSize = size * 0.7;

  return (
    <div
      className="mark-center absolute inset-0 font-bold"
      style={{
        opacity,
        color,
        fontSize: `${fontSize}px`,
      }}
    >
      {mark.value}
    </div>
  );
}
