/**
 * Game Types - Main game state and configuration
 */

import type { Sheet } from './sheet';
import type { Mark, MarkType } from './marks';
import type { DicePool, DiceRollHistory, DieDefinition } from './dice';
import type { DeckDefinition, DeckState } from './cards';

export interface SymbolDefinition {
  id: string;
  name: string;
  svgPath: string; // SVG path data
  color?: string;
}

export interface ColorPalette {
  id: string;
  name: string;
  colors: string[]; // Array of hex color codes
}

export interface ToolState {
  selectedTool: MarkType;
  isPencilMode: boolean;
  selectedColor?: string;
  selectedSymbol?: string;
  selectedNumber?: number;
}

export interface GameConfig {
  id: string;
  name: string;
  description?: string;
  sheets: Sheet[];
  diceDefinitions?: DieDefinition[];
  deckDefinitions?: DeckDefinition[];
  symbolPalette?: SymbolDefinition[];
  colorPalettes?: ColorPalette[];
  defaultTools?: MarkType[]; // Available tools for this game
}

export interface GameState {
  config: GameConfig;
  currentSheetIndex: number;
  marks: Mark[];
  dicePools: DicePool[];
  diceHistory: DiceRollHistory[];
  decks: DeckState[];
  tools: ToolState;
  history: GameAction[];
  historyIndex: number; // Current position in history for undo/redo
}

// Action types for undo/redo system
export type GameActionType =
  | 'ADD_MARK'
  | 'REMOVE_MARK'
  | 'UPDATE_MARK'
  | 'ROLL_DICE'
  | 'LOCK_DIE'
  | 'UNLOCK_DIE'
  | 'MODIFY_DIE'
  | 'DRAW_CARD'
  | 'DISCARD_CARD'
  | 'SHUFFLE_DECK'
  | 'CHANGE_SHEET';

export interface BaseAction {
  type: GameActionType;
  timestamp: number;
}

export interface AddMarkAction extends BaseAction {
  type: 'ADD_MARK';
  mark: Mark;
}

export interface RemoveMarkAction extends BaseAction {
  type: 'REMOVE_MARK';
  markId: string;
  previousMark: Mark; // Store for undo
}

export interface UpdateMarkAction extends BaseAction {
  type: 'UPDATE_MARK';
  markId: string;
  newMark: Mark;
  previousMark: Mark;
}

export interface RollDiceAction extends BaseAction {
  type: 'ROLL_DICE';
  poolId: string;
  previousResults: DicePool['dice'];
  newResults: DicePool['dice'];
}

export type GameAction =
  | AddMarkAction
  | RemoveMarkAction
  | UpdateMarkAction
  | RollDiceAction;
