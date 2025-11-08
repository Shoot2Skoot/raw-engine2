/**
 * ID Generation Utilities
 */

/**
 * Generate a random ID
 */
export function generateId(prefix?: string): string {
  const random = Math.random().toString(36).substring(2, 11)
  const timestamp = Date.now().toString(36)
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`
}

/**
 * Generate a mark ID
 */
export function generateMarkId(): string {
  return generateId('mark')
}

/**
 * Generate a hotspot ID
 */
export function generateHotspotId(): string {
  return generateId('hotspot')
}

/**
 * Generate a sheet ID
 */
export function generateSheetId(): string {
  return generateId('sheet')
}

/**
 * Generate a region ID
 */
export function generateRegionId(): string {
  return generateId('region')
}

/**
 * Generate a die ID
 */
export function generateDieId(): string {
  return generateId('die')
}

/**
 * Generate a card ID
 */
export function generateCardId(): string {
  return generateId('card')
}

/**
 * Generate a deck ID
 */
export function generateDeckId(): string {
  return generateId('deck')
}

/**
 * Generate an action ID
 */
export function generateActionId(): string {
  return generateId('action')
}

/**
 * Generate a tool ID
 */
export function generateToolId(): string {
  return generateId('tool')
}
