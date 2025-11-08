import React, { useMemo } from 'react';
import { GridLayout as GridLayoutType, Mark, RectangularHotspot } from '../../types';
import { Hotspot } from './Hotspot';

interface GridLayoutProps {
  layout: GridLayoutType;
  marks: Mark[];
  debugMode?: boolean;
  onHotspotClick?: (hotspotId: string) => void;
}

/**
 * Renders a grid layout with auto-generated hotspots
 */
export function GridLayout({ layout, marks, debugMode, onHotspotClick }: GridLayoutProps) {
  // Generate hotspots for grid cells
  const hotspots = useMemo(() => {
    const result: RectangularHotspot[] = [];
    const cellSize = layout.cellSize === 'auto' ? 50 : layout.cellSize;
    const offsetX = layout.offset?.x || 0;
    const offsetY = layout.offset?.y || 0;

    for (let row = 0; row < layout.rows; row++) {
      for (let col = 0; col < layout.columns; col++) {
        const cellKey = `${row}-${col}`;
        const overrides = layout.cellOverrides?.[cellKey];

        const hotspot: RectangularHotspot = {
          id: `grid-${row}-${col}`,
          label: `R${row + 1}C${col + 1}`,
          shape: 'rectangle',
          position: {
            x: offsetX + col * (cellSize + layout.gap),
            y: offsetY + row * (cellSize + layout.gap),
          },
          size: {
            width: cellSize,
            height: cellSize,
          },
          markConfig: {
            ...layout.defaultMarkConfig,
            ...overrides,
          },
          enabled: true,
          readonly: false,
        };

        result.push(hotspot);
      }
    }

    return result;
  }, [layout]);

  // Calculate total dimensions
  const cellSize = layout.cellSize === 'auto' ? 50 : layout.cellSize;
  const totalWidth = layout.columns * cellSize + (layout.columns - 1) * layout.gap + (layout.offset?.x || 0) * 2;
  const totalHeight = layout.rows * cellSize + (layout.rows - 1) * layout.gap + (layout.offset?.y || 0) * 2;

  return (
    <div
      className="relative"
      style={{
        width: `${totalWidth}px`,
        height: `${totalHeight}px`,
        backgroundColor: layout.backgroundColor || 'transparent',
      }}
    >
      {hotspots.map((hotspot) => {
        const hotspotMarks = marks.filter(m => m.hotspotId === hotspot.id);

        return (
          <Hotspot
            key={hotspot.id}
            hotspot={hotspot}
            marks={hotspotMarks}
            debugMode={debugMode}
            onClick={() => onHotspotClick?.(hotspot.id)}
          />
        );
      })}
    </div>
  );
}
