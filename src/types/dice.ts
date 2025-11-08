/**
 * Dice types for random number/symbol generation
 */

/** Standard die types */
export type StandardDieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

/** Custom die face content */
export interface DieFace {
  /** Display value (number, text, symbol name) */
  value: string | number;
  /** Display color (optional) */
  color?: string;
  /** Symbol/icon identifier (optional) */
  symbol?: string;
  /** Probability weight (default 1, higher = more likely) */
  weight?: number;
}

/** Standard numeric die configuration */
export interface StandardDie {
  type: 'standard';
  /** Die type (d4, d6, etc.) */
  dieType: StandardDieType;
  /** Unique identifier */
  id: string;
  /** Display color */
  color?: string;
}

/** Custom die with arbitrary faces */
export interface CustomDie {
  type: 'custom';
  /** Unique identifier */
  id: string;
  /** Array of faces (2-100 faces) */
  faces: DieFace[];
  /** Display color */
  color?: string;
}

/** Union type of all die types */
export type Die = StandardDie | CustomDie;

/** Single die result after rolling */
export interface DieResult {
  /** The die that was rolled */
  die: Die;
  /** The face that came up */
  faceIndex: number;
  /** Display value */
  value: string | number;
  /** Whether this die is locked (can't be rerolled) */
  locked: boolean;
  /** Whether this die has been modified */
  modified: boolean;
}

/** Dice pool - a collection of dice that can be rolled together */
export interface DicePool {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Dice in this pool */
  dice: Die[];
  /** Current results (undefined if not rolled yet) */
  results?: DieResult[];
}

/** Dice pool state */
export interface DicePoolState {
  /** The pool configuration */
  pool: DicePool;
  /** Current roll results */
  results: DieResult[];
  /** Roll history (last N rolls) */
  history: DieResult[][];
}

/** Roll a single die */
export function rollDie(die: Die): DieResult {
  let faceIndex: number;
  let value: string | number;

  if (die.type === 'standard') {
    const sides = parseInt(die.dieType.substring(1));
    faceIndex = Math.floor(Math.random() * sides);
    value = faceIndex + 1; // 1-indexed
  } else {
    // Custom die - handle weighted faces
    const totalWeight = die.faces.reduce(
      (sum, face) => sum + (face.weight || 1),
      0
    );
    let random = Math.random() * totalWeight;

    faceIndex = 0;
    for (let i = 0; i < die.faces.length; i++) {
      random -= die.faces[i].weight || 1;
      if (random <= 0) {
        faceIndex = i;
        break;
      }
    }

    value = die.faces[faceIndex].value;
  }

  return {
    die,
    faceIndex,
    value,
    locked: false,
    modified: false,
  };
}

/** Roll multiple dice */
export function rollDice(dice: Die[]): DieResult[] {
  return dice.map(rollDie);
}

/** Reroll unlocked dice in a pool */
export function rerollUnlocked(results: DieResult[]): DieResult[] {
  return results.map((result) =>
    result.locked ? result : rollDie(result.die)
  );
}

/** Modify a die result by adding/subtracting a value */
export function modifyDieValue(
  result: DieResult,
  delta: number
): DieResult | null {
  if (typeof result.value !== 'number') {
    return null; // Can't modify non-numeric dice
  }

  const die = result.die;
  if (die.type !== 'standard') {
    return null; // Only modify standard dice
  }

  const sides = parseInt(die.dieType.substring(1));
  const newValue = Math.max(1, Math.min(sides, result.value + delta));

  return {
    ...result,
    value: newValue,
    faceIndex: newValue - 1,
    modified: true,
  };
}

/** Get the numeric value from standard die type */
export function getDieSides(dieType: StandardDieType): number {
  return parseInt(dieType.substring(1));
}
