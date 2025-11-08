/**
 * Utilities for dice rolling and manipulation
 */

import type { Die, DieFace, StandardDieType } from '../types';

/**
 * Rolls a single die and returns the result
 */
export function rollDie(die: Die): DieFace | number {
  if (die.config.type === 'standard') {
    const sides = getStandardDieSides(die.config.sides);
    return Math.floor(Math.random() * sides) + 1;
  } else {
    // Custom die with faces
    const { faces, weights } = die.config;

    if (weights && weights.length === faces.length) {
      // Weighted random selection
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);
      let random = Math.random() * totalWeight;

      for (let i = 0; i < faces.length; i++) {
        random -= weights[i];
        if (random <= 0) {
          return faces[i];
        }
      }
    }

    // Uniform random selection
    const index = Math.floor(Math.random() * faces.length);
    return faces[index];
  }
}

/**
 * Rolls multiple dice and returns results
 */
export function rollDice(dice: Die[]): Array<{ dieId: string; result: DieFace | number }> {
  return dice
    .filter(die => !die.locked)
    .map(die => ({
      dieId: die.id,
      result: rollDie(die)
    }));
}

/**
 * Gets the number of sides for a standard die type
 */
export function getStandardDieSides(type: StandardDieType): number {
  switch (type) {
    case 'd4': return 4;
    case 'd6': return 6;
    case 'd8': return 8;
    case 'd10': return 10;
    case 'd12': return 12;
    case 'd20': return 20;
  }
}

/**
 * Modifies a die value (for +1/-1 adjustments)
 */
export function modifyDieValue(
  currentValue: DieFace | number,
  modification: number,
  die: Die
): DieFace | number {
  if (typeof currentValue === 'number') {
    if (die.config.type === 'standard') {
      const sides = getStandardDieSides(die.config.sides);
      const newValue = currentValue + modification;
      // Clamp to valid range
      return Math.max(1, Math.min(sides, newValue));
    }
  }

  // For custom dice, modification is not straightforward
  // Return the current value unchanged
  return currentValue;
}

/**
 * Formats a die face for display
 */
export function formatDieFace(face: DieFace | number): string {
  if (typeof face === 'number') {
    return face.toString();
  }

  switch (face.type) {
    case 'number':
      return face.value.toString();
    case 'symbol':
      return face.symbol;
    case 'text':
      return face.text;
    case 'color':
      return face.color;
    case 'combination':
      return face.content.map(c => c.value).join(' ');
  }
}
