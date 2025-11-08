import React from 'react';
import { ColorMark } from '../../types';

interface ColorMarkRendererProps {
  mark: ColorMark;
}

/**
 * Renders a color fill mark
 */
export function ColorMarkRenderer({ mark }: ColorMarkRendererProps) {
  const opacity = mark.permanence === 'pencil'
    ? mark.opacity / 200 // Half opacity for pencil
    : mark.opacity / 100;

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundColor: mark.color,
        opacity,
      }}
    />
  );
}
