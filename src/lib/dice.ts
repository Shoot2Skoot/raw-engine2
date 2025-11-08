/**
 * Dice utilities - Rolling, locking, modifying dice
 */

import type { DieDefinition, DieResult, DicePool } from '../types';

/**
 * Roll a single die
 */
export function rollDie(definition: DieDefinition): DieResult {
  const totalWeight = definition.faces.reduce(
    (sum, face) => sum + (face.weight || 1),
    0
  );

  let random = Math.random() * totalWeight;
  let faceIndex = 0;

  for (let i = 0; i < definition.faces.length; i++) {
    random -= definition.faces[i].weight || 1;
    if (random <= 0) {
      faceIndex = i;
      break;
    }
  }

  return {
    id: crypto.randomUUID(),
    dieDefinitionId: definition.id,
    faceIndex,
    locked: false,
    modified: false,
  };
}

/**
 * Roll multiple dice
 */
export function rollMultipleDice(
  definition: DieDefinition,
  count: number
): DieResult[] {
  return Array.from({ length: count }, () => rollDie(definition));
}

/**
 * Re-roll specific dice in a pool, keeping locked ones
 */
export function rerollDice(
  dice: DieResult[],
  definitions: Map<string, DieDefinition>
): DieResult[] {
  return dice.map((die) => {
    if (die.locked) {
      return die;
    }
    const definition = definitions.get(die.dieDefinitionId);
    if (!definition) {
      console.error(`Die definition not found: ${die.dieDefinitionId}`);
      return die;
    }
    return rollDie(definition);
  });
}

/**
 * Toggle lock state of a die
 */
export function toggleDieLock(die: DieResult): DieResult {
  return {
    ...die,
    locked: !die.locked,
  };
}

/**
 * Modify a die value (add/subtract)
 */
export function modifyDieValue(
  die: DieResult,
  definition: DieDefinition,
  delta: number
): DieResult {
  const currentFace = definition.faces[die.faceIndex];
  if (currentFace.value.type !== 'number' || currentFace.value.number === undefined) {
    console.warn('Can only modify numeric dice');
    return die;
  }

  const currentValue = currentFace.value.number;
  const newValue = Math.max(1, Math.min(definition.faces.length, currentValue + delta));

  // Find the face with this value
  const newFaceIndex = definition.faces.findIndex(
    (face) => face.value.type === 'number' && face.value.number === newValue
  );

  if (newFaceIndex === -1) {
    console.warn('Could not find face with modified value');
    return die;
  }

  return {
    ...die,
    faceIndex: newFaceIndex,
    modified: true,
  };
}

/**
 * Set a die to a specific value
 */
export function setDieValue(
  die: DieResult,
  definition: DieDefinition,
  value: number
): DieResult {
  const faceIndex = definition.faces.findIndex(
    (face) => face.value.type === 'number' && face.value.number === value
  );

  if (faceIndex === -1) {
    console.warn(`Die does not have a face with value ${value}`);
    return die;
  }

  return {
    ...die,
    faceIndex,
    modified: true,
  };
}

/**
 * Create a dice pool
 */
export function createDicePool(
  id: string,
  name: string,
  dice: DieResult[] = []
): DicePool {
  return {
    id,
    name,
    dice,
  };
}

/**
 * Get the display value of a die
 */
export function getDieValue(die: DieResult, definition: DieDefinition) {
  return definition.faces[die.faceIndex].value;
}

/**
 * Calculate sum of numeric dice in a pool
 */
export function sumDicePool(
  pool: DicePool,
  definitions: Map<string, DieDefinition>
): number {
  return pool.dice.reduce((sum, die) => {
    const definition = definitions.get(die.dieDefinitionId);
    if (!definition) return sum;

    const face = definition.faces[die.faceIndex];
    if (face.value.type === 'number' && face.value.number !== undefined) {
      return sum + face.value.number;
    }
    return sum;
  }, 0);
}
