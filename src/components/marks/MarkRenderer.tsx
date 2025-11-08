/**
 * Mark Renderer Component
 * Renders different types of marks (checkbox, number, color, etc.)
 */

import {
  Mark,
  CheckboxMark,
  NumberMark,
  ColorMark,
  CircleMark,
  SymbolMark,
  TextMark,
} from '../../types';
import { Check, X } from 'lucide-react';

interface MarkRendererProps {
  mark: Mark;
  size: number;
}

export function MarkRenderer({ mark, size }: MarkRendererProps) {
  const opacity = mark.isPencil ? 0.5 : 1;

  switch (mark.type) {
    case 'checkbox':
      return <CheckboxMarkRenderer mark={mark} size={size} opacity={opacity} />;
    case 'number':
      return <NumberMarkRenderer mark={mark} size={size} opacity={opacity} />;
    case 'color':
      return <ColorMarkRenderer mark={mark} size={size} opacity={opacity} />;
    case 'circle':
      return <CircleMarkRenderer mark={mark} size={size} opacity={opacity} />;
    case 'symbol':
      return <SymbolMarkRenderer mark={mark} size={size} opacity={opacity} />;
    case 'text':
      return <TextMarkRenderer mark={mark} size={size} opacity={opacity} />;
    default:
      return null;
  }
}

function CheckboxMarkRenderer({
  mark,
  size,
  opacity,
}: {
  mark: CheckboxMark;
  size: number;
  opacity: number;
}) {
  const boxSize = size * 0.6;
  const iconSize = boxSize * 0.7;

  return (
    <g opacity={opacity}>
      <rect
        x={(size - boxSize) / 2}
        y={(size - boxSize) / 2}
        width={boxSize}
        height={boxSize}
        fill="white"
        stroke="#1f2937"
        strokeWidth={2}
        rx={4}
      />
      {mark.state === 'checked' && (
        <g transform={`translate(${(size - iconSize) / 2}, ${(size - iconSize) / 2})`}>
          <Check size={iconSize} strokeWidth={3} color="#10b981" />
        </g>
      )}
      {mark.state === 'crossed' && (
        <g transform={`translate(${(size - iconSize) / 2}, ${(size - iconSize) / 2})`}>
          <X size={iconSize} strokeWidth={3} color="#ef4444" />
        </g>
      )}
    </g>
  );
}

function NumberMarkRenderer({
  mark,
  size,
  opacity,
}: {
  mark: NumberMark;
  size: number;
  opacity: number;
}) {
  const fontSize = size * 0.5;

  return (
    <text
      x={size / 2}
      y={size / 2}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={fontSize}
      fontWeight="bold"
      fill="#1f2937"
      opacity={opacity}
      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    >
      {mark.value}
    </text>
  );
}

function ColorMarkRenderer({
  mark,
  size,
  opacity,
}: {
  mark: ColorMark;
  size: number;
  opacity: number;
}) {
  return (
    <rect
      x={2}
      y={2}
      width={size - 4}
      height={size - 4}
      fill={mark.color}
      opacity={opacity * 0.7}
      rx={4}
    />
  );
}

function CircleMarkRenderer({
  mark,
  size,
  opacity,
}: {
  mark: CircleMark;
  size: number;
  opacity: number;
}) {
  const radius = size * 0.3;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <g opacity={opacity}>
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill={mark.state === 'full' ? '#1f2937' : 'white'}
        stroke="#1f2937"
        strokeWidth={2}
      />
      {mark.state === 'half' && (
        <path
          d={`M ${cx} ${cy - radius} A ${radius} ${radius} 0 0 1 ${cx} ${cy + radius} Z`}
          fill="#1f2937"
        />
      )}
    </g>
  );
}

function SymbolMarkRenderer({
  mark,
  size,
  opacity,
}: {
  mark: SymbolMark;
  size: number;
  opacity: number;
}) {
  const fontSize = size * 0.6;

  return (
    <text
      x={size / 2}
      y={size / 2}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={fontSize}
      fill="#1f2937"
      opacity={opacity}
    >
      {mark.symbol}
    </text>
  );
}

function TextMarkRenderer({
  mark,
  size,
  opacity,
}: {
  mark: TextMark;
  size: number;
  opacity: number;
}) {
  const fontSize = Math.min(size * 0.3, size / Math.max(mark.text.length * 0.6, 1));

  return (
    <text
      x={size / 2}
      y={size / 2}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={fontSize}
      fill="#1f2937"
      opacity={opacity}
      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    >
      {mark.text}
    </text>
  );
}
