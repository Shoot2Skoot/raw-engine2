/**
 * Text Mark Component - renders freeform text marks
 */

import type { TextMark as TextMarkType } from '../../types';

interface TextMarkProps {
  mark: TextMarkType;
  size?: number;
}

export function TextMark({ mark, size = 32 }: TextMarkProps) {
  const isPencil = mark.mode === 'pencil';
  const opacity = isPencil ? 0.5 : 1;
  const color = isPencil ? '#9CA3AF' : '#1F2937';

  return (
    <div
      className="flex items-center justify-center text-center px-1"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.35,
        opacity,
        color,
        wordBreak: 'break-word',
      }}
    >
      {mark.text}
    </div>
  );
}
