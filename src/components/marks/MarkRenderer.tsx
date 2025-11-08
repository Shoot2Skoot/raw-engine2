/**
 * Mark renderer - renders different types of marks
 */


import type { Mark } from '../../types';
import { Check, X, Circle, CircleDot } from 'lucide-react';

interface MarkRendererProps {
  mark: Mark;
}

export function MarkRenderer({ mark }: MarkRendererProps) {
  const isPencil = 'isPencil' in mark ? mark.isPencil : false;
  const opacity = isPencil ? 0.5 : 1;

  switch (mark.type) {
    case 'checkbox':
      return (
        <div className="w-full h-full flex items-center justify-center" style={{ opacity }}>
          {mark.state === 'checked' && <Check className="w-6 h-6 text-green-600" />}
          {mark.state === 'crossed' && <X className="w-6 h-6 text-red-600" />}
        </div>
      );

    case 'number':
      return (
        <div
          className="w-full h-full flex items-center justify-center font-bold text-lg"
          style={{ opacity, color: isPencil ? '#888' : '#000' }}
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
            opacity: mark.opacity ?? 0.6
          }}
        />
      );

    case 'circle':
      return (
        <div className="w-full h-full flex items-center justify-center" style={{ opacity }}>
          {mark.state === 'empty' && <Circle className="w-8 h-8 text-gray-400" />}
          {mark.state === 'half' && (
            <svg width="32" height="32" viewBox="0 0 32 32" className="text-blue-500">
              <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M 16 2 A 14 14 0 0 1 16 30 Z" fill="currentColor" />
            </svg>
          )}
          {mark.state === 'full' && <CircleDot className="w-8 h-8 text-blue-600" fill="currentColor" />}
        </div>
      );

    case 'symbol':
      return (
        <div
          className="w-full h-full flex items-center justify-center text-2xl"
          style={{ opacity, color: mark.color ?? '#000' }}
        >
          {mark.symbol}
        </div>
      );

    case 'text':
      return (
        <div
          className="w-full h-full flex items-center justify-center text-sm font-medium px-1 text-center break-words"
          style={{ opacity, color: isPencil ? '#888' : '#000' }}
        >
          {mark.text}
        </div>
      );

    case 'line':
      // Lines are rendered differently (connecting two hotspots)
      // For now, we'll skip rendering them in the hotspot
      return null;

    default:
      return null;
  }
}
