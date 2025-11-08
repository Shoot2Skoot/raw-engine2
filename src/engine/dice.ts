/**
 * Dice rolling utilities
 */

import type {
  DieConfig,
  DieResult,
  DieFace,
  StandardDieType,
  CustomDie,
} from '../types';

/**
 * Standard die face counts
 */
const STANDARD_DIE_FACES: Record<StandardDieType, number> = {
  d4: 4,
  d6: 6,
  d8: 8,
  d10: 10,
  d12: 12,
  d20: 20,
};

/**
 * Roll a single standard die
 */
export function rollStandardDie(type: StandardDieType): number {
  const faces = STANDARD_DIE_FACES[type];
  return Math.floor(Math.random() * faces) + 1;
}

/**
 * Roll a single custom die
 */
export function rollCustomDie(die: CustomDie): DieFace {
  const totalWeight = die.faces.reduce((sum, face) => sum + (face.weight || 1), 0);
  let random = Math.random() * totalWeight;

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
 * Roll a die configuration and return result
 */
export function rollDie(config: DieConfig): DieResult {
  if (config.type === 'custom' && config.customDie) {
    const face = rollCustomDie(config.customDie);
    const faceIndex = config.customDie.faces.indexOf(face);
    return {
      dieId: config.id,
      faceIndex,
      face,
      locked: false,
    };
  } else if (config.type !== 'custom') {
    const value = rollStandardDie(config.type);
    return {
      dieId: config.id,
      faceIndex: value - 1,
      face: value,
      locked: false,
    };
  }

  throw new Error('Invalid die configuration');
}

/**
 * Roll multiple dice
 */
export function rollDice(configs: DieConfig[]): DieResult[] {
  const results: DieResult[] = [];

  for (const config of configs) {
    for (let i = 0; i < config.quantity; i++) {
      results.push(rollDie(config));
    }
  }

  return results;
}

/**
 * Reroll specific dice (excluding locked ones)
 */
export function rerollDice(
  configs: DieConfig[],
  currentResults: DieResult[],
  indicesToReroll?: number[]
): DieResult[] {
  return currentResults.map((result, index) => {
    // Skip locked dice
    if (result.locked) {
      return result;
    }

    // If indices specified, only reroll those
    if (indicesToReroll && !indicesToReroll.includes(index)) {
      return result;
    }

    // Find the config for this die
    const config = configs.find(c => c.id === result.dieId);
    if (!config) {
      return result;
    }

    // Reroll
    return rollDie(config);
  });
}

/**
 * Get sum of standard dice results
 */
export function sumDiceResults(results: DieResult[]): number {
  return results.reduce((sum, result) => {
    if (typeof result.face === 'number') {
      return sum + result.face;
    }
    if (typeof result.face === 'object' && result.face.number !== undefined) {
      return sum + result.face.number;
    }
    return sum;
  }, 0);
}

/**
 * Format die result for display
 */
export function formatDieResult(result: DieResult): string {
  if (typeof result.face === 'number') {
    return result.face.toString();
  }

  const face = result.face as DieFace;
  const parts: string[] = [];

  if (face.number !== undefined) parts.push(face.number.toString());
  if (face.text) parts.push(face.text);
  if (face.symbol) parts.push(face.symbol);
  if (face.color) parts.push(`[${face.color}]`);

  return parts.join(' ');
}

/**
 * Create standard die configuration
 */
export function createStandardDieConfig(
  type: StandardDieType,
  quantity: number = 1
): DieConfig {
  return {
    id: `${type}-${Date.now()}`,
    type,
    quantity,
  };
}

/**
 * Create custom die configuration
 */
export function createCustomDieConfig(
  customDie: CustomDie,
  quantity: number = 1
): DieConfig {
  return {
    id: customDie.id,
    type: 'custom',
    customDie,
    quantity,
  };
}
