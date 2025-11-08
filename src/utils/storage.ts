/**
 * Storage Utilities
 * Handle saving and loading game state to localStorage
 */

import { GameState } from '../types';

const STORAGE_KEY_PREFIX = 'roll-write-game';

/**
 * Save game state to localStorage
 */
export function saveGameState(gameId: string, state: GameState): void {
  try {
    const key = `${STORAGE_KEY_PREFIX}-${gameId}`;
    const serialized = JSON.stringify(state);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}

/**
 * Load game state from localStorage
 */
export function loadGameState(gameId: string): GameState | null {
  try {
    const key = `${STORAGE_KEY_PREFIX}-${gameId}`;
    const serialized = localStorage.getItem(key);
    if (!serialized) return null;
    return JSON.parse(serialized) as GameState;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
}

/**
 * Clear saved game state
 */
export function clearGameState(gameId: string): void {
  try {
    const key = `${STORAGE_KEY_PREFIX}-${gameId}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear game state:', error);
  }
}

/**
 * Export game state to JSON file
 */
export function exportGameState(gameId: string, state: GameState): void {
  try {
    const serialized = JSON.stringify(state, null, 2);
    const blob = new Blob([serialized], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${gameId}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export game state:', error);
  }
}

/**
 * Import game state from JSON file
 */
export function importGameState(
  file: File,
  callback: (state: GameState | null) => void
): void {
  try {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const state = JSON.parse(content) as GameState;
        callback(state);
      } catch (error) {
        console.error('Failed to parse game state:', error);
        callback(null);
      }
    };
    reader.readAsText(file);
  } catch (error) {
    console.error('Failed to import game state:', error);
    callback(null);
  }
}

/**
 * List all saved games
 */
export function listSavedGames(): string[] {
  try {
    const games: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_KEY_PREFIX)) {
        games.push(key.replace(`${STORAGE_KEY_PREFIX}-`, ''));
      }
    }
    return games;
  } catch (error) {
    console.error('Failed to list saved games:', error);
    return [];
  }
}
