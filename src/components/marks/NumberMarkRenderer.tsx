/**
 * Number Mark Renderer
 * Displays number marks
 */

import React from 'react';
import { NumberMark } from '../../types';

interface NumberMarkRendererProps {
  mark: NumberMark;
  size: number;
}

export const NumberMarkRenderer: React.FC<NumberMarkRendererProps> = ({
  mark,
  size,
}) => {
  const opacity = mark.isPermanent ? 1 : 0.5;
  const fontSize = size * 0.6;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
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
};
