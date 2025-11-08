/**
 * Game State Types - Overall game state and actions
 */

import type { Sheet } from './sheets';
import type { Mark } from './marks';
import type { DicePool, DiceModification } from './dice';
import type { Deck, DeckAction } from './cards';

/**
 * Tool types available to players
 */
export type Tool =
  | { type: 'checkbox' }
  | { type: 'number'; min?: number; max?: number }
  | { type: 'color'; palette: string[] }
  | { type: 'circle' }
  | { type: 'symbol'; symbolSet: string[] }
  | { type: 'text'; maxLength?: number }
  | { type: 'line'; style?: 'solid' | 'dashed' | 'dotted' }
  | { type: 'eraser' };

/**
 * Player action types for undo/redo
 */
export type GameAction =
  // Mark actions
  | {
      type: 'PLACE_MARK';
      sheetId: string;
      hotspotId: string;
      mark: Mark;
      timestamp: number;
    }
  | {
      type: 'REMOVE_MARK';
      sheetId: string;
      hotspotId: string;
      markIndex: number;
      previousMark: Mark;
      timestamp: number;
    }
  | {
      type: 'UPDATE_MARK';
      sheetId: string;
      hotspotId: string;
      markIndex: number;
      previousMark: Mark;
      newMark: Mark;
      timestamp: number;
    }
  // Dice actions
  | {
      type: 'ROLL_DICE';
      poolId: string;
      timestamp: number;
    }
  | {
      type: 'MODIFY_DIE';
      poolId: string;
      modification: DiceModification;
      timestamp: number;
    }
  // Card actions
  | {
      type: 'DECK_ACTION';
      action: DeckAction;
      timestamp: number;
    }
  // Tool selection
  | {
      type: 'SELECT_TOOL';
      tool: Tool;
      timestamp: number;
    }
  // Sheet navigation
  | {
      type: 'SWITCH_SHEET';
      sheetId: string;
      timestamp: number;
    };

/**
 * History entry for undo/redo
 */
export interface HistoryEntry {
  action: GameAction;
  /** Reverse action for undo */
  inverse?: GameAction;
}

/**
 * Complete game state
 */
export interface GameState {
  /** Game metadata */
  gameId: string;
  gameName: string;
  version: string;

  /** All sheets in the game */
  sheets: Sheet[];

  /** Current active sheet */
  activeSheetId: string;

  /** Marks on all sheets (indexed by sheetId → hotspotId → marks[]) */
  marks: Record<string, Record<string, Mark[]>>;

  /** Dice pools */
  dicePools: DicePool[];

  /** Card decks */
  decks: Deck[];

  /** Currently selected tool */
  selectedTool: Tool;

  /** Undo/redo history */
  history: {
    past: HistoryEntry[];
    future: HistoryEntry[];
  };

  /** Game metadata and custom state */
  metadata?: Record<string, unknown>;

  /** Last saved timestamp */
  lastSaved?: number;

  /** Last modified timestamp */
  lastModified: number;
}

/**
 * Game configuration (immutable game definition)
 */
export interface GameConfig {
  /** Game metadata */
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;

  /** Sheet definitions */
  sheets: Sheet[];

  /** Default active sheet */
  defaultSheet?: string;

  /** Available dice pools */
  dicePools?: DicePool[];

  /** Available decks */
  decks?: Deck[];

  /** Available tools */
  tools: Tool[];

  /** Default tool */
  defaultTool: Tool;

  /** UI configuration */
  ui?: {
    /** Show dice section? */
    showDice?: boolean;
    /** Show cards section? */
    showCards?: boolean;
    /** Compact or spacious layout? */
    layout?: 'compact' | 'spacious';
    /** Color scheme */
    theme?: {
      primary: string;
      secondary: string;
      background: string;
      surface: string;
      text: string;
    };
  };

  /** Custom game logic hooks (optional) */
  hooks?: {
    /** Called after any mark is placed */
    onMarkPlaced?: (state: GameState, action: GameAction) => void;
    /** Called after dice are rolled */
    onDiceRolled?: (state: GameState, action: GameAction) => void;
    /** Called after card is drawn */
    onCardDrawn?: (state: GameState, action: GameAction) => void;
    /** Custom validation */
    validateAction?: (state: GameState, action: GameAction) => boolean;
  };
}

/**
 * Saved game data (for export/import)
 */
export interface SavedGame {
  /** Game configuration */
  config: GameConfig;
  /** Current game state */
  state: GameState;
  /** Save metadata */
  savedAt: number;
  /** Save version */
  saveVersion: string;
}
