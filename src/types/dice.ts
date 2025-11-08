/**
 * Dice Types
 * Defines dice mechanics and configurations
 */

/** Standard dice types */
export type StandardDieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

/** Die face content types */
export type DieFaceContent =
  | { type: 'number'; value: number }
  | { type: 'symbol'; symbol: string; color?: string }
  | { type: 'text'; text: string }
  | { type: 'color'; color: string }
  | { type: 'combination'; items: DieFaceContent[] };

/** Custom die face with optional weight for probability */
export interface DieFace {
  content: DieFaceContent;
  weight?: number; // for weighted probability (defaults to 1)
}

/** Die configuration */
export interface DieConfig {
  id: string;
  type: 'standard' | 'custom';
  standardType?: StandardDieType; // if type is 'standard'
  faces?: DieFace[]; // if type is 'custom'
  label?: string; // display name
  color?: string; // visual color for the die
}

/** Die instance with current result */
export interface DieInstance {
  id: string;
  configId: string;
  currentFace: number; // index of the face
  isLocked: boolean;
  wasModified: boolean; // tracks if value was changed manually
}

/** Die roll result */
export interface DieRollResult {
  dieId: string;
  faceIndex: number;
  value: DieFaceContent;
  timestamp: number;
}

/** Dice pool configuration */
export interface DicePoolConfig {
  id: string;
  label: string;
  diceConfigs: DieConfig[];
  isShared?: boolean; // shared between players vs individual
}

/** Dice pool instance */
export interface DicePoolInstance {
  id: string;
  configId: string;
  dice: DieInstance[];
  rollHistory: DieRollResult[][];
}

/** Dice manipulation actions */
export type DiceAction =
  | { type: 'roll'; diceIds?: string[] } // roll all or specific dice
  | { type: 'lock'; dieId: string }
  | { type: 'unlock'; dieId: string }
  | { type: 'set-value'; dieId: string; faceIndex: number }
  | { type: 'increment'; dieId: string } // +1
  | { type: 'decrement'; dieId: string } // -1
  | { type: 'flip'; dieId: string }; // opposite face
