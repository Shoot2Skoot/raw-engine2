/**
 * Grid layout renderer
 */

import { useMemo } from 'react';
import type {
  GridLayout as GridLayoutType,
  Hotspot as HotspotType,
  PlacedMark,
} from '../../types';
import { HotspotShape } from '../../types';
import { Hotspot } from './Hotspot';

interface GridLayoutProps {
  layout: GridLayoutType;
  sheetId: string;
  marks: PlacedMark[];
}

export function GridLayout({ layout, sheetId, marks }: GridLayoutProps) {
  // Generate hotspots for grid cells
  const hotspots = useMemo(() => {
    const cells: HotspotType[] = [];
    const cellWidth =
      layout.cellWidth === 'auto' ? 50 : layout.cellWidth;
    const cellHeight =
      layout.cellHeight === 'auto' ? 50 : layout.cellHeight;
    const gap = layout.gap || 2;
    const offsetX = layout.offset?.x || 0;
    const offsetY = layout.offset?.y || 0;

    for (let row = 0; row < layout.rows; row++) {
      for (let col = 0; col < layout.columns; col++) {
        const x = offsetX + col * (cellWidth + gap);
        const y = offsetY + row * (cellHeight + gap);

        cells.push({
          id: `cell-${row}-${col}`,
          label: `R${row + 1}C${col + 1}`,
          geometry: {
            shape: HotspotShape.Rectangle,
            x,
            y,
            width: cellWidth,
            height: cellHeight,
          },
          allowedMarkTypes: layout.allowedMarkTypes,
          maxMarks: 1,
          canUnmark: true,
          enabled: true,
        });
      }
    }

    return cells;
  }, [layout]);

  const totalWidth =
    (layout.offset?.x || 0) +
    layout.columns *
      ((layout.cellWidth === 'auto' ? 50 : layout.cellWidth) +
        (layout.gap || 2)) -
    (layout.gap || 2);

  const totalHeight =
    (layout.offset?.y || 0) +
    layout.rows *
      ((layout.cellHeight === 'auto' ? 50 : layout.cellHeight) +
        (layout.gap || 2)) -
    (layout.gap || 2);

  return (
    <div
      className="relative"
      style={{
        width: totalWidth,
        height: totalHeight,
        backgroundColor: layout.backgroundColor,
      }}
    >
      {/* Grid lines (optional) */}
      {layout.showGridLines !== false && (
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ width: totalWidth, height: totalHeight }}
        >
          {hotspots.map((hotspot) => {
            const geom = hotspot.geometry as any;
            return (
              <rect
                key={hotspot.id}
                x={geom.x}
                y={geom.y}
                width={geom.width}
                height={geom.height}
                fill="none"
                stroke={layout.borderColor || '#d1d5db'}
                strokeWidth={1}
              />
            );
          })}
        </svg>
      )}

      {/* Hotspots */}
      {hotspots.map((hotspot) => (
        <Hotspot
          key={hotspot.id}
          hotspot={hotspot}
          sheetId={sheetId}
          marks={marks}
        />
      ))}
    </div>
  );
}
