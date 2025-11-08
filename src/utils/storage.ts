/**
 * LocalStorage utilities for auto-save and manual save/load
 */

import type { GameState, SaveFile } from '../types';

const STORAGE_KEY_PREFIX = 'roll-and-write-engine';
const SAVE_VERSION = '1.0.0';

/** Get the storage key for a game */
function getStorageKey(gameId: string): string {
  return `${STORAGE_KEY_PREFIX}:${gameId}`;
}

/** Save game state to localStorage */
export function saveGameState(gameState: GameState): void {
  try {
    const key = getStorageKey(gameState.id);
    const data = JSON.stringify({
      ...gameState,
      lastSaved: Date.now(),
    });
    localStorage.setItem(key, data);
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}

/** Load game state from localStorage */
export function loadGameState(gameId: string): GameState | null {
  try {
    const key = getStorageKey(gameId);
    const data = localStorage.getItem(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data) as GameState;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
}

/** Delete saved game state */
export function deleteGameState(gameId: string): void {
  try {
    const key = getStorageKey(gameId);
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to delete game state:', error);
  }
}

/** Check if a saved game exists */
export function hasSavedGame(gameId: string): boolean {
  const key = getStorageKey(gameId);
  return localStorage.getItem(key) !== null;
}

/** Export game state as downloadable JSON file */
export function exportGameState(gameState: GameState): void {
  const saveFile: SaveFile = {
    version: SAVE_VERSION,
    gameState,
    exportedAt: Date.now(),
  };

  const dataStr = JSON.stringify(saveFile, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${gameState.name}-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Import game state from JSON file */
export function importGameState(file: File): Promise<GameState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const saveFile = JSON.parse(content) as SaveFile;

        if (!saveFile.gameState) {
          reject(new Error('Invalid save file format'));
          return;
        }

        resolve(saveFile.gameState);
      } catch (error) {
        reject(new Error('Failed to parse save file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/** List all saved games */
export function listSavedGames(): Array<{ gameId: string; lastSaved?: number }> {
  const games: Array<{ gameId: string; lastSaved?: number }> = [];

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        const gameId = key.replace(`${STORAGE_KEY_PREFIX}:`, '');
        const data = localStorage.getItem(key);

        if (data) {
          try {
            const gameState = JSON.parse(data) as GameState;
            games.push({
              gameId,
              lastSaved: gameState.lastSaved,
            });
          } catch {
            // Skip invalid entries
          }
        }
      }
    }
  } catch (error) {
    console.error('Failed to list saved games:', error);
  }

  return games.sort((a, b) => (b.lastSaved || 0) - (a.lastSaved || 0));
}

/** Clear all saved games (use with caution!) */
export function clearAllSavedGames(): void {
  const keysToRemove: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach(key => localStorage.removeItem(key));
}

/** Get storage usage estimate */
export function getStorageUsage(): { used: number; total: number } {
  try {
    let used = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        const value = localStorage.getItem(key);
        if (value) {
          used += key.length + value.length;
        }
      }
    }

    // Typical localStorage limit is 5-10MB, we'll assume 5MB
    const total = 5 * 1024 * 1024;

    return { used, total };
  } catch {
    return { used: 0, total: 0 };
  }
}
