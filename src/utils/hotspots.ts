/**
 * Utility functions for generating and managing hotspots
 */

import type { Hotspot, GridLayout, Position, HotspotConstraints } from '../types';

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Generate hotspots for a grid layout
 */
export function generateGridHotspots(
  sheetId: string,
  gridConfig: GridLayout
): Hotspot[] {
  const hotspots: Hotspot[] = [];
  const cellSize = gridConfig.cellSize === 'auto' ? 50 : gridConfig.cellSize || 50;
  const gap = gridConfig.gap || 0;
  const offset = gridConfig.offset || { x: 0, y: 0 };

  for (let row = 0; row < gridConfig.rows; row++) {
    for (let col = 0; col < gridConfig.columns; col++) {
      const id = `${sheetId}_cell_${row}_${col}`;
      const x = offset.x + col * (cellSize + gap);
      const y = offset.y + row * (cellSize + gap);

      hotspots.push({
        id,
        sheetId,
        shape: 'rectangle',
        position: { x, y },
        size: { width: cellSize, height: cellSize },
        constraints: gridConfig.defaultConstraints,
        label: `R${row + 1}C${col + 1}`,
        group: `grid_${sheetId}`,
      });
    }
  }

  return hotspots;
}

/**
 * Generate hotspots for a track layout
 */
export function generateTrackHotspots(
  sheetId: string,
  trackId: string,
  spaces: number,
  orientation: 'horizontal' | 'vertical' = 'horizontal',
  spaceSize: number = 40,
  gap: number = 4,
  offset: Position = { x: 0, y: 0 },
  constraints: HotspotConstraints
): Hotspot[] {
  const hotspots: Hotspot[] = [];

  for (let i = 0; i < spaces; i++) {
    const id = `${sheetId}_${trackId}_space_${i}`;
    const position =
      orientation === 'horizontal'
        ? { x: offset.x + i * (spaceSize + gap), y: offset.y }
        : { x: offset.x, y: offset.y + i * (spaceSize + gap) };

    hotspots.push({
      id,
      sheetId,
      shape: 'rectangle',
      position,
      size: { width: spaceSize, height: spaceSize },
      constraints,
      label: `${i + 1}`,
      group: trackId,
    });
  }

  return hotspots;
}

/**
 * Check if a point is inside a hotspot
 */
export function isPointInHotspot(point: Position, hotspot: Hotspot): boolean {
  switch (hotspot.shape) {
    case 'rectangle':
      if (!hotspot.size) return false;
      return (
        point.x >= hotspot.position.x &&
        point.x <= hotspot.position.x + hotspot.size.width &&
        point.y >= hotspot.position.y &&
        point.y <= hotspot.position.y + hotspot.size.height
      );

    case 'circle':
      if (!hotspot.radius) return false;
      const dx = point.x - hotspot.position.x;
      const dy = point.y - hotspot.position.y;
      return Math.sqrt(dx * dx + dy * dy) <= hotspot.radius;

    case 'polygon':
      if (!hotspot.vertices || hotspot.vertices.length < 3) return false;
      return isPointInPolygon(point, hotspot.vertices);

    case 'point':
      // Point hotspots have a small clickable radius
      const distance = Math.sqrt(
        Math.pow(point.x - hotspot.position.x, 2) +
        Math.pow(point.y - hotspot.position.y, 2)
      );
      return distance <= 10; // 10px click radius

    default:
      return false;
  }
}

/**
 * Point-in-polygon test using ray casting algorithm
 */
function isPointInPolygon(point: Position, vertices: Position[]): boolean {
  let inside = false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const xi = vertices[i].x;
    const yi = vertices[i].y;
    const xj = vertices[j].x;
    const yj = vertices[j].y;

    const intersect =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Get bounding box of a hotspot
 */
export function getHotspotBounds(hotspot: Hotspot): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
} {
  switch (hotspot.shape) {
    case 'rectangle':
      if (!hotspot.size) {
        return {
          minX: hotspot.position.x,
          minY: hotspot.position.y,
          maxX: hotspot.position.x,
          maxY: hotspot.position.y,
        };
      }
      return {
        minX: hotspot.position.x,
        minY: hotspot.position.y,
        maxX: hotspot.position.x + hotspot.size.width,
        maxY: hotspot.position.y + hotspot.size.height,
      };

    case 'circle':
      if (!hotspot.radius) {
        return {
          minX: hotspot.position.x,
          minY: hotspot.position.y,
          maxX: hotspot.position.x,
          maxY: hotspot.position.y,
        };
      }
      return {
        minX: hotspot.position.x - hotspot.radius,
        minY: hotspot.position.y - hotspot.radius,
        maxX: hotspot.position.x + hotspot.radius,
        maxY: hotspot.position.y + hotspot.radius,
      };

    case 'polygon':
      if (!hotspot.vertices || hotspot.vertices.length === 0) {
        return {
          minX: hotspot.position.x,
          minY: hotspot.position.y,
          maxX: hotspot.position.x,
          maxY: hotspot.position.y,
        };
      }
      const xs = hotspot.vertices.map(v => v.x);
      const ys = hotspot.vertices.map(v => v.y);
      return {
        minX: Math.min(...xs),
        minY: Math.min(...ys),
        maxX: Math.max(...xs),
        maxY: Math.max(...ys),
      };

    case 'point':
      return {
        minX: hotspot.position.x - 10,
        minY: hotspot.position.y - 10,
        maxX: hotspot.position.x + 10,
        maxY: hotspot.position.y + 10,
      };
  }
}
