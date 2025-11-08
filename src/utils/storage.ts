/**
 * Utility functions for saving and loading game state
 */

import type { GameState } from '../types';

const STORAGE_KEY_PREFIX = 'roll-write-game-';

/**
 * Save game state to localStorage
 */
export function saveToLocalStorage(gameId: string, state: GameState): void {
  try {
    const key = `${STORAGE_KEY_PREFIX}${gameId}`;
    const serialized = serializeGameState(state);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}

/**
 * Load game state from localStorage
 */
export function loadFromLocalStorage(gameId: string): GameState | null {
  try {
    const key = `${STORAGE_KEY_PREFIX}${gameId}`;
    const serialized = localStorage.getItem(key);
    if (!serialized) return null;

    return deserializeGameState(serialized);
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
}

/**
 * Clear saved game state from localStorage
 */
export function clearLocalStorage(gameId: string): void {
  const key = `${STORAGE_KEY_PREFIX}${gameId}`;
  localStorage.removeItem(key);
}

/**
 * Export game state as JSON file
 */
export function exportGameState(state: GameState): void {
  const serialized = serializeGameState(state);
  const blob = new Blob([serialized], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${state.gameId}_${timestamp}.json`;

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
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
        const content = e.target?.result as string;
        const state = deserializeGameState(content);
        resolve(state);
      } catch (error) {
        reject(new Error('Invalid game state file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Serialize game state to JSON string
 * Handles Map conversion
 */
function serializeGameState(state: GameState): string {
  // Convert Maps to objects for JSON serialization
  const serializable = {
    ...state,
    sheetStates: state.sheetStates.map(sheetState => ({
      sheetId: sheetState.sheetId,
      marks: Array.from(sheetState.marks.entries()),
    })),
  };

  return JSON.stringify(serializable, null, 2);
}

/**
 * Deserialize game state from JSON string
 * Handles Map reconstruction
 */
function deserializeGameState(json: string): GameState {
  const parsed = JSON.parse(json);

  return {
    ...parsed,
    sheetStates: parsed.sheetStates.map((sheetState: { sheetId: string; marks: [string, unknown[]][] }) => ({
      sheetId: sheetState.sheetId,
      marks: new Map(sheetState.marks),
    })),
  };
}

/**
 * Check if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get size of saved game state in bytes
 */
export function getStorageSize(gameId: string): number {
  const key = `${STORAGE_KEY_PREFIX}${gameId}`;
  const item = localStorage.getItem(key);
  return item ? new Blob([item]).size : 0;
}

/**
 * List all saved games
 */
export function listSavedGames(): string[] {
  const games: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_KEY_PREFIX)) {
      games.push(key.replace(STORAGE_KEY_PREFIX, ''));
    }
  }

  return games;
}
