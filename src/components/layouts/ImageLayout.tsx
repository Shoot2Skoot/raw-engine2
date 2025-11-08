/**
 * ImageLayout - renders hotspots overlaid on an image background
 */

import React from 'react';
import type { ImageLayout as ImageLayoutType, Mark } from '../../types';
import { HotspotCell } from '../HotspotCell';

interface ImageLayoutProps {
  layout: ImageLayoutType;
  marks: Mark[];
  onHotspotClick: (hotspotId: string) => void;
  highlightedHotspots?: string[];
}

export const ImageLayout: React.FC<ImageLayoutProps> = ({
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
      <img
        src={layout.imageUrl}
        alt="Game sheet background"
        className="absolute inset-0 w-full h-full"
        style={{
          objectFit: layout.maintainAspectRatio ? 'contain' : 'fill',
        }}
      />
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
