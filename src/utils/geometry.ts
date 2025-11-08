/**
 * Geometry Utilities for Hotspot Detection
 */

import type { Position, Rectangle, Circle, Polygon } from '../types';

/**
 * Checks if a point is inside a rectangle
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
 * Checks if a point is inside a circle
 */
export function isPointInCircle(point: Position, circle: Circle): boolean {
  const dx = point.x - circle.center.x;
  const dy = point.y - circle.center.y;
  const distanceSquared = dx * dx + dy * dy;
  return distanceSquared <= circle.radius * circle.radius;
}

/**
 * Checks if a point is inside a polygon using ray casting algorithm
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

    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}

/**
 * Calculates the distance between two points
 */
export function distance(p1: Position, p2: Position): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculates the center point of a rectangle
 */
export function rectangleCenter(rect: Rectangle): Position {
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  };
}

/**
 * Calculates the bounding box of a polygon
 */
export function polygonBoundingBox(polygon: Polygon): Rectangle {
  const xs = polygon.vertices.map((v) => v.x);
  const ys = polygon.vertices.map((v) => v.y);

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

/**
 * Calculates the center point of a polygon
 */
export function polygonCenter(polygon: Polygon): Position {
  const bbox = polygonBoundingBox(polygon);
  return rectangleCenter(bbox);
}

/**
 * Creates a rectangle from top-left corner and size
 */
export function createRectangle(
  x: number,
  y: number,
  width: number,
  height: number
): Rectangle {
  return { x, y, width, height };
}

/**
 * Creates a circle from center point and radius
 */
export function createCircle(x: number, y: number, radius: number): Circle {
  return { center: { x, y }, radius };
}

/**
 * Creates a polygon from an array of points
 */
export function createPolygon(vertices: Position[]): Polygon {
  return { vertices };
}
