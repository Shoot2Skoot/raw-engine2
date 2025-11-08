/**
 * MarkRenderer - renders different mark types
 */

import React from 'react';
import type { Mark } from '../../types';
import { CheckboxMarkView } from './CheckboxMarkView';
import { NumberMarkView } from './NumberMarkView';
import { ColorMarkView } from './ColorMarkView';
import { CircleMarkView } from './CircleMarkView';
import { SymbolMarkView } from './SymbolMarkView';
import { TextMarkView } from './TextMarkView';

interface MarkRendererProps {
  mark: Mark;
}

export const MarkRenderer: React.FC<MarkRendererProps> = ({ mark }) => {
  const baseClassName = mark.isPencil ? 'opacity-50' : '';

  switch (mark.type) {
    case 'checkbox':
      return <CheckboxMarkView mark={mark} className={baseClassName} />;
    case 'number':
      return <NumberMarkView mark={mark} className={baseClassName} />;
    case 'color':
      return <ColorMarkView mark={mark} className={baseClassName} />;
    case 'circle':
      return <CircleMarkView mark={mark} className={baseClassName} />;
    case 'symbol':
      return <SymbolMarkView mark={mark} className={baseClassName} />;
    case 'text':
      return <TextMarkView mark={mark} className={baseClassName} />;
    default:
      return null;
  }
};
