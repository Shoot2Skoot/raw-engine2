/**
 * Action Types - For undo/redo system
 */

import type { Mark } from './marks';

/** Base action interface */
export interface BaseAction {
  type: string;
  timestamp: number;
}

/** Action: Add a mark to a hotspot */
export interface AddMarkAction extends BaseAction {
  type: 'ADD_MARK';
  sheetId: string;
  hotspotId: string;
  mark: Mark;
}

/** Action: Remove a mark from a hotspot */
export interface RemoveMarkAction extends BaseAction {
  type: 'REMOVE_MARK';
  sheetId: string;
  hotspotId: string;
  markIndex: number;
  /** Store removed mark for redo */
  mark: Mark;
}

/** Action: Update a mark on a hotspot */
export interface UpdateMarkAction extends BaseAction {
  type: 'UPDATE_MARK';
  sheetId: string;
  hotspotId: string;
  markIndex: number;
  oldMark: Mark;
  newMark: Mark;
}

/** Action: Roll dice in a pool */
export interface RollDiceAction extends BaseAction {
  type: 'ROLL_DICE';
  poolId: string;
  results: Array<{
    dieId: string;
    faceValue: number | string;
  }>;
}

/** Action: Lock/unlock a die */
export interface ToggleDieLockAction extends BaseAction {
  type: 'TOGGLE_DIE_LOCK';
  poolId: string;
  dieId: string;
  locked: boolean;
}

/** Action: Draw a card from a deck */
export interface DrawCardAction extends BaseAction {
  type: 'DRAW_CARD';
  deckId: string;
  cardId: string;
}

/** Action: Discard current card */
export interface DiscardCardAction extends BaseAction {
  type: 'DISCARD_CARD';
  deckId: string;
  cardId: string;
}

/** Action: Shuffle a deck */
export interface ShuffleDeckAction extends BaseAction {
  type: 'SHUFFLE_DECK';
  deckId: string;
  /** Store previous order for potential undo */
  previousOrder: string[]; // card IDs
}

/** Action: Reshuffle discard pile into deck */
export interface ReshuffleDiscardAction extends BaseAction {
  type: 'RESHUFFLE_DISCARD';
  deckId: string;
}

/** Union type of all actions */
export type GameAction =
  | AddMarkAction
  | RemoveMarkAction
  | UpdateMarkAction
  | RollDiceAction
  | ToggleDieLockAction
  | DrawCardAction
  | DiscardCardAction
  | ShuffleDeckAction
  | ReshuffleDiscardAction;

/** Action history for undo/redo */
export interface ActionHistory {
  /** Past actions (for undo) */
  past: GameAction[];
  /** Future actions (for redo) */
  future: GameAction[];
  /** Maximum history size */
  maxSize: number;
}
