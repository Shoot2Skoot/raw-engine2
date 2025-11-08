/**
 * Dice Utility Functions
 */

import type {
  Die,
  DieResult,
  StandardDie,
  CustomDie,
  DieFace,
  StandardDiceType,
} from '../types/dice';
import {
  isCustomDie,
  isStandardDie,
} from '../types/dice';

/**
 * Get number of sides for a standard die
 */
export function getStandardDieSides(type: StandardDiceType): number {
  const sides: Record<StandardDiceType, number> = {
    d4: 4,
    d6: 6,
    d8: 8,
    d10: 10,
    d12: 12,
    d20: 20,
    d100: 100,
  };
  return sides[type];
}

/**
 * Roll a standard die
 */
export function rollStandardDie(die: StandardDie): DieResult {
  const sides = getStandardDieSides(die.type);
  const value = Math.floor(Math.random() * sides) + 1;

  return {
    dieId: die.id,
    faceIndex: value - 1,
    face: value,
    locked: false,
    modified: false,
    resultId: `${die.id}-${Date.now()}-${Math.random()}`,
  };
}

/**
 * Roll a custom die (with optional weighted probability)
 */
export function rollCustomDie(die: CustomDie): DieResult {
  let faceIndex: number;

  if (die.weights && die.weights.length === die.faces.length) {
    // Weighted roll
    faceIndex = weightedRandom(die.weights);
  } else {
    // Uniform random
    faceIndex = Math.floor(Math.random() * die.faces.length);
  }

  return {
    dieId: die.id,
    faceIndex,
    face: die.faces[faceIndex],
    locked: false,
    modified: false,
    resultId: `${die.id}-${Date.now()}-${Math.random()}`,
  };
}

/**
 * Roll any die
 */
export function rollDie(die: Die): DieResult {
  if (isStandardDie(die)) {
    return rollStandardDie(die);
  } else {
    return rollCustomDie(die);
  }
}

/**
 * Roll multiple dice
 */
export function rollDice(dice: Die[]): DieResult[] {
  return dice.map((die) => rollDie(die));
}

/**
 * Reroll a specific die result
 */
export function rerollDie(die: Die, previousResult: DieResult): DieResult {
  const newResult = rollDie(die);
  return {
    ...newResult,
    locked: previousResult.locked,
    modified: true,
  };
}

/**
 * Increment die value (for standard numeric dice)
 */
export function incrementDie(die: Die, result: DieResult): DieResult {
  if (isStandardDie(die)) {
    const sides = getStandardDieSides(die.type);
    const currentValue = result.face as number;
    const newValue = currentValue >= sides ? sides : currentValue + 1;

    return {
      ...result,
      face: newValue,
      faceIndex: newValue - 1,
      modified: true,
    };
  }

  // For custom dice, cycle to next face
  if (isCustomDie(die)) {
    const newIndex = (result.faceIndex + 1) % die.faces.length;
    return {
      ...result,
      faceIndex: newIndex,
      face: die.faces[newIndex],
      modified: true,
    };
  }

  return result;
}

/**
 * Decrement die value (for standard numeric dice)
 */
export function decrementDie(die: Die, result: DieResult): DieResult {
  if (isStandardDie(die)) {
    const currentValue = result.face as number;
    const newValue = currentValue <= 1 ? 1 : currentValue - 1;

    return {
      ...result,
      face: newValue,
      faceIndex: newValue - 1,
      modified: true,
    };
  }

  // For custom dice, cycle to previous face
  if (isCustomDie(die)) {
    const newIndex = result.faceIndex === 0 ? die.faces.length - 1 : result.faceIndex - 1;
    return {
      ...result,
      faceIndex: newIndex,
      face: die.faces[newIndex],
      modified: true,
    };
  }

  return result;
}

/**
 * Flip die to opposite side
 */
export function flipDie(die: Die, result: DieResult): DieResult {
  if (isStandardDie(die)) {
    const sides = getStandardDieSides(die.type);
    const currentValue = result.face as number;
    const newValue = sides - currentValue + 1;

    return {
      ...result,
      face: newValue,
      faceIndex: newValue - 1,
      modified: true,
    };
  }

  // For custom dice, flip to opposite face
  if (isCustomDie(die)) {
    const newIndex = die.faces.length - 1 - result.faceIndex;
    return {
      ...result,
      faceIndex: newIndex,
      face: die.faces[newIndex],
      modified: true,
    };
  }

  return result;
}

/**
 * Set die to specific value
 */
export function setDieValue(die: Die, result: DieResult, value: number): DieResult {
  if (isStandardDie(die)) {
    const sides = getStandardDieSides(die.type);
    const clampedValue = Math.max(1, Math.min(sides, value));

    return {
      ...result,
      face: clampedValue,
      faceIndex: clampedValue - 1,
      modified: true,
    };
  }

  // For custom dice, set by index
  if (isCustomDie(die)) {
    const clampedIndex = Math.max(0, Math.min(die.faces.length - 1, value));
    return {
      ...result,
      faceIndex: clampedIndex,
      face: die.faces[clampedIndex],
      modified: true,
    };
  }

  return result;
}

/**
 * Lock/unlock a die result
 */
export function toggleLock(result: DieResult): DieResult {
  return {
    ...result,
    locked: !result.locked,
  };
}

/**
 * Weighted random selection
 */
function weightedRandom(weights: number[]): number {
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < weights.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return i;
    }
  }

  return weights.length - 1;
}

/**
 * Get dice sum (for standard numeric dice)
 */
export function getDiceSum(results: DieResult[]): number {
  return results.reduce((sum, result) => {
    if (typeof result.face === 'number') {
      return sum + result.face;
    }
    if (typeof result.face === 'object' && result.face.value !== undefined) {
      return sum + result.face.value;
    }
    return sum;
  }, 0);
}

/**
 * Display die face as string
 */
export function dieFaceToString(face: DieFace | number): string {
  if (typeof face === 'number') {
    return face.toString();
  }

  if (face.display?.primary) {
    return face.display.primary;
  }

  if (face.value !== undefined) {
    return face.value.toString();
  }

  if (face.text) {
    return face.text;
  }

  if (face.symbol) {
    return face.symbol;
  }

  return '?';
}
