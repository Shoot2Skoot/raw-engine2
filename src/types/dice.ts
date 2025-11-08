/**
 * Dice Types - For rolling and managing dice
 */

/** Standard die types */
export type StandardDieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

/** Content that can appear on a die face */
export interface DieFaceContent {
  /** Number value */
  number?: number;
  /** Text label */
  text?: string;
  /** Symbol/icon name */
  symbol?: string;
  /** Color */
  color?: string;
}

/** A face on a custom die */
export interface DieFace {
  /** Face identifier */
  id: string;
  /** What appears on this face */
  content: DieFaceContent;
  /** Probability weight (for uneven distributions, default: 1) */
  weight?: number;
}

/** Custom die with arbitrary faces */
export interface CustomDie {
  /** Die identifier */
  id: string;
  /** Display name */
  name?: string;
  /** All faces of this die */
  faces: DieFace[];
}

/** Standard numeric die */
export interface StandardDie {
  /** Die identifier */
  id: string;
  /** Die type */
  type: StandardDieType;
}

/** Union type for any die */
export type Die = StandardDie | CustomDie;

/** Result of rolling a die */
export interface DieResult {
  /** Which die was rolled */
  dieId: string;
  /** The face that came up */
  face: DieFaceContent;
  /** Timestamp of roll */
  timestamp: number;
  /** Whether this die is locked (can't be rerolled) */
  locked?: boolean;
  /** Whether this die has been modified */
  modified?: boolean;
}

/** Collection of dice that are rolled together */
export interface DicePool {
  /** Pool identifier */
  id: string;
  /** Display name */
  name: string;
  /** Dice in this pool */
  dice: Die[];
  /** Current results (if rolled) */
  results?: DieResult[];
}

/** Dice roll history entry */
export interface RollHistoryEntry {
  /** When the roll occurred */
  timestamp: number;
  /** Which pool was rolled */
  poolId: string;
  /** Results of the roll */
  results: DieResult[];
}

/** Complete dice state */
export interface DiceState {
  /** All dice pools in the game */
  pools: DicePool[];
  /** Roll history (last 10 rolls) */
  history: RollHistoryEntry[];
}
