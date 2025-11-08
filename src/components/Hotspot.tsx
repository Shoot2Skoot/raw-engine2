/**
 * Hotspot component - renders an interactive region where marks can be placed
 */

import React from 'react';
import type { Hotspot as HotspotType } from '../types';
import { MarkRenderer } from './marks/MarkRenderer';

interface HotspotProps {
  hotspot: HotspotType;
  onClick: () => void;
}

export function Hotspot({ hotspot, onClick }: HotspotProps) {
  if (!hotspot.visible && hotspot.visible !== undefined) {
    return null;
  }

  const { position } = hotspot;
  const isEnabled = hotspot.enabled ?? true;
  const isReadOnly = hotspot.constraints.readOnly ?? false;

  // Calculate positioning based on shape
  let style: React.CSSProperties = {
    position: 'absolute',
    cursor: isEnabled && !isReadOnly ? 'pointer' : 'default',
    opacity: isEnabled ? 1 : 0.5
  };

  let content: React.ReactNode = null;

  if (position.shape === 'rectangle') {
    style = {
      ...style,
      left: position.x,
      top: position.y,
      width: position.width,
      height: position.height
    };

    content = (
      <div
        className={`
          w-full h-full border-2 rounded
          ${isEnabled && !isReadOnly ? 'border-gray-300 hover:border-blue-500' : 'border-gray-200'}
          transition-colors duration-150
          flex items-center justify-center
        `}
        onClick={isEnabled && !isReadOnly ? onClick : undefined}
      >
        {/* Render all marks in this hotspot */}
        {hotspot.marks.map((mark, index) => (
          <MarkRenderer key={index} mark={mark} />
        ))}
      </div>
    );
  } else if (position.shape === 'circle') {
    const diameter = position.radius * 2;
    style = {
      ...style,
      left: position.cx - position.radius,
      top: position.cy - position.radius,
      width: diameter,
      height: diameter
    };

    content = (
      <div
        className={`
          w-full h-full rounded-full border-2
          ${isEnabled && !isReadOnly ? 'border-gray-300 hover:border-blue-500' : 'border-gray-200'}
          transition-colors duration-150
          flex items-center justify-center
        `}
        onClick={isEnabled && !isReadOnly ? onClick : undefined}
      >
        {hotspot.marks.map((mark, index) => (
          <MarkRenderer key={index} mark={mark} />
        ))}
      </div>
    );
  } else if (position.shape === 'polygon') {
    // For polygons, we'll use SVG
    const points = position.points;
    const minX = Math.min(...points.map(p => p.x));
    const minY = Math.min(...points.map(p => p.y));
    const maxX = Math.max(...points.map(p => p.x));
    const maxY = Math.max(...points.map(p => p.y));

    style = {
      ...style,
      left: minX,
      top: minY,
      width: maxX - minX,
      height: maxY - minY
    };

    const svgPoints = points.map(p => `${p.x - minX},${p.y - minY}`).join(' ');

    content = (
      <svg
        width="100%"
        height="100%"
        onClick={isEnabled && !isReadOnly ? onClick : undefined}
      >
        <polygon
          points={svgPoints}
          className={`
            ${isEnabled && !isReadOnly ? 'fill-transparent stroke-gray-300 hover:stroke-blue-500' : 'fill-transparent stroke-gray-200'}
            transition-colors duration-150
          `}
          strokeWidth="2"
        />
        {/* Center marks in polygon */}
        <foreignObject x="0" y="0" width="100%" height="100%">
          <div className="flex items-center justify-center w-full h-full">
            {hotspot.marks.map((mark, index) => (
              <MarkRenderer key={index} mark={mark} />
            ))}
          </div>
        </foreignObject>
      </svg>
    );
  }

  return <div style={style}>{content}</div>;
}
