/**
 * GridSheetRenderer
 * Renders grid-based sheet layouts
 */

import React from 'react';
import type { GridSheet } from '../../types';
import { HotspotRenderer } from '../hotspots/HotspotRenderer';

interface GridSheetRendererProps {
  sheet: GridSheet;
  selectedHotspotId?: string;
  onHotspotSelect?: (hotspotId: string) => void;
  debug?: boolean;
}

export const GridSheetRenderer: React.FC<GridSheetRendererProps> = ({
  sheet,
  selectedHotspotId,
  onHotspotSelect,
  debug = false,
}) => {
  const { grid, dimensions, background } = sheet;
  const {
    rows,
    columns,
    cellWidth,
    cellHeight,
    gap,
    offset = { x: 0, y: 0 },
    showGridLines = true,
    gridLineColor = '#ddd',
    gridLineWidth = 1,
  } = grid;

  // Calculate cell dimensions
  const actualCellWidth =
    cellWidth === 'auto'
      ? (dimensions.width - gap * (columns - 1)) / columns
      : cellWidth;
  const actualCellHeight =
    cellHeight === 'auto'
      ? (dimensions.height - gap * (rows - 1)) / rows
      : cellHeight;

  // Render grid lines
  const renderGridLines = () => {
    if (!showGridLines) return null;

    const lines: React.ReactElement[] = [];

    // Vertical lines
    for (let col = 0; col <= columns; col++) {
      const x = offset.x + col * (actualCellWidth + gap);
      lines.push(
        <line
          key={`v-${col}`}
          x1={x}
          y1={offset.y}
          x2={x}
          y2={offset.y + rows * actualCellHeight + (rows - 1) * gap}
          stroke={gridLineColor}
          strokeWidth={gridLineWidth}
        />
      );
    }

    // Horizontal lines
    for (let row = 0; row <= rows; row++) {
      const y = offset.y + row * (actualCellHeight + gap);
      lines.push(
        <line
          key={`h-${row}`}
          x1={offset.x}
          y1={y}
          x2={offset.x + columns * actualCellWidth + (columns - 1) * gap}
          y2={y}
          stroke={gridLineColor}
          strokeWidth={gridLineWidth}
        />
      );
    }

    return <g>{lines}</g>;
  };

  return (
    <svg width={dimensions.width} height={dimensions.height} className="w-full h-full">
      {/* Background */}
      <rect
        width={dimensions.width}
        height={dimensions.height}
        fill={background?.color || '#fff'}
      />

      {/* Grid lines */}
      {renderGridLines()}

      {/* Hotspots */}
      {sheet.hotspots.map((hotspot) => (
        <HotspotRenderer
          key={hotspot.id}
          hotspot={hotspot}
          isSelected={hotspot.id === selectedHotspotId}
          onSelect={onHotspotSelect}
          debug={debug}
        />
      ))}
    </svg>
  );
};
