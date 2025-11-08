/**
 * Dice rolling utilities
 */

import type { DieDefinition, DieResult, DieFaceValue, StandardDieType, CustomDie } from '../types';

/** Get number of faces for a standard die */
export function getStandardDieFaces(dieType: StandardDieType): number {
  const faces: Record<StandardDieType, number> = {
    d4: 4,
    d6: 6,
    d8: 8,
    d10: 10,
    d12: 12,
    d20: 20,
  };
  return faces[dieType];
}

/** Check if a die definition is standard or custom */
export function isStandardDie(die: DieDefinition): die is StandardDieType {
  return typeof die === 'string';
}

/** Roll a single standard die */
export function rollStandardDie(dieType: StandardDieType): number {
  const faces = getStandardDieFaces(dieType);
  return Math.floor(Math.random() * faces) + 1;
}

/** Roll a single custom die */
export function rollCustomDie(die: CustomDie): DieFaceValue {
  const { faces, weights } = die;

  // If no weights, all faces are equally likely
  if (!weights || weights.length !== faces.length) {
    const randomIndex = Math.floor(Math.random() * faces.length);
    return faces[randomIndex];
  }

  // Weighted random selection
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < faces.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return faces[i];
    }
  }

  // Fallback (shouldn't happen)
  return faces[faces.length - 1];
}

/** Roll a die and return result */
export function rollDie(die: DieDefinition, id: string): DieResult {
  if (isStandardDie(die)) {
    return {
      id,
      die,
      value: rollStandardDie(die),
      isLocked: false,
      wasModified: false,
    };
  } else {
    return {
      id,
      die,
      value: rollCustomDie(die),
      isLocked: false,
      wasModified: false,
    };
  }
}

/** Reroll a die result */
export function rerollDie(result: DieResult): DieResult {
  if (result.isLocked) {
    return result; // Don't reroll locked dice
  }

  if (isStandardDie(result.die)) {
    return {
      ...result,
      value: rollStandardDie(result.die),
      wasModified: false,
    };
  } else {
    return {
      ...result,
      value: rollCustomDie(result.die),
      wasModified: false,
    };
  }
}

/** Lock or unlock a die */
export function toggleLock(result: DieResult): DieResult {
  return {
    ...result,
    isLocked: !result.isLocked,
  };
}

/** Modify a die value (for game abilities that adjust dice) */
export function modifyDieValue(result: DieResult, modifier: number): DieResult {
  if (!isStandardDie(result.die) || typeof result.value !== 'number') {
    return result; // Can only modify numeric dice
  }

  const faces = getStandardDieFaces(result.die);
  const newValue = Math.max(1, Math.min(faces, (result.value as number) + modifier));

  return {
    ...result,
    value: newValue,
    wasModified: true,
  };
}

/** Set a die to a specific value */
export function setDieValue(result: DieResult, value: number): DieResult {
  if (!isStandardDie(result.die)) {
    return result; // Can only set value on standard dice
  }

  const faces = getStandardDieFaces(result.die);
  const clampedValue = Math.max(1, Math.min(faces, value));

  return {
    ...result,
    value: clampedValue,
    wasModified: true,
  };
}

/** Get the sum of all numeric dice results */
export function sumDiceResults(results: DieResult[]): number {
  return results.reduce((sum, result) => {
    if (typeof result.value === 'number') {
      return sum + result.value;
    }
    return sum;
  }, 0);
}

/** Format die value for display */
export function formatDieValue(value: number | DieFaceValue): string {
  if (typeof value === 'number') {
    return value.toString();
  }

  switch (value.type) {
    case 'number':
      return value.number?.toString() || '?';
    case 'text':
      return value.text || '?';
    case 'symbol':
      return value.symbolId || '?';
    case 'color':
      return value.color || '?';
    case 'combination':
      return value.combination?.map(formatDieValue).join('+') || '?';
    default:
      return '?';
  }
}
