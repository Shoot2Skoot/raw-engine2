/**
 * Storage Utilities
 * LocalStorage wrapper for game state persistence
 */

import type { SavedGame, GameState } from '../types';

/** Check if localStorage is available */
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
 * Save game state to localStorage
 */
export function saveToLocalStorage(key: string, state: GameState, gameName: string): void {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available');
    return;
  }

  const savedGame: SavedGame = {
    version: '1.0.0',
    gameName,
    state,
    timestamp: Date.now(),
  };

  try {
    localStorage.setItem(key, JSON.stringify(savedGame));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

/**
 * Load game state from localStorage
 */
export function loadFromLocalStorage(key: string): SavedGame | null {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available');
    return null;
  }

  try {
    const data = localStorage.getItem(key);
    if (!data) return null;

    const saved = JSON.parse(data) as SavedGame;
    return saved;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
}

/**
 * Clear saved game from localStorage
 */
export function clearLocalStorage(key: string): void {
  if (!isLocalStorageAvailable()) return;
  localStorage.removeItem(key);
}

/**
 * Export game state as downloadable JSON file
 */
export function exportToFile(state: GameState, gameName: string): void {
  const savedGame: SavedGame = {
    version: '1.0.0',
    gameName,
    state,
    timestamp: Date.now(),
  };

  const blob = new Blob([JSON.stringify(savedGame, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${gameName}-${timestamp}.json`;

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

/**
 * Import game state from JSON file
 */
export function importFromFile(file: File): Promise<SavedGame> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const saved = JSON.parse(content) as SavedGame;
        resolve(saved);
      } catch (error) {
        reject(new Error('Invalid save file format'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}
