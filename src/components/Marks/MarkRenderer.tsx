import type { Mark } from '../../types';
import { CheckboxMark } from './CheckboxMark';
import { NumberMark } from './NumberMark';
import { ColorMark } from './ColorMark';
import { CircleMark } from './CircleMark';
import { TextMark } from './TextMark';

interface MarkRendererProps {
  mark: Mark;
  size?: number;
}

/**
 * Renders the appropriate mark component based on mark type
 */
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
    case 'text':
      return <TextMark mark={mark} size={size} />;
    case 'symbol':
      // TODO: Implement symbol marks
      return null;
    case 'line':
      // Lines are rendered differently (between hotspots, not within)
      return null;
    case 'fill':
      // Fills are rendered at the sheet level
      return null;
    default:
      return null;
  }
}
