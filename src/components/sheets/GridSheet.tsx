/**
 * Grid sheet component - renders grid-based layouts
 */

import { useRef, useState } from 'react';
import type { Sheet, GridLayout, Position } from '../../types';
import { Hotspot } from '../Hotspot';
import { findHotspotAtPosition } from '../../utils/hotspotGenerator';
import { getRelativePosition } from '../../utils/geometry';

interface GridSheetProps {
  sheet: Sheet;
  onHotspotClick?: (hotspotId: string) => void;
}

export function GridSheet({ sheet, onHotspotClick }: GridSheetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredHotspotId, setHoveredHotspotId] = useState<string | null>(null);

  const layout = sheet.layout as GridLayout;
  const gap = layout.gap ?? 0;
  const offset = layout.offset ?? { x: 0, y: 0 };

  // Calculate cell size
  let cellSize: number;
  if (layout.cellSize === 'auto') {
    cellSize = 60;
  } else {
    cellSize = layout.cellSize;
  }

  // Calculate total dimensions
  const width = layout.columns * cellSize + (layout.columns - 1) * gap + offset.x * 2;
  const height = layout.rows * cellSize + (layout.rows - 1) * gap + offset.y * 2;

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

    // Use the last touch point before it was removed
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
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: layout.backgroundColor || '#f9fafb',
        }}
        onClick={handleClick}
        onTouchEnd={handleTouchEnd}
      >
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
