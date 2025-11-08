/**
 * Hotspot utilities - Generate hotspots from layout configurations
 */

import type {
  Hotspot,
  RectHotspot,
  CircleHotspot,
  GridLayoutConfig,
  TrackLayoutConfig,
  Position,
} from '../types';

/**
 * Generate hotspots for a grid layout
 */
export function generateGridHotspots(
  sheetId: string,
  config: GridLayoutConfig
): RectHotspot[] {
  const hotspots: RectHotspot[] = [];
  const cellSize = config.cellSize || 50;
  const gap = config.gap || 2;
  const offsetX = config.offsetX || 0;
  const offsetY = config.offsetY || 0;

  for (let row = 0; row < config.rows; row++) {
    for (let col = 0; col < config.columns; col++) {
      const x = offsetX + col * (cellSize + gap);
      const y = offsetY + row * (cellSize + gap);

      hotspots.push({
        id: `${sheetId}-cell-${row}-${col}`,
        sheetId,
        shape: 'rect',
        x,
        y,
        width: cellSize,
        height: cellSize,
        allowedMarks: config.allowedMarks,
        maxMarks: 1,
      });
    }
  }

  return hotspots;
}

/**
 * Generate hotspots for a linear track
 */
export function generateTrackHotspots(
  sheetId: string,
  config: TrackLayoutConfig
): CircleHotspot[] | RectHotspot[] {
  const hotspots: CircleHotspot[] = [];
  const spaceSize = config.spaceSize || 30;
  const gap = config.gap || 5;

  if (config.orientation === 'custom' && config.path) {
    // Custom path track
    config.path.forEach((pos, index) => {
      hotspots.push({
        id: `${sheetId}-track-${index}`,
        sheetId,
        shape: 'circle',
        centerX: pos.x,
        centerY: pos.y,
        radius: spaceSize / 2,
        allowedMarks: config.allowedMarks,
        maxMarks: 1,
      });
    });
  } else {
    // Linear track
    const isHorizontal = config.orientation !== 'vertical';

    for (let i = 0; i < config.spaces; i++) {
      const centerX = isHorizontal ? i * (spaceSize + gap) + spaceSize / 2 : spaceSize / 2;
      const centerY = isHorizontal ? spaceSize / 2 : i * (spaceSize + gap) + spaceSize / 2;

      hotspots.push({
        id: `${sheetId}-track-${i}`,
        sheetId,
        shape: 'circle',
        centerX,
        centerY,
        radius: spaceSize / 2,
        allowedMarks: config.allowedMarks,
        maxMarks: 1,
      });
    }
  }

  return hotspots;
}

/**
 * Generate hotspots for a connection grid (nodes for line drawing)
 */
export function generateConnectionHotspots(
  sheetId: string,
  rows: number,
  columns: number,
  pointSize: number = 8,
  gap: number = 40
): CircleHotspot[] {
  const hotspots: CircleHotspot[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const centerX = col * gap + gap;
      const centerY = row * gap + gap;

      hotspots.push({
        id: `${sheetId}-node-${row}-${col}`,
        sheetId,
        shape: 'circle',
        centerX,
        centerY,
        radius: pointSize / 2,
        allowedMarks: ['line'],
        maxMarks: 8, // Can connect in multiple directions
      });
    }
  }

  return hotspots;
}

/**
 * Check if a point is inside a hotspot
 */
export function isPointInHotspot(x: number, y: number, hotspot: Hotspot): boolean {
  switch (hotspot.shape) {
    case 'rect':
      return (
        x >= hotspot.x &&
        x <= hotspot.x + hotspot.width &&
        y >= hotspot.y &&
        y <= hotspot.y + hotspot.height
      );

    case 'circle': {
      const dx = x - hotspot.centerX;
      const dy = y - hotspot.centerY;
      return Math.sqrt(dx * dx + dy * dy) <= hotspot.radius;
    }

    case 'polygon':
      return isPointInPolygon({ x, y }, hotspot.points);

    default:
      return false;
  }
}

/**
 * Point-in-polygon test using ray casting algorithm
 */
function isPointInPolygon(point: Position, polygon: Position[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    const intersect =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Find hotspot at a given position
 */
export function findHotspotAtPosition(
  x: number,
  y: number,
  hotspots: Hotspot[]
): Hotspot | undefined {
  // Search in reverse order to prioritize higher z-index hotspots
  for (let i = hotspots.length - 1; i >= 0; i--) {
    if (isPointInHotspot(x, y, hotspots[i])) {
      return hotspots[i];
    }
  }
  return undefined;
}

/**
 * Get adjacent hotspots (for connection grids)
 */
export function getAdjacentHotspots(
  hotspot: Hotspot,
  allHotspots: Hotspot[],
  allowDiagonal: boolean = false
): Hotspot[] {
  if (hotspot.shape !== 'circle') return [];

  const maxDistance = 60; // Max pixel distance to be considered adjacent
  const adjacent: Hotspot[] = [];

  for (const other of allHotspots) {
    if (other.id === hotspot.id || other.shape !== 'circle') continue;

    const dx = other.centerX - hotspot.centerX;
    const dy = other.centerY - hotspot.centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= maxDistance) {
      if (allowDiagonal) {
        adjacent.push(other);
      } else {
        // Only orthogonal connections (horizontal or vertical)
        if (Math.abs(dx) < 5 || Math.abs(dy) < 5) {
          adjacent.push(other);
        }
      }
    }
  }

  return adjacent;
}
