/**
 * Component for rendering different mark types
 */

import type { Mark, Hotspot } from '../../types';
import { getHotspotCenter, getHotspotBounds } from '../../engine/regions';
import { Check, X } from 'lucide-react';

interface MarkRendererProps {
  mark: Mark;
  hotspot: Hotspot;
}

export function MarkRenderer({ mark, hotspot }: MarkRendererProps) {
  const bounds = getHotspotBounds(hotspot);
  const center = getHotspotCenter(hotspot);

  // Apply opacity for pencil marks
  const opacity = mark.permanence === 'pencil' ? 0.5 : 1;

  switch (mark.type) {
    case 'checkbox':
      return <CheckboxMarkRenderer mark={mark} center={center} bounds={bounds} opacity={opacity} />;

    case 'number':
      return <NumberMarkRenderer mark={mark} center={center} bounds={bounds} opacity={opacity} />;

    case 'color':
      return <ColorMarkRenderer mark={mark} bounds={bounds} />;

    case 'circle':
      return <CircleMarkRenderer mark={mark} center={center} bounds={bounds} opacity={opacity} />;

    case 'symbol':
      return <SymbolMarkRenderer mark={mark} center={center} bounds={bounds} opacity={opacity} />;

    case 'text':
      return <TextMarkRenderer mark={mark} center={center} bounds={bounds} opacity={opacity} />;

    case 'line':
      // Lines are rendered separately in LineMarkRenderer
      return null;

    default:
      return null;
  }
}

// ============================================================================
// CHECKBOX MARK
// ============================================================================

interface CheckboxMarkRendererProps {
  mark: Extract<Mark, { type: 'checkbox' }>;
  center: { x: number; y: number };
  bounds: { width: number; height: number };
  opacity: number;
}

function CheckboxMarkRenderer({ mark, center, bounds, opacity }: CheckboxMarkRendererProps) {
  const size = Math.min(bounds.width, bounds.height) * 0.6;

  if (mark.state === 'empty') {
    return null;
  }

  return (
    <g opacity={opacity}>
      {mark.state === 'checked' && (
        <Check
          x={center.x - size / 2}
          y={center.y - size / 2}
          width={size}
          height={size}
          stroke="currentColor"
          strokeWidth={2}
          fill="none"
        />
      )}
      {mark.state === 'crossed' && (
        <X
          x={center.x - size / 2}
          y={center.y - size / 2}
          width={size}
          height={size}
          stroke="currentColor"
          strokeWidth={2}
        />
      )}
    </g>
  );
}

// ============================================================================
// NUMBER MARK
// ============================================================================

interface NumberMarkRendererProps {
  mark: Extract<Mark, { type: 'number' }>;
  center: { x: number; y: number };
  bounds: { width: number; height: number };
  opacity: number;
}

function NumberMarkRenderer({ mark, center, bounds, opacity }: NumberMarkRendererProps) {
  const fontSize = Math.min(bounds.width, bounds.height) * 0.6;

  return (
    <text
      x={center.x}
      y={center.y}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={fontSize}
      fontWeight="600"
      fill="currentColor"
      opacity={opacity}
    >
      {mark.value}
    </text>
  );
}

// ============================================================================
// COLOR MARK
// ============================================================================

interface ColorMarkRendererProps {
  mark: Extract<Mark, { type: 'color' }>;
  bounds: { x: number; y: number; width: number; height: number };
}

function ColorMarkRenderer({ mark, bounds }: ColorMarkRendererProps) {
  const opacity = mark.opacity ?? 0.6;

  return (
    <rect
      x={bounds.x}
      y={bounds.y}
      width={bounds.width}
      height={bounds.height}
      fill={mark.color}
      opacity={opacity}
      pointerEvents="none"
    />
  );
}

// ============================================================================
// CIRCLE MARK
// ============================================================================

interface CircleMarkRendererProps {
  mark: Extract<Mark, { type: 'circle' }>;
  center: { x: number; y: number };
  bounds: { width: number; height: number };
  opacity: number;
}

function CircleMarkRenderer({ mark, center, bounds, opacity }: CircleMarkRendererProps) {
  const radius = Math.min(bounds.width, bounds.height) * 0.3;

  if (mark.state === 'empty') {
    return null;
  }

  return (
    <g opacity={opacity}>
      {mark.state === 'half' && (
        <>
          <circle
            cx={center.x}
            cy={center.y}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          />
          <path
            d={`M ${center.x},${center.y - radius} A ${radius},${radius} 0 0,1 ${center.x},${center.y + radius} Z`}
            fill="currentColor"
          />
        </>
      )}
      {mark.state === 'full' && (
        <circle
          cx={center.x}
          cy={center.y}
          r={radius}
          fill="currentColor"
        />
      )}
    </g>
  );
}

// ============================================================================
// SYMBOL MARK
// ============================================================================

interface SymbolMarkRendererProps {
  mark: Extract<Mark, { type: 'symbol' }>;
  center: { x: number; y: number };
  bounds: { width: number; height: number };
  opacity: number;
}

function SymbolMarkRenderer({ mark, center, bounds, opacity }: SymbolMarkRendererProps) {
  const size = Math.min(bounds.width, bounds.height) * 0.5;

  // For now, render symbol ID as text
  // In a real implementation, you'd map symbolId to actual icons
  return (
    <text
      x={center.x}
      y={center.y}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={size}
      fill="currentColor"
      opacity={opacity}
    >
      {getSymbolIcon(mark.symbolId)}
    </text>
  );
}

function getSymbolIcon(symbolId: string): string {
  const symbols: Record<string, string> = {
    star: '★',
    diamond: '◆',
    heart: '❤',
    square: '■',
    circle: '●',
    triangle: '▲',
    water: '💧',
    plant: '🌱',
    robot: '🤖',
    astronaut: '👨‍🚀',
  };

  return symbols[symbolId] || symbolId;
}

// ============================================================================
// TEXT MARK
// ============================================================================

interface TextMarkRendererProps {
  mark: Extract<Mark, { type: 'text' }>;
  center: { x: number; y: number };
  bounds: { width: number; height: number };
  opacity: number;
}

function TextMarkRenderer({ mark, center, bounds, opacity }: TextMarkRendererProps) {
  const fontSize = Math.min(bounds.width, bounds.height) * 0.4;

  return (
    <text
      x={center.x}
      y={center.y}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={fontSize}
      fill="currentColor"
      opacity={opacity}
      style={{ userSelect: 'none' }}
    >
      {mark.text}
    </text>
  );
}
