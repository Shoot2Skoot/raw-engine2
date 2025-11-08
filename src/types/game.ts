/**
 * Game Types
 * Main game state and configuration
 */

import { SheetDefinition } from './sheet';
import { PlacedMark } from './marks';
import { DicePoolConfig, DicePoolInstance } from './dice';
import { DeckConfig, DeckInstance } from './cards';

/** Tool types for player interaction */
export type ToolType =
  | 'checkbox'
  | 'number'
  | 'color'
  | 'circle'
  | 'symbol'
  | 'text'
  | 'line'
  | 'eraser';

/** Tool configuration */
export interface Tool {
  type: ToolType;
  label: string;
  icon?: string;
  isPermanent: boolean; // pen vs pencil mode
  config?: unknown; // tool-specific configuration (e.g., color palette)
}

/** Game action for undo/redo */
export type GameAction =
  | { type: 'place-mark'; mark: PlacedMark }
  | { type: 'remove-mark'; markId: string }
  | { type: 'roll-dice'; poolId: string; results: unknown }
  | { type: 'lock-die'; poolId: string; dieId: string }
  | { type: 'unlock-die'; poolId: string; dieId: string }
  | { type: 'draw-card'; deckId: string; cardId: string }
  | { type: 'discard-card'; deckId: string; cardId: string };

/** History entry for undo/redo */
export interface HistoryEntry {
  action: GameAction;
  timestamp: number;
}

/** Game configuration */
export interface GameConfig {
  id: string;
  name: string;
  version: string;
  sheets: SheetDefinition[];
  dicePools?: DicePoolConfig[];
  decks?: DeckConfig[];
  tools: Tool[];
  metadata?: Record<string, unknown>;
}

/** Game state */
export interface GameState {
  configId: string;
  currentSheetId: string;
  marks: PlacedMark[];
  dicePools: DicePoolInstance[];
  decks: DeckInstance[];
  selectedTool: Tool;
  history: HistoryEntry[];
  historyIndex: number; // current position in history for undo/redo
  lastSaved: number; // timestamp
  metadata?: Record<string, unknown>; // custom game state
}

/** Complete game instance */
export interface Game {
  config: GameConfig;
  state: GameState;
}
