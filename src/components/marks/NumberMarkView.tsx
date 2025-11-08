/**
 * NumberMarkView - renders number marks
 */

import React from 'react';
import type { NumberMark } from '../../types';

interface NumberMarkViewProps {
  mark: NumberMark;
  className?: string;
}

export const NumberMarkView: React.FC<NumberMarkViewProps> = ({
  mark,
  className = '',
}) => {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center ${className}`}
    >
      <span className="text-2xl font-bold text-gray-900">{mark.value}</span>
    </div>
  );
};
