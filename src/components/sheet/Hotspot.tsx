/**
 * Hotspot component - Renders an interactive hotspot
 */

import React from 'react';
import type { Hotspot as HotspotType } from '../../types';

interface HotspotProps {
  hotspot: HotspotType;
  onClick: () => void;
  isActive?: boolean;
  children?: React.ReactNode;
}

export const Hotspot: React.FC<HotspotProps> = ({
  hotspot,
  onClick,
  isActive = false,
  children,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hotspot.disabled && !hotspot.readOnly) {
      onClick();
    }
  };

  const baseClasses = `
    cursor-pointer transition-all duration-150
    ${hotspot.disabled ? 'opacity-30 cursor-not-allowed' : ''}
    ${hotspot.readOnly ? 'cursor-default' : ''}
    ${isActive ? 'ring-2 ring-blue-500' : ''}
  `;

  if (hotspot.shape === 'rect') {
    return (
      <g onClick={handleClick} className={baseClasses}>
        <rect
          x={hotspot.x}
          y={hotspot.y}
          width={hotspot.width}
          height={hotspot.height}
          className="fill-transparent stroke-gray-300 hover:fill-blue-50 hover:stroke-blue-400"
          strokeWidth={1}
        />
        <g transform={`translate(${hotspot.x}, ${hotspot.y})`}>{children}</g>
      </g>
    );
  }

  if (hotspot.shape === 'circle') {
    return (
      <g onClick={handleClick} className={baseClasses}>
        <circle
          cx={hotspot.centerX}
          cy={hotspot.centerY}
          r={hotspot.radius}
          className="fill-transparent stroke-gray-300 hover:fill-blue-50 hover:stroke-blue-400"
          strokeWidth={1}
        />
        <g transform={`translate(${hotspot.centerX}, ${hotspot.centerY})`}>{children}</g>
      </g>
    );
  }

  if (hotspot.shape === 'polygon') {
    const points = hotspot.points.map((p) => `${p.x},${p.y}`).join(' ');
    const centerX = hotspot.points.reduce((sum, p) => sum + p.x, 0) / hotspot.points.length;
    const centerY = hotspot.points.reduce((sum, p) => sum + p.y, 0) / hotspot.points.length;

    return (
      <g onClick={handleClick} className={baseClasses}>
        <polygon
          points={points}
          className="fill-transparent stroke-gray-300 hover:fill-blue-50 hover:stroke-blue-400"
          strokeWidth={1}
        />
        <g transform={`translate(${centerX}, ${centerY})`}>{children}</g>
      </g>
    );
  }

  return null;
};
