import type { TextMark as TextMarkType } from '../../types';

interface TextMarkProps {
  mark: TextMarkType;
  size?: number;
}

export function TextMark({ mark, size = 14 }: TextMarkProps) {
  const opacity = mark.isPencil ? 0.5 : 1;
  const color = mark.isPencil ? '#999' : '#000';

  return (
    <div
      className="mark-center absolute inset-0 text-center px-1 overflow-hidden"
      style={{
        opacity,
        color,
        fontSize: `${size}px`,
        lineHeight: '1.2',
      }}
    >
      <span className="break-words">{mark.text}</span>
    </div>
  );
}
