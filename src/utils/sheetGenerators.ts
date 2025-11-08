/**
 * Sheet Generator Utilities
 * Helper functions for creating sheets and hotspots
 */

import type {
  GridSheet,
  CellHotspot,
  MarkConfig,
  GridConfig,
  Point,
} from '../types';

/**
 * Generates a grid-based sheet with automatic hotspot creation
 */
export function createGridSheet(config: {
  id: string;
  name: string;
  rows: number;
  columns: number;
  cellWidth: number | 'auto';
  cellHeight: number | 'auto';
  gap?: number;
  markConfig: MarkConfig;
  sheetWidth?: number;
  sheetHeight?: number;
  backgroundColor?: string;
}): GridSheet {
  const {
    id,
    name,
    rows,
    columns,
    cellWidth,
    cellHeight,
    gap = 4,
    markConfig,
    sheetWidth = 800,
    sheetHeight = 600,
    backgroundColor = '#ffffff',
  } = config;

  // Calculate actual cell dimensions
  const actualCellWidth =
    cellWidth === 'auto' ? (sheetWidth - gap * (columns - 1)) / columns : cellWidth;
  const actualCellHeight =
    cellHeight === 'auto' ? (sheetHeight - gap * (rows - 1)) / rows : cellHeight;

  // Generate hotspots for each grid cell
  const hotspots: CellHotspot[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const x = col * (actualCellWidth + gap);
      const y = row * (actualCellHeight + gap);

      hotspots.push({
        id: `cell-${row}-${col}`,
        type: 'cell',
        shape: {
          x,
          y,
          width: actualCellWidth,
          height: actualCellHeight,
        },
        markConfig: { ...markConfig },
        marks: [],
        enabled: true,
        gridPosition: { row, col },
      });
    }
  }

  const gridConfig: GridConfig = {
    rows,
    columns,
    cellWidth,
    cellHeight,
    gap,
    showGridLines: true,
    gridLineColor: '#ddd',
    gridLineWidth: 1,
  };

  return {
    id,
    name,
    layoutType: 'grid',
    hotspots,
    dimensions: {
      width: sheetWidth,
      height: sheetHeight,
    },
    grid: gridConfig,
    background: {
      color: backgroundColor,
    },
  };
}

/**
 * Creates a resource track with sequential spaces
 */
export function createResourceTrack(config: {
  trackId: string;
  spaces: number;
  startPoint: Point;
  direction: 'horizontal' | 'vertical';
  spaceSize: number;
  gap: number;
  markConfig: MarkConfig;
  labels?: (string | number)[];
}): CellHotspot[] {
  const {
    trackId,
    spaces,
    startPoint,
    direction,
    spaceSize,
    gap,
    markConfig,
    labels,
  } = config;

  const hotspots: CellHotspot[] = [];

  for (let i = 0; i < spaces; i++) {
    const x =
      direction === 'horizontal'
        ? startPoint.x + i * (spaceSize + gap)
        : startPoint.x;
    const y =
      direction === 'vertical'
        ? startPoint.y + i * (spaceSize + gap)
        : startPoint.y;

    hotspots.push({
      id: `${trackId}-space-${i}`,
      type: 'cell',
      shape: {
        x,
        y,
        width: spaceSize,
        height: spaceSize,
      },
      markConfig: { ...markConfig },
      marks: [],
      enabled: true,
      label: labels?.[i]?.toString(),
      metadata: {
        trackId,
        position: i,
      },
    });
  }

  return hotspots;
}

/**
 * Generates a unique ID
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
