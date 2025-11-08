/**
 * Dice Utilities
 * Helper functions for dice rolling and management
 */

import type {
  StandardDie,
  CustomDie,
  Die,
  DicePool,
  RollResult,
  StandardDieType,
  CustomFace,
} from '../types';

/**
 * Get maximum value for a standard die
 */
function getStandardDieMax(dieType: StandardDieType): number {
  const maxValues: Record<StandardDieType, number> = {
    d4: 4,
    d6: 6,
    d8: 8,
    d10: 10,
    d12: 12,
    d20: 20,
  };
  return maxValues[dieType];
}

/**
 * Roll a standard die
 */
export function rollStandardDie(die: StandardDie): number {
  const max = getStandardDieMax(die.dieType);
  return Math.floor(Math.random() * max) + 1;
}

/**
 * Roll a custom die
 */
export function rollCustomDie(die: CustomDie): CustomFace {
  // Calculate total weight
  const totalWeight = die.faces.reduce((sum, face) => sum + (face.weight || 1), 0);

  // Generate random value
  let random = Math.random() * totalWeight;

  // Select face based on weight
  for (const face of die.faces) {
    random -= face.weight || 1;
    if (random <= 0) {
      return face;
    }
  }

  // Fallback to last face
  return die.faces[die.faces.length - 1];
}

/**
 * Roll a single die
 */
export function rollDie(die: Die): Die {
  if (die.locked) {
    return die;
  }

  if (die.type === 'standard') {
    return {
      ...die,
      value: rollStandardDie(die),
      modified: false,
    };
  } else {
    return {
      ...die,
      currentFace: rollCustomDie(die),
      modified: false,
    };
  }
}

/**
 * Roll all dice in a pool
 */
export function rollDicePool(pool: DicePool): { pool: DicePool; result: RollResult } {
  const rolledDice = pool.dice.map((die) => rollDie(die));

  const results = rolledDice.map((die) => ({
    dieId: die.id,
    value: die.type === 'standard' ? (die.value ?? 0) : (die.currentFace?.value ?? 0),
  }));

  const sum = results.reduce((acc, result) => {
    if (typeof result.value === 'number') {
      return acc + result.value;
    }
    return acc;
  }, 0);

  const rollResult: RollResult = {
    timestamp: Date.now(),
    poolId: pool.id,
    results,
    sum,
  };

  return {
    pool: { ...pool, dice: rolledDice },
    result: rollResult,
  };
}

/**
 * Create a standard die
 */
export function createStandardDie(
  dieType: StandardDieType,
  id?: string
): StandardDie {
  return {
    type: 'standard',
    dieType,
    id: id || `die-${dieType}-${Date.now()}`,
    value: null,
    locked: false,
    modified: false,
  };
}

/**
 * Create a custom die
 */
export function createCustomDie(faces: CustomFace[], id?: string): CustomDie {
  return {
    type: 'custom',
    id: id || `custom-die-${Date.now()}`,
    faces,
    currentFace: null,
    locked: false,
    modified: false,
  };
}

/**
 * Create a dice pool
 */
export function createDicePool(
  name: string,
  dice: Die[],
  id?: string
): DicePool {
  return {
    id: id || `pool-${Date.now()}`,
    name,
    dice,
  };
}

/**
 * Lock/unlock a die
 */
export function toggleDieLock(die: Die): Die {
  return { ...die, locked: !die.locked };
}

/**
 * Modify a standard die value
 */
export function modifyStandardDieValue(
  die: StandardDie,
  modification: 'increment' | 'decrement' | 'set',
  value?: number
): StandardDie {
  if (die.value === null) return die;

  const max = getStandardDieMax(die.dieType);
  let newValue = die.value;

  switch (modification) {
    case 'increment':
      newValue = Math.min(die.value + (value || 1), max);
      break;
    case 'decrement':
      newValue = Math.max(die.value - (value || 1), 1);
      break;
    case 'set':
      if (value !== undefined && value >= 1 && value <= max) {
        newValue = value;
      }
      break;
  }

  return {
    ...die,
    value: newValue,
    modified: true,
  };
}
