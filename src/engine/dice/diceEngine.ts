/**
 * Dice Engine
 * Core logic for dice rolling and manipulation
 */

import {
  DieConfig,
  DieInstance,
  DieFace,
  DieFaceContent,
  DieRollResult,
  DicePoolInstance,
  StandardDieType,
} from '../../types';
import { generateId, randomInt, weightedRandom } from '../../utils/common';

/**
 * Get standard die faces based on type
 */
function getStandardDieFaces(type: StandardDieType): DieFace[] {
  const faceCount = parseInt(type.substring(1));
  return Array.from({ length: faceCount }, (_, i) => ({
    content: { type: 'number' as const, value: i + 1 },
  }));
}

/**
 * Create a new die instance from configuration
 */
export function createDieInstance(config: DieConfig): DieInstance {
  const faces = config.type === 'standard' && config.standardType
    ? getStandardDieFaces(config.standardType)
    : config.faces ?? [];

  return {
    id: generateId(),
    configId: config.id,
    currentFace: randomInt(0, faces.length - 1),
    isLocked: false,
    wasModified: false,
  };
}

/**
 * Roll a single die
 */
export function rollDie(
  dieInstance: DieInstance,
  config: DieConfig
): DieRollResult {
  if (dieInstance.isLocked) {
    // Return current face if locked
    const faces = config.type === 'standard' && config.standardType
      ? getStandardDieFaces(config.standardType)
      : config.faces ?? [];

    return {
      dieId: dieInstance.id,
      faceIndex: dieInstance.currentFace,
      value: faces[dieInstance.currentFace].content,
      timestamp: Date.now(),
    };
  }

  const faces = config.type === 'standard' && config.standardType
    ? getStandardDieFaces(config.standardType)
    : config.faces ?? [];

  // Handle weighted probability
  const weights = faces.map((face) => face.weight ?? 1);
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  if (totalWeight === faces.length) {
    // All equal weights, use simple random
    const faceIndex = randomInt(0, faces.length - 1);
    dieInstance.currentFace = faceIndex;
    dieInstance.wasModified = false;

    return {
      dieId: dieInstance.id,
      faceIndex,
      value: faces[faceIndex].content,
      timestamp: Date.now(),
    };
  } else {
    // Use weighted random
    const faceIndex = faces.indexOf(
      weightedRandom(faces, weights)
    );
    dieInstance.currentFace = faceIndex;
    dieInstance.wasModified = false;

    return {
      dieId: dieInstance.id,
      faceIndex,
      value: faces[faceIndex].content,
      timestamp: Date.now(),
    };
  }
}

/**
 * Roll multiple dice
 */
export function rollDice(
  diceInstances: DieInstance[],
  configs: DieConfig[]
): DieRollResult[] {
  return diceInstances.map((die) => {
    const config = configs.find((c) => c.id === die.configId);
    if (!config) {
      throw new Error(`Die configuration not found: ${die.configId}`);
    }
    return rollDie(die, config);
  });
}

/**
 * Lock a die
 */
export function lockDie(dieInstance: DieInstance): void {
  dieInstance.isLocked = true;
}

/**
 * Unlock a die
 */
export function unlockDie(dieInstance: DieInstance): void {
  dieInstance.isLocked = false;
}

/**
 * Set die to specific value
 */
export function setDieValue(
  dieInstance: DieInstance,
  faceIndex: number
): void {
  dieInstance.currentFace = faceIndex;
  dieInstance.wasModified = true;
}

/**
 * Increment die value (wrap around)
 */
export function incrementDie(
  dieInstance: DieInstance,
  config: DieConfig
): void {
  const faces = config.type === 'standard' && config.standardType
    ? getStandardDieFaces(config.standardType)
    : config.faces ?? [];

  dieInstance.currentFace = (dieInstance.currentFace + 1) % faces.length;
  dieInstance.wasModified = true;
}

/**
 * Decrement die value (wrap around)
 */
export function decrementDie(
  dieInstance: DieInstance,
  config: DieConfig
): void {
  const faces = config.type === 'standard' && config.standardType
    ? getStandardDieFaces(config.standardType)
    : config.faces ?? [];

  dieInstance.currentFace =
    dieInstance.currentFace === 0
      ? faces.length - 1
      : dieInstance.currentFace - 1;
  dieInstance.wasModified = true;
}

/**
 * Flip die to opposite face (for standard dice)
 */
export function flipDie(dieInstance: DieInstance, config: DieConfig): void {
  if (config.type === 'standard' && config.standardType) {
    const faceCount = parseInt(config.standardType.substring(1));
    dieInstance.currentFace = faceCount - dieInstance.currentFace - 1;
    dieInstance.wasModified = true;
  }
}

/**
 * Get current die face content
 */
export function getDieFaceContent(
  dieInstance: DieInstance,
  config: DieConfig
): DieFaceContent {
  const faces = config.type === 'standard' && config.standardType
    ? getStandardDieFaces(config.standardType)
    : config.faces ?? [];

  return faces[dieInstance.currentFace].content;
}
