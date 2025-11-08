import { useCallback } from 'react';
import type { Hotspot, Mark } from '../../types';
import { MarkRenderer } from '../Marks';

interface HotspotCellProps {
  hotspot: Hotspot;
  marks: Mark[];
  isSelected?: boolean;
  onClick?: (hotspot: Hotspot) => void;
  onDoubleClick?: (hotspot: Hotspot) => void;
}

/**
 * Renders a single hotspot with its marks
 */
export function HotspotCell({
  hotspot,
  marks,
  isSelected,
  onClick,
  onDoubleClick,
}: HotspotCellProps) {
  const handleClick = useCallback(() => {
    onClick?.(hotspot);
  }, [hotspot, onClick]);

  const handleDoubleClick = useCallback(() => {
    onDoubleClick?.(hotspot);
  }, [hotspot, onDoubleClick]);

  // Render based on hotspot shape
  const renderShape = () => {
    switch (hotspot.shape) {
      case 'rectangle':
        if (!hotspot.size) return null;
        return (
          <div
            className={`
              absolute border-2 border-gray-300 bg-white
              hotspot-base hotspot-hover
              ${isSelected ? 'border-blue-500 bg-blue-50' : ''}
              ${hotspot.constraints.isReadOnly ? 'cursor-default' : ''}
            `}
            style={{
              left: hotspot.position.x,
              top: hotspot.position.y,
              width: hotspot.size.width,
              height: hotspot.size.height,
              zIndex: hotspot.zIndex || 1,
            }}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
          >
            {/* Render all marks for this hotspot */}
            {marks.map(mark => (
              <MarkRenderer
                key={mark.id}
                mark={mark}
                size={Math.min(hotspot.size!.width, hotspot.size!.height) * 0.7}
              />
            ))}

            {/* Label (optional) */}
            {hotspot.label && marks.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
                {hotspot.label}
              </div>
            )}
          </div>
        );

      case 'circle':
        if (!hotspot.radius) return null;
        const diameter = hotspot.radius * 2;
        return (
          <div
            className={`
              absolute rounded-full border-2 border-gray-300 bg-white
              hotspot-base hotspot-hover
              ${isSelected ? 'border-blue-500 bg-blue-50' : ''}
              ${hotspot.constraints.isReadOnly ? 'cursor-default' : ''}
            `}
            style={{
              left: hotspot.position.x - hotspot.radius,
              top: hotspot.position.y - hotspot.radius,
              width: diameter,
              height: diameter,
              zIndex: hotspot.zIndex || 1,
            }}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
          >
            {marks.map(mark => (
              <MarkRenderer key={mark.id} mark={mark} size={diameter * 0.6} />
            ))}
          </div>
        );

      case 'polygon':
        if (!hotspot.vertices || hotspot.vertices.length < 3) return null;
        const points = hotspot.vertices
          .map(v => `${v.x},${v.y}`)
          .join(' ');

        // Calculate bounding box for positioning
        const xs = hotspot.vertices.map(v => v.x);
        const ys = hotspot.vertices.map(v => v.y);
        const minX = Math.min(...xs);
        const minY = Math.min(...ys);
        const maxX = Math.max(...xs);
        const maxY = Math.max(...ys);
        const width = maxX - minX;
        const height = maxY - minY;

        return (
          <svg
            className={`absolute ${hotspot.constraints.isReadOnly ? '' : 'cursor-pointer'}`}
            style={{
              left: minX,
              top: minY,
              width,
              height,
              zIndex: hotspot.zIndex || 1,
            }}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
          >
            <polygon
              points={points}
              fill="white"
              stroke={isSelected ? '#3B82F6' : '#D1D5DB'}
              strokeWidth="2"
              className="hotspot-base hotspot-hover"
            />
          </svg>
        );

      case 'point':
        return (
          <div
            className={`
              absolute w-3 h-3 rounded-full border-2 border-gray-400 bg-white
              hotspot-base hotspot-hover
              ${isSelected ? 'border-blue-500 bg-blue-500' : ''}
            `}
            style={{
              left: hotspot.position.x - 6,
              top: hotspot.position.y - 6,
              zIndex: hotspot.zIndex || 1,
            }}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
          />
        );

      default:
        return null;
    }
  };

  return <>{renderShape()}</>;
}
