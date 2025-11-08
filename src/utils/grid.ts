/**
 * Grid Generation Utilities
 * Auto-generate hotspots from grid configuration
 */

import { GridConfig, Hotspot, RectangleHotspot } from '../types';
import { generateId } from './common';

/**
 * Generate hotspots from grid configuration
 */
export function generateGridHotspots(config: GridConfig): RectangleHotspot[] {
  const hotspots: RectangleHotspot[] = [];

  for (let row = 0; row < config.rows; row++) {
    for (let col = 0; col < config.columns; col++) {
      const x = config.startPosition.x + col * (config.cellWidth + config.gap);
      const y = config.startPosition.y + row * (config.cellHeight + config.gap);

      hotspots.push({
        id: generateId(),
        shape: 'rectangle',
        position: { x, y },
        dimensions: {
          width: config.cellWidth,
          height: config.cellHeight,
        },
        allowedMarkTypes: config.allowedMarkTypes,
        maxMarks: config.maxMarks ?? 1,
        canUnmark: config.canUnmark ?? true,
        isEnabled: true,
        metadata: {
          row,
          col,
          gridId: config.startPosition.x + '-' + config.startPosition.y,
        },
      });
    }
  }

  return hotspots;
}

/**
 * Find hotspot at given position
 */
export function findHotspotAtPosition(
  hotspots: Hotspot[],
  x: number,
  y: number
): Hotspot | null {
  for (const hotspot of hotspots) {
    if (hotspot.shape === 'rectangle') {
      if (
        x >= hotspot.position.x &&
        x <= hotspot.position.x + hotspot.dimensions.width &&
        y >= hotspot.position.y &&
        y <= hotspot.position.y + hotspot.dimensions.height
      ) {
        return hotspot;
      }
    } else if (hotspot.shape === 'circle') {
      const dx = x - hotspot.center.x;
      const dy = y - hotspot.center.y;
      if (Math.sqrt(dx * dx + dy * dy) <= hotspot.radius) {
        return hotspot;
      }
    } else if (hotspot.shape === 'polygon') {
      // Point in polygon test
      let inside = false;
      const vertices = hotspot.vertices;
      for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
        const xi = vertices[i].x;
        const yi = vertices[i].y;
        const xj = vertices[j].x;
        const yj = vertices[j].y;

        const intersect =
          yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }
      if (inside) return hotspot;
    }
  }
  return null;
}
