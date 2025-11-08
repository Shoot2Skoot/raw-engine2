/**
 * Mark Renderer - renders the appropriate mark component based on mark type
 */

import type { Mark } from '../../types';
import { CheckboxMark } from './CheckboxMark';
import { NumberMark } from './NumberMark';
import { ColorMark } from './ColorMark';
import { CircleMark } from './CircleMark';
import { SymbolMark } from './SymbolMark';
import { TextMark } from './TextMark';
import { LineMark } from './LineMark';

interface MarkRendererProps {
  mark: Mark;
  size?: number;
  width?: number;
  height?: number;
  // For line marks
  fromX?: number;
  fromY?: number;
  toX?: number;
  toY?: number;
}

export function MarkRenderer({
  mark,
  size = 32,
  width = size,
  height = size,
  fromX = 0,
  fromY = 0,
  toX = 0,
  toY = 0,
}: MarkRendererProps) {
  switch (mark.type) {
    case 'checkbox':
      return <CheckboxMark mark={mark} size={size} />;

    case 'number':
      return <NumberMark mark={mark} size={size} />;

    case 'color':
      return <ColorMark mark={mark} width={width} height={height} />;

    case 'circle':
      return <CircleMark mark={mark} size={size} />;

    case 'symbol':
      return <SymbolMark mark={mark} size={size} />;

    case 'text':
      return <TextMark mark={mark} size={size} />;

    case 'line':
      return (
        <LineMark
          mark={mark}
          fromX={fromX}
          fromY={fromY}
          toX={toX}
          toY={toY}
        />
      );

    default:
      return null;
  }
}
