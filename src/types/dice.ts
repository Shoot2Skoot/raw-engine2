/**
 * Dice Types
 * Defines dice rolling mechanics and configurations
 */

/** Standard die types */
export type StandardDieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

/** Die face value types */
export type DieFaceValue = number | string | DieFaceComplex;

/** Complex die face with multiple elements */
export interface DieFaceComplex {
  /** Primary value (number or text) */
  value: number | string;
  /** Symbol identifier */
  symbol?: string;
  /** Color */
  color?: string;
  /** Additional data */
  metadata?: Record<string, unknown>;
}

/** Custom die face definition */
export interface CustomFace {
  /** Face identifier */
  id: string;
  /** Face value */
  value: DieFaceValue;
  /** Probability weight (default: 1) */
  weight?: number;
  /** Display configuration */
  display?: {
    /** Text to display */
    text?: string;
    /** Icon/symbol to display */
    icon?: string;
    /** Background color */
    backgroundColor?: string;
    /** Text color */
    textColor?: string;
  };
}

/** Standard numeric die */
export interface StandardDie {
  type: 'standard';
  /** Die type (d4, d6, etc.) */
  dieType: StandardDieType;
  /** Unique identifier */
  id: string;
  /** Current rolled value (null if not rolled) */
  value: number | null;
  /** Whether die is locked (won't re-roll) */
  locked: boolean;
  /** Whether die has been modified */
  modified: boolean;
}

/** Custom die with defined faces */
export interface CustomDie {
  type: 'custom';
  /** Unique identifier */
  id: string;
  /** Custom face definitions */
  faces: CustomFace[];
  /** Current rolled face (null if not rolled) */
  currentFace: CustomFace | null;
  /** Whether die is locked */
  locked: boolean;
  /** Whether die has been modified */
  modified: boolean;
}

/** Union type of all die types */
export type Die = StandardDie | CustomDie;

/** Dice pool (group of dice) */
export interface DicePool {
  /** Pool identifier */
  id: string;
  /** Pool display name */
  name: string;
  /** Dice in this pool */
  dice: Die[];
  /** Pool metadata */
  metadata?: Record<string, unknown>;
}

/** Roll result */
export interface RollResult {
  /** Timestamp of roll */
  timestamp: number;
  /** Pool that was rolled */
  poolId: string;
  /** Individual die results */
  results: {
    dieId: string;
    value: DieFaceValue;
  }[];
  /** Sum of numeric results */
  sum?: number;
}

/** Dice modification action */
export type DiceModification =
  | { type: 'reroll'; dieId: string }
  | { type: 'lock'; dieId: string }
  | { type: 'unlock'; dieId: string }
  | { type: 'increment'; dieId: string; amount: number }
  | { type: 'decrement'; dieId: string; amount: number }
  | { type: 'set-value'; dieId: string; value: number }
  | { type: 'flip'; dieId: string }; // Set to opposite side

/** Dice configuration */
export interface DiceConfig {
  /** Available dice pools */
  pools: DicePool[];
  /** Roll history limit */
  historyLimit?: number;
  /** Enable animations */
  enableAnimations?: boolean;
}
