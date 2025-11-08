/**
 * Grid Generation Utilities
 * Automatically generate hotspots from grid layouts
 */

import type { Hotspot, Rectangle } from '../types/hotspots';
import type { GridLayout } from '../types/sheets';
import type { MarkType } from '../types/marks';

/**
 * Generate hotspots from a grid layout
 */
export function generateGridHotspots(layout: GridLayout): Hotspot[] {
  const hotspots: Hotspot[] = [];

  const cellSize =
    layout.cellSize === 'auto' ? 50 : layout.cellSize; // Default to 50px if auto
  const gap = layout.gap ?? 0;
  const offsetX = layout.offset?.x ?? 0;
  const offsetY = layout.offset?.y ?? 0;

  for (let row = 0; row < layout.rows; row++) {
    for (let col = 0; col < layout.columns; col++) {
      const cellKey = `${row}-${col}`;
      const id = `grid-${row}-${col}`;

      // Calculate position
      const x = offsetX + col * (cellSize + gap);
      const y = offsetY + row * (cellSize + gap);

      // Get custom constraints for this cell, if any
      const customConstraints = layout.cellConstraints?.[cellKey];

      // Get label for this cell, if any
      const label = layout.cellLabels?.[cellKey];

      const hotspot: Hotspot = {
        id,
        label,
        shape: {
          x,
          y,
          width: cellSize,
          height: cellSize,
        } as Rectangle,
        constraints: {
          allowedMarkTypes: layout.defaultAllowedMarks,
          maxMarks: 1, // Default: one mark per cell
          erasable: true,
          enabled: true,
          ...customConstraints, // Override with custom constraints
        },
        style: {
          backgroundColor: layout.backgroundColor,
          borderColor: '#cccccc',
          borderWidth: 1,
        },
      };

      hotspots.push(hotspot);
    }
  }

  return hotspots;
}

/**
 * Get cell ID from row and column
 */
export function getCellId(row: number, col: number): string {
  return `grid-${row}-${col}`;
}

/**
 * Parse cell ID to get row and column
 */
export function parseCellId(cellId: string): { row: number; col: number } | null {
  const match = cellId.match(/^grid-(\d+)-(\d+)$/);
  if (!match) return null;

  return {
    row: parseInt(match[1], 10),
    col: parseInt(match[2], 10),
  };
}

/**
 * Get adjacent cell IDs (for connection-based games)
 */
export function getAdjacentCells(
  row: number,
  col: number,
  rows: number,
  columns: number,
  includeDiagonals: boolean = false
): string[] {
  const adjacent: string[] = [];

  // Orthogonal directions
  const orthogonal = [
    { dr: -1, dc: 0 }, // Up
    { dr: 1, dc: 0 }, // Down
    { dr: 0, dc: -1 }, // Left
    { dr: 0, dc: 1 }, // Right
  ];

  // Diagonal directions
  const diagonal = [
    { dr: -1, dc: -1 }, // Up-left
    { dr: -1, dc: 1 }, // Up-right
    { dr: 1, dc: -1 }, // Down-left
    { dr: 1, dc: 1 }, // Down-right
  ];

  const directions = includeDiagonals ? [...orthogonal, ...diagonal] : orthogonal;

  for (const { dr, dc } of directions) {
    const newRow = row + dr;
    const newCol = col + dc;

    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < columns) {
      adjacent.push(getCellId(newRow, newCol));
    }
  }

  return adjacent;
}

/**
 * Calculate grid dimensions based on cell count and size
 */
export function calculateGridDimensions(layout: GridLayout): {
  width: number;
  height: number;
} {
  const cellSize = layout.cellSize === 'auto' ? 50 : layout.cellSize;
  const gap = layout.gap ?? 0;

  const width = layout.columns * cellSize + (layout.columns - 1) * gap;
  const height = layout.rows * cellSize + (layout.rows - 1) * gap;

  return { width, height };
}

/**
 * Create a simple grid layout configuration
 */
export function createSimpleGrid(
  rows: number,
  columns: number,
  allowedMarks: MarkType[]
): GridLayout {
  return {
    type: 'grid',
    rows,
    columns,
    cellSize: 50,
    gap: 2,
    defaultAllowedMarks: allowedMarks,
  };
}
