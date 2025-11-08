/**
 * Game state manager - Centralized state management with undo/redo
 */

import type { GameState, GameConfig, GameAction, ToolState } from '../types';
import { initializeDeck } from './cards';
import { generateGridHotspots, generateTrackHotspots } from './hotspots';

/**
 * Create initial game state from config
 */
export function createInitialGameState(config: GameConfig): GameState {
  // Initialize decks
  const decks = config.deckDefinitions?.map(initializeDeck) || [];

  // Generate hotspots for sheets based on their layouts
  const sheetsWithHotspots = config.sheets.map((sheet) => {
    let hotspots = sheet.hotspots || [];

    // Auto-generate hotspots for grid layouts if not provided
    if (sheet.layout.type === 'grid' && hotspots.length === 0) {
      hotspots = generateGridHotspots(sheet.id, sheet.layout);
    }

    // Auto-generate hotspots for track layouts if not provided
    if (sheet.layout.type === 'track' && hotspots.length === 0) {
      hotspots = generateTrackHotspots(sheet.id, sheet.layout);
    }

    return {
      ...sheet,
      hotspots,
    };
  });

  const updatedConfig = {
    ...config,
    sheets: sheetsWithHotspots,
  };

  return {
    config: updatedConfig,
    currentSheetIndex: 0,
    marks: [],
    dicePools: [],
    diceHistory: [],
    decks,
    tools: {
      selectedTool: config.defaultTools?.[0] || 'checkbox',
      isPencilMode: false,
    },
    history: [],
    historyIndex: -1,
  };
}

/**
 * Apply an action to the game state
 */
export function applyAction(state: GameState, action: GameAction): GameState {
  let newState = state;

  switch (action.type) {
    case 'ADD_MARK':
      newState = {
        ...state,
        marks: [...state.marks, action.mark],
      };
      break;

    case 'REMOVE_MARK':
      newState = {
        ...state,
        marks: state.marks.filter((mark) => mark.id !== action.markId),
      };
      break;

    case 'UPDATE_MARK':
      newState = {
        ...state,
        marks: state.marks.map((mark) =>
          mark.id === action.markId ? action.newMark : mark
        ),
      };
      break;

    case 'ROLL_DICE':
      newState = {
        ...state,
        dicePools: state.dicePools.map((pool) =>
          pool.id === action.poolId ? { ...pool, dice: action.newResults } : pool
        ),
        diceHistory: [
          ...state.diceHistory,
          {
            timestamp: action.timestamp,
            poolId: action.poolId,
            results: action.newResults,
          },
        ],
      };
      break;

    default:
      console.warn('Unknown action type:', (action as any).type);
      return state;
  }

  // Add action to history
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(action);

  return {
    ...newState,
    history: newHistory,
    historyIndex: newHistory.length - 1,
  };
}

/**
 * Undo last action
 */
export function undo(state: GameState): GameState {
  if (state.historyIndex < 0) {
    console.warn('Nothing to undo');
    return state;
  }

  const action = state.history[state.historyIndex];
  let newState = state;

  switch (action.type) {
    case 'ADD_MARK':
      newState = {
        ...state,
        marks: state.marks.filter((mark) => mark.id !== action.mark.id),
      };
      break;

    case 'REMOVE_MARK':
      newState = {
        ...state,
        marks: [...state.marks, action.previousMark],
      };
      break;

    case 'UPDATE_MARK':
      newState = {
        ...state,
        marks: state.marks.map((mark) =>
          mark.id === action.markId ? action.previousMark : mark
        ),
      };
      break;

    case 'ROLL_DICE':
      newState = {
        ...state,
        dicePools: state.dicePools.map((pool) =>
          pool.id === action.poolId ? { ...pool, dice: action.previousResults } : pool
        ),
      };
      break;

    default:
      console.warn('Cannot undo action type:', (action as any).type);
      return state;
  }

  return {
    ...newState,
    historyIndex: state.historyIndex - 1,
  };
}

/**
 * Redo last undone action
 */
export function redo(state: GameState): GameState {
  if (state.historyIndex >= state.history.length - 1) {
    console.warn('Nothing to redo');
    return state;
  }

  const nextAction = state.history[state.historyIndex + 1];
  const newState = applyActionWithoutHistory(state, nextAction);

  return {
    ...newState,
    historyIndex: state.historyIndex + 1,
  };
}

/**
 * Apply action without adding to history (used internally for redo)
 */
function applyActionWithoutHistory(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_MARK':
      return {
        ...state,
        marks: [...state.marks, action.mark],
      };

    case 'REMOVE_MARK':
      return {
        ...state,
        marks: state.marks.filter((mark) => mark.id !== action.markId),
      };

    case 'UPDATE_MARK':
      return {
        ...state,
        marks: state.marks.map((mark) =>
          mark.id === action.markId ? action.newMark : mark
        ),
      };

    case 'ROLL_DICE':
      return {
        ...state,
        dicePools: state.dicePools.map((pool) =>
          pool.id === action.poolId ? { ...pool, dice: action.newResults } : pool
        ),
      };

    default:
      return state;
  }
}

/**
 * Change current sheet
 */
export function changeSheet(state: GameState, sheetIndex: number): GameState {
  if (sheetIndex < 0 || sheetIndex >= state.config.sheets.length) {
    console.warn('Invalid sheet index:', sheetIndex);
    return state;
  }

  return {
    ...state,
    currentSheetIndex: sheetIndex,
  };
}

/**
 * Update tool state
 */
export function updateToolState(
  state: GameState,
  updates: Partial<ToolState>
): GameState {
  return {
    ...state,
    tools: {
      ...state.tools,
      ...updates,
    },
  };
}

/**
 * Reset game state
 */
export function resetGameState(
  state: GameState,
  resetMarksOnly: boolean = false
): GameState {
  if (resetMarksOnly) {
    return {
      ...state,
      marks: [],
      history: [],
      historyIndex: -1,
    };
  }

  // Full reset
  return createInitialGameState(state.config);
}

/**
 * Save game state to localStorage
 */
export function saveToLocalStorage(state: GameState, key: string = 'gameState'): void {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

/**
 * Load game state from localStorage
 */
export function loadFromLocalStorage(key: string = 'gameState'): GameState | null {
  try {
    const serialized = localStorage.getItem(key);
    if (!serialized) return null;
    return JSON.parse(serialized);
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
}

/**
 * Export game state to JSON file
 */
export function exportGameState(state: GameState, filename?: string): void {
  const json = JSON.stringify(state, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `game-save-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Import game state from JSON file
 */
export function importGameState(file: File): Promise<GameState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const state = JSON.parse(e.target?.result as string);
        resolve(state);
      } catch (error) {
        reject(new Error('Invalid game state file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
