/**
 * State Types
 * Game state management, history, and persistence
 */

import type { Mark } from './marks';
import type { DiceRollHistory, DicePool } from './dice';
import type { DeckState } from './cards';

/** Tool type for marking */
export type ToolType =
  | 'checkbox'
  | 'number'
  | 'color'
  | 'circle'
  | 'symbol'
  | 'text'
  | 'line'
  | 'area'
  | 'eraser';

/** Current tool state */
export interface ToolState {
  currentTool: ToolType;
  isPencilMode: boolean;
  selectedColor?: string;
  selectedSymbol?: string;
  selectedNumber?: number;
}

/** Action types for history/undo */
export type Action =
  | { type: 'ADD_MARK'; mark: Mark; sheetId: string }
  | { type: 'REMOVE_MARK'; markId: string; sheetId: string }
  | { type: 'UPDATE_MARK'; markId: string; mark: Partial<Mark>; sheetId: string }
  | { type: 'ROLL_DICE'; poolId: string; results: unknown }
  | { type: 'LOCK_DIE'; dieId: string }
  | { type: 'UNLOCK_DIE'; dieId: string }
  | { type: 'MODIFY_DIE'; dieId: string; modification: unknown }
  | { type: 'DRAW_CARD'; deckId: string; cardId: string }
  | { type: 'DISCARD_CARD'; deckId: string; cardId: string }
  | { type: 'SHUFFLE_DECK'; deckId: string };

/** History entry */
export interface HistoryEntry {
  action: Action;
  timestamp: number;
  sheetId?: string;
}

/** History state with undo/redo support */
export interface History {
  past: HistoryEntry[];
  future: HistoryEntry[];
  maxSize: number;
}

/** Sheet state (marks on a specific sheet) */
export interface SheetState {
  sheetId: string;
  marks: Mark[];
}

/** Complete game state */
export interface GameState {
  sheets: SheetState[];
  currentSheetId: string;
  toolState: ToolState;
  dicePools?: DicePool[];
  diceHistory?: DiceRollHistory;
  deckStates?: DeckState[];
  history: History;
  metadata?: Record<string, unknown>;
  lastSaved?: number;
}

/** Saved game data (serializable) */
export interface SavedGame {
  version: string;
  gameName: string;
  state: GameState;
  timestamp: number;
}

/** Auto-save configuration */
export interface AutoSaveConfig {
  enabled: boolean;
  storageKey: string;
  debounceMs?: number; // Delay before saving (default 500ms)
}
