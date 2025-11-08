/**
 * ID Generation Utilities
 */

let idCounter = 0;

/**
 * Generates a unique ID with optional prefix
 */
export function generateId(prefix = 'id'): string {
  idCounter++;
  return `${prefix}_${Date.now()}_${idCounter}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generates a unique ID for marks
 */
export function generateMarkId(): string {
  return generateId('mark');
}

/**
 * Generates a unique ID for hotspots
 */
export function generateHotspotId(): string {
  return generateId('hotspot');
}

/**
 * Generates a unique ID for sheets
 */
export function generateSheetId(): string {
  return generateId('sheet');
}

/**
 * Generates a unique ID for dice
 */
export function generateDieId(): string {
  return generateId('die');
}

/**
 * Generates a unique ID for dice pools
 */
export function generatePoolId(): string {
  return generateId('pool');
}

/**
 * Generates a unique ID for cards
 */
export function generateCardId(): string {
  return generateId('card');
}

/**
 * Generates a unique ID for decks
 */
export function generateDeckId(): string {
  return generateId('deck');
}

/**
 * Generates a unique ID for games
 */
export function generateGameId(): string {
  return generateId('game');
}
