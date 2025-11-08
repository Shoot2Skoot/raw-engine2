import type { TextMark as TextMarkType } from '../../types';

interface TextMarkProps {
  mark: TextMarkType;
  fontSize?: number;
}

export function TextMark({ mark, fontSize = 14 }: TextMarkProps) {
  const isPencil = mark.style === 'pencil';
  const opacity = isPencil ? 0.5 : 1;
  const color = isPencil ? '#9CA3AF' : '#1F2937';

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none px-1 text-center break-words"
      style={{
        fontSize: `${fontSize}px`,
        color,
        opacity,
      }}
    >
      {mark.text}
    </div>
  );
}
