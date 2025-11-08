import React from 'react';
import type { Mark } from '../../types';
import { Check, X, Circle, Star } from 'lucide-react';

interface MarkRendererProps {
  mark: Mark;
  size?: number;
}

/**
 * Renders a mark based on its type
 */
export function MarkRenderer({ mark, size = 24 }: MarkRendererProps) {
  const isPencil = mark.isPencil;
  const opacity = isPencil ? 0.5 : 1;

  switch (mark.type) {
    case 'checkbox':
      return (
        <CheckboxMarkRenderer
          state={mark.state}
          size={size}
          opacity={opacity}
        />
      );

    case 'number':
      return (
        <NumberMarkRenderer
          value={mark.value}
          size={size}
          opacity={opacity}
        />
      );

    case 'color':
      return (
        <ColorMarkRenderer
          color={mark.color}
          opacity={mark.opacity * opacity}
        />
      );

    case 'circle':
      return (
        <CircleMarkRenderer
          state={mark.state}
          size={size}
          opacity={opacity}
        />
      );

    case 'symbol':
      return (
        <SymbolMarkRenderer
          symbol={mark.symbol}
          color={mark.color}
          size={size}
          opacity={opacity}
        />
      );

    case 'text':
      return (
        <TextMarkRenderer text={mark.text} size={size} opacity={opacity} />
      );

    default:
      return null;
  }
}

// ============================================================================
// INDIVIDUAL MARK RENDERERS
// ============================================================================

function CheckboxMarkRenderer({
  state,
  size,
  opacity,
}: {
  state: 'empty' | 'checked' | 'crossed';
  size: number;
  opacity: number;
}) {
  return (
    <div
      className="flex items-center justify-center w-full h-full"
      style={{ opacity }}
    >
      {state === 'empty' && (
        <div
          className="border-2 border-gray-400 rounded"
          style={{ width: size, height: size }}
        />
      )}

      {state === 'checked' && (
        <div
          className="border-2 border-green-600 bg-green-50 rounded flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          <Check className="text-green-600" size={size * 0.8} strokeWidth={3} />
        </div>
      )}

      {state === 'crossed' && (
        <div
          className="border-2 border-red-600 bg-red-50 rounded flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          <X className="text-red-600" size={size * 0.8} strokeWidth={3} />
        </div>
      )}
    </div>
  );
}

function NumberMarkRenderer({
  value,
  size,
  opacity,
}: {
  value: number;
  size: number;
  opacity: number;
}) {
  const fontSize = size * 0.8;

  return (
    <div
      className="flex items-center justify-center w-full h-full font-bold"
      style={{ opacity, fontSize: `${fontSize}px` }}
    >
      {value}
    </div>
  );
}

function ColorMarkRenderer({
  color,
  opacity,
}: {
  color: string;
  opacity: number;
}) {
  return (
    <div
      className="absolute inset-0 rounded"
      style={{
        backgroundColor: color,
        opacity,
      }}
    />
  );
}

function CircleMarkRenderer({
  state,
  size,
  opacity,
}: {
  state: 'empty' | 'half' | 'full';
  size: number;
  opacity: number;
}) {
  return (
    <div
      className="flex items-center justify-center w-full h-full"
      style={{ opacity }}
    >
      {state === 'empty' && (
        <Circle
          className="text-gray-400"
          size={size}
          strokeWidth={2}
          fill="none"
        />
      )}

      {state === 'half' && (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-blue-600"
          />
          <path
            d="M 12 2 A 10 10 0 0 1 12 22 Z"
            fill="currentColor"
            className="text-blue-600"
          />
        </svg>
      )}

      {state === 'full' && (
        <Circle
          className="text-blue-600"
          size={size}
          strokeWidth={2}
          fill="currentColor"
        />
      )}
    </div>
  );
}

function SymbolMarkRenderer({
  symbol,
  color = 'currentColor',
  size,
  opacity,
}: {
  symbol: string;
  color?: string;
  size: number;
  opacity: number;
}) {
  // Map symbol names to icons
  const iconMap: Record<string, React.ComponentType<any>> = {
    star: Star,
    circle: Circle,
    check: Check,
    // Add more symbols as needed
  };

  const Icon = iconMap[symbol] || Star;

  return (
    <div
      className="flex items-center justify-center w-full h-full"
      style={{ opacity, color }}
    >
      <Icon size={size} fill={color} />
    </div>
  );
}

function TextMarkRenderer({
  text,
  size,
  opacity,
}: {
  text: string;
  size: number;
  opacity: number;
}) {
  const fontSize = Math.max(size * 0.5, 10);

  return (
    <div
      className="flex items-center justify-center w-full h-full px-1 text-center break-words"
      style={{ opacity, fontSize: `${fontSize}px`, lineHeight: 1.2 }}
    >
      {text}
    </div>
  );
}
