import type { ColorMark as ColorMarkType } from '../../types';

interface ColorMarkProps {
  mark: ColorMarkType;
}

export function ColorMark({ mark }: ColorMarkProps) {
  const opacity = mark.isPencil ? 0.3 : (mark.opacity || 0.6);

  return (
    <div
      className="absolute inset-0 rounded"
      style={{
        backgroundColor: mark.color,
        opacity,
      }}
    />
  );
}
