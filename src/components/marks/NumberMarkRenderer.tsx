import React from 'react';
import { NumberMark } from '../../types';

interface NumberMarkRendererProps {
  mark: NumberMark;
  size: number;
}

/**
 * Renders a number mark
 */
export function NumberMarkRenderer({ mark, size }: NumberMarkRendererProps) {
  const opacity = mark.permanence === 'pencil' ? 0.5 : 1.0;
  const fontSize = Math.min(size * 0.6, 48);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      style={{ opacity }}
    >
      <span
        className="font-bold"
        style={{ fontSize: `${fontSize}px` }}
      >
        {mark.value}
      </span>
    </div>
  );
}
