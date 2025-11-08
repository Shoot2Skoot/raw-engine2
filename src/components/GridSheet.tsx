import React, { useMemo } from 'react';
import type { GridLayout, RectHotspot } from '../types';
import { Hotspot } from './Hotspot';

interface GridSheetProps {
  layout: GridLayout;
  sheetId: string;
}

export const GridSheet: React.FC<GridSheetProps> = ({ layout, sheetId }) => {
  // Generate hotspots from grid configuration
  const hotspots = useMemo<RectHotspot[]>(() => {
    const result: RectHotspot[] = [];
    const cellWidth = layout.cellWidth || 60;
    const cellHeight = layout.cellHeight || 60;
    const gap = layout.gap || 2;
    const offsetX = layout.offsetX || 0;
    const offsetY = layout.offsetY || 0;

    for (let row = 0; row < layout.rows; row++) {
      for (let col = 0; col < layout.columns; col++) {
        const id = `${sheetId}-cell-${row}-${col}`;
        const x = offsetX + col * (cellWidth + gap);
        const y = offsetY + row * (cellHeight + gap);

        // Check for cell overrides
        const override = layout.cellOverrides?.[id];

        result.push({
          id,
          shape: 'rect',
          x,
          y,
          width: cellWidth,
          height: cellHeight,
          allowedMarkTypes: override?.allowedMarkTypes || layout.defaultAllowedMarks,
          maxMarks: override?.maxMarks,
          disabled: override?.disabled,
          readonly: override?.readonly,
        });
      }
    }

    return result;
  }, [layout, sheetId]);

  // Calculate total dimensions
  const cellWidth = layout.cellWidth || 60;
  const cellHeight = layout.cellHeight || 60;
  const gap = layout.gap || 2;
  const width = layout.columns * (cellWidth + gap) - gap + (layout.offsetX || 0) * 2;
  const height = layout.rows * (cellHeight + gap) - gap + (layout.offsetY || 0) * 2;

  return (
    <div
      className="relative"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: layout.backgroundColor || 'transparent',
      }}
    >
      <svg
        width={width}
        height={height}
        className="absolute inset-0"
        style={{ pointerEvents: 'none' }}
      >
        {/* Grid lines */}
        {hotspots.map((hotspot) => (
          <rect
            key={`grid-${hotspot.id}`}
            x={hotspot.x}
            y={hotspot.y}
            width={hotspot.width}
            height={hotspot.height}
            fill="none"
            stroke="#ddd"
            strokeWidth="1"
          />
        ))}
      </svg>

      {/* Hotspots */}
      {hotspots.map((hotspot) => (
        <Hotspot key={hotspot.id} hotspot={hotspot} />
      ))}
    </div>
  );
};
