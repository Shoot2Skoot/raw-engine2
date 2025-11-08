/**
 * MarkRenderer
 * Renders different mark types
 */

import React from 'react';
import type { Mark } from '../../types';

interface MarkRendererProps {
  mark: Mark;
  size: number;
}

export const MarkRenderer: React.FC<MarkRendererProps> = ({ mark, size }) => {
  const opacity = mark.mode === 'pencil' ? 0.5 : 1.0;

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
    case 'line':
      return null; // Lines are rendered differently (between hotspots)
    default:
      return null;
  }
};

// Checkbox Mark Renderer
const CheckboxMarkRenderer: React.FC<{
  mark: Extract<Mark, { type: 'checkbox' }>;
  size: number;
  opacity: number;
}> = ({ mark, size, opacity }) => {
  const boxSize = size * 0.7;
  const offset = -boxSize / 2;

  if (mark.state === 'empty') {
    return (
      <rect
        x={offset}
        y={offset}
        width={boxSize}
        height={boxSize}
        fill="none"
        stroke="#000"
        strokeWidth={2}
        opacity={opacity}
      />
    );
  }

  if (mark.state === 'checked') {
    return (
      <g opacity={opacity}>
        <rect
          x={offset}
          y={offset}
          width={boxSize}
          height={boxSize}
          fill="none"
          stroke="#000"
          strokeWidth={2}
        />
        <path
          d={`M ${offset + boxSize * 0.2} ${offset + boxSize * 0.5}
              L ${offset + boxSize * 0.4} ${offset + boxSize * 0.7}
              L ${offset + boxSize * 0.8} ${offset + boxSize * 0.3}`}
          stroke="#000"
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    );
  }

  if (mark.state === 'crossed') {
    return (
      <g opacity={opacity}>
        <rect
          x={offset}
          y={offset}
          width={boxSize}
          height={boxSize}
          fill="none"
          stroke="#000"
          strokeWidth={2}
        />
        <line
          x1={offset + boxSize * 0.2}
          y1={offset + boxSize * 0.2}
          x2={offset + boxSize * 0.8}
          y2={offset + boxSize * 0.8}
          stroke="#000"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <line
          x1={offset + boxSize * 0.8}
          y1={offset + boxSize * 0.2}
          x2={offset + boxSize * 0.2}
          y2={offset + boxSize * 0.8}
          stroke="#000"
          strokeWidth={3}
          strokeLinecap="round"
        />
      </g>
    );
  }

  return null;
};

// Number Mark Renderer
const NumberMarkRenderer: React.FC<{
  mark: Extract<Mark, { type: 'number' }>;
  size: number;
  opacity: number;
}> = ({ mark, size, opacity }) => {
  return (
    <text
      x={0}
      y={0}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={size * 0.6}
      fontWeight="bold"
      fill="#000"
      opacity={opacity}
    >
      {mark.value}
    </text>
  );
};

// Color Mark Renderer
const ColorMarkRenderer: React.FC<{
  mark: Extract<Mark, { type: 'color' }>;
  size: number;
  opacity: number;
}> = ({ mark, size, opacity }) => {
  const squareSize = size * 0.9;
  const offset = -squareSize / 2;

  return (
    <rect
      x={offset}
      y={offset}
      width={squareSize}
      height={squareSize}
      fill={mark.color}
      opacity={mark.opacity * opacity}
      rx={2}
    />
  );
};

// Circle Mark Renderer
const CircleMarkRenderer: React.FC<{
  mark: Extract<Mark, { type: 'circle' }>;
  size: number;
  opacity: number;
}> = ({ mark, size, opacity }) => {
  const radius = size * 0.4;

  if (mark.state === 'empty') {
    return <circle cx={0} cy={0} r={radius} fill="none" stroke="#000" strokeWidth={2} opacity={opacity} />;
  }

  if (mark.state === 'half') {
    return (
      <g opacity={opacity}>
        <circle cx={0} cy={0} r={radius} fill="none" stroke="#000" strokeWidth={2} />
        <path
          d={`M 0 ${-radius} A ${radius} ${radius} 0 0 1 0 ${radius} Z`}
          fill="#000"
          stroke="none"
        />
      </g>
    );
  }

  if (mark.state === 'full') {
    return <circle cx={0} cy={0} r={radius} fill="#000" opacity={opacity} />;
  }

  return null;
};

// Symbol Mark Renderer
const SymbolMarkRenderer: React.FC<{
  mark: Extract<Mark, { type: 'symbol' }>;
  size: number;
  opacity: number;
}> = ({ mark, size, opacity }) => {
  const symbolSize = size * 0.7;
  const color = mark.color || '#000';

  // Render different symbols based on symbolId
  const renderSymbol = () => {
    switch (mark.symbolId) {
      case 'star':
        return (
          <path
            d={`M 0 ${-symbolSize / 2}
                L ${symbolSize * 0.12} ${-symbolSize * 0.12}
                L ${symbolSize / 2} 0
                L ${symbolSize * 0.12} ${symbolSize * 0.12}
                L 0 ${symbolSize / 2}
                L ${-symbolSize * 0.12} ${symbolSize * 0.12}
                L ${-symbolSize / 2} 0
                L ${-symbolSize * 0.12} ${-symbolSize * 0.12}
                Z`}
            fill={color}
          />
        );
      case 'diamond':
        return (
          <path
            d={`M 0 ${-symbolSize / 2}
                L ${symbolSize / 2} 0
                L 0 ${symbolSize / 2}
                L ${-symbolSize / 2} 0
                Z`}
            fill={color}
          />
        );
      case 'heart':
        return (
          <path
            d={`M 0 ${symbolSize * 0.15}
                C 0 ${-symbolSize * 0.1}, ${-symbolSize / 2} ${-symbolSize * 0.35}, ${-symbolSize / 2} 0
                C ${-symbolSize / 2} ${symbolSize * 0.15}, 0 ${symbolSize * 0.35}, 0 ${symbolSize / 2}
                C 0 ${symbolSize * 0.35}, ${symbolSize / 2} ${symbolSize * 0.15}, ${symbolSize / 2} 0
                C ${symbolSize / 2} ${-symbolSize * 0.35}, 0 ${-symbolSize * 0.1}, 0 ${symbolSize * 0.15}
                Z`}
            fill={color}
          />
        );
      case 'square':
        return (
          <rect
            x={-symbolSize / 2}
            y={-symbolSize / 2}
            width={symbolSize}
            height={symbolSize}
            fill={color}
          />
        );
      default:
        // Default: filled circle
        return <circle cx={0} cy={0} r={symbolSize / 2} fill={color} />;
    }
  };

  return <g opacity={opacity}>{renderSymbol()}</g>;
};

// Text Mark Renderer
const TextMarkRenderer: React.FC<{
  mark: Extract<Mark, { type: 'text' }>;
  size: number;
  opacity: number;
}> = ({ mark, size, opacity }) => {
  return (
    <text
      x={0}
      y={0}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={Math.min(size * 0.4, 16)}
      fill="#000"
      opacity={opacity}
    >
      {mark.text}
    </text>
  );
};
