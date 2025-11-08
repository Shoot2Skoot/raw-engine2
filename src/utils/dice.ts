/**
 * Utility functions for working with dice
 */

import type {
  Die,
  StandardDie,
  CustomDie,
  StandardDieType,
  DieFace,
  DicePool,
} from '../types';

/**
 * Generate a unique ID for dice
 */
export function generateDieId(): string {
  return `die_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Get the maximum value for a standard die
 */
export function getStandardDieMax(type: StandardDieType): number {
  const maxValues: Record<StandardDieType, number> = {
    d4: 4,
    d6: 6,
    d8: 8,
    d10: 10,
    d12: 12,
    d20: 20,
  };
  return maxValues[type];
}

/**
 * Roll a standard die
 */
export function rollStandardDie(type: StandardDieType): number {
  const max = getStandardDieMax(type);
  return Math.floor(Math.random() * max) + 1;
}

/**
 * Roll a custom die (considering weights)
 */
export function rollCustomDie(faces: DieFace[]): DieFace {
  const totalWeight = faces.reduce((sum, face) => sum + (face.weight ?? 1), 0);
  let random = Math.random() * totalWeight;

  for (const face of faces) {
    random -= face.weight ?? 1;
    if (random <= 0) {
      return face;
    }
  }

  // Fallback (should never reach here)
  return faces[faces.length - 1];
}

/**
 * Create a standard die
 */
export function createStandardDie(type: StandardDieType): StandardDie {
  return {
    id: generateDieId(),
    type,
    locked: false,
    modified: false,
  };
}

/**
 * Create a custom die
 */
export function createCustomDie(name: string, faces: DieFace[]): CustomDie {
  return {
    id: generateDieId(),
    name,
    faces,
    locked: false,
    modified: false,
  };
}

/**
 * Create multiple standard dice
 */
export function createStandardDice(type: StandardDieType, count: number): StandardDie[] {
  return Array.from({ length: count }, () => createStandardDie(type));
}

/**
 * Roll a die (standard or custom)
 */
export function rollDie(die: Die): Die {
  if ('type' in die) {
    // Standard die
    return {
      ...die,
      currentValue: rollStandardDie(die.type),
      modified: false,
    };
  } else {
    // Custom die
    return {
      ...die,
      currentValue: rollCustomDie(die.faces),
      modified: false,
    };
  }
}

/**
 * Roll multiple dice
 */
export function rollDice(dice: Die[]): Die[] {
  return dice.map(die => (die.locked ? die : rollDie(die)));
}

/**
 * Lock a die
 */
export function lockDie(die: Die): Die {
  return { ...die, locked: true };
}

/**
 * Unlock a die
 */
export function unlockDie(die: Die): Die {
  return { ...die, locked: false };
}

/**
 * Modify a standard die value
 */
export function modifyStandardDie(die: StandardDie, newValue: number): StandardDie {
  const max = getStandardDieMax(die.type);
  const clampedValue = Math.max(1, Math.min(max, newValue));

  return {
    ...die,
    currentValue: clampedValue,
    modified: true,
  };
}

/**
 * Modify a custom die value
 */
export function modifyCustomDie(die: CustomDie, newValue: DieFace): CustomDie {
  return {
    ...die,
    currentValue: newValue,
    modified: true,
  };
}

/**
 * Flip a standard die to opposite side
 */
export function flipStandardDie(die: StandardDie): StandardDie {
  if (die.currentValue === undefined) return die;

  const max = getStandardDieMax(die.type);
  const flipped = max + 1 - die.currentValue;

  return {
    ...die,
    currentValue: flipped,
    modified: true,
  };
}

/**
 * Create a dice pool
 */
export function createDicePool(name: string, dice: Die[]): DicePool {
  return {
    id: `pool_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
    name,
    dice,
  };
}

/**
 * Get total sum of dice in a pool (standard dice only)
 */
export function getDicePoolSum(pool: DicePool): number {
  return pool.dice.reduce((sum, die) => {
    if ('type' in die && die.currentValue !== undefined) {
      return sum + die.currentValue;
    }
    return sum;
  }, 0);
}

/**
 * Move a die from one pool to another
 */
export function moveDie(
  fromPool: DicePool,
  toPool: DicePool,
  dieId: string
): [DicePool, DicePool] | null {
  const dieIndex = fromPool.dice.findIndex(d => d.id === dieId);
  if (dieIndex === -1) return null;

  const die = fromPool.dice[dieIndex];
  const newFromPool = {
    ...fromPool,
    dice: fromPool.dice.filter((_, i) => i !== dieIndex),
  };
  const newToPool = {
    ...toPool,
    dice: [...toPool.dice, die],
  };

  return [newFromPool, newToPool];
}
