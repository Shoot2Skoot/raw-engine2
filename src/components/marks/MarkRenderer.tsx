/**
 * Mark Renderer
 * Routes to appropriate mark renderer based on type
 */

import React from 'react';
import { Mark } from '../../types';
import { CheckboxMarkRenderer } from './CheckboxMarkRenderer';
import { NumberMarkRenderer } from './NumberMarkRenderer';
import { ColorMarkRenderer } from './ColorMarkRenderer';
import { CircleMarkRenderer } from './CircleMarkRenderer';

interface MarkRendererProps {
  mark: Mark;
  size: number;
}

export const MarkRenderer: React.FC<MarkRendererProps> = ({ mark, size }) => {
  switch (mark.type) {
    case 'checkbox':
      return <CheckboxMarkRenderer mark={mark} size={size} />;
    case 'number':
      return <NumberMarkRenderer mark={mark} size={size} />;
    case 'color':
      return <ColorMarkRenderer mark={mark} size={size} />;
    case 'circle':
      return <CircleMarkRenderer mark={mark} size={size} />;
    case 'symbol':
      // TODO: Implement symbol renderer
      return null;
    case 'text':
      // TODO: Implement text renderer
      return null;
    case 'line':
      // Line marks are rendered differently (not per hotspot)
      return null;
    default:
      return null;
  }
};
