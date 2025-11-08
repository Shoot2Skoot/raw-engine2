/**
 * Color Mark Renderer
 * Displays color fill marks
 */

import React from 'react';
import { ColorMark } from '../../types';

interface ColorMarkRendererProps {
  mark: ColorMark;
  size: number;
}

export const ColorMarkRenderer: React.FC<ColorMarkRendererProps> = ({
  mark,
  size,
}) => {
  const finalOpacity = mark.isPermanent ? mark.opacity : mark.opacity * 0.5;

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundColor: mark.color,
        opacity: finalOpacity,
      }}
    />
  );
};
