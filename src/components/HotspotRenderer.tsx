/**
 * Hotspot Renderer Component
 *
 * Renders a single hotspot with its geometry and marks
 */

import type { Hotspot } from '../types';
import { MarkRenderer } from './MarkRenderer';
import { getHotspotBounds } from '../utils/geometry';

interface HotspotRendererProps {
  hotspot: Hotspot;
  onClick?: () => void;
  isHovered?: boolean;
}

export function HotspotRenderer({ hotspot, onClick, isHovered }: HotspotRendererProps) {
  const bounds = getHotspotBounds(hotspot);
  const isEnabled = hotspot.constraints.isEnabled !== false;
  const canInteract = isEnabled && onClick;

  // Base classes for all hotspots
  const baseClasses = `
    absolute transition-all duration-150
    ${canInteract ? 'cursor-pointer' : 'cursor-default'}
    ${isHovered && canInteract ? 'ring-2 ring-blue-400' : ''}
    ${!isEnabled ? 'opacity-40' : ''}
  `;

  return (
    <div
      className={baseClasses}
      style={{
        left: bounds.x,
        top: bounds.y,
        width: bounds.width,
        height: bounds.height,
        zIndex: hotspot.zIndex || 0,
        ...hotspot.style,
      }}
      onClick={canInteract ? onClick : undefined}
    >
      {/* Hotspot background shape */}
      <HotspotShape hotspot={hotspot} isHovered={isHovered} />

      {/* Render all marks */}
      <div className="absolute inset-0 pointer-events-none">
        {hotspot.marks.map(mark => (
          <div key={mark.id} className="w-full h-full">
            <MarkRenderer mark={mark} size={Math.min(bounds.width, bounds.height)} />
          </div>
        ))}
      </div>

      {/* Label (if any) */}
      {hotspot.label && (
        <div className="absolute -top-5 left-0 text-xs text-gray-500 pointer-events-none">
          {hotspot.label}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// HOTSPOT SHAPE RENDERING
// ============================================================================

function HotspotShape({
  hotspot,
  isHovered,
}: {
  hotspot: Hotspot;
  isHovered?: boolean;
}) {
  const strokeColor = isHovered ? '#3b82f6' : '#d1d5db';
  const strokeWidth = isHovered ? 2 : 1;

  switch (hotspot.shape) {
    case 'rectangle':
      return (
        <svg
          className="absolute inset-0 pointer-events-none"
          width="100%"
          height="100%"
        >
          <rect
            width="100%"
            height="100%"
            fill="transparent"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            rx="4"
          />
        </svg>
      );

    case 'circle': {
      const bounds = getHotspotBounds(hotspot);
      const radius = Math.min(bounds.width, bounds.height) / 2;
      const cx = bounds.width / 2;
      const cy = bounds.height / 2;

      return (
        <svg
          className="absolute inset-0 pointer-events-none"
          width="100%"
          height="100%"
        >
          <circle
            cx={cx}
            cy={cy}
            r={radius - strokeWidth}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        </svg>
      );
    }

    case 'polygon': {
      if (hotspot.shape !== 'polygon') return null;

      const bounds = getHotspotBounds(hotspot);
      const polygonGeom = hotspot.geometry as import('../types').PolygonGeometry;
      const points = polygonGeom.points
        .map((p: { x: number; y: number }) => `${p.x - bounds.x},${p.y - bounds.y}`)
        .join(' ');

      return (
        <svg
          className="absolute inset-0 pointer-events-none"
          width="100%"
          height="100%"
        >
          <polygon
            points={points}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        </svg>
      );
    }

    default:
      return null;
  }
}
