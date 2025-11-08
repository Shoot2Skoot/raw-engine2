/**
 * CircleMarkView - renders circle marks with fill levels
 */

import React from 'react';
import type { CircleMark } from '../../types';

interface CircleMarkViewProps {
  mark: CircleMark;
  className?: string;
}

export const CircleMarkView: React.FC<CircleMarkViewProps> = ({
  mark,
  className = '',
}) => {
  return (
    <div className={`absolute inset-0 flex items-center justify-center ${className}`}>
      <svg className="w-3/4 h-3/4" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-gray-900"
        />

        {/* Fill based on level */}
        {mark.fillLevel === 'half' && (
          <path
            d="M 50 5 A 45 45 0 0 1 50 95 Z"
            fill="currentColor"
            className="text-gray-900"
          />
        )}
        {mark.fillLevel === 'full' && (
          <circle cx="50" cy="50" r="45" fill="currentColor" className="text-gray-900" />
        )}
      </svg>
    </div>
  );
};
