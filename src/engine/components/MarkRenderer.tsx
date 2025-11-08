/**
 * Mark Renderer Component
 * Renders different types of marks (checkbox, number, color, etc.)
 */

import React from 'react';
import { Check, X, Circle, Star, Diamond, Heart, Square } from 'lucide-react';
import type { Mark } from '../types';

interface MarkRendererProps {
  mark: Mark;
  size?: number;
}

export const MarkRenderer: React.FC<MarkRendererProps> = ({ mark, size = 40 }) => {
  const opacity = mark.isPencil ? 0.5 : 1;
  const color = mark.isPencil ? '#9ca3af' : undefined;

  const renderMark = () => {
    switch (mark.type) {
      case 'checkbox': {
        const iconSize = size * 0.7;
        return (
          <div
            className="flex items-center justify-center w-full h-full"
            style={{ opacity }}
          >
            {mark.state === 'checked' && (
              <Check size={iconSize} color={color || '#22c55e'} strokeWidth={3} />
            )}
            {mark.state === 'crossed' && (
              <X size={iconSize} color={color || '#ef4444'} strokeWidth={3} />
            )}
          </div>
        );
      }

      case 'number':
        return (
          <div
            className="flex items-center justify-center w-full h-full font-bold text-2xl"
            style={{ opacity, color: color || '#1f2937' }}
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
          />
        );

      case 'circle': {
        const iconSize = size * 0.8;
        return (
          <div
            className="flex items-center justify-center w-full h-full"
            style={{ opacity }}
          >
            {mark.fillLevel === 'empty' && (
              <Circle size={iconSize} color={color || '#6b7280'} strokeWidth={2} />
            )}
            {mark.fillLevel === 'half' && (
              <svg width={iconSize} height={iconSize} viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke={color || '#6b7280'}
                  strokeWidth="2"
                />
                <path
                  d="M12 2 A10 10 0 0 1 12 22 Z"
                  fill={color || '#6b7280'}
                />
              </svg>
            )}
            {mark.fillLevel === 'full' && (
              <Circle size={iconSize} fill={color || '#6b7280'} strokeWidth={0} />
            )}
          </div>
        );
      }

      case 'symbol': {
        const iconSize = size * 0.7;
        const iconColor = mark.color || color || '#1f2937';
        const iconProps = { size: iconSize, color: iconColor, strokeWidth: 2 };

        // Map symbol names to Lucide icons
        const symbolMap: Record<string, React.ComponentType<typeof iconProps>> = {
          star: Star,
          diamond: Diamond,
          heart: Heart,
          square: Square,
          circle: Circle,
        };

        const IconComponent = symbolMap[mark.symbol] || Star;

        return (
          <div
            className="flex items-center justify-center w-full h-full"
            style={{ opacity }}
          >
            <IconComponent {...iconProps} />
          </div>
        );
      }

      case 'text':
        return (
          <div
            className="flex items-center justify-center w-full h-full text-sm font-medium px-1"
            style={{
              opacity,
              color: color || '#1f2937',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {mark.text}
          </div>
        );

      case 'line':
        // Lines are rendered separately at the sheet level
        return null;

      case 'area':
        // Area fills are rendered as backgrounds
        return null;

      default:
        return null;
    }
  };

  return <>{renderMark()}</>;
};
