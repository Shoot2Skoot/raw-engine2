/**
 * Universal mark renderer - handles all mark types
 */

import type { Mark } from '../../types';
import { MarkType } from '../../types';
import { CheckboxMark } from './CheckboxMark';
import { NumberMark } from './NumberMark';
import { ColorFillMark } from './ColorFillMark';
import { CircleMark } from './CircleMark';

interface MarkRendererProps {
  mark: Mark;
  size?: number;
}

export function MarkRenderer({ mark, size = 32 }: MarkRendererProps) {
  switch (mark.type) {
    case MarkType.Checkbox:
      return <CheckboxMark mark={mark as any} size={size} />;
    case MarkType.Number:
      return <NumberMark mark={mark as any} size={size} />;
    case MarkType.ColorFill:
      return <ColorFillMark mark={mark as any} width={size} height={size} />;
    case MarkType.Circle:
      return <CircleMark mark={mark as any} size={size} />;
    case MarkType.Text:
      return (
        <div
          className="flex items-center justify-center text-sm"
          style={{
            opacity: mark.temporary ? 0.5 : 1,
            fontSize: (mark as any).fontSize || size * 0.4,
          }}
        >
          {(mark as any).value}
        </div>
      );
    case MarkType.Symbol:
      return (
        <div
          className="flex items-center justify-center"
          style={{
            opacity: mark.temporary ? 0.5 : 1,
            color: (mark as any).color,
            fontSize: size * ((mark as any).scale || 1),
          }}
        >
          {/* Placeholder for symbol rendering */}
          ★
        </div>
      );
    default:
      return null;
  }
}
