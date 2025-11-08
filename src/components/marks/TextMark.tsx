/**
 * Text mark renderer - displays text labels
 */

import type { TextMark as TextMarkType } from '../../types';

interface TextMarkProps {
  mark: TextMarkType;
  size: number;
}

export function TextMark({ mark, size }: TextMarkProps) {
  const fontSize = Math.min(size * 0.3, 16);

  return (
    <div
      className="flex items-center justify-center w-full h-full p-1 text-center overflow-hidden"
      style={{
        fontSize: `${fontSize}px`,
        color: mark.temporary ? '#999' : '#000',
      }}
    >
      <span className="line-clamp-2">{mark.value}</span>
    </div>
  );
}
