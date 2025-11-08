/**
 * Random Number Generation Utilities
 */

/**
 * Generates a random integer between min (inclusive) and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Rolls a standard die (d4, d6, d8, d10, d12, d20)
 */
export function rollStandardDie(sides: number): number {
  return randomInt(1, sides);
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 * Returns a new array, does not mutate the original
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
 * Selects a random element from an array
 */
export function randomElement<T>(array: T[]): T {
  return array[randomInt(0, array.length - 1)];
}

/**
 * Selects a weighted random element from an array
 * weights array must be same length as values array
 */
export function weightedRandomElement<T>(
  values: T[],
  weights: number[]
): T {
  if (values.length !== weights.length) {
    throw new Error('Values and weights arrays must have the same length');
  }

  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < values.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return values[i];
    }
  }

  // Fallback (should never reach here)
  return values[values.length - 1];
}

/**
 * Splits an array into N approximately equal chunks
 */
export function splitArray<T>(array: T[], chunks: number): T[][] {
  const result: T[][] = [];
  const chunkSize = Math.ceil(array.length / chunks);

  for (let i = 0; i < chunks; i++) {
    const start = i * chunkSize;
    const end = start + chunkSize;
    const chunk = array.slice(start, end);
    if (chunk.length > 0) {
      result.push(chunk);
    }
  }

  return result;
}
