/**
 * SymbolMarkView - renders symbol/icon marks
 */

import React from 'react';
import { Star, Square, Heart, Diamond, Circle, Triangle } from 'lucide-react';
import type { SymbolMark } from '../../types';

interface SymbolMarkViewProps {
  mark: SymbolMark;
  className?: string;
}

const symbolMap: Record<string, React.FC<{ className?: string }>> = {
  star: Star,
  square: Square,
  heart: Heart,
  diamond: Diamond,
  circle: Circle,
  triangle: Triangle,
};

export const SymbolMarkView: React.FC<SymbolMarkViewProps> = ({
  mark,
  className = '',
}) => {
  const SymbolIcon = symbolMap[mark.symbolId] || Star;

  return (
    <div className={`absolute inset-0 flex items-center justify-center ${className}`}>
      <SymbolIcon className="w-2/3 h-2/3 text-gray-900" />
    </div>
  );
};
