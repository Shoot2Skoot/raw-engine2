import React from 'react';
import { Hotspot as HotspotType, Mark } from '../../types';
import { MarkRenderer } from '../marks/MarkRenderer';

interface HotspotProps {
  hotspot: HotspotType;
  marks: Mark[];
  debugMode?: boolean;
  onClick?: () => void;
}

/**
 * Renders a hotspot (interactive region) with its marks
 */
export function Hotspot({ hotspot, marks, debugMode = false, onClick }: HotspotProps) {
  const isDisabled = !hotspot.enabled || hotspot.readonly;

  // Calculate position and size based on shape
  const getStyle = (): React.CSSProperties => {
    switch (hotspot.shape) {
      case 'rectangle':
        return {
          position: 'absolute',
          left: `${hotspot.position.x}px`,
          top: `${hotspot.position.y}px`,
          width: `${hotspot.size.width}px`,
          height: `${hotspot.size.height}px`,
        };

      case 'circle':
        return {
          position: 'absolute',
          left: `${hotspot.center.x - hotspot.radius}px`,
          top: `${hotspot.center.y - hotspot.radius}px`,
          width: `${hotspot.radius * 2}px`,
          height: `${hotspot.radius * 2}px`,
          borderRadius: '50%',
        };

      case 'polygon':
        // For polygons, calculate bounding box
        const xs = hotspot.vertices.map(v => v.x);
        const ys = hotspot.vertices.map(v => v.y);
        const minX = Math.min(...xs);
        const minY = Math.min(...ys);
        const maxX = Math.max(...xs);
        const maxY = Math.max(...ys);

        return {
          position: 'absolute',
          left: `${minX}px`,
          top: `${minY}px`,
          width: `${maxX - minX}px`,
          height: `${maxY - minY}px`,
        };
    }
  };

  const style = getStyle();
  const size = Math.min(
    typeof style.width === 'string' ? parseFloat(style.width) : 50,
    typeof style.height === 'string' ? parseFloat(style.height) : 50
  );

  return (
    <div
      className={`
        relative
        ${!isDisabled && 'cursor-pointer hover:bg-blue-100/20'}
        ${debugMode && 'border-2 border-red-500 border-dashed'}
        transition-colors
      `}
      style={style}
      onClick={!isDisabled ? onClick : undefined}
      role={!isDisabled ? 'button' : undefined}
      aria-label={hotspot.label}
      tabIndex={!isDisabled ? 0 : undefined}
    >
      {/* Render all marks for this hotspot */}
      {marks.map((mark) => (
        <MarkRenderer key={mark.id} mark={mark} size={size} />
      ))}

      {/* Debug label */}
      {debugMode && hotspot.label && (
        <div className="absolute top-0 left-0 text-xs bg-red-500 text-white px-1">
          {hotspot.label}
        </div>
      )}
    </div>
  );
}
