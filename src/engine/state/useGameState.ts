/**
 * React Hook for Game State Management
 * Provides auto-save and state management functionality
 */

import { useState, useEffect, useCallback } from 'react';
import { GameConfig, GameState, Tool, PlacedMark } from '../../types';
import {
  createInitialState,
  addMark as addMarkToState,
  removeMark as removeMarkFromState,
  removeMarksFromHotspot as removeMarksFromHotspotState,
  selectTool as selectToolState,
  changeSheet as changeSheetState,
  undo as undoState,
  redo as redoState,
  resetState,
  getMarksForHotspot,
} from './gameState';
import { saveGameState, loadGameState } from '../../utils/storage';

/**
 * Custom hook for managing game state
 */
export function useGameState(config: GameConfig) {
  // Try to load saved state, otherwise create initial state
  const [state, setState] = useState<GameState>(() => {
    const savedState = loadGameState(config.id);
    if (savedState && savedState.configId === config.id) {
      return savedState;
    }
    return createInitialState(config);
  });

  // Auto-save to localStorage whenever state changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveGameState(config.id, state);
    }, 500); // Debounce saves by 500ms

    return () => clearTimeout(timeoutId);
  }, [state, config.id]);

  // Mark operations
  const addMark = useCallback(
    (hotspotId: string, mark: PlacedMark['mark']) => {
      setState((current) => addMarkToState(current, hotspotId, mark));
    },
    []
  );

  const removeMark = useCallback((markId: string) => {
    setState((current) => removeMarkFromState(current, markId));
  }, []);

  const removeMarksFromHotspot = useCallback((hotspotId: string) => {
    setState((current) => removeMarksFromHotspotState(current, hotspotId));
  }, []);

  const getHotspotMarks = useCallback(
    (hotspotId: string) => {
      return getMarksForHotspot(state, hotspotId);
    },
    [state]
  );

  // Tool selection
  const selectTool = useCallback((tool: Tool) => {
    setState((current) => selectToolState(current, tool));
  }, []);

  // Sheet navigation
  const changeSheet = useCallback((sheetId: string) => {
    setState((current) => changeSheetState(current, sheetId));
  }, []);

  // Undo/Redo
  const undo = useCallback(() => {
    setState((current) => undoState(current));
  }, []);

  const redo = useCallback(() => {
    setState((current) => redoState(current));
  }, []);

  const canUndo = state.historyIndex >= 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  // Reset
  const reset = useCallback(
    (resetMarks = true, resetDice = true, resetCards = true) => {
      setState(resetState(config, resetMarks, resetDice, resetCards));
    },
    [config]
  );

  // Export state
  const exportState = useCallback(() => {
    return JSON.stringify(state, null, 2);
  }, [state]);

  // Import state
  const importState = useCallback((stateJson: string) => {
    try {
      const imported = JSON.parse(stateJson) as GameState;
      if (imported.configId === config.id) {
        setState(imported);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [config.id]);

  return {
    state,
    setState,
    addMark,
    removeMark,
    removeMarksFromHotspot,
    getHotspotMarks,
    selectTool,
    changeSheet,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
    exportState,
    importState,
  };
}
