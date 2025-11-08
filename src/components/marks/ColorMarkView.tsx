/**
 * ColorMarkView - renders color fill marks
 */

import React from 'react';
import type { ColorMark } from '../../types';

interface ColorMarkViewProps {
  mark: ColorMark;
  className?: string;
}

export const ColorMarkView: React.FC<ColorMarkViewProps> = ({
  mark,
  className = '',
}) => {
  return (
    <div
      className={`absolute inset-0 ${className}`}
      style={{
        backgroundColor: mark.color,
        opacity: mark.opacity || 0.5,
      }}
    />
  );
};
