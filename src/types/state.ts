/**
 * Game state and history management type definitions
 */

import type { ID, MarkType } from './core';
import type { PlacedMark } from './marks';
import type { DicePoolState, DiceRollHistory } from './dice';
import type { DeckState, CardDrawHistory, SplitDeckState } from './cards';

/**
 * Action types for undo/redo
 */
export const ActionType = {
  PlaceMark: 'place-mark',
  RemoveMark: 'remove-mark',
  ModifyMark: 'modify-mark',
  RollDice: 'roll-dice',
  LockDie: 'lock-die',
  UnlockDie: 'unlock-die',
  ModifyDie: 'modify-die',
  DrawCard: 'draw-card',
  DiscardCard: 'discard-card',
  ShuffleDeck: 'shuffle-deck',
  SplitDeck: 'split-deck',
} as const;

export type ActionType = (typeof ActionType)[keyof typeof ActionType];

/**
 * Base action interface
 */
export interface BaseAction {
  /** Unique action identifier */
  id: ID;
  /** Action type */
  type: ActionType;
  /** When the action occurred */
  timestamp: number;
  /** Which sheet (if applicable) */
  sheetId?: ID;
  /** Turn or round number */
  turn?: number;
}

/**
 * Place mark action
 */
export interface PlaceMarkAction extends BaseAction {
  type: 'place-mark';
  hotspotId: ID;
  mark: PlacedMark;
}

/**
 * Remove mark action
 */
export interface RemoveMarkAction extends BaseAction {
  type: 'remove-mark';
  markId: ID;
  /** Store removed mark for undo */
  removedMark: PlacedMark;
}

/**
 * Modify mark action
 */
export interface ModifyMarkAction extends BaseAction {
  type: 'modify-mark';
  markId: ID;
  /** Previous state for undo */
  previousMark: PlacedMark;
  /** New state */
  newMark: PlacedMark;
}

/**
 * Roll dice action
 */
export interface RollDiceAction extends BaseAction {
  type: 'roll-dice';
  poolId: ID;
  /** Previous results for undo */
  previousResults?: DicePoolState;
  /** New results */
  newResults: DicePoolState;
}

/**
 * Draw card action
 */
export interface DrawCardAction extends BaseAction {
  type: 'draw-card';
  deckId: ID;
  /** Previous deck state for undo */
  previousState: DeckState;
  /** New deck state */
  newState: DeckState;
}

/**
 * Shuffle deck action
 */
export interface ShuffleDeckAction extends BaseAction {
  type: 'shuffle-deck';
  deckId: ID;
  /** Previous order for undo */
  previousState: DeckState;
  /** New order */
  newState: DeckState;
}

/**
 * Union type for all actions
 */
export type Action =
  | PlaceMarkAction
  | RemoveMarkAction
  | ModifyMarkAction
  | RollDiceAction
  | DrawCardAction
  | ShuffleDeckAction;

/**
 * History manager state
 */
export interface HistoryState {
  /** Past actions (for undo) */
  past: Action[];
  /** Future actions (for redo) */
  future: Action[];
  /** Maximum history size */
  maxSize: number;
  /** Current turn/round number */
  currentTurn: number;
}

/**
 * Sheet state - all marks on one sheet
 */
export interface SheetState {
  /** Which sheet */
  sheetId: ID;
  /** All placed marks */
  marks: PlacedMark[];
  /** Last modified timestamp */
  lastModified: number;
}

/**
 * Complete game state
 */
export interface GameState {
  /** Game identifier */
  gameId: ID;
  /** Current session identifier */
  sessionId: ID;
  /** State for all sheets */
  sheets: Record<ID, SheetState>;
  /** State for all dice pools */
  dicePools: Record<ID, DicePoolState>;
  /** State for all decks */
  decks: Record<ID, DeckState>;
  /** Split deck states */
  splitDecks?: Record<ID, SplitDeckState>;
  /** Currently active sheet */
  activeSheetId: ID;
  /** Currently selected tool */
  activeTool?: {
    markType: MarkType;
    config?: any;
  };
  /** Whether pencil mode is active */
  pencilMode: boolean;
  /** History for undo/redo */
  history: HistoryState;
  /** Dice roll history */
  diceHistory: DiceRollHistory[];
  /** Card draw history */
  cardHistory: CardDrawHistory[];
  /** Game start time */
  startTime: number;
  /** Last save time */
  lastSaveTime?: number;
  /** Custom game metadata */
  metadata?: Record<string, any>;
}

/**
 * Saved game file structure
 */
export interface SavedGame {
  /** File format version */
  version: string;
  /** Game state */
  state: GameState;
  /** Game definition (for validation) */
  gameDefinitionId: ID;
  /** When saved */
  savedAt: number;
  /** User notes */
  notes?: string;
}

/**
 * Auto-save configuration
 */
export interface AutoSaveConfig {
  /** Enable auto-save */
  enabled: boolean;
  /** Save interval in milliseconds */
  interval: number;
  /** Storage key prefix */
  storageKeyPrefix: string;
  /** Maximum saves to keep */
  maxSaves: number;
}
