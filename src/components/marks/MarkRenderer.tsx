/**
 * Mark Renderers - Display different types of marks
 */

import type { Mark } from '../../types';
import { Check, X } from 'lucide-react';

interface MarkRendererProps {
  mark: Mark;
  size?: number;
}

export function MarkRenderer({ mark, size = 40 }: MarkRendererProps) {
  const opacity = mark.isPermanent === false ? 0.5 : 1;

  switch (mark.type) {
    case 'checkbox':
      return (
        <div className="absolute inset-0 flex items-center justify-center" style={{ opacity }}>
          {mark.state === 'checked' && (
            <Check className="w-3/4 h-3/4 text-green-600" strokeWidth={3} />
          )}
          {mark.state === 'crossed' && (
            <X className="w-3/4 h-3/4 text-red-600" strokeWidth={3} />
          )}
        </div>
      );

    case 'number':
      return (
        <div
          className="absolute inset-0 flex items-center justify-center font-bold text-gray-900"
          style={{ fontSize: `${size * 0.6}px`, opacity }}
        >
          {mark.value}
        </div>
      );

    case 'color':
      return (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: mark.color,
            opacity: mark.opacity || 0.5,
          }}
        />
      );

    case 'circle':
      return (
        <div className="absolute inset-0 flex items-center justify-center" style={{ opacity }}>
          <svg viewBox="0 0 100 100" className="w-3/4 h-3/4">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            />
            {mark.state === 'half' && (
              <path d="M 50 5 A 45 45 0 0 1 50 95 Z" fill="currentColor" />
            )}
            {mark.state === 'full' && (
              <circle cx="50" cy="50" r="45" fill="currentColor" />
            )}
          </svg>
        </div>
      );

    case 'symbol':
      return (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity, color: mark.color || 'currentColor' }}
        >
          <span style={{ fontSize: `${size * 0.6}px` }}>{mark.symbol}</span>
        </div>
      );

    case 'text':
      return (
        <div
          className="absolute inset-0 flex items-center justify-center text-xs font-medium p-1 overflow-hidden"
          style={{ opacity }}
        >
          {mark.text}
        </div>
      );

    case 'line':
      // Line marks are rendered differently, at the sheet level
      return null;

    default:
      return null;
  }
}
