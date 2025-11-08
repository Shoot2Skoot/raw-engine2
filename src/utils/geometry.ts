/**
 * Geometry utilities for hotspot hit detection
 */

import type {
  Hotspot,
  RectangleGeometry,
  CircleGeometry,
  PolygonGeometry,
} from '../types';

/** Check if a point is inside a rectangle */
export function pointInRectangle(
  point: { x: number; y: number },
  rect: RectangleGeometry
): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

/** Check if a point is inside a circle */
export function pointInCircle(
  point: { x: number; y: number },
  circle: CircleGeometry
): boolean {
  const dx = point.x - circle.cx;
  const dy = point.y - circle.cy;
  const distanceSquared = dx * dx + dy * dy;
  return distanceSquared <= circle.radius * circle.radius;
}

/** Check if a point is inside a polygon (ray casting algorithm) */
export function pointInPolygon(
  point: { x: number; y: number },
  polygon: PolygonGeometry
): boolean {
  const { points } = polygon;
  let inside = false;

  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const xi = points[i].x;
    const yi = points[i].y;
    const xj = points[j].x;
    const yj = points[j].y;

    const intersect =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;

    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}

/** Check if a point is inside a hotspot */
export function pointInHotspot(
  point: { x: number; y: number },
  hotspot: Hotspot
): boolean {
  switch (hotspot.shape) {
    case 'rectangle':
      return pointInRectangle(point, hotspot.geometry as RectangleGeometry);
    case 'circle':
      return pointInCircle(point, hotspot.geometry as CircleGeometry);
    case 'polygon':
      return pointInPolygon(point, hotspot.geometry as PolygonGeometry);
    default:
      return false;
  }
}

/** Find the first hotspot that contains a point (considering z-index) */
export function findHotspotAtPoint(
  point: { x: number; y: number },
  hotspots: Hotspot[]
): Hotspot | null {
  // Sort by z-index (higher z-index = on top)
  const sorted = [...hotspots].sort(
    (a, b) => (b.zIndex || 0) - (a.zIndex || 0)
  );

  for (const hotspot of sorted) {
    if (pointInHotspot(point, hotspot)) {
      return hotspot;
    }
  }

  return null;
}

/** Get the bounding box of a hotspot */
export function getHotspotBounds(hotspot: Hotspot): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  switch (hotspot.shape) {
    case 'rectangle': {
      const rect = hotspot.geometry as RectangleGeometry;
      return {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      };
    }
    case 'circle': {
      const circle = hotspot.geometry as CircleGeometry;
      return {
        x: circle.cx - circle.radius,
        y: circle.cy - circle.radius,
        width: circle.radius * 2,
        height: circle.radius * 2,
      };
    }
    case 'polygon': {
      const polygon = hotspot.geometry as PolygonGeometry;
      const xs = polygon.points.map(p => p.x);
      const ys = polygon.points.map(p => p.y);
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

/** Get the center point of a hotspot */
export function getHotspotCenter(hotspot: Hotspot): { x: number; y: number } {
  switch (hotspot.shape) {
    case 'rectangle': {
      const rect = hotspot.geometry as RectangleGeometry;
      return {
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2,
      };
    }
    case 'circle': {
      const circle = hotspot.geometry as CircleGeometry;
      return { x: circle.cx, y: circle.cy };
    }
    case 'polygon': {
      const polygon = hotspot.geometry as PolygonGeometry;
      const sumX = polygon.points.reduce((sum, p) => sum + p.x, 0);
      const sumY = polygon.points.reduce((sum, p) => sum + p.y, 0);
      return {
        x: sumX / polygon.points.length,
        y: sumY / polygon.points.length,
      };
    }
  }
}

/** Calculate distance between two points */
export function distance(
  p1: { x: number; y: number },
  p2: { x: number; y: number }
): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/** Check if two hotspots are adjacent (close enough to connect) */
export function areHotspotsAdjacent(
  h1: Hotspot,
  h2: Hotspot,
  maxDistance: number = 50
): boolean {
  const center1 = getHotspotCenter(h1);
  const center2 = getHotspotCenter(h2);
  return distance(center1, center2) <= maxDistance;
}
