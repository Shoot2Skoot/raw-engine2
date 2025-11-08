/**
 * Utilities for working with regions and generating hotspots
 */

import type {
  Hotspot,
  GridRegion,
  Region,
  Position,
} from '../types';

/**
 * Generate hotspots from a grid region configuration
 */
export function generateGridHotspots(grid: GridRegion): Hotspot[] {
  const hotspots: Hotspot[] = [];
  const offsetX = grid.offsetX || 0;
  const offsetY = grid.offsetY || 0;
  const gap = grid.gap || 0;

  for (let row = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.columns; col++) {
      const x = offsetX + col * (grid.cellWidth + gap);
      const y = offsetY + row * (grid.cellHeight + gap);

      const hotspot: Hotspot = {
        id: `${grid.id}-r${row}-c${col}`,
        geometry: {
          shape: 'rectangle',
          x,
          y,
          width: grid.cellWidth,
          height: grid.cellHeight,
        },
        allowedMarkTypes: grid.allowedMarkTypes,
        metadata: {
          row,
          column: col,
          gridId: grid.id,
        },
      };

      hotspots.push(hotspot);
    }
  }

  return hotspots;
}

/**
 * Get all hotspots from a region
 */
export function getHotspotsFromRegion(region: Region): Hotspot[] {
  switch (region.type) {
    case 'grid':
      return generateGridHotspots(region);

    case 'freeform':
      return region.hotspots;

    case 'track':
      return region.spaces;

    case 'territory':
      return [{
        id: region.id,
        geometry: region.boundary,
        allowedMarkTypes: region.allowedMarkTypes,
        metadata: { territoryId: region.id },
      }];

    case 'connection':
      // For connection grids, hotspots are the nodes
      return region.nodes.map((pos, idx) => ({
        id: `${region.id}-node-${idx}`,
        geometry: {
          shape: 'circle' as const,
          centerX: pos.x,
          centerY: pos.y,
          radius: 8, // Small clickable area around node
        },
        allowedMarkTypes: ['line'],
        metadata: { nodeIndex: idx, connectionGridId: region.id },
      }));

    default:
      return [];
  }
}

/**
 * Check if a point is inside a hotspot
 */
export function isPointInHotspot(x: number, y: number, hotspot: Hotspot): boolean {
  const { geometry } = hotspot;

  switch (geometry.shape) {
    case 'rectangle':
      return (
        x >= geometry.x &&
        x <= geometry.x + geometry.width &&
        y >= geometry.y &&
        y <= geometry.y + geometry.height
      );

    case 'circle': {
      const dx = x - geometry.centerX;
      const dy = y - geometry.centerY;
      return Math.sqrt(dx * dx + dy * dy) <= geometry.radius;
    }

    case 'polygon': {
      // Ray casting algorithm for point-in-polygon
      let inside = false;
      const points = geometry.points;

      for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const xi = points[i].x;
        const yi = points[i].y;
        const xj = points[j].x;
        const yj = points[j].y;

        const intersect =
          yi > y !== yj > y &&
          x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

        if (intersect) inside = !inside;
      }

      return inside;
    }

    default:
      return false;
  }
}

/**
 * Find hotspot at a given position
 */
export function findHotspotAtPosition(
  x: number,
  y: number,
  hotspots: Hotspot[]
): Hotspot | null {
  // Search in reverse order to prioritize hotspots drawn on top
  for (let i = hotspots.length - 1; i >= 0; i--) {
    if (isPointInHotspot(x, y, hotspots[i])) {
      return hotspots[i];
    }
  }
  return null;
}

/**
 * Get bounding box of a hotspot
 */
export function getHotspotBounds(hotspot: Hotspot): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  const { geometry } = hotspot;

  switch (geometry.shape) {
    case 'rectangle':
      return {
        x: geometry.x,
        y: geometry.y,
        width: geometry.width,
        height: geometry.height,
      };

    case 'circle':
      return {
        x: geometry.centerX - geometry.radius,
        y: geometry.centerY - geometry.radius,
        width: geometry.radius * 2,
        height: geometry.radius * 2,
      };

    case 'polygon': {
      const xs = geometry.points.map(p => p.x);
      const ys = geometry.points.map(p => p.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
      };
    }
  }
}

/**
 * Get center point of a hotspot
 */
export function getHotspotCenter(hotspot: Hotspot): Position {
  const { geometry } = hotspot;

  switch (geometry.shape) {
    case 'rectangle':
      return {
        x: geometry.x + geometry.width / 2,
        y: geometry.y + geometry.height / 2,
      };

    case 'circle':
      return {
        x: geometry.centerX,
        y: geometry.centerY,
      };

    case 'polygon': {
      const xs = geometry.points.map(p => p.x);
      const ys = geometry.points.map(p => p.y);
      return {
        x: xs.reduce((a, b) => a + b, 0) / xs.length,
        y: ys.reduce((a, b) => a + b, 0) / ys.length,
      };
    }
  }
}
