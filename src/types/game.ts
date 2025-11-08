/**
 * Game State Types
 * Defines overall game state and configuration
 */

import type { Sheet } from './sheets';
import type { DicePool, RollResult } from './dice';
import type { Deck } from './cards';
import type { MarkType } from './marks';

/** Tool types available for marking */
export type ToolType = MarkType | 'eraser' | 'none';

/** Active tool state */
export interface ActiveTool {
  /** Currently selected tool */
  type: ToolType;
  /** Tool-specific configuration */
  config?: {
    /** For number tool: current number to place */
    number?: number;
    /** For color tool: current color */
    color?: string;
    /** For symbol tool: current symbol */
    symbol?: string;
    /** Mark mode (pencil or pen) */
    mode?: 'pencil' | 'pen';
  };
}

/** Game action - any user action that modifies game state */
export type GameAction =
  | { type: 'place-mark'; sheetId: string; hotspotId: string; markId: string }
  | { type: 'remove-mark'; sheetId: string; hotspotId: string; markId: string }
  | { type: 'modify-mark'; sheetId: string; hotspotId: string; markId: string }
  | { type: 'roll-dice'; poolId: string }
  | { type: 'modify-die'; poolId: string; dieId: string; modification: string }
  | { type: 'draw-card'; deckId: string }
  | { type: 'discard-card'; deckId: string; cardId: string }
  | { type: 'shuffle-deck'; deckId: string }
  | { type: 'switch-sheet'; sheetId: string }
  | { type: 'select-tool'; toolType: ToolType };

/** History entry for undo/redo */
export interface HistoryEntry {
  /** Unique entry ID */
  id: string;
  /** Action that was performed */
  action: GameAction;
  /** Timestamp */
  timestamp: number;
  /** Previous state snapshot (for undo) */
  previousState: GameStateSnapshot;
  /** Description for display */
  description?: string;
}

/** Game state snapshot (for save/load and undo/redo) */
export interface GameStateSnapshot {
  /** All sheets with their current state */
  sheets: Record<string, Sheet>;
  /** All dice pools */
  dicePools: Record<string, DicePool>;
  /** All decks */
  decks: Record<string, Deck>;
  /** Roll history */
  rollHistory: RollResult[];
  /** Current active sheet */
  activeSheetId: string;
  /** Current active tool */
  activeTool: ActiveTool;
  /** Timestamp */
  timestamp: number;
}

/** Complete game state */
export interface GameState {
  /** Game metadata */
  game: GameMetadata;
  /** Current state */
  current: GameStateSnapshot;
  /** Undo history */
  history: HistoryEntry[];
  /** Current position in history (for undo/redo) */
  historyIndex: number;
}

/** Game metadata */
export interface GameMetadata {
  /** Game identifier */
  id: string;
  /** Game name */
  name: string;
  /** Game version */
  version: string;
  /** Game description */
  description?: string;
  /** Author information */
  author?: string;
  /** Creation timestamp */
  created: number;
  /** Last modified timestamp */
  modified: number;
}

/** Game configuration */
export interface GameConfig {
  /** Game metadata */
  metadata: GameMetadata;
  /** Sheet definitions */
  sheets: Sheet[];
  /** Dice configuration */
  dice?: {
    pools: DicePool[];
  };
  /** Card decks */
  decks?: Deck[];
  /** UI configuration */
  ui?: {
    /** Color palette for color marks */
    colorPalette?: string[];
    /** Symbol palette for symbol marks */
    symbolPalette?: { id: string; icon: string; label?: string }[];
    /** Enable keyboard shortcuts */
    keyboardShortcuts?: boolean;
    /** Auto-save interval in milliseconds (0 = disabled) */
    autoSaveInterval?: number;
  };
}

/** Tool palette item */
export interface ToolPaletteItem {
  /** Tool type */
  type: ToolType;
  /** Display label */
  label: string;
  /** Icon identifier */
  icon: string;
  /** Keyboard shortcut */
  shortcut?: string;
  /** Whether this tool is enabled */
  enabled?: boolean;
}
