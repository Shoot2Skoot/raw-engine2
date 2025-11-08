import type { Mark } from '../../types';
import { CheckboxMark } from './CheckboxMark';
import { NumberMark } from './NumberMark';
import { ColorMark } from './ColorMark';
import { CircleMark } from './CircleMark';
import { TextMark } from './TextMark';

interface MarkRendererProps {
  marks: Mark[];
  
}

export function MarkRenderer({ marks }: MarkRendererProps) {
  // Sort marks so color fills appear first (behind other marks)
  const sortedMarks = [...marks].sort((a, b) => {
    if (a.type === 'color' && b.type !== 'color') return -1;
    if (a.type !== 'color' && b.type === 'color') return 1;
    return 0;
  });

  return (
    <>
      {sortedMarks.map((mark) => {
        switch (mark.type) {
          case 'checkbox':
            return <CheckboxMark key={mark.id} mark={mark} />;
          case 'number':
            return <NumberMark key={mark.id} mark={mark} />;
          case 'color':
            return <ColorMark key={mark.id} mark={mark} />;
          case 'circle':
            return <CircleMark key={mark.id} mark={mark} />;
          case 'text':
            return <TextMark key={mark.id} mark={mark} />;
          default:
            return null;
        }
      })}
    </>
  );
}
