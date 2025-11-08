/**
 * Mark rendering components
 */

import React from 'react';
import { Check, X } from 'lucide-react';
import type { AnyMark } from '../types';

interface MarkProps {
  mark: AnyMark;
  width: number;
  height: number;
  customSymbols: Record<string, string>;
}

export const Mark: React.FC<MarkProps> = ({ mark, width, height, customSymbols }) => {
  const opacity = mark.isPermanent ? 1 : 0.5;
  const fontSize = Math.min(width, height) * 0.6;

  switch (mark.type) {
    case 'checkbox':
      return (
        <g opacity={opacity}>
          {mark.state === 'checked' && (
            <Check
              x={width * 0.1}
              y={height * 0.1}
              width={width * 0.8}
              height={height * 0.8}
              stroke="currentColor"
              strokeWidth={2}
            />
          )}
          {mark.state === 'crossed' && (
            <X
              x={width * 0.1}
              y={height * 0.1}
              width={width * 0.8}
              height={height * 0.8}
              stroke="currentColor"
              strokeWidth={2}
            />
          )}
        </g>
      );

    case 'number':
      return (
        <text
          x={width / 2}
          y={height / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={fontSize}
          fill="currentColor"
          opacity={opacity}
          fontWeight="bold"
        >
          {mark.value}
        </text>
      );

    case 'color':
      return (
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={mark.color}
          opacity={mark.isPermanent ? 0.7 : 0.35}
        />
      );

    case 'circle':
      return (
        <g opacity={opacity}>
          {mark.state === 'half' && (
            <path
              d={`M ${width / 2} ${height / 2} L ${width / 2} 0 A ${width / 2} ${height / 2} 0 0 1 ${width / 2} ${height} Z`}
              fill="currentColor"
            />
          )}
          {mark.state === 'full' && (
            <circle cx={width / 2} cy={height / 2} r={Math.min(width, height) * 0.4} fill="currentColor" />
          )}
        </g>
      );

    case 'symbol':
      const symbol = customSymbols[mark.symbolId] || mark.symbolId;
      return (
        <text
          x={width / 2}
          y={height / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={fontSize}
          opacity={opacity}
        >
          {symbol}
        </text>
      );

    case 'text':
      return (
        <text
          x={width / 2}
          y={height / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={fontSize * 0.5}
          fill="currentColor"
          opacity={opacity}
        >
          {mark.text}
        </text>
      );

    default:
      return null;
  }
};
