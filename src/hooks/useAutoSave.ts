/**
 * Auto-save hook - automatically saves game state to localStorage
 */

import { useEffect, useRef } from 'react';
import type { GameState } from '../types';
import { serializeGameState, deserializeGameState } from '../utils/gameState';

const AUTOSAVE_KEY_PREFIX = 'raw-engine-autosave-';
const AUTOSAVE_DEBOUNCE_MS = 500; // Wait 500ms after last change before saving

/**
 * Hook to automatically save game state to localStorage
 */
export function useAutoSave(state: GameState, enabled = true) {
  const timeoutRef = useRef<number | null>(null);
  const lastSaveRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    // Debounce saves to avoid too frequent writes
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      try {
        const key = `${AUTOSAVE_KEY_PREFIX}${state.id}`;
        const serialized = serializeGameState(state);
        localStorage.setItem(key, serialized);
        lastSaveRef.current = Date.now();
        console.debug('Auto-saved game state');
      } catch (error) {
        console.error('Failed to auto-save game state:', error);
        // Check if it's a quota exceeded error
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          console.error('localStorage quota exceeded. Consider clearing old saves.');
        }
      }
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [state, enabled]);
}

/**
 * Load a saved game state from localStorage
 */
export function loadSavedGame(gameId: string): GameState | null {
  try {
    const key = `${AUTOSAVE_KEY_PREFIX}${gameId}`;
    const saved = localStorage.getItem(key);

    if (!saved) {
      return null;
    }

    return deserializeGameState(saved);
  } catch (error) {
    console.error('Failed to load saved game:', error);
    return null;
  }
}

/**
 * Get all saved games
 */
export function getAllSavedGames(): Array<{ id: string; name: string; lastModified: number }> {
  const saves: Array<{ id: string; name: string; lastModified: number }> = [];

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(AUTOSAVE_KEY_PREFIX)) {
        const data = localStorage.getItem(key);
        if (data) {
          const state = deserializeGameState(data);
          saves.push({
            id: state.id,
            name: state.name,
            lastModified: state.lastModified,
          });
        }
      }
    }
  } catch (error) {
    console.error('Failed to get saved games:', error);
  }

  return saves.sort((a, b) => b.lastModified - a.lastModified);
}

/**
 * Delete a saved game
 */
export function deleteSavedGame(gameId: string): boolean {
  try {
    const key = `${AUTOSAVE_KEY_PREFIX}${gameId}`;
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Failed to delete saved game:', error);
    return false;
  }
}

/**
 * Clear all saved games
 */
export function clearAllSaves(): boolean {
  try {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(AUTOSAVE_KEY_PREFIX)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.error('Failed to clear all saves:', error);
    return false;
  }
}

/**
 * Get localStorage usage stats
 */
export function getStorageStats(): {
  used: number;
  available: number;
  percentage: number;
} {
  try {
    let used = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        used += key.length + (value?.length || 0);
      }
    }

    // localStorage typically has 5-10MB limit, we'll assume 5MB
    const available = 5 * 1024 * 1024; // 5MB in bytes
    const percentage = (used / available) * 100;

    return {
      used,
      available,
      percentage: Math.min(percentage, 100),
    };
  } catch (error) {
    console.error('Failed to get storage stats:', error);
    return {
      used: 0,
      available: 0,
      percentage: 0,
    };
  }
}
