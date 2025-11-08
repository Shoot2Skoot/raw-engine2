/**
 * LocalStorage Utilities for Auto-Save
 */

import type { GameState, SavedGame } from '../types';

const STORAGE_KEY_PREFIX = 'raw_engine_';
const AUTO_SAVE_KEY = `${STORAGE_KEY_PREFIX}autosave`;
const SAVE_VERSION = '1.0.0';

/**
 * Saves game state to localStorage (auto-save)
 */
export function autoSaveGame(state: GameState): boolean {
  try {
    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    console.error('Failed to auto-save game:', error);
    return false;
  }
}

/**
 * Loads game state from localStorage (auto-save)
 */
export function loadAutoSave(): GameState | null {
  try {
    const saved = localStorage.getItem(AUTO_SAVE_KEY);
    if (!saved) return null;
    return JSON.parse(saved) as GameState;
  } catch (error) {
    console.error('Failed to load auto-save:', error);
    return null;
  }
}

/**
 * Clears the auto-save from localStorage
 */
export function clearAutoSave(): boolean {
  try {
    localStorage.removeItem(AUTO_SAVE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear auto-save:', error);
    return false;
  }
}

/**
 * Exports game state as JSON string for manual save
 */
export function exportGameState(state: GameState): string {
  const savedGame: SavedGame = {
    version: SAVE_VERSION,
    state,
    exportedAt: Date.now(),
  };
  return JSON.stringify(savedGame, null, 2);
}

/**
 * Imports game state from JSON string
 */
export function importGameState(jsonString: string): GameState | null {
  try {
    const savedGame = JSON.parse(jsonString) as SavedGame;

    // Version validation (future-proofing for migrations)
    if (savedGame.version !== SAVE_VERSION) {
      console.warn(
        `Save file version mismatch. Expected ${SAVE_VERSION}, got ${savedGame.version}`
      );
      // In the future, could add migration logic here
    }

    return savedGame.state;
  } catch (error) {
    console.error('Failed to import game state:', error);
    return null;
  }
}

/**
 * Downloads game state as a JSON file
 */
export function downloadGameState(state: GameState, filename?: string): void {
  const json = exportGameState(state);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const defaultFilename = `${state.name.replace(/\s+/g, '_')}_${Date.now()}.json`;
  const finalFilename = filename || defaultFilename;

  const link = document.createElement('a');
  link.href = url;
  link.download = finalFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Triggers file upload dialog and returns the imported game state
 */
export function uploadGameState(): Promise<GameState | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        resolve(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const state = importGameState(content);
        resolve(state);
      };
      reader.onerror = () => {
        console.error('Failed to read file');
        resolve(null);
      };
      reader.readAsText(file);
    };

    input.click();
  });
}

/**
 * Checks if localStorage is available
 */
export function isStorageAvailable(): boolean {
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
 * Gets the size of localStorage usage in bytes
 */
export function getStorageSize(): number {
  let total = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total;
}
