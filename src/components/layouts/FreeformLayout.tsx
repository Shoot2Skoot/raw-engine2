/**
 * FreeformLayout - renders manually defined hotspots and regions
 */

import React from 'react';
import type { FreeformLayout as FreeformLayoutType, Mark } from '../../types';
import { HotspotCell } from '../HotspotCell';

interface FreeformLayoutProps {
  layout: FreeformLayoutType;
  marks: Mark[];
  onHotspotClick: (hotspotId: string) => void;
  highlightedHotspots?: string[];
}

export const FreeformLayout: React.FC<FreeformLayoutProps> = ({
  layout,
  marks,
  onHotspotClick,
  highlightedHotspots = [],
}) => {
  return (
    <div
      className="relative"
      style={{
        width: layout.width,
        height: layout.height,
      }}
    >
      {/* Render regions as background */}
      {layout.regions?.map((region) => (
        <div
          key={region.id}
          className="absolute pointer-events-none"
          style={{
            backgroundColor: region.backgroundColor,
            border: region.border,
            zIndex: region.zIndex || 0,
          }}
        />
      ))}

      {/* Render hotspots */}
      {layout.hotspots.map((hotspot) => {
        const cellMarks = marks.filter((m) => m.hotspotId === hotspot.id);
        const isHighlighted = highlightedHotspots.includes(hotspot.id);

        return (
          <HotspotCell
            key={hotspot.id}
            hotspot={hotspot}
            marks={cellMarks}
            onClick={() => onHotspotClick(hotspot.id)}
            isHighlighted={isHighlighted}
          />
        );
      })}
    </div>
  );
};
