/**
 * Utility functions for the game engine
 */

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Fisher-Yates shuffle algorithm
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Roll a standard die
 */
export function rollStandardDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

/**
 * Roll a custom die
 */
export function rollCustomDie<T>(faces: T[]): T {
  return faces[Math.floor(Math.random() * faces.length)];
}

/**
 * Check if a point is inside a rectangle
 */
export function isPointInRect(
  x: number,
  y: number,
  rectX: number,
  rectY: number,
  rectWidth: number,
  rectHeight: number
): boolean {
  return x >= rectX && x <= rectX + rectWidth && y >= rectY && y <= rectY + rectHeight;
}

/**
 * Check if a point is inside a circle
 */
export function isPointInCircle(
  x: number,
  y: number,
  cx: number,
  cy: number,
  r: number
): boolean {
  const dx = x - cx;
  const dy = y - cy;
  return dx * dx + dy * dy <= r * r;
}

/**
 * Check if a point is inside a polygon using ray casting algorithm
 */
export function isPointInPolygon(
  x: number,
  y: number,
  points: Array<{ x: number; y: number }>
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

/**
 * Save to localStorage
 */
export function saveToLocalStorage(key: string, data: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

/**
 * Load from localStorage
 */
export function loadFromLocalStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
}

/**
 * Download data as JSON file
 */
export function downloadJSON(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate grid hotspots from grid configuration
 */
export function generateGridHotspots(
  rows: number,
  columns: number,
  cellWidth: number,
  cellHeight: number,
  gap: number = 0,
  offsetX: number = 0,
  offsetY: number = 0,
  allowedMarkTypes: Array<'checkbox' | 'number' | 'color' | 'circle' | 'symbol' | 'text' | 'line'>
): Array<{
  id: string;
  shape: 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
  allowedMarkTypes: Array<'checkbox' | 'number' | 'color' | 'circle' | 'symbol' | 'text' | 'line'>;
  row: number;
  col: number;
}> {
  const hotspots = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      hotspots.push({
        id: `cell-${row}-${col}`,
        shape: 'rectangle' as const,
        x: offsetX + col * (cellWidth + gap),
        y: offsetY + row * (cellHeight + gap),
        width: cellWidth,
        height: cellHeight,
        allowedMarkTypes,
        row,
        col,
      });
    }
  }
  return hotspots;
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString();
}
