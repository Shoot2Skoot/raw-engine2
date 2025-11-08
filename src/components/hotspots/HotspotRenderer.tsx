/**
 * HotspotRenderer
 * Renders interactive hotspot regions
 */

import React from 'react';
import type { Hotspot, Rectangle, Circle, Polygon } from '../../types';
import { MarkRenderer } from '../marks/MarkRenderer';

interface HotspotRendererProps {
  hotspot: Hotspot;
  isSelected?: boolean;
  onSelect?: (hotspotId: string) => void;
  debug?: boolean;
}

export const HotspotRenderer: React.FC<HotspotRendererProps> = ({
  hotspot,
  isSelected = false,
  onSelect,
  debug = false,
}) => {
  const handleClick = () => {
    if (hotspot.enabled && onSelect) {
      onSelect(hotspot.id);
    }
  };

  const renderShape = () => {
    const { shape, style } = hotspot;
    const baseStyle = {
      fill: style?.backgroundColor || 'transparent',
      fillOpacity: style?.backgroundOpacity ?? 0.1,
      stroke: style?.borderColor || '#666',
      strokeWidth: style?.borderWidth ?? 1,
      cursor: hotspot.enabled ? 'pointer' : 'not-allowed',
      opacity: hotspot.enabled ? 1 : 0.5,
    };

    if (debug) {
      baseStyle.fill = isSelected ? 'rgba(59, 130, 246, 0.3)' : 'rgba(156, 163, 175, 0.2)';
      baseStyle.stroke = isSelected ? '#3b82f6' : '#9ca3af';
    }

    if ('width' in shape) {
      // Rectangle
      const rect = shape as Rectangle;
      return (
        <rect
          x={rect.x}
          y={rect.y}
          width={rect.width}
          height={rect.height}
          rx={style?.borderRadius ?? 0}
          {...baseStyle}
          onClick={handleClick}
        />
      );
    } else if ('radius' in shape) {
      // Circle
      const circle = shape as Circle;
      return (
        <circle
          cx={circle.center.x}
          cy={circle.center.y}
          r={circle.radius}
          {...baseStyle}
          onClick={handleClick}
        />
      );
    } else if ('vertices' in shape) {
      // Polygon
      const polygon = shape as Polygon;
      const points = polygon.vertices.map((v) => `${v.x},${v.y}`).join(' ');
      return <polygon points={points} {...baseStyle} onClick={handleClick} />;
    }

    return null;
  };

  const getShapeBounds = (): Rectangle => {
    const { shape } = hotspot;

    if ('width' in shape) {
      return shape as Rectangle;
    } else if ('radius' in shape) {
      const circle = shape as Circle;
      return {
        x: circle.center.x - circle.radius,
        y: circle.center.y - circle.radius,
        width: circle.radius * 2,
        height: circle.radius * 2,
      };
    } else if ('vertices' in shape) {
      const polygon = shape as Polygon;
      const xs = polygon.vertices.map((v) => v.x);
      const ys = polygon.vertices.map((v) => v.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
      };
    }

    return { x: 0, y: 0, width: 0, height: 0 };
  };

  const bounds = getShapeBounds();

  return (
    <g data-hotspot-id={hotspot.id} data-hotspot-type={hotspot.type}>
      {renderShape()}

      {/* Render marks */}
      {hotspot.marks.map((mark) => (
        <g
          key={mark.id}
          transform={`translate(${bounds.x + bounds.width / 2}, ${
            bounds.y + bounds.height / 2
          })`}
        >
          <MarkRenderer mark={mark} size={Math.min(bounds.width, bounds.height) * 0.8} />
        </g>
      ))}

      {/* Optional label */}
      {hotspot.label && (
        <text
          x={bounds.x + bounds.width / 2}
          y={bounds.y - 5}
          textAnchor="middle"
          fontSize="12"
          fill="#666"
          pointerEvents="none"
        >
          {hotspot.label}
        </text>
      )}
    </g>
  );
};
