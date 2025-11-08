/**
 * Hotspot Component
 * Renders interactive regions where marks can be placed
 */

import React from 'react';
import type { Hotspot as HotspotType, Mark } from '../types';

interface HotspotProps {
  hotspot: HotspotType;
  marks: Mark[];
  isSelected: boolean;
  onClick: (hotspotId: string) => void;
  children?: React.ReactNode;
}

export const Hotspot: React.FC<HotspotProps> = ({
  hotspot,
  marks: _marks,
  isSelected,
  onClick,
  children,
}) => {
  const handleClick = () => {
    if (!hotspot.disabled && !hotspot.readonly) {
      onClick(hotspot.id);
    }
  };

  // Base styles for all hotspots
  const baseClasses = `
    absolute cursor-pointer transition-all
    ${hotspot.disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${hotspot.readonly ? 'cursor-default' : ''}
    ${isSelected ? 'ring-2 ring-blue-500' : ''}
  `;

  // Render based on hotspot type
  const renderHotspot = () => {
    switch (hotspot.type) {
      case 'rect':
      case 'gridcell':
        return (
          <div
            className={`${baseClasses} border-2 border-gray-300 hover:border-blue-400 bg-white/50`}
            style={{
              left: hotspot.position.x,
              top: hotspot.position.y,
              width: hotspot.dimensions.width,
              height: hotspot.dimensions.height,
            }}
            onClick={handleClick}
            role="button"
            tabIndex={hotspot.disabled ? -1 : 0}
            aria-label={`Hotspot ${hotspot.id}`}
            aria-disabled={hotspot.disabled}
          >
            {children}
          </div>
        );

      case 'circle':
        return (
          <div
            className={`${baseClasses} rounded-full border-2 border-gray-300 hover:border-blue-400 bg-white/50`}
            style={{
              left: hotspot.position.x - hotspot.radius,
              top: hotspot.position.y - hotspot.radius,
              width: hotspot.radius * 2,
              height: hotspot.radius * 2,
            }}
            onClick={handleClick}
            role="button"
            tabIndex={hotspot.disabled ? -1 : 0}
            aria-label={`Hotspot ${hotspot.id}`}
          >
            {children}
          </div>
        );

      case 'polygon':
        // For polygons, we'll use SVG
        const points = hotspot.vertices.map((v) => `${v.x},${v.y}`).join(' ');
        const minX = Math.min(...hotspot.vertices.map((v) => v.x));
        const minY = Math.min(...hotspot.vertices.map((v) => v.y));
        const maxX = Math.max(...hotspot.vertices.map((v) => v.x));
        const maxY = Math.max(...hotspot.vertices.map((v) => v.y));

        return (
          <svg
            className={baseClasses}
            style={{
              left: minX,
              top: minY,
              width: maxX - minX,
              height: maxY - minY,
            }}
            onClick={handleClick}
          >
            <polygon
              points={points}
              fill="rgba(255, 255, 255, 0.5)"
              stroke="#d1d5db"
              strokeWidth="2"
              className="hover:stroke-blue-400"
            />
            {children}
          </svg>
        );

      case 'node':
        return (
          <div
            className={`${baseClasses} rounded-full border-2 border-gray-500 bg-gray-200 hover:bg-blue-200`}
            style={{
              left: hotspot.position.x - hotspot.radius,
              top: hotspot.position.y - hotspot.radius,
              width: hotspot.radius * 2,
              height: hotspot.radius * 2,
            }}
            onClick={handleClick}
            role="button"
            tabIndex={hotspot.disabled ? -1 : 0}
            aria-label={`Connection point ${hotspot.id}`}
          >
            {children}
          </div>
        );

      default:
        return null;
    }
  };

  return renderHotspot();
};
