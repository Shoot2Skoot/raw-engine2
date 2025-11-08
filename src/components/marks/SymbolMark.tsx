/**
 * Symbol mark renderer - displays icons from Lucide React
 */

import type { SymbolMark as SymbolMarkType } from '../../types';
import * as Icons from 'lucide-react';

interface SymbolMarkProps {
  mark: SymbolMarkType;
  size: number;
}

export function SymbolMark({ mark, size }: SymbolMarkProps) {
  const iconSize = size * 0.6;

  // Get icon component by name
  // Default to Star if symbol not found
  const IconComponent = (Icons as any)[mark.symbol] || Icons.Star;

  return (
    <div className="flex items-center justify-center w-full h-full">
      <IconComponent size={iconSize} color={mark.color || '#333'} />
    </div>
  );
}
