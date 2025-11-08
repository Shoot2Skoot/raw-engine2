import { Sheet } from './sheets';
import { Mark } from './marks';
import { DiceState } from './dice';
import { CardState } from './cards';

/**
 * Game State - Complete state of the game
 */

/**
 * Tool type for marking
 */
export type ToolType = 'checkbox' | 'number' | 'color' | 'circle' | 'symbol' | 'text' | 'line' | 'erase';

/**
 * Current tool configuration
 */
export interface Tool {
  type: ToolType;
  /** For pencil/pen distinction */
  permanence: 'pencil' | 'pen';
  /** For number tool: current/last value */
  numberValue?: number;
  /** For color tool: current color */
  color?: string;
  /** For symbol tool: current symbol */
  symbolId?: string;
  /** For line tool: style and color */
  lineStyle?: {
    style: 'solid' | 'dashed' | 'dotted';
    color: string;
    thickness: number;
  };
}

/**
 * Action types for undo/redo
 */
export type GameAction =
  | { type: 'PLACE_MARK'; mark: Mark }
  | { type: 'REMOVE_MARK'; markId: string }
  | { type: 'MODIFY_MARK'; markId: string; changes: Partial<Mark> }
  | { type: 'ROLL_DICE'; poolId: string; results: any[] }
  | { type: 'LOCK_DIE'; poolId: string; dieIndex: number }
  | { type: 'UNLOCK_DIE'; poolId: string; dieIndex: number }
  | { type: 'DRAW_CARD'; deckId: string; cardId: string }
  | { type: 'DISCARD_CARD'; deckId: string; cardId: string }
  | { type: 'SHUFFLE_DECK'; deckId: string };

/**
 * History state for undo/redo
 */
export interface HistoryState {
  /** Past actions (for undo) */
  past: GameAction[];
  /** Future actions (for redo) */
  future: GameAction[];
}

/**
 * Complete game state
 */
export interface GameState {
  /** Game metadata */
  metadata: {
    /** Game name */
    name: string;
    /** Game version */
    version: string;
    /** Created timestamp */
    created: number;
    /** Last modified timestamp */
    modified: number;
  };

  /** Sheet definitions */
  sheets: Sheet[];

  /** Current active sheet ID */
  activeSheetId: string;

  /** All marks placed on all sheets (keyed by sheet ID) */
  marks: Record<string, Mark[]>;

  /** Dice state */
  dice: DiceState;

  /** Card state */
  cards: CardState;

  /** Currently selected tool */
  currentTool: Tool;

  /** Action history for undo/redo */
  history: HistoryState;

  /** UI state */
  ui: {
    /** Whether dice panel is visible */
    showDicePanel: boolean;
    /** Whether card panel is visible */
    showCardPanel: boolean;
    /** Zoom level (1.0 = 100%) */
    zoomLevel: number;
    /** Whether debug mode is enabled (shows hotspot boundaries) */
    debugMode: boolean;
  };
}

/**
 * Game configuration (what developers define)
 */
export interface GameConfig {
  /** Game name */
  name: string;
  /** Game version */
  version: string;
  /** Sheet definitions */
  sheets: Sheet[];
  /** Initial dice pools */
  dicePools?: DiceState['pools'];
  /** Card decks */
  cardDecks?: CardState['decks'];
  /** Default tool */
  defaultTool?: Partial<Tool>;
}

/**
 * Saved game data (for export/import)
 */
export interface SavedGame {
  /** Config that created this save */
  config: GameConfig;
  /** Current state */
  state: GameState;
  /** Save metadata */
  saveMetadata: {
    savedAt: number;
    version: string;
  };
}
