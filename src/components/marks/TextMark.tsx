/**
 * Text mark component
 */

import type { TextMark as TextMarkType } from '../../types';

interface TextMarkProps {
  mark: TextMarkType;
  maxWidth?: number;
}

export function TextMark({ mark, maxWidth = 100 }: TextMarkProps) {
  const opacity = mark.permanence === 'pencil' ? 0.5 : 1;
  const color = mark.permanence === 'pencil' ? '#666' : '#000';

  return (
    <div
      className="text-sm font-medium break-words text-center"
      style={{
        opacity,
        color,
        maxWidth,
      }}
    >
      {mark.text}
    </div>
  );
}
