/**
 * Mark Renderer Component
 *
 * Renders different types of marks (checkbox, number, color, etc.)
 */

import { Check, X } from 'lucide-react';
import type { Mark } from '../types';

interface MarkRendererProps {
  mark: Mark;
  size?: number;
}

export function MarkRenderer({ mark, size = 40 }: MarkRendererProps) {
  const opacity = mark.isPencil ? 0.5 : 1;
  const color = mark.isPencil ? '#888' : '#000';

  switch (mark.type) {
    case 'checkbox':
      return <CheckboxMark state={mark.checkboxState || 'empty'} size={size} opacity={opacity} />;

    case 'number':
      return (
        <NumberMark
          value={mark.numberValue || 0}
          size={size}
          opacity={opacity}
          color={color}
        />
      );

    case 'color':
      return <ColorMark color={mark.colorValue || '#ccc'} size={size} opacity={opacity} />;

    case 'circle':
      return <CircleMark state={mark.circleState || 'empty'} size={size} opacity={opacity} />;

    case 'symbol':
      return <SymbolMark symbolId={mark.symbolId || ''} size={size} opacity={opacity} />;

    case 'text':
      return <TextMark text={mark.textValue || ''} size={size} opacity={opacity} color={color} />;

    case 'line':
      // Lines are rendered differently, not as individual marks
      return null;

    default:
      return null;
  }
}

// ============================================================================
// INDIVIDUAL MARK COMPONENTS
// ============================================================================

function CheckboxMark({
  state,
  size,
  opacity,
}: {
  state: 'empty' | 'checked' | 'crossed';
  size: number;
  opacity: number;
}) {
  const padding = size * 0.1;
  const innerSize = size - padding * 2;

  return (
    <svg width={size} height={size} opacity={opacity}>
      {/* Box outline */}
      <rect
        x={padding}
        y={padding}
        width={innerSize}
        height={innerSize}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        rx="2"
      />

      {/* Check or X */}
      {state === 'checked' && (
        <g transform={`translate(${padding}, ${padding})`}>
          <Check size={innerSize} strokeWidth={3} />
        </g>
      )}

      {state === 'crossed' && (
        <g transform={`translate(${padding}, ${padding})`}>
          <X size={innerSize} strokeWidth={3} />
        </g>
      )}
    </svg>
  );
}

function NumberMark({
  value,
  size,
  opacity,
  color,
}: {
  value: number;
  size: number;
  opacity: number;
  color: string;
}) {
  const fontSize = size * 0.6;

  return (
    <div
      className="flex items-center justify-center w-full h-full font-bold"
      style={{
        fontSize: `${fontSize}px`,
        opacity,
        color,
      }}
    >
      {value}
    </div>
  );
}

function ColorMark({
  color,
  size: _size,
  opacity,
}: {
  color: string;
  size: number;
  opacity: number;
}) {
  return (
    <div
      className="w-full h-full rounded-sm"
      style={{
        backgroundColor: color,
        opacity: opacity * 0.7, // Color fills are semi-transparent
      }}
    />
  );
}

function CircleMark({
  state,
  size,
  opacity,
}: {
  state: 'empty' | 'half' | 'full';
  size: number;
  opacity: number;
}) {
  const radius = (size / 2) * 0.9;
  const center = size / 2;

  return (
    <svg width={size} height={size} opacity={opacity}>
      {/* Circle outline */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill={state === 'full' ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
      />

      {/* Half fill (left side) */}
      {state === 'half' && (
        <path
          d={`M ${center} ${center - radius} A ${radius} ${radius} 0 0 1 ${center} ${center + radius} Z`}
          fill="currentColor"
        />
      )}
    </svg>
  );
}

function SymbolMark({
  symbolId,
  size: _size,
  opacity,
}: {
  symbolId: string;
  size: number;
  opacity: number;
}) {
  // For now, just display the symbol ID
  // In a full implementation, this would map to actual icons
  const fontSize = _size * 0.4;

  return (
    <div
      className="flex items-center justify-center w-full h-full font-semibold"
      style={{
        fontSize: `${fontSize}px`,
        opacity,
      }}
    >
      {symbolId.substring(0, 2).toUpperCase()}
    </div>
  );
}

function TextMark({
  text,
  size,
  opacity,
  color,
}: {
  text: string;
  size: number;
  opacity: number;
  color: string;
}) {
  const fontSize = Math.min(size * 0.3, 16);

  return (
    <div
      className="flex items-center justify-center w-full h-full text-center px-1"
      style={{
        fontSize: `${fontSize}px`,
        opacity,
        color,
        wordBreak: 'break-word',
        lineHeight: 1.2,
      }}
    >
      {text}
    </div>
  );
}
