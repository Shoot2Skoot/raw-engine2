import React from 'react';
import { Mark } from '../../types';
import { CheckboxMarkRenderer } from './CheckboxMarkRenderer';
import { NumberMarkRenderer } from './NumberMarkRenderer';
import { ColorMarkRenderer } from './ColorMarkRenderer';
import { CircleMarkRenderer } from './CircleMarkRenderer';
import { TextMarkRenderer } from './TextMarkRenderer';

interface MarkRendererProps {
  mark: Mark;
  size?: number;
}

/**
 * Main mark renderer - delegates to specific mark type renderers
 */
export function MarkRenderer({ mark, size = 50 }: MarkRendererProps) {
  switch (mark.type) {
    case 'checkbox':
      return <CheckboxMarkRenderer mark={mark} size={size} />;

    case 'number':
      return <NumberMarkRenderer mark={mark} size={size} />;

    case 'color':
      return <ColorMarkRenderer mark={mark} />;

    case 'circle':
      return <CircleMarkRenderer mark={mark} size={size} />;

    case 'text':
      return <TextMarkRenderer mark={mark} size={size} />;

    case 'symbol':
      // TODO: Implement symbol renderer with icon library
      return null;

    case 'line':
      // Lines are rendered differently (not in individual hotspots)
      return null;

    default:
      return null;
  }
}
