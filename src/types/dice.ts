/**
 * Dice Types - Dice rolling mechanics and configuration
 */

/**
 * Standard die types
 */
export type StandardDieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

/**
 * Die face content (can be number, text, symbol, color, or combination)
 */
export interface DieFace {
  /** Display value (number or text) */
  value: string | number;
  /** Optional symbol identifier */
  symbol?: string;
  /** Optional color */
  color?: string;
  /** Weight for probability (default 1 = equal probability) */
  weight?: number;
}

/**
 * Standard numeric die
 */
export interface StandardDie {
  type: 'standard';
  dieType: StandardDieType;
  /** Unique identifier */
  id: string;
  /** Optional label */
  label?: string;
}

/**
 * Custom die with any faces
 */
export interface CustomDie {
  type: 'custom';
  /** Unique identifier */
  id: string;
  /** Optional label */
  label?: string;
  /** Array of faces (2-100) */
  faces: DieFace[];
}

/**
 * Union type of all die types
 */
export type Die = StandardDie | CustomDie;

/**
 * Result of rolling a single die
 */
export interface DieResult {
  /** Die that was rolled */
  dieId: string;
  /** Face that came up */
  face: DieFace | number; // number for standard dice, DieFace for custom
  /** Whether this die is locked (can't be rerolled) */
  locked: boolean;
  /** Whether this die has been modified */
  modified: boolean;
}

/**
 * Dice pool (collection of dice that can be rolled together)
 */
export interface DicePool {
  /** Unique identifier */
  id: string;
  /** Pool name/label */
  name: string;
  /** Dice in this pool */
  dice: Die[];
  /** Current results (if rolled) */
  results?: DieResult[];
  /** Whether this pool is currently visible */
  visible: boolean;
}

/**
 * Roll history entry
 */
export interface RollHistoryEntry {
  /** Timestamp */
  timestamp: number;
  /** Pool that was rolled */
  poolId: string;
  /** Results */
  results: DieResult[];
}

/**
 * Complete dice state
 */
export interface DiceState {
  /** All dice pools */
  pools: DicePool[];
  /** Roll history (last 10 rolls) */
  history: RollHistoryEntry[];
}
