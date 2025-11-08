import type { NumberMark as NumberMarkType } from '../../types';

interface NumberMarkProps {
  mark: NumberMarkType;
  fontSize?: number;
}

export function NumberMark({ mark, fontSize = 24 }: NumberMarkProps) {
  const isPencil = mark.style === 'pencil';
  const opacity = isPencil ? 0.5 : 1;
  const color = isPencil ? '#9CA3AF' : '#1F2937';

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none font-bold"
      style={{
        fontSize: `${fontSize}px`,
        color,
        opacity,
      }}
    >
      {mark.value}
    </div>
  );
}
