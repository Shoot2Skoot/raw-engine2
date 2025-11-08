/**
 * GridLayout - renders a uniform grid of cells
 */

import React, { useMemo } from 'react';
import type { GridLayout as GridLayoutType, Mark, Hotspot } from '../../types';
import { HotspotCell } from '../HotspotCell';

interface GridLayoutProps {
  layout: GridLayoutType;
  marks: Mark[];
  hotspots: Hotspot[];
  onHotspotClick: (hotspotId: string) => void;
  highlightedHotspots?: string[];
}

export const GridLayout: React.FC<GridLayoutProps> = ({
  layout,
  marks,
  hotspots,
  onHotspotClick,
  highlightedHotspots = [],
}) => {
  // Generate grid cells as hotspots if not already defined
  const gridHotspots = useMemo(() => {
    // Check if hotspots are already defined for this grid
    const existingHotspots = hotspots.filter((h) =>
      h.id.startsWith('grid-cell-')
    );

    if (existingHotspots.length > 0) {
      return existingHotspots;
    }

    // Auto-generate hotspots for grid cells
    const cellWidth = layout.cellWidth || 60;
    const cellHeight = layout.cellHeight || 60;
    const gap = layout.gap || 4;
    const offsetX = layout.offsetX || 0;
    const offsetY = layout.offsetY || 0;

    const generatedHotspots: Hotspot[] = [];

    for (let row = 0; row < layout.rows; row++) {
      for (let col = 0; col < layout.columns; col++) {
        const x = offsetX + col * (cellWidth + gap);
        const y = offsetY + row * (cellHeight + gap);

        generatedHotspots.push({
          id: `grid-cell-${row}-${col}`,
          shape: {
            shape: 'rect',
            x,
            y,
            width: cellWidth,
            height: cellHeight,
          },
          allowedMarkTypes: layout.allowedMarkTypes,
          label: `${row},${col}`,
        });
      }
    }

    return generatedHotspots;
  }, [layout, hotspots]);

  const cellWidth = layout.cellWidth || 60;
  const cellHeight = layout.cellHeight || 60;
  const gap = layout.gap || 4;
  const offsetX = layout.offsetX || 0;
  const offsetY = layout.offsetY || 0;

  const gridWidth = layout.columns * cellWidth + (layout.columns - 1) * gap;
  const gridHeight = layout.rows * cellHeight + (layout.rows - 1) * gap;

  return (
    <div
      className="relative"
      style={{
        width: gridWidth + offsetX * 2,
        height: gridHeight + offsetY * 2,
        backgroundColor: layout.backgroundColor || 'transparent',
      }}
    >
      {gridHotspots.map((hotspot) => {
        const cellMarks = marks.filter((m) => m.hotspotId === hotspot.id);
        const isHighlighted = highlightedHotspots.includes(hotspot.id);

        if (hotspot.shape.shape !== 'rect') return null;

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
