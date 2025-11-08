/**
 * Component for rendering hotspots
 */

import React from 'react';
import type { Hotspot } from '../../types';

interface HotspotRendererProps {
  hotspot: Hotspot;
  isDebugMode?: boolean;
  isHovered?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function HotspotRenderer({
  hotspot,
  isDebugMode = false,
  isHovered = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: HotspotRendererProps) {
  const { geometry } = hotspot;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hotspot.readonly && onClick) {
      onClick();
    }
  };

  // Visual styles
  const fillColor = isDebugMode
    ? isHovered
      ? 'rgba(59, 130, 246, 0.3)'
      : 'rgba(59, 130, 246, 0.1)'
    : 'transparent';

  const strokeColor = isDebugMode ? '#3b82f6' : 'transparent';
  const strokeWidth = isDebugMode ? 1 : 0;
  const cursor = hotspot.readonly ? 'default' : 'pointer';

  switch (geometry.shape) {
    case 'rectangle':
      return (
        <rect
          x={geometry.x}
          y={geometry.y}
          width={geometry.width}
          height={geometry.height}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          onClick={handleClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={{ cursor }}
          className="hotspot"
        />
      );

    case 'circle':
      return (
        <circle
          cx={geometry.centerX}
          cy={geometry.centerY}
          r={geometry.radius}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          onClick={handleClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={{ cursor }}
          className="hotspot"
        />
      );

    case 'polygon': {
      const points = geometry.points
        .map(p => `${p.x},${p.y}`)
        .join(' ');

      return (
        <polygon
          points={points}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          onClick={handleClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={{ cursor }}
          className="hotspot"
        />
      );
    }

    default:
      return null;
  }
}
