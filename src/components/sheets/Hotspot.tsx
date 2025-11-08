/**
 * Hotspot Component
 * Interactive region that can receive marks
 */

import React, { useCallback } from 'react';
import { Hotspot as HotspotType, PlacedMark } from '../../types';
import { MarkRenderer } from '../marks/MarkRenderer';

interface HotspotProps {
  hotspot: HotspotType;
  marks: PlacedMark[];
  onClick: (hotspotId: string) => void;
}

export const Hotspot: React.FC<HotspotProps> = ({
  hotspot,
  marks,
  onClick,
}) => {
  const handleClick = useCallback(() => {
    if (hotspot.isEnabled) {
      onClick(hotspot.id);
    }
  }, [hotspot.id, hotspot.isEnabled, onClick]);

  // Only rectangle hotspots for now (most common)
  if (hotspot.shape !== 'rectangle') {
    return null; // TODO: Implement other shapes
  }

  const { position, dimensions } = hotspot;

  return (
    <div
      className={`absolute border border-gray-300 ${
        hotspot.isEnabled
          ? 'cursor-pointer hover:bg-blue-50 hover:border-blue-400'
          : 'cursor-not-allowed bg-gray-100'
      }`}
      style={{
        left: position.x,
        top: position.y,
        width: dimensions.width,
        height: dimensions.height,
        minWidth: '44px', // Touch-friendly minimum
        minHeight: '44px',
      }}
      onClick={handleClick}
      role="button"
      tabIndex={hotspot.isEnabled ? 0 : -1}
      aria-label={`Hotspot ${hotspot.id}`}
    >
      {/* Render all marks for this hotspot */}
      {marks.map((placedMark) => (
        <div key={placedMark.id} className="absolute inset-0">
          <MarkRenderer
            mark={placedMark.mark}
            size={Math.min(dimensions.width, dimensions.height)}
          />
        </div>
      ))}
    </div>
  );
};
