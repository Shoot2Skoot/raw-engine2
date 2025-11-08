import React from 'react';
import { TextMark } from '../../types';

interface TextMarkRendererProps {
  mark: TextMark;
  size: number;
}

/**
 * Renders a text mark
 */
export function TextMarkRenderer({ mark, size }: TextMarkRendererProps) {
  const opacity = mark.permanence === 'pencil' ? 0.5 : 1.0;
  const fontSize = Math.min(size * 0.3, 24);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none p-1"
      style={{ opacity }}
    >
      <span
        className="text-center break-words w-full"
        style={{ fontSize: `${fontSize}px`, lineHeight: 1.2 }}
      >
        {mark.text}
      </span>
    </div>
  );
}
