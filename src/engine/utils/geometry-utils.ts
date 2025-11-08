/**
 * Geometry Utility Functions
 * Hit detection, point-in-shape tests, and geometric calculations
 */

import type {
  Position,
  Rectangle,
  Circle,
  Polygon,
  HotspotShape,
} from '../types/hotspots';
import {
  isRectangle,
  isCircle,
  isPolygon,
} from '../types/hotspots';

/**
 * Check if a point is inside a rectangle
 */
export function pointInRectangle(point: Position, rect: Rectangle): boolean {
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
export function pointInCircle(point: Position, circle: Circle): boolean {
  const dx = point.x - circle.center.x;
  const dy = point.y - circle.center.y;
  const distanceSquared = dx * dx + dy * dy;
  return distanceSquared <= circle.radius * circle.radius;
}

/**
 * Check if a point is inside a polygon (ray casting algorithm)
 */
export function pointInPolygon(point: Position, polygon: Polygon): boolean {
  const { vertices } = polygon;
  let inside = false;

  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const xi = vertices[i].x;
    const yi = vertices[i].y;
    const xj = vertices[j].x;
    const yj = vertices[j].y;

    const intersect =
      yi > point.y !== yj > point.y && point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * Check if a point is inside any hotspot shape
 */
export function pointInShape(point: Position, shape: HotspotShape): boolean {
  if (isRectangle(shape)) {
    return pointInRectangle(point, shape);
  } else if (isCircle(shape)) {
    return pointInCircle(point, shape);
  } else if (isPolygon(shape)) {
    return pointInPolygon(point, shape);
  }
  return false;
}

/**
 * Get bounding box of any shape
 */
export function getShapeBounds(shape: HotspotShape): Rectangle {
  if (isRectangle(shape)) {
    return shape;
  } else if (isCircle(shape)) {
    return {
      x: shape.center.x - shape.radius,
      y: shape.center.y - shape.radius,
      width: shape.radius * 2,
      height: shape.radius * 2,
    };
  } else if (isPolygon(shape)) {
    const xs = shape.vertices.map((v) => v.x);
    const ys = shape.vertices.map((v) => v.y);
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
  return { x: 0, y: 0, width: 0, height: 0 };
}

/**
 * Get center point of any shape
 */
export function getShapeCenter(shape: HotspotShape): Position {
  if (isRectangle(shape)) {
    return {
      x: shape.x + shape.width / 2,
      y: shape.y + shape.height / 2,
    };
  } else if (isCircle(shape)) {
    return shape.center;
  } else if (isPolygon(shape)) {
    const sumX = shape.vertices.reduce((sum, v) => sum + v.x, 0);
    const sumY = shape.vertices.reduce((sum, v) => sum + v.y, 0);
    return {
      x: sumX / shape.vertices.length,
      y: sumY / shape.vertices.length,
    };
  }
  return { x: 0, y: 0 };
}

/**
 * Calculate distance between two points
 */
export function distance(p1: Position, p2: Position): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate angle between two points (in radians)
 */
export function angleBetween(p1: Position, p2: Position): number {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

/**
 * Linear interpolation between two points
 */
export function lerp(p1: Position, p2: Position, t: number): Position {
  return {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t,
  };
}

/**
 * Generate points along a line (for drawing connections)
 */
export function pointsAlongLine(p1: Position, p2: Position, segments: number): Position[] {
  const points: Position[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    points.push(lerp(p1, p2, t));
  }
  return points;
}

/**
 * Generate points along a curved path (Bezier curve)
 */
export function pointsAlongCurve(
  p1: Position,
  p2: Position,
  control: Position,
  segments: number
): Position[] {
  const points: Position[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const x =
      (1 - t) * (1 - t) * p1.x + 2 * (1 - t) * t * control.x + t * t * p2.x;
    const y =
      (1 - t) * (1 - t) * p1.y + 2 * (1 - t) * t * control.y + t * t * p2.y;
    points.push({ x, y });
  }
  return points;
}

/**
 * Check if two rectangles overlap
 */
export function rectanglesOverlap(r1: Rectangle, r2: Rectangle): boolean {
  return !(
    r1.x + r1.width < r2.x ||
    r2.x + r2.width < r1.x ||
    r1.y + r1.height < r2.y ||
    r2.y + r2.height < r1.y
  );
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Convert mouse/touch event to canvas position
 */
export function eventToPosition(
  event: MouseEvent | Touch,
  element: HTMLElement
): Position {
  const rect = element.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

/**
 * Scale position by a factor
 */
export function scalePosition(position: Position, scale: number): Position {
  return {
    x: position.x * scale,
    y: position.y * scale,
  };
}

/**
 * Translate position by offset
 */
export function translatePosition(position: Position, offset: Position): Position {
  return {
    x: position.x + offset.x,
    y: position.y + offset.y,
  };
}
