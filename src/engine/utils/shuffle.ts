/**
 * Shuffle Utilities
 * Fisher-Yates shuffle implementation for randomization
 */

/**
 * Shuffle an array in place using Fisher-Yates algorithm
 * @param array - Array to shuffle
 * @returns The shuffled array (mutated in place)
 */
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array]; // Create a copy to avoid mutation
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generate a random integer between min (inclusive) and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Pick a random element from an array
 */
export function randomElement<T>(array: T[]): T {
  return array[randomInt(0, array.length - 1)];
}

/**
 * Weighted random selection
 * @param items - Array of items
 * @param weights - Array of weights corresponding to items
 * @returns Selected item based on weights
 */
export function weightedRandom<T>(items: T[], weights: number[]): T {
  if (items.length !== weights.length) {
    throw new Error('Items and weights arrays must have the same length');
  }

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return items[i];
    }
  }

  return items[items.length - 1]; // Fallback (shouldn't reach here)
}
