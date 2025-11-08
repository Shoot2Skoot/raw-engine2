/**
 * Dice rolling utilities
 */

import type { Die, StandardDie, CustomDie, DieResult, FaceValue } from '../types/dice';
import { StandardDieType } from '../types/dice';

/**
 * Get number of sides for a standard die
 */
export function getStandardDieSides(type: StandardDieType): number {
  const sides: Record<StandardDieType, number> = {
    [StandardDieType.D4]: 4,
    [StandardDieType.D6]: 6,
    [StandardDieType.D8]: 8,
    [StandardDieType.D10]: 10,
    [StandardDieType.D12]: 12,
    [StandardDieType.D20]: 20,
    [StandardDieType.D100]: 100,
  };
  return sides[type];
}

/**
 * Roll a single die
 */
export function rollDie(die: Die): DieResult {
  let value: FaceValue;

  if (die.type === 'custom') {
    const customDie = die as CustomDie;
    // Calculate total weight
    const totalWeight = customDie.faces.reduce(
      (sum, face) => sum + (face.weight || 1),
      0
    );
    // Random weighted selection
    let random = Math.random() * totalWeight;
    let selectedFace = customDie.faces[0];
    for (const face of customDie.faces) {
      random -= face.weight || 1;
      if (random <= 0) {
        selectedFace = face;
        break;
      }
    }
    value = selectedFace.value;
  } else {
    const standardDie = die as StandardDie;
    const sides = getStandardDieSides(standardDie.type);
    value = Math.floor(Math.random() * sides) + 1;
  }

  return {
    dieId: die.id,
    value,
    locked: false,
    modified: false,
    timestamp: Date.now(),
  };
}

/**
 * Roll multiple dice
 */
export function rollDice(dice: Die[]): DieResult[] {
  return dice.map(rollDie);
}

/**
 * Reroll specific dice
 */
export function rerollDice(dice: Die[], results: DieResult[]): DieResult[] {
  return results.map((result) => {
    if (result.locked) {
      return result;
    }
    const die = dice.find((d) => d.id === result.dieId);
    if (!die) return result;
    return rollDie(die);
  });
}

/**
 * Lock a die
 */
export function lockDie(results: DieResult[], dieId: string): DieResult[] {
  return results.map((result) =>
    result.dieId === dieId ? { ...result, locked: true } : result
  );
}

/**
 * Unlock a die
 */
export function unlockDie(results: DieResult[], dieId: string): DieResult[] {
  return results.map((result) =>
    result.dieId === dieId ? { ...result, locked: false } : result
  );
}

/**
 * Modify a die value
 */
export function modifyDieValue(
  results: DieResult[],
  dieId: string,
  newValue: FaceValue
): DieResult[] {
  return results.map((result) =>
    result.dieId === dieId
      ? {
          ...result,
          value: newValue,
          modified: true,
          originalValue: result.originalValue || result.value,
        }
      : result
  );
}

/**
 * Get sum of numeric dice results
 */
export function sumDiceResults(results: DieResult[]): number {
  return results.reduce((sum, result) => {
    const value = typeof result.value === 'number' ? result.value : 0;
    return sum + value;
  }, 0);
}
