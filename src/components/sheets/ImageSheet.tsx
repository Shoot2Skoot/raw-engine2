/**
 * Image sheet component - renders image-based layouts with overlay hotspots
 */

import { useRef, useState } from 'react';
import type { Sheet, ImageLayout, Position } from '../../types';
import { Hotspot } from '../Hotspot';
import { findHotspotAtPosition } from '../../utils/hotspotGenerator';
import { getRelativePosition } from '../../utils/geometry';

interface ImageSheetProps {
  sheet: Sheet;
  onHotspotClick?: (hotspotId: string) => void;
}

export function ImageSheet({ sheet, onHotspotClick }: ImageSheetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredHotspotId, setHoveredHotspotId] = useState<string | null>(null);

  const layout = sheet.layout as ImageLayout;

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const position = getRelativePosition(event.nativeEvent, containerRef.current);
    const hotspot = findHotspotAtPosition(sheet.hotspots, position);

    if (hotspot && onHotspotClick) {
      onHotspotClick(hotspot.id);
    }
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || event.touches.length > 0) return;

    const touch = event.changedTouches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const position: Position = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };

    const hotspot = findHotspotAtPosition(sheet.hotspots, position);

    if (hotspot && onHotspotClick) {
      onHotspotClick(hotspot.id);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full p-8 overflow-auto">
      <div
        ref={containerRef}
        className="relative"
        style={{
          width: sheet.dimensions?.width || 800,
          height: sheet.dimensions?.height || 600,
        }}
        onClick={handleClick}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background image */}
        <img
          src={layout.imageUrl}
          alt={sheet.name}
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: layout.imageMode === 'fit' ? 'contain' :
                      layout.imageMode === 'stretch' ? 'fill' :
                      (layout.imageMode || 'contain') as React.CSSProperties['objectFit'],
          }}
          draggable={false}
        />

        {/* Render all hotspots */}
        {sheet.hotspots.map((hotspot) => (
          <Hotspot
            key={hotspot.id}
            hotspot={hotspot}
            isHovered={hotspot.id === hoveredHotspotId}
            onClick={() => onHotspotClick?.(hotspot.id)}
            onMouseEnter={() => setHoveredHotspotId(hotspot.id)}
            onMouseLeave={() => setHoveredHotspotId(null)}
          />
        ))}
      </div>
    </div>
  );
}
