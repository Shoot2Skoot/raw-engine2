/**
 * Utility helper functions
 */

/** Generate a unique ID */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/** Shuffle an array using Fisher-Yates algorithm */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** Check if a point is inside a rectangle */
export function isPointInRect(
  x: number,
  y: number,
  rectX: number,
  rectY: number,
  width: number,
  height: number
): boolean {
  return x >= rectX && x <= rectX + width && y >= rectY && y <= rectY + height;
}

/** Check if a point is inside a circle */
export function isPointInCircle(
  x: number,
  y: number,
  centerX: number,
  centerY: number,
  radius: number
): boolean {
  const dx = x - centerX;
  const dy = y - centerY;
  return dx * dx + dy * dy <= radius * radius;
}

/** Check if a point is inside a polygon */
export function isPointInPolygon(
  x: number,
  y: number,
  points: { x: number; y: number }[]
): boolean {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const xi = points[i].x;
    const yi = points[i].y;
    const xj = points[j].x;
    const yj = points[j].y;

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/** Format a number with leading zeros */
export function padNumber(num: number, length: number): string {
  return num.toString().padStart(length, '0');
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
