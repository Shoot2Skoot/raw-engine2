/**
 * Game State - Complete game configuration and state
 */

import type { Sheet } from './sheet';
import type { DiceState } from './dice';
import type { CardState } from './cards';
import type { Tool } from './tools';
import type { ActionHistory } from './actions';

/** Complete game configuration */
export interface GameConfig {
  /** Game identifier */
  id: string;
  /** Game name */
  name: string;
  /** Game description */
  description?: string;
  /** All sheets in the game */
  sheets: Sheet[];
  /** Dice configuration (optional) */
  dice?: DiceState;
  /** Card configuration (optional) */
  cards?: CardState;
  /** Available tools for this game */
  tools: Tool[];
  /** Default tool on game start */
  defaultTool?: string; // tool type
}

/** Runtime game state */
export interface GameState {
  /** Game configuration */
  config: GameConfig;
  /** Currently active sheet */
  currentSheetId: string;
  /** Currently selected tool */
  currentTool: Tool;
  /** Action history for undo/redo */
  history: ActionHistory;
  /** Last saved timestamp */
  lastSaved?: number;
  /** Whether game has unsaved changes */
  dirty: boolean;
}

/** Saved game data (for export/import) */
export interface SavedGame {
  /** Game configuration */
  config: GameConfig;
  /** Current state */
  state: {
    currentSheetId: string;
    currentToolType: string;
    sheets: Array<{
      id: string;
      hotspots: Array<{
        id: string;
        marks: unknown[]; // Mark[]
      }>;
    }>;
    dice?: DiceState;
    cards?: CardState;
  };
  /** Save metadata */
  metadata: {
    version: string;
    timestamp: number;
    gameName: string;
  };
}
