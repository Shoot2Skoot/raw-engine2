/**
 * Unified mark renderer - dispatches to appropriate mark component
 */

import type { Mark } from '../../types';
import { CheckboxMark } from './CheckboxMark';
import { NumberMark } from './NumberMark';
import { ColorMark } from './ColorMark';
import { CircleMark } from './CircleMark';
import { SymbolMark } from './SymbolMark';
import { TextMark } from './TextMark';

interface MarkRendererProps {
  mark: Mark;
  size: number;
}

export function MarkRenderer({ mark, size }: MarkRendererProps) {
  switch (mark.type) {
    case 'checkbox':
      return <CheckboxMark mark={mark} size={size} />;
    case 'number':
      return <NumberMark mark={mark} size={size} />;
    case 'color':
      return <ColorMark mark={mark} />;
    case 'circle':
      return <CircleMark mark={mark} size={size} />;
    case 'symbol':
      return <SymbolMark mark={mark} size={size} />;
    case 'text':
      return <TextMark mark={mark} size={size} />;
    case 'line':
      // Lines are rendered separately at the sheet level
      return null;
    default:
      return null;
  }
}
