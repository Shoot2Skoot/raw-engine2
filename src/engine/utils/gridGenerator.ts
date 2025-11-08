/**
 * Grid Generation Utilities
 * Auto-generate grid cells and hotspots
 */

import type { GridCellHotspot, MarkConstraints } from '../types';
import { generateId } from './idGenerator';

export interface GridGeneratorOptions {
  rows: number;
  columns: number;
  cellSize: number;
  gap: number;
  startX: number;
  startY: number;
  defaultConstraints: MarkConstraints;
  regionId?: string;
}

/**
 * Generate a grid of hotspots
 */
export function generateGrid(options: GridGeneratorOptions): GridCellHotspot[] {
  const {
    rows,
    columns,
    cellSize,
    gap,
    startX,
    startY,
    defaultConstraints,
    regionId,
  } = options;

  const hotspots: GridCellHotspot[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const x = startX + col * (cellSize + gap);
      const y = startY + row * (cellSize + gap);

      const hotspot: GridCellHotspot = {
        id: generateId('cell'),
        type: 'gridcell',
        row,
        col,
        position: { x, y },
        dimensions: { width: cellSize, height: cellSize },
        constraints: { ...defaultConstraints },
        regionId,
      };

      hotspots.push(hotspot);
    }
  }

  return hotspots;
}

/**
 * Get a cell at specific row/column
 */
export function getCellAt(
  grid: GridCellHotspot[],
  row: number,
  col: number
): GridCellHotspot | undefined {
  return grid.find((cell) => cell.row === row && cell.col === col);
}

/**
 * Get all cells in a row
 */
export function getCellsInRow(grid: GridCellHotspot[], row: number): GridCellHotspot[] {
  return grid.filter((cell) => cell.row === row);
}

/**
 * Get all cells in a column
 */
export function getCellsInColumn(grid: GridCellHotspot[], col: number): GridCellHotspot[] {
  return grid.filter((cell) => cell.col === col);
}

/**
 * Get adjacent cells (up, down, left, right)
 */
export function getAdjacentCells(
  grid: GridCellHotspot[],
  row: number,
  col: number
): GridCellHotspot[] {
  const adjacentPositions = [
    { row: row - 1, col }, // Up
    { row: row + 1, col }, // Down
    { row, col: col - 1 }, // Left
    { row, col: col + 1 }, // Right
  ];

  return adjacentPositions
    .map(({ row: r, col: c }) => getCellAt(grid, r, c))
    .filter((cell): cell is GridCellHotspot => cell !== undefined);
}

/**
 * Get diagonal cells
 */
export function getDiagonalCells(
  grid: GridCellHotspot[],
  row: number,
  col: number
): GridCellHotspot[] {
  const diagonalPositions = [
    { row: row - 1, col: col - 1 }, // Top-left
    { row: row - 1, col: col + 1 }, // Top-right
    { row: row + 1, col: col - 1 }, // Bottom-left
    { row: row + 1, col: col + 1 }, // Bottom-right
  ];

  return diagonalPositions
    .map(({ row: r, col: c }) => getCellAt(grid, r, c))
    .filter((cell): cell is GridCellHotspot => cell !== undefined);
}

/**
 * Get all neighboring cells (adjacent + diagonal)
 */
export function getAllNeighbors(
  grid: GridCellHotspot[],
  row: number,
  col: number
): GridCellHotspot[] {
  return [...getAdjacentCells(grid, row, col), ...getDiagonalCells(grid, row, col)];
}
