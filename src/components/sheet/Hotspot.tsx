/**
 * Hotspot Component - renders an interactive region where marks can be placed
 */

import { useMemo } from 'react';
import type { Hotspot as HotspotType, HotspotState } from '../../types';
import { MarkRenderer } from '../marks';

interface HotspotProps {
  hotspotState: HotspotState;
  onClick?: (hotspot: HotspotType) => void;
  showDebug?: boolean;
}

export function Hotspot({ hotspotState, onClick, showDebug = false }: HotspotProps) {
  const { hotspot, marks } = hotspotState;

  // Calculate position and dimensions based on shape
  const bounds = useMemo(() => {
    switch (hotspot.shape) {
      case 'rectangle':
        return {
          left: hotspot.bounds.x,
          top: hotspot.bounds.y,
          width: hotspot.bounds.width,
          height: hotspot.bounds.height,
        };
      case 'circle':
        return {
          left: hotspot.bounds.center.x - hotspot.bounds.radius,
          top: hotspot.bounds.center.y - hotspot.bounds.radius,
          width: hotspot.bounds.radius * 2,
          height: hotspot.bounds.radius * 2,
        };
      case 'polygon':
        // Calculate bounding box for polygon
        const xs = hotspot.bounds.vertices.map((v) => v.x);
        const ys = hotspot.bounds.vertices.map((v) => v.y);
        const minX = Math.min(...xs);
        const minY = Math.min(...ys);
        const maxX = Math.max(...xs);
        const maxY = Math.max(...ys);
        return {
          left: minX,
          top: minY,
          width: maxX - minX,
          height: maxY - minY,
        };
    }
  }, [hotspot]);

  // Render shape overlay for debug mode or as clickable area
  const renderShape = () => {
    const baseStyle = {
      position: 'absolute' as const,
      cursor: hotspot.enabled ? 'pointer' : 'default',
      opacity: showDebug ? 0.3 : 0,
      transition: 'opacity 0.2s',
    };

    switch (hotspot.shape) {
      case 'rectangle':
        return (
          <div
            className="absolute inset-0 bg-blue-500 hover:opacity-20"
            style={{
              ...baseStyle,
              borderRadius: '2px',
            }}
          />
        );
      case 'circle':
        return (
          <div
            className="absolute inset-0 bg-blue-500 hover:opacity-20"
            style={{
              ...baseStyle,
              borderRadius: '50%',
            }}
          />
        );
      case 'polygon':
        // For polygons, we'll use SVG clip-path
        const points = hotspot.bounds.vertices
          .map((v) => `${v.x - bounds.left},${v.y - bounds.top}`)
          .join(' ');
        return (
          <svg
            className="absolute inset-0"
            style={{ width: bounds.width, height: bounds.height }}
          >
            <polygon
              points={points}
              fill="blue"
              style={{
                ...baseStyle,
                opacity: showDebug ? 0.3 : 0,
              }}
              className="hover:opacity-20"
            />
          </svg>
        );
    }
  };

  const handleClick = () => {
    if (hotspot.enabled && onClick) {
      onClick(hotspot);
    }
  };

  return (
    <div
      className="absolute"
      style={{
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height,
        zIndex: hotspot.zIndex,
      }}
      onClick={handleClick}
    >
      {/* Clickable shape overlay */}
      {renderShape()}

      {/* Render all marks */}
      <div className="absolute inset-0 pointer-events-none">
        {marks.map((mark) => (
          <div
            key={mark.id}
            className="absolute inset-0 flex items-center justify-center"
          >
            <MarkRenderer
              mark={mark}
              size={Math.min(bounds.width, bounds.height) * 0.8}
              width={bounds.width}
              height={bounds.height}
            />
          </div>
        ))}
      </div>

      {/* Debug label */}
      {showDebug && hotspot.label && (
        <div className="absolute top-0 left-0 text-xs bg-black text-white px-1 pointer-events-none">
          {hotspot.label}
        </div>
      )}
    </div>
  );
}
