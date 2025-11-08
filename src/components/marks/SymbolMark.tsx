/**
 * Symbol/icon mark component
 */

import type { SymbolMark as SymbolMarkType } from '../../types';
import { Star, Heart, Square, Circle, Triangle, Diamond } from 'lucide-react';

interface SymbolMarkProps {
  mark: SymbolMarkType;
  size?: number;
}

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  star: Star,
  heart: Heart,
  square: Square,
  circle: Circle,
  triangle: Triangle,
  diamond: Diamond,
};

export function SymbolMark({ mark, size = 24 }: SymbolMarkProps) {
  const opacity = mark.permanence === 'pencil' ? 0.5 : 1;
  const Icon = iconMap[mark.symbol.toLowerCase()];

  if (Icon) {
    return (
      <div style={{ opacity }}>
        <Icon size={size} color={mark.color} />
      </div>
    );
  }

  // Fallback: render as emoji or text
  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.8,
        opacity,
        color: mark.color,
      }}
    >
      {mark.symbol}
    </div>
  );
}
