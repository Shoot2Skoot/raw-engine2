/**
 * Unified mark renderer component
 */

import type { Mark } from '../../types';
import { CheckboxMark } from './CheckboxMark';
import { NumberMark } from './NumberMark';
import { ColorMark } from './ColorMark';
import { CircleMark } from './CircleMark';
import { SymbolMark } from './SymbolMark';
import { TextMark } from './TextMark';

interface MarkRendererProps {
  marks: Mark[];
  cellSize?: number;
}

/**
 * Renders all marks for a hotspot
 */
export function MarkRenderer({ marks, cellSize = 40 }: MarkRendererProps) {
  if (marks.length === 0) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative flex items-center justify-center" style={{ width: cellSize, height: cellSize }}>
        {marks.map(mark => {
          switch (mark.type) {
            case 'checkbox':
              return <CheckboxMark key={mark.id} mark={mark} size={cellSize * 0.8} />;

            case 'number':
              return <NumberMark key={mark.id} mark={mark} size={cellSize} />;

            case 'color':
              return <ColorMark key={mark.id} mark={mark} width={cellSize} height={cellSize} />;

            case 'circle':
              return <CircleMark key={mark.id} mark={mark} size={cellSize * 0.8} />;

            case 'symbol':
              return <SymbolMark key={mark.id} mark={mark} size={cellSize * 0.6} />;

            case 'text':
              return <TextMark key={mark.id} mark={mark} maxWidth={cellSize * 0.9} />;

            case 'line':
              // Lines are rendered separately at the sheet level
              return null;

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
