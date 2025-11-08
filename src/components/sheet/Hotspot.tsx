/**
 * Hotspot component - an interactive cell/region on a sheet
 */

import { useState } from 'react';
import type { HotspotShape, Mark } from '../../types';
import { MarkRenderer } from '../marks/MarkRenderer';

interface HotspotProps {
  id: string;
  shape: HotspotShape;
  constraints: unknown;
  marks: Mark[];
  onClick: () => void;
  readOnly?: boolean;
}

export function Hotspot({ shape, marks, onClick, readOnly }: HotspotProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (!readOnly) {
      onClick();
    }
  };

  // Render based on shape type
  if ('width' in shape && 'height' in shape) {
    // Rectangle
    const { x, y, width, height } = shape;

    return (
      <g
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ cursor: readOnly ? 'default' : 'pointer' }}
        className="hotspot"
      >
        {/* Cell background */}
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={isHovered && !readOnly ? '#e0e7ff' : '#ffffff'}
          stroke="#cbd5e1"
          strokeWidth={isHovered && !readOnly ? 2 : 1}
          rx={2}
        />

        {/* Marks */}
        <foreignObject x={x} y={y} width={width} height={height}>
          <div className="relative w-full h-full">
            <MarkRenderer marks={marks} cellSize={Math.min(width, height)} />
          </div>
        </foreignObject>
      </g>
    );
  } else if ('center' in shape && 'radius' in shape) {
    // Circle
    const { center, radius } = shape;

    return (
      <g
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ cursor: readOnly ? 'default' : 'pointer' }}
        className="hotspot"
      >
        {/* Circle background */}
        <circle
          cx={center.x}
          cy={center.y}
          r={radius}
          fill={isHovered && !readOnly ? '#e0e7ff' : '#ffffff'}
          stroke="#cbd5e1"
          strokeWidth={isHovered && !readOnly ? 2 : 1}
        />

        {/* Marks */}
        <foreignObject
          x={center.x - radius}
          y={center.y - radius}
          width={radius * 2}
          height={radius * 2}
        >
          <div className="relative w-full h-full">
            <MarkRenderer marks={marks} cellSize={radius * 2} />
          </div>
        </foreignObject>
      </g>
    );
  } else if ('vertices' in shape) {
    // Polygon
    const { vertices } = shape;
    const points = vertices.map(v => `${v.x},${v.y}`).join(' ');

    // Calculate bounding box for foreignObject
    const minX = Math.min(...vertices.map(v => v.x));
    const minY = Math.min(...vertices.map(v => v.y));
    const maxX = Math.max(...vertices.map(v => v.x));
    const maxY = Math.max(...vertices.map(v => v.y));
    const width = maxX - minX;
    const height = maxY - minY;

    return (
      <g
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ cursor: readOnly ? 'default' : 'pointer' }}
        className="hotspot"
      >
        {/* Polygon background */}
        <polygon
          points={points}
          fill={isHovered && !readOnly ? '#e0e7ff' : '#ffffff'}
          stroke="#cbd5e1"
          strokeWidth={isHovered && !readOnly ? 2 : 1}
        />

        {/* Marks */}
        <foreignObject x={minX} y={minY} width={width} height={height}>
          <div className="relative w-full h-full">
            <MarkRenderer marks={marks} cellSize={Math.min(width, height)} />
          </div>
        </foreignObject>
      </g>
    );
  }

  return null;
}
