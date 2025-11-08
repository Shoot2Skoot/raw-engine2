/**
 * Mark renderers - Render different mark types
 */

import React from 'react';
import type {
  Mark,
  CheckboxMark,
  NumberMark,
  ColorMark,
  CircleMark,
  SymbolMark,
  TextMark,
  FillMark,
  Hotspot,
} from '../../types';

interface MarkRendererProps {
  mark: Mark;
  hotspot: Hotspot;
}

export const MarkRenderer: React.FC<MarkRendererProps> = ({ mark, hotspot }) => {
  const opacity = mark.isPencil ? 0.5 : 1;

  switch (mark.type) {
    case 'checkbox':
      return <CheckboxMarkRenderer mark={mark} hotspot={hotspot} opacity={opacity} />;
    case 'number':
      return <NumberMarkRenderer mark={mark} hotspot={hotspot} opacity={opacity} />;
    case 'color':
      return <ColorMarkRenderer mark={mark} hotspot={hotspot} opacity={opacity} />;
    case 'circle':
      return <CircleMarkRenderer mark={mark} hotspot={hotspot} opacity={opacity} />;
    case 'symbol':
      return <SymbolMarkRenderer mark={mark} hotspot={hotspot} opacity={opacity} />;
    case 'text':
      return <TextMarkRenderer mark={mark} hotspot={hotspot} opacity={opacity} />;
    case 'fill':
      return <FillMarkRenderer mark={mark} hotspot={hotspot} opacity={opacity} />;
    default:
      return null;
  }
};

function getSize(hotspot: Hotspot, scale: number = 0.6): number {
  if (hotspot.shape === 'rect') {
    return Math.min(hotspot.width, hotspot.height) * scale;
  }
  if (hotspot.shape === 'circle') {
    return hotspot.radius * scale * 2;
  }
  return 20;
}

function getCenter(hotspot: Hotspot): { x: number; y: number } {
  if (hotspot.shape === 'rect') {
    return { x: hotspot.width / 2, y: hotspot.height / 2 };
  }
  return { x: 0, y: 0 };
}

const CheckboxMarkRenderer: React.FC<{
  mark: CheckboxMark;
  hotspot: Hotspot;
  opacity: number;
}> = ({ hotspot, opacity }) => {
  if (mark.state === 'empty') return null;

  const size = getSize(hotspot, 0.6);
  const center = getCenter(hotspot);

  if (mark.state === 'checked') {
    return (
      <g opacity={opacity}>
        <path
          d={`M ${center.x - size / 2},${center.y} L ${center.x - size / 6},${center.y + size / 3} L ${center.x + size / 2},${center.y - size / 3}`}
          stroke="#10b981"
          strokeWidth={size / 8}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    );
  }

  if (mark.state === 'crossed') {
    return (
      <g opacity={opacity}>
        <line
          x1={center.x - size / 2}
          y1={center.y - size / 2}
          x2={center.x + size / 2}
          y2={center.y + size / 2}
          stroke="#ef4444"
          strokeWidth={size / 10}
          strokeLinecap="round"
        />
        <line
          x1={center.x + size / 2}
          y1={center.y - size / 2}
          x2={center.x - size / 2}
          y2={center.y + size / 2}
          stroke="#ef4444"
          strokeWidth={size / 10}
          strokeLinecap="round"
        />
      </g>
    );
  }

  return null;
};

const NumberMarkRenderer: React.FC<{
  mark: NumberMark;
  hotspot: Hotspot;
  opacity: number;
}> = ({ hotspot, opacity }) => {
  const fontSize = getSize(hotspot, 0.5);
  const center = getCenter(hotspot);

  return (
    <text
      x={center.x}
      y={center.y}
      fontSize={fontSize}
      fontFamily="system-ui, sans-serif"
      fontWeight="600"
      fill={mark.isPencil ? '#9ca3af' : '#1f2937'}
      textAnchor="middle"
      dominantBaseline="central"
      opacity={opacity}
    >
      {mark.value}
    </text>
  );
};

const ColorMarkRenderer: React.FC<{
  mark: ColorMark;
  hotspot: Hotspot;
  opacity: number;
}> = ({ hotspot, opacity }) => {
  if (hotspot.shape === 'rect') {
    return (
      <rect
        x={2}
        y={2}
        width={hotspot.width - 4}
        height={hotspot.height - 4}
        fill={mark.color}
        opacity={opacity * 0.7}
        rx={2}
      />
    );
  }

  if (hotspot.shape === 'circle') {
    return (
      <circle
        cx={0}
        cy={0}
        r={hotspot.radius - 2}
        fill={mark.color}
        opacity={opacity * 0.7}
      />
    );
  }

  return null;
};

const CircleMarkRenderer: React.FC<{
  mark: CircleMark;
  hotspot: Hotspot;
  opacity: number;
}> = ({ hotspot, opacity }) => {
  if (mark.state === 'empty') return null;

  const radius = getSize(hotspot, 0.3);
  const center = getCenter(hotspot);

  if (mark.state === 'full') {
    return (
      <circle
        cx={center.x}
        cy={center.y}
        r={radius}
        fill="#3b82f6"
        opacity={opacity}
      />
    );
  }

  if (mark.state === 'half') {
    return (
      <g opacity={opacity}>
        <circle cx={center.x} cy={center.y} r={radius} fill="none" stroke="#3b82f6" strokeWidth={2} />
        <path
          d={`M ${center.x},${center.y - radius} A ${radius},${radius} 0 0,0 ${center.x},${center.y + radius} Z`}
          fill="#3b82f6"
        />
      </g>
    );
  }

  return null;
};

const SymbolMarkRenderer: React.FC<{
  mark: SymbolMark;
  hotspot: Hotspot;
  opacity: number;
}> = ({ hotspot, opacity }) => {
  const size = getSize(hotspot, 0.6);
  const center = getCenter(hotspot);

  return (
    <text
      x={center.x}
      y={center.y}
      fontSize={size}
      textAnchor="middle"
      dominantBaseline="central"
      opacity={opacity}
    >
      ★
    </text>
  );
};

const TextMarkRenderer: React.FC<{
  mark: TextMark;
  hotspot: Hotspot;
  opacity: number;
}> = ({ hotspot, opacity }) => {
  const fontSize = getSize(hotspot, 0.3);
  const center = getCenter(hotspot);

  return (
    <text
      x={center.x}
      y={center.y}
      fontSize={fontSize}
      fontFamily="system-ui, sans-serif"
      fill="#1f2937"
      textAnchor="middle"
      dominantBaseline="central"
      opacity={opacity}
    >
      {mark.value}
    </text>
  );
};

const FillMarkRenderer: React.FC<{
  mark: FillMark;
  hotspot: Hotspot;
  opacity: number;
}> = ({ hotspot, opacity }) => {
  const fillOpacity = (mark.opacity || 0.5) * opacity;

  if (hotspot.shape === 'rect') {
    return (
      <rect
        x={0}
        y={0}
        width={hotspot.width}
        height={hotspot.height}
        fill={mark.color}
        opacity={fillOpacity}
      />
    );
  }

  if (hotspot.shape === 'circle') {
    return (
      <circle
        cx={0}
        cy={0}
        r={hotspot.radius}
        fill={mark.color}
        opacity={fillOpacity}
      />
    );
  }

  if (hotspot.shape === 'polygon') {
    const points = hotspot.points.map((p) => `${p.x},${p.y}`).join(' ');
    return <polygon points={points} fill={mark.color} opacity={fillOpacity} />;
  }

  return null;
};
