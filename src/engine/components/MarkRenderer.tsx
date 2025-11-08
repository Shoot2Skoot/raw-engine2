/**
 * Mark Renderer - Renders different mark types
 */

import React from 'react';
import { Check, X, Circle, Type } from 'lucide-react';
import type { Mark } from '../types';

interface MarkRendererProps {
  mark: Mark;
  size?: number;
}

export const MarkRenderer: React.FC<MarkRendererProps> = ({ mark, size = 40 }) => {
  const opacity = mark.permanence === 'pencil' ? 0.5 : 1;

  switch (mark.type) {
    case 'checkbox':
      return (
        <div className="flex items-center justify-center w-full h-full" style={{ opacity }}>
          {mark.state === 'checked' && <Check className="w-full h-full text-green-600" />}
          {mark.state === 'crossed' && <X className="w-full h-full text-red-600" />}
          {mark.state === 'empty' && (
            <div className="w-3/4 h-3/4 border-2 border-gray-400 rounded"></div>
          )}
        </div>
      );

    case 'number':
      return (
        <div
          className="flex items-center justify-center w-full h-full font-bold text-gray-900"
          style={{ opacity, fontSize: size * 0.6 }}
        >
          {mark.value}
        </div>
      );

    case 'color':
      return (
        <div
          className="w-full h-full"
          style={{
            backgroundColor: mark.color,
            opacity: mark.opacity ?? 0.5,
          }}
        ></div>
      );

    case 'circle':
      return (
        <div className="flex items-center justify-center w-full h-full" style={{ opacity }}>
          {mark.state === 'empty' && (
            <Circle className="w-3/4 h-3/4 text-gray-400" strokeWidth={2} />
          )}
          {mark.state === 'half' && (
            <svg className="w-3/4 h-3/4" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-400"
              />
              <path d="M 12 2 A 10 10 0 0 1 12 22 Z" fill="currentColor" className="text-blue-500" />
            </svg>
          )}
          {mark.state === 'full' && (
            <Circle className="w-3/4 h-3/4 text-blue-500" fill="currentColor" />
          )}
        </div>
      );

    case 'symbol':
      return (
        <div className="flex items-center justify-center w-full h-full" style={{ opacity }}>
          <Type className="w-2/3 h-2/3" style={{ color: mark.color || '#000' }} />
        </div>
      );

    case 'text':
      return (
        <div
          className="flex items-center justify-center w-full h-full text-gray-900 px-1"
          style={{ opacity, fontSize: size * 0.3 }}
        >
          {mark.text}
        </div>
      );

    case 'line':
      // Lines are rendered separately as SVG connections between hotspots
      return null;

    default:
      return null;
  }
};
