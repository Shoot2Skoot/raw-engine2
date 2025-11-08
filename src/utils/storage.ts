/**
 * Utilities for saving/loading game state to/from localStorage
 */

import type { GameState, GameConfig, SavedGame } from '../types';

const STORAGE_KEY_PREFIX = 'roll-write-engine';

/**
 * Saves game state to localStorage
 */
export function saveGameToLocalStorage(state: GameState, config: GameConfig): void {
  try {
    const savedGame: SavedGame = {
      version: '1.0.0',
      timestamp: Date.now(),
      config,
      state
    };

    const key = `${STORAGE_KEY_PREFIX}-${config.id}`;
    localStorage.setItem(key, JSON.stringify(savedGame));
  } catch (error) {
    console.error('Failed to save game to localStorage:', error);
  }
}

/**
 * Loads game state from localStorage
 */
export function loadGameFromLocalStorage(gameId: string): SavedGame | null {
  try {
    const key = `${STORAGE_KEY_PREFIX}-${gameId}`;
    const data = localStorage.getItem(key);

    if (!data) return null;

    const savedGame: SavedGame = JSON.parse(data);
    return savedGame;
  } catch (error) {
    console.error('Failed to load game from localStorage:', error);
    return null;
  }
}

/**
 * Clears saved game from localStorage
 */
export function clearGameFromLocalStorage(gameId: string): void {
  try {
    const key = `${STORAGE_KEY_PREFIX}-${gameId}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear game from localStorage:', error);
  }
}

/**
 * Lists all saved games
 */
export function listSavedGames(): Array<{ id: string; name: string; timestamp: number }> {
  const games: Array<{ id: string; name: string; timestamp: number }> = [];

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_KEY_PREFIX)) {
        const data = localStorage.getItem(key);
        if (data) {
          const savedGame: SavedGame = JSON.parse(data);
          games.push({
            id: savedGame.config.id,
            name: savedGame.config.name,
            timestamp: savedGame.timestamp
          });
        }
      }
    }
  } catch (error) {
    console.error('Failed to list saved games:', error);
  }

  return games.sort((a, b) => b.timestamp - a.timestamp);
}
