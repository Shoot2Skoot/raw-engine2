/**
 * ID Generation Utilities
 * Generate unique IDs for marks, hotspots, dice, cards, etc.
 */

let counter = 0;

/** Generate a unique ID with optional prefix */
export function generateId(prefix: string = 'id'): string {
  counter += 1;
  return `${prefix}-${Date.now()}-${counter}`;
}

/** Generate multiple unique IDs at once */
export function generateIds(count: number, prefix: string = 'id'): string[] {
  return Array.from({ length: count }, () => generateId(prefix));
}

/** Reset the counter (useful for testing) */
export function resetIdCounter(): void {
  counter = 0;
}
