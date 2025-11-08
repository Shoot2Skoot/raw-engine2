/**
 * ID generation utilities
 */

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a short ID (for display)
 */
export function generateShortId(): string {
  return Math.random().toString(36).substr(2, 6);
}
