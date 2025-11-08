/**
 * Hotspot component - renders a single interactive hotspot
 */

import type { Hotspot as HotspotType } from '../types';
import { MarkRenderer } from './marks/MarkRenderer';
import { getShapeBounds } from '../utils/geometry';

interface HotspotProps {
  hotspot: HotspotType;
  isHovered?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function Hotspot({
  hotspot,
  isHovered = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: HotspotProps) {
  const bounds = getShapeBounds(hotspot.shape);
  const size = Math.min(bounds.width, bounds.height);

  // Determine if hotspot should be interactive
  const isInteractive = hotspot.enabled && !hotspot.readOnly;

  // Render shape based on type
  const renderShape = () => {
    const baseClasses = `absolute transition-colors ${
      isInteractive ? 'cursor-pointer' : 'cursor-default'
    }`;

    const hoverClasses = isHovered && isInteractive ? 'bg-blue-100' : 'bg-transparent';
    const borderClasses = hotspot.style?.borderColor
      ? `border-[${hotspot.style.borderColor}]`
      : 'border-gray-300';

    const borderWidth = hotspot.style?.borderWidth ?? 1;

    switch (hotspot.shape.type) {
      case 'rectangle': {
        const rect = hotspot.shape.bounds;
        return (
          <div
            className={`${baseClasses} ${hoverClasses} border ${borderClasses}`}
            style={{
              left: `${rect.x}px`,
              top: `${rect.y}px`,
              width: `${rect.width}px`,
              height: `${rect.height}px`,
              borderWidth: `${borderWidth}px`,
              backgroundColor: hotspot.style?.backgroundColor,
            }}
            onClick={isInteractive ? onClick : undefined}
            onMouseEnter={isInteractive ? onMouseEnter : undefined}
            onMouseLeave={isInteractive ? onMouseLeave : undefined}
            onTouchStart={isInteractive ? onMouseEnter : undefined}
            onTouchEnd={isInteractive ? onMouseLeave : undefined}
          >
            {/* Render default value if no marks */}
            {hotspot.marks.length === 0 && hotspot.defaultValue && (
              <div className="flex items-center justify-center w-full h-full text-gray-400 font-medium">
                {hotspot.defaultValue}
              </div>
            )}

            {/* Render all marks */}
            {hotspot.marks.map((mark, index) => (
              <div key={index} className="absolute inset-0">
                <MarkRenderer mark={mark} size={size} />
              </div>
            ))}
          </div>
        );
      }

      case 'circle': {
        const circle = hotspot.shape.bounds;
        return (
          <div
            className={`${baseClasses} ${hoverClasses} border ${borderClasses} rounded-full`}
            style={{
              left: `${circle.center.x - circle.radius}px`,
              top: `${circle.center.y - circle.radius}px`,
              width: `${circle.radius * 2}px`,
              height: `${circle.radius * 2}px`,
              borderWidth: `${borderWidth}px`,
              backgroundColor: hotspot.style?.backgroundColor,
            }}
            onClick={isInteractive ? onClick : undefined}
            onMouseEnter={isInteractive ? onMouseEnter : undefined}
            onMouseLeave={isInteractive ? onMouseLeave : undefined}
          >
            {/* Render marks */}
            {hotspot.marks.map((mark, index) => (
              <div key={index} className="absolute inset-0">
                <MarkRenderer mark={mark} size={size} />
              </div>
            ))}
          </div>
        );
      }

      case 'polygon': {
        const vertices = hotspot.shape.bounds.vertices;
        // For polygons, we'll use SVG
        const points = vertices.map((v) => `${v.x},${v.y}`).join(' ');

        return (
          <svg
            className={`absolute ${baseClasses}`}
            style={{
              left: `${bounds.x}px`,
              top: `${bounds.y}px`,
              width: `${bounds.width}px`,
              height: `${bounds.height}px`,
            }}
          >
            <polygon
              points={points}
              fill={isHovered && isInteractive ? '#DBEAFE' : 'transparent'}
              stroke={hotspot.style?.borderColor || '#D1D5DB'}
              strokeWidth={borderWidth}
              onClick={isInteractive ? onClick : undefined}
              onMouseEnter={isInteractive ? onMouseEnter : undefined}
              onMouseLeave={isInteractive ? onMouseLeave : undefined}
              style={{ cursor: isInteractive ? 'pointer' : 'default' }}
            />

            {/* Render marks */}
            <foreignObject x="0" y="0" width={bounds.width} height={bounds.height}>
              <div className="relative w-full h-full">
                {hotspot.marks.map((mark, index) => (
                  <div key={index} className="absolute inset-0">
                    <MarkRenderer mark={mark} size={size} />
                  </div>
                ))}
              </div>
            </foreignObject>
          </svg>
        );
      }

      default:
        return null;
    }
  };

  return <>{renderShape()}</>;
}
