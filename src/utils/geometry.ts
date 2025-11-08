/**
 * Geometry utilities for hotspot collision detection and positioning
 */

import type { Position, Rectangle, Circle, Polygon, HotspotShape } from '../types';

/**
 * Check if a point is inside a rectangle
 */
export function isPointInRectangle(point: Position, rect: Rectangle): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

/**
 * Check if a point is inside a circle
 */
export function isPointInCircle(point: Position, circle: Circle): boolean {
  const dx = point.x - circle.center.x;
  const dy = point.y - circle.center.y;
  return dx * dx + dy * dy <= circle.radius * circle.radius;
}

/**
 * Check if a point is inside a polygon using ray casting algorithm
 */
export function isPointInPolygon(point: Position, polygon: Polygon): boolean {
  const vertices = polygon.vertices;
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
 * Check if a point is inside a hotspot of any shape
 */
export function isPointInHotspot(point: Position, shape: HotspotShape): boolean {
  switch (shape.type) {
    case 'rectangle':
      return isPointInRectangle(point, shape.bounds);
    case 'circle':
      return isPointInCircle(point, shape.bounds);
    case 'polygon':
      return isPointInPolygon(point, shape.bounds);
    default:
      return false;
  }
}

/**
 * Get bounding box for a hotspot shape
 */
export function getShapeBounds(shape: HotspotShape): Rectangle {
  switch (shape.type) {
    case 'rectangle':
      return shape.bounds;
    case 'circle': {
      const { center, radius } = shape.bounds;
      return {
        x: center.x - radius,
        y: center.y - radius,
        width: radius * 2,
        height: radius * 2,
      };
    }
    case 'polygon': {
      const vertices = shape.bounds.vertices;
      if (vertices.length === 0) {
        return { x: 0, y: 0, width: 0, height: 0 };
      }
      const xs = vertices.map((v) => v.x);
      const ys = vertices.map((v) => v.y);
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
 * Convert mouse/touch event to position relative to element
 */
export function getRelativePosition(
  event: MouseEvent | TouchEvent,
  element: HTMLElement
): Position {
  const rect = element.getBoundingClientRect();
  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
}
