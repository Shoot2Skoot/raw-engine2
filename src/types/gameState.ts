/**
 * Game state - the complete state of a roll-and-write game
 */

import type { SheetState } from './sheet';
import type { DicePoolState } from './dice';
import type { DeckState } from './cards';
import type { ToolState } from './tools';

/** Action types for undo/redo system */
export type ActionType =
  | 'PLACE_MARK'
  | 'REMOVE_MARK'
  | 'MODIFY_MARK'
  | 'ROLL_DICE'
  | 'LOCK_DIE'
  | 'MODIFY_DIE'
  | 'DRAW_CARD'
  | 'DISCARD_CARD'
  | 'SHUFFLE_DECK'
  | 'SWITCH_SHEET';

/** Action for undo/redo */
export interface GameAction {
  /** Action type */
  type: ActionType;
  /** Timestamp */
  timestamp: number;
  /** Previous state snapshot (for undo) */
  previousState: Partial<GameState>;
  /** New state snapshot (for redo) */
  newState: Partial<GameState>;
  /** Human-readable description */
  description: string;
}

/** Complete game configuration */
export interface GameConfig {
  /** Game identifier */
  id: string;
  /** Game name */
  name: string;
  /** Game version */
  version: string;
  /** All sheets in this game */
  sheets: SheetState[];
  /** Dice pools (optional) */
  dicePools?: DicePoolState[];
  /** Card decks (optional) */
  decks?: DeckState[];
  /** Available tools */
  tools: ToolState;
  /** Custom game-specific data */
  customData?: Record<string, any>;
}

/** Complete game state */
export interface GameState {
  /** Game configuration */
  config: GameConfig;
  /** Currently active sheet index */
  activeSheetIndex: number;
  /** All sheet states */
  sheets: SheetState[];
  /** Dice pool states */
  dicePools: DicePoolState[];
  /** Deck states */
  decks: DeckState[];
  /** Tool state */
  tools: ToolState;
  /** Undo stack */
  undoStack: GameAction[];
  /** Redo stack */
  redoStack: GameAction[];
  /** Last auto-save timestamp */
  lastSaved: number;
  /** Custom game-specific state */
  customState?: Record<string, any>;
}

/** Saved game data (for localStorage or file export) */
export interface SavedGame {
  /** Save format version */
  version: string;
  /** When this was saved */
  timestamp: number;
  /** Game state */
  state: GameState;
  /** Save metadata */
  metadata: {
    gameName: string;
    saveDate: string;
    playTime?: number;
  };
}

/** Create initial game state from config */
export function createInitialGameState(config: GameConfig): GameState {
  return {
    config,
    activeSheetIndex: 0,
    sheets: config.sheets,
    dicePools: config.dicePools || [],
    decks: config.decks || [],
    tools: config.tools,
    undoStack: [],
    redoStack: [],
    lastSaved: Date.now(),
    customState: config.customData,
  };
}

/** Serialize game state to JSON */
export function serializeGameState(state: GameState): string {
  const savedGame: SavedGame = {
    version: '1.0.0',
    timestamp: Date.now(),
    state: {
      ...state,
      // Convert Map to object for serialization
      sheets: state.sheets.map(sheet => ({
        ...sheet,
        hotspots: Object.fromEntries(sheet.hotspots) as any,
      })),
    },
    metadata: {
      gameName: state.config.name,
      saveDate: new Date().toISOString(),
    },
  };

  return JSON.stringify(savedGame, null, 2);
}

/** Deserialize game state from JSON */
export function deserializeGameState(json: string): GameState {
  const savedGame: SavedGame = JSON.parse(json);

  return {
    ...savedGame.state,
    // Convert hotspots object back to Map
    sheets: savedGame.state.sheets.map(sheet => ({
      ...sheet,
      hotspots: new Map(Object.entries((sheet.hotspots as any) || {})),
    })),
  };
}

/** Save game to localStorage */
export function saveToLocalStorage(state: GameState, key: string = 'gameState'): void {
  try {
    const serialized = serializeGameState(state);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

/** Load game from localStorage */
export function loadFromLocalStorage(key: string = 'gameState'): GameState | null {
  try {
    const serialized = localStorage.getItem(key);
    if (!serialized) return null;
    return deserializeGameState(serialized);
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
}

/** Save game to file (download) */
export function saveToFile(state: GameState, filename?: string): void {
  const serialized = serializeGameState(state);
  const blob = new Blob([serialized], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const finalFilename = filename || `${state.config.name}-${timestamp}.json`;

  const a = document.createElement('a');
  a.href = url;
  a.download = finalFilename;
  a.click();

  URL.revokeObjectURL(url);
}

/** Load game from file */
export async function loadFromFile(file: File): Promise<GameState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const state = deserializeGameState(json);
        resolve(state);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
