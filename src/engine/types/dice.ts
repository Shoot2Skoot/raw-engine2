/**
 * Dice Types - Random number generation and custom dice
 */

/**
 * Standard dice types
 */
export type StandardDiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';

/**
 * Face content for custom dice
 */
export interface DieFace {
  /** Numeric value (optional) */
  value?: number;
  /** Text to display */
  text?: string;
  /** Symbol/icon name */
  symbol?: string;
  /** Color */
  color?: string;
  /** Combination display */
  display?: {
    primary: string; // main display (number, text, or symbol)
    secondary?: string; // optional secondary display
    backgroundColor?: string;
  };
}

/**
 * Custom die definition
 */
export interface CustomDie {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Number of faces */
  faceCount: number;
  /** Definition of each face */
  faces: DieFace[];
  /** Probability weights (optional, for uneven distributions) */
  weights?: number[];
  /** Visual styling */
  style?: {
    backgroundColor?: string;
    textColor?: string;
    size?: number;
  };
}

/**
 * Standard die definition
 */
export interface StandardDie {
  /** Unique identifier */
  id: string;
  /** Standard die type */
  type: StandardDiceType;
  /** Visual styling */
  style?: {
    backgroundColor?: string;
    textColor?: string;
    size?: number;
  };
}

/**
 * Union type for any die
 */
export type Die = StandardDie | CustomDie;

/**
 * Type guard for custom die
 */
export function isCustomDie(die: Die): die is CustomDie {
  return 'faceCount' in die;
}

/**
 * Type guard for standard die
 */
export function isStandardDie(die: Die): die is StandardDie {
  return 'type' in die && !('faceCount' in die);
}

/**
 * Result of rolling a die
 */
export interface DieResult {
  /** Die that was rolled */
  dieId: string;
  /** Face index that came up */
  faceIndex: number;
  /** Face content */
  face: DieFace | number; // number for standard dice, DieFace for custom
  /** Is this die locked? */
  locked: boolean;
  /** Has this die been modified? */
  modified: boolean;
  /** Unique ID for this specific roll result */
  resultId: string;
}

/**
 * Dice pool - a collection of dice that can be rolled together
 */
export interface DicePool {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Dice in this pool */
  dice: Die[];
  /** Current results (if rolled) */
  results?: DieResult[];
  /** Roll history */
  history?: Array<{
    timestamp: number;
    results: DieResult[];
  }>;
}

/**
 * Dice modification operation
 */
export type DiceModification =
  | { type: 'reroll'; dieResultId: string }
  | { type: 'lock'; dieResultId: string }
  | { type: 'unlock'; dieResultId: string }
  | { type: 'increment'; dieResultId: string }
  | { type: 'decrement'; dieResultId: string }
  | { type: 'setValue'; dieResultId: string; value: number }
  | { type: 'flip'; dieResultId: string }; // flip to opposite side

/**
 * Dice notation parser result (e.g., "2d6" → 2 six-sided dice)
 */
export interface DiceNotation {
  count: number;
  dieType: StandardDiceType;
}

/**
 * Parse dice notation string like "2d6", "3d8", "1d20"
 */
export function parseDiceNotation(notation: string): DiceNotation | null {
  const match = notation.match(/^(\d+)d(\d+)$/i);
  if (!match) return null;

  const count = parseInt(match[1], 10);
  const sides = parseInt(match[2], 10);

  const dieType = `d${sides}` as StandardDiceType;
  if (!['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'].includes(dieType)) {
    return null;
  }

  return { count, dieType };
}
