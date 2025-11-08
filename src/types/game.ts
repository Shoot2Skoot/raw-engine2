/**
 * Game Types - Overall game state and configuration
 */

import type { Mark } from './marks';
import type { SheetDefinition, SheetState } from './sheet';
import type { DicePoolDefinition, DicePoolState } from './dice';
import type { DeckDefinition, DeckState } from './cards';
import type { ToolConfig } from './marks';

/**
 * Game definition (configuration)
 */
export interface GameDefinition {
  id: string;
  name: string;
  description?: string;
  version?: string;
  author?: string;

  // Game components
  sheets: SheetDefinition[];
  tools: ToolConfig[];
  dicePools?: DicePoolDefinition[];
  decks?: DeckDefinition[];

  // Settings
  settings?: {
    autosave?: boolean;
    autosaveInterval?: number; // milliseconds
    maxUndoHistory?: number;
    enableKeyboardShortcuts?: boolean;
  };

  // Metadata
  metadata?: Record<string, unknown>;
}

/**
 * Action types for undo/redo
 */
export type GameAction =
  | { type: 'ADD_MARK'; mark: Mark }
  | { type: 'REMOVE_MARK'; markId: string }
  | { type: 'UPDATE_MARK'; markId: string; updates: Partial<Mark> }
  | { type: 'ROLL_DICE'; poolId: string }
  | { type: 'LOCK_DIE'; dieId: string }
  | { type: 'UNLOCK_DIE'; dieId: string }
  | { type: 'MODIFY_DIE'; dieId: string; modification: string }
  | { type: 'DRAW_CARD'; deckId: string; count?: number }
  | { type: 'DISCARD_CARD'; deckId: string; cardId: string }
  | { type: 'SHUFFLE_DECK'; deckId: string }
  | { type: 'RESHUFFLE_DISCARD'; deckId: string }
  | { type: 'SPLIT_DECK'; deckId: string; pileCount: number };

/**
 * History entry for undo/redo
 */
export interface HistoryEntry {
  timestamp: number;
  action: GameAction;
  inverseAction: GameAction; // To undo
}

/**
 * Game state (runtime)
 */
export interface GameState {
  // Game identity
  gameId: string;
  sessionId: string;
  startTime: number;

  // Current state
  currentSheetId: string;
  currentTool: string; // Tool type

  // Component states
  marks: Mark[];
  sheets: Map<string, SheetState>;
  dicePools: Map<string, DicePoolState>;
  decks: Map<string, DeckState>;

  // History
  history: HistoryEntry[];
  historyIndex: number; // Current position in history

  // UI state
  ui: {
    selectedHotspotId?: string;
    toolOptions?: Record<string, unknown>;
    isPencilMode: boolean;
    zoom: number;
    pan: { x: number; y: number };
  };

  // Metadata
  metadata?: Record<string, unknown>;
}

/**
 * Saved game format (for export/import)
 */
export interface SavedGame {
  version: string;
  gameDefinitionId: string;
  gameState: GameState;
  savedAt: number;
  checksum?: string;
}
