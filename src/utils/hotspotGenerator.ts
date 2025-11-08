/**
 * Utilities for automatically generating hotspots from layout configurations
 */

import type { Hotspot, GridLayout, Position } from '../types';

/**
 * Generate hotspots for a grid layout
 */
export function generateGridHotspots(layout: GridLayout): Hotspot[] {
  const hotspots: Hotspot[] = [];
  const gap = layout.gap ?? 0;
  const offset = layout.offset ?? { x: 0, y: 0 };

  // Calculate cell size
  let cellSize: number;
  if (layout.cellSize === 'auto') {
    // Default to 60px for auto mode
    cellSize = 60;
  } else {
    cellSize = layout.cellSize;
  }

  // Generate hotspots for each cell
  for (let row = 0; row < layout.rows; row++) {
    for (let col = 0; col < layout.columns; col++) {
      const x = offset.x + col * (cellSize + gap);
      const y = offset.y + row * (cellSize + gap);

      // Check for cell-specific constraints
      const cellKey = `${row},${col}`;
      const constraints = layout.cellConstraints?.get(cellKey) ?? layout.defaultConstraints;

      const hotspot: Hotspot = {
        id: `grid-${row}-${col}`,
        label: `(${row},${col})`,
        shape: {
          type: 'rectangle',
          bounds: {
            x,
            y,
            width: cellSize,
            height: cellSize,
          },
        },
        constraints,
        marks: [],
        enabled: true,
      };

      hotspots.push(hotspot);
    }
  }

  return hotspots;
}

/**
 * Generate hotspots for a track layout
 */
export function generateTrackHotspots(layout: {
  spaces: number;
  path: 'horizontal' | 'vertical' | 'custom';
  customPath?: Position[];
  spaceSize: number;
  constraints: import('../types').MarkConstraints;
}): Hotspot[] {
  const hotspots: Hotspot[] = [];

  if (layout.path === 'custom' && layout.customPath) {
    // Use custom path positions
    for (let i = 0; i < Math.min(layout.spaces, layout.customPath.length); i++) {
      const pos = layout.customPath[i];
      hotspots.push({
        id: `track-${i}`,
        label: `${i}`,
        shape: {
          type: 'rectangle',
          bounds: {
            x: pos.x - layout.spaceSize / 2,
            y: pos.y - layout.spaceSize / 2,
            width: layout.spaceSize,
            height: layout.spaceSize,
          },
        },
        constraints: layout.constraints,
        marks: [],
        enabled: true,
      });
    }
  } else {
    // Generate linear track
    for (let i = 0; i < layout.spaces; i++) {
      const x = layout.path === 'horizontal' ? i * (layout.spaceSize + 4) : 0;
      const y = layout.path === 'vertical' ? i * (layout.spaceSize + 4) : 0;

      hotspots.push({
        id: `track-${i}`,
        label: `${i}`,
        shape: {
          type: 'rectangle',
          bounds: {
            x,
            y,
            width: layout.spaceSize,
            height: layout.spaceSize,
          },
        },
        constraints: layout.constraints,
        marks: [],
        enabled: true,
      });
    }
  }

  return hotspots;
}

/**
 * Find hotspot at a given position
 */
export function findHotspotAtPosition(hotspots: Hotspot[], position: Position): Hotspot | null {
  // Iterate in reverse to check higher z-index items first
  for (let i = hotspots.length - 1; i >= 0; i--) {
    const hotspot = hotspots[i];
    if (!hotspot.enabled || hotspot.readOnly) continue;

    const shape = hotspot.shape;
    let isInside = false;

    switch (shape.type) {
      case 'rectangle': {
        const rect = shape.bounds;
        isInside =
          position.x >= rect.x &&
          position.x <= rect.x + rect.width &&
          position.y >= rect.y &&
          position.y <= rect.y + rect.height;
        break;
      }
      case 'circle': {
        const circle = shape.bounds;
        const dx = position.x - circle.center.x;
        const dy = position.y - circle.center.y;
        isInside = dx * dx + dy * dy <= circle.radius * circle.radius;
        break;
      }
      case 'polygon': {
        const vertices = shape.bounds.vertices;
        let inside = false;
        for (let j = 0, k = vertices.length - 1; j < vertices.length; k = j++) {
          const xi = vertices[j].x;
          const yi = vertices[j].y;
          const xk = vertices[k].x;
          const yk = vertices[k].y;
          const intersect =
            yi > position.y !== yk > position.y &&
            position.x < ((xk - xi) * (position.y - yi)) / (yk - yi) + xi;
          if (intersect) inside = !inside;
        }
        isInside = inside;
        break;
      }
    }

    if (isInside) {
      return hotspot;
    }
  }

  return null;
}
