/**
 * Mark Renderer - Renders different types of marks on hotspots
 */

import type { Mark, Hotspot } from '../../types';
import { Check, X } from 'lucide-react';

interface MarkRendererProps {
  mark: Mark;
  hotspot: Hotspot;
}

export function MarkRenderer({ mark, hotspot }: MarkRendererProps) {
  const isPencil = mark.permanence === 'pencil';

  switch (mark.type) {
    case 'checkbox':
      return (
        <CheckboxMarkRenderer
          mark={mark}
          hotspot={hotspot}
          isPencil={isPencil}
        />
      );

    case 'number':
      return (
        <NumberMarkRenderer
          mark={mark}
          hotspot={hotspot}
          isPencil={isPencil}
        />
      );

    case 'color':
      return (
        <ColorMarkRenderer
          mark={mark}
          hotspot={hotspot}
          isPencil={isPencil}
        />
      );

    case 'circle':
      return (
        <CircleMarkRenderer
          mark={mark}
          hotspot={hotspot}
          isPencil={isPencil}
        />
      );

    case 'symbol':
      return (
        <SymbolMarkRenderer
          mark={mark}
          hotspot={hotspot}
          isPencil={isPencil}
        />
      );

    case 'text':
      return (
        <TextMarkRenderer
          mark={mark}
          hotspot={hotspot}
          isPencil={isPencil}
        />
      );

    default:
      return null;
  }
}

function CheckboxMarkRenderer({ mark, hotspot, isPencil }: any) {
  const { state } = mark;
  const shape = hotspot.shape as any;

  if (shape.type !== 'rect') return null;

  const size = Math.min(shape.width, shape.height) * 0.7;

  return (
    <g className={isPencil ? 'opacity-50' : 'opacity-100'}>
      {state === 'checked' && (
        <Check
          x={shape.x + shape.width / 2 - size / 2}
          y={shape.y + shape.height / 2 - size / 2}
          width={size}
          height={size}
          className="stroke-green-600 stroke-[3]"
        />
      )}
      {state === 'crossed' && (
        <X
          x={shape.x + shape.width / 2 - size / 2}
          y={shape.y + shape.height / 2 - size / 2}
          width={size}
          height={size}
          className="stroke-red-600 stroke-[3]"
        />
      )}
    </g>
  );
}

function NumberMarkRenderer({ mark, hotspot, isPencil }: any) {
  const { value } = mark;
  const shape = hotspot.shape as any;

  if (shape.type !== 'rect') return null;

  const fontSize = Math.min(shape.width, shape.height) * 0.6;

  return (
    <text
      x={shape.x + shape.width / 2}
      y={shape.y + shape.height / 2}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={fontSize}
      fontWeight="bold"
      fill={isPencil ? '#999' : '#000'}
      className={isPencil ? 'opacity-50' : 'opacity-100'}
    >
      {value}
    </text>
  );
}

function ColorMarkRenderer({ mark, hotspot, isPencil }: any) {
  const { color, opacity } = mark;
  const shape = hotspot.shape as any;

  if (shape.type === 'rect') {
    return (
      <rect
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        fill={color}
        opacity={(opacity || 0.5) * (isPencil ? 0.5 : 1)}
      />
    );
  } else if (shape.type === 'circle') {
    return (
      <circle
        cx={shape.center.x}
        cy={shape.center.y}
        r={shape.radius}
        fill={color}
        opacity={(opacity || 0.5) * (isPencil ? 0.5 : 1)}
      />
    );
  } else if (shape.type === 'polygon') {
    const points = shape.vertices.map((v: any) => `${v.x},${v.y}`).join(' ');
    return (
      <polygon
        points={points}
        fill={color}
        opacity={(opacity || 0.5) * (isPencil ? 0.5 : 1)}
      />
    );
  }

  return null;
}

function CircleMarkRenderer({ mark, hotspot, isPencil }: any) {
  const { state } = mark;
  const shape = hotspot.shape as any;

  if (shape.type !== 'rect') return null;

  const cx = shape.x + shape.width / 2;
  const cy = shape.y + shape.height / 2;
  const r = Math.min(shape.width, shape.height) * 0.35;

  return (
    <g className={isPencil ? 'opacity-50' : 'opacity-100'}>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={state === 'full' ? '#000' : 'none'}
        stroke="#000"
        strokeWidth={2}
      />
      {state === 'half' && (
        <path
          d={`M ${cx},${cy - r} A ${r},${r} 0 0,1 ${cx},${cy + r} Z`}
          fill="#000"
        />
      )}
    </g>
  );
}

function SymbolMarkRenderer({ mark, hotspot, isPencil }: any) {
  const { symbol } = mark;
  const shape = hotspot.shape as any;

  if (shape.type !== 'rect') return null;

  const fontSize = Math.min(shape.width, shape.height) * 0.6;

  // For now, render symbol as text
  // In a full implementation, this would use actual icon components
  return (
    <text
      x={shape.x + shape.width / 2}
      y={shape.y + shape.height / 2}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={fontSize}
      fill={isPencil ? '#999' : '#000'}
      className={isPencil ? 'opacity-50' : 'opacity-100'}
    >
      {symbol}
    </text>
  );
}

function TextMarkRenderer({ mark, hotspot, isPencil }: any) {
  const { text } = mark;
  const shape = hotspot.shape as any;

  if (shape.type !== 'rect') return null;

  const fontSize = Math.min(shape.width, shape.height) * 0.4;

  return (
    <text
      x={shape.x + shape.width / 2}
      y={shape.y + shape.height / 2}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={fontSize}
      fill={isPencil ? '#999' : '#000'}
      className={isPencil ? 'opacity-50' : 'opacity-100'}
    >
      {text}
    </text>
  );
}
