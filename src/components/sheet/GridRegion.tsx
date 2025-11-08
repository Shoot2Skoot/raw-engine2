/**
 * Grid region component - renders a uniform grid of cells
 */

import type { GridRegion as GridRegionType, Mark } from '../../types';
import { Hotspot } from './Hotspot';

interface GridRegionProps {
  region: GridRegionType;
  marks: Map<string, Mark[]>;
  onHotspotClick: (hotspotId: string) => void;
}

export function GridRegion({ region, marks, onHotspotClick }: GridRegionProps) {
  const cellSize = region.cellSize === 'auto' ? 40 : region.cellSize;
  const gap = region.gap;

  // Generate grid cells
  const cells = [];
  for (let row = 0; row < region.rows; row++) {
    for (let col = 0; col < region.columns; col++) {
      const hotspotId = `${region.id}_r${row}_c${col}`;
      const x = region.position.x + col * (cellSize + gap);
      const y = region.position.y + row * (cellSize + gap);

      cells.push(
        <Hotspot
          key={hotspotId}
          id={hotspotId}
          shape={{ x, y, width: cellSize, height: cellSize }}
          constraints={region.constraints}
          marks={marks.get(hotspotId) || []}
          onClick={() => onHotspotClick(hotspotId)}
        />
      );
    }
  }

  const gridWidth = region.columns * cellSize + (region.columns - 1) * gap;
  const gridHeight = region.rows * cellSize + (region.rows - 1) * gap;

  return (
    <g>
      {/* Background */}
      {region.backgroundColor && (
        <rect
          x={region.position.x - gap}
          y={region.position.y - gap}
          width={gridWidth + gap * 2}
          height={gridHeight + gap * 2}
          fill={region.backgroundColor}
          opacity={0.1}
        />
      )}

      {/* Grid label */}
      {region.label && (
        <text
          x={region.position.x + gridWidth / 2}
          y={region.position.y - 10}
          textAnchor="middle"
          className="text-sm font-semibold fill-current"
        >
          {region.label}
        </text>
      )}

      {/* Cells */}
      {cells}
    </g>
  );
}
