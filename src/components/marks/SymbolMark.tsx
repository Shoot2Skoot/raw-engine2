/**
 * Symbol Mark Component - renders symbol/icon marks
 */

import {
  Star,
  Diamond,
  Heart,
  Square,
  Triangle,
  Hexagon,
  Circle,
} from 'lucide-react';
import type { SymbolMark as SymbolMarkType } from '../../types';

interface SymbolMarkProps {
  mark: SymbolMarkType;
  size?: number;
}

const SYMBOL_ICONS: Record<string, typeof Star> = {
  star: Star,
  diamond: Diamond,
  heart: Heart,
  square: Square,
  triangle: Triangle,
  hexagon: Hexagon,
  circle: Circle,
};

export function SymbolMark({ mark, size = 24 }: SymbolMarkProps) {
  const isPencil = mark.mode === 'pencil';
  const opacity = isPencil ? 0.5 : 1;
  const color = mark.color || '#374151';

  const Icon = SYMBOL_ICONS[mark.symbol] || Star;

  return (
    <div
      className="flex items-center justify-center"
      style={{ width: size, height: size, opacity }}
    >
      <Icon size={size * 0.8} color={color} fill={color} />
    </div>
  );
}
