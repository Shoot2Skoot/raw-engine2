/**
 * TextMarkView - renders text marks
 */

import React from 'react';
import type { TextMark } from '../../types';

interface TextMarkViewProps {
  mark: TextMark;
  className?: string;
}

export const TextMarkView: React.FC<TextMarkViewProps> = ({
  mark,
  className = '',
}) => {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center p-1 ${className}`}
    >
      <span className="text-sm font-medium text-gray-900 text-center break-words">
        {mark.value}
      </span>
    </div>
  );
};
