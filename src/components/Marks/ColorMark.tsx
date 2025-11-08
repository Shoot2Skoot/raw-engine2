import type { ColorMark as ColorMarkType } from '../../types';

interface ColorMarkProps {
  mark: ColorMarkType;
}

export function ColorMark({ mark }: ColorMarkProps) {
  const opacity = mark.opacity ?? 0.5;
  const finalOpacity = mark.style === 'pencil' ? opacity * 0.5 : opacity;

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundColor: mark.color,
        opacity: finalOpacity,
      }}
    />
  );
}
