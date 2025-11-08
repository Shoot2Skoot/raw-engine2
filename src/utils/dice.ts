/**
 * Utility functions for dice rolling
 */

import type { DieDefinition, DieFace, DieInstance, StandardDieType } from '../types';
import { generateId } from './hotspots';

/**
 * Roll a standard die
 */
export function rollStandardDie(type: StandardDieType): number {
  const sides = parseInt(type.substring(1)); // Extract number from 'd6', 'd20', etc.
  return Math.floor(Math.random() * sides) + 1;
}

/**
 * Roll a custom die
 */
export function rollCustomDie(definition: DieDefinition): DieFace {
  if (!definition.faces || definition.faces.length === 0) {
    throw new Error('Custom die must have faces defined');
  }

  // Calculate total weight
  const totalWeight = definition.faces.reduce((sum, face) => {
    return sum + (face.weight || 1);
  }, 0);

  // Pick a random weighted face
  let random = Math.random() * totalWeight;
  for (const face of definition.faces) {
    random -= face.weight || 1;
    if (random <= 0) {
      return face;
    }
  }

  // Fallback (should never happen)
  return definition.faces[0];
}

/**
 * Create a die instance from a definition
 */
export function createDieInstance(
  definition: DieDefinition,
  poolId?: string
): DieInstance {
  const currentFace =
    definition.type === 'standard' && definition.standardType
      ? rollStandardDie(definition.standardType)
      : rollCustomDie(definition);

  return {
    id: generateId(),
    definitionId: definition.id,
    currentFace,
    isLocked: false,
    isModified: false,
    poolId,
  };
}

/**
 * Re-roll a die instance
 */
export function rerollDie(
  instance: DieInstance,
  definition: DieDefinition
): DieInstance {
  const newFace =
    definition.type === 'standard' && definition.standardType
      ? rollStandardDie(definition.standardType)
      : rollCustomDie(definition);

  return {
    ...instance,
    currentFace: newFace,
    isModified: false,
  };
}

/**
 * Increment die value (for standard numeric dice)
 */
export function incrementDie(
  instance: DieInstance,
  definition: DieDefinition
): DieInstance {
  if (definition.type === 'standard' && definition.standardType) {
    const currentValue = instance.currentFace as number;
    const maxValue = parseInt(definition.standardType.substring(1));
    const newValue = currentValue < maxValue ? currentValue + 1 : currentValue;

    return {
      ...instance,
      currentFace: newValue,
      isModified: true,
    };
  }

  return instance;
}

/**
 * Decrement die value (for standard numeric dice)
 */
export function decrementDie(
  instance: DieInstance,
  definition: DieDefinition
): DieInstance {
  if (definition.type === 'standard' && definition.standardType) {
    const currentValue = instance.currentFace as number;
    const newValue = currentValue > 1 ? currentValue - 1 : currentValue;

    return {
      ...instance,
      currentFace: newValue,
      isModified: true,
    };
  }

  return instance;
}

/**
 * Flip die to opposite face (for standard dice)
 */
export function flipDie(
  instance: DieInstance,
  definition: DieDefinition
): DieInstance {
  if (definition.type === 'standard' && definition.standardType) {
    const currentValue = instance.currentFace as number;
    const maxValue = parseInt(definition.standardType.substring(1));
    const oppositeValue = maxValue + 1 - currentValue;

    return {
      ...instance,
      currentFace: oppositeValue,
      isModified: true,
    };
  }

  return instance;
}

/**
 * Format die face for display
 */
export function formatDieFace(face: DieFace | number): string {
  if (typeof face === 'number') {
    return face.toString();
  }

  if (face.display) {
    return face.display;
  }

  if (face.type === 'number' && face.value !== undefined) {
    return face.value.toString();
  }

  if (face.type === 'text' && face.text) {
    return face.text;
  }

  if (face.type === 'symbol' && face.symbol) {
    return face.symbol;
  }

  return '?';
}
