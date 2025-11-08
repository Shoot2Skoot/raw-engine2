/**
 * useGameState Hook
 * Main hook for managing complete game state
 */

import { useState, useCallback, useEffect } from 'react';
import type { GameState, GameConfig, Mark, SheetState, ToolType, Action } from '../types';
import { generateId } from '../utils/idGenerator';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/storage';

export function useGameState(config: GameConfig) {
  const [state, setState] = useState<GameState>(() => {
    // Try to load from localStorage first
    if (config.autoSave?.enabled) {
      const saved = loadFromLocalStorage(config.autoSave.storageKey);
      if (saved) {
        return saved.state;
      }
    }

    // Initialize new state
    return {
      sheets: config.sheets.sheets.map((sheet) => ({
        sheetId: sheet.id,
        marks: [],
      })),
      currentSheetId: config.sheets.initialSheetId || config.sheets.sheets[0].id,
      toolState: {
        currentTool: 'checkbox',
        isPencilMode: false,
      },
      dicePools: config.dice?.pools || [],
      diceHistory: { results: [], maxHistory: config.maxHistorySize || 10 },
      deckStates: config.cards?.initialStates || [],
      history: {
        past: [],
        future: [],
        maxSize: config.maxHistorySize || 50,
      },
      metadata: {},
    };
  });

  // Auto-save effect
  useEffect(() => {
    const autoSave = config.autoSave;
    if (autoSave?.enabled) {
      const timeoutId = setTimeout(() => {
        saveToLocalStorage(
          autoSave.storageKey,
          state,
          config.metadata.name
        );
      }, autoSave.debounceMs || 500);

      return () => clearTimeout(timeoutId);
    }
  }, [state, config.autoSave, config.metadata.name]);

  // Helper to get current sheet state
  const getCurrentSheetState = useCallback((): SheetState => {
    return (
      state.sheets.find((s) => s.sheetId === state.currentSheetId) || {
        sheetId: state.currentSheetId,
        marks: [],
      }
    );
  }, [state.sheets, state.currentSheetId]);

  // Add action to history
  const addToHistory = useCallback((action: Action) => {
    setState((prev) => ({
      ...prev,
      history: {
        ...prev.history,
        past: [...prev.history.past, { action, timestamp: Date.now() }].slice(
          -prev.history.maxSize
        ),
        future: [], // Clear redo stack when new action is performed
      },
    }));
  }, []);

  // Add mark
  const addMark = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mark: any) => {
      const fullMark: Mark = {
        ...mark,
        id: generateId('mark'),
        createdAt: Date.now(),
      } as Mark;

      setState((prev) => {
        const newSheets = prev.sheets.map((sheet) =>
          sheet.sheetId === prev.currentSheetId
            ? { ...sheet, marks: [...sheet.marks, fullMark] }
            : sheet
        );

        return { ...prev, sheets: newSheets };
      });

      addToHistory({
        type: 'ADD_MARK',
        mark: fullMark,
        sheetId: state.currentSheetId,
      });

      return fullMark;
    },
    [state.currentSheetId, addToHistory]
  );

  // Remove mark
  const removeMark = useCallback(
    (markId: string) => {
      setState((prev) => {
        const newSheets = prev.sheets.map((sheet) =>
          sheet.sheetId === prev.currentSheetId
            ? { ...sheet, marks: sheet.marks.filter((m) => m.id !== markId) }
            : sheet
        );

        return { ...prev, sheets: newSheets };
      });

      addToHistory({
        type: 'REMOVE_MARK',
        markId,
        sheetId: state.currentSheetId,
      });
    },
    [state.currentSheetId, addToHistory]
  );

  // Update mark
  const updateMark = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (markId: string, updates: Partial<Mark>) => {
      setState((prev) => {
        const newSheets = prev.sheets.map((sheet) =>
          sheet.sheetId === prev.currentSheetId
            ? {
                ...sheet,
                marks: sheet.marks.map((m) =>
                  m.id === markId ? ({ ...m, ...updates } as Mark) : m
                ),
              }
            : sheet
        );

        return { ...prev, sheets: newSheets };
      });

      addToHistory({
        type: 'UPDATE_MARK',
        markId,
        mark: updates,
        sheetId: state.currentSheetId,
      });
    },
    [state.currentSheetId, addToHistory]
  );

  // Set current tool
  const setCurrentTool = useCallback((tool: ToolType) => {
    setState((prev) => ({
      ...prev,
      toolState: { ...prev.toolState, currentTool: tool },
    }));
  }, []);

  // Toggle pencil mode
  const togglePencilMode = useCallback(() => {
    setState((prev) => ({
      ...prev,
      toolState: {
        ...prev.toolState,
        isPencilMode: !prev.toolState.isPencilMode,
      },
    }));
  }, []);

  // Switch sheet
  const switchSheet = useCallback((sheetId: string) => {
    setState((prev) => ({ ...prev, currentSheetId: sheetId }));
  }, []);

  // Undo
  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.history.past.length === 0) return prev;

      const lastEntry = prev.history.past[prev.history.past.length - 1];
      const newPast = prev.history.past.slice(0, -1);

      // Reverse the action
      let newSheets = prev.sheets;
      const action = lastEntry.action;
      if (action.type === 'ADD_MARK') {
        newSheets = prev.sheets.map((sheet) =>
          sheet.sheetId === action.sheetId
            ? {
                ...sheet,
                marks: sheet.marks.filter((m) => m.id !== action.mark.id),
              }
            : sheet
        );
      } else if (action.type === 'REMOVE_MARK') {
        // Would need to store the removed mark to properly restore
        // For now, we'll keep it simple
      }

      return {
        ...prev,
        sheets: newSheets,
        history: {
          ...prev.history,
          past: newPast,
          future: [lastEntry, ...prev.history.future],
        },
      };
    });
  }, []);

  // Redo
  const redo = useCallback(() => {
    setState((prev) => {
      if (prev.history.future.length === 0) return prev;

      const nextEntry = prev.history.future[0];
      const newFuture = prev.history.future.slice(1);

      // Reapply the action
      let newSheets = prev.sheets;
      const action = nextEntry.action;
      if (action.type === 'ADD_MARK') {
        newSheets = prev.sheets.map((sheet) =>
          sheet.sheetId === action.sheetId
            ? { ...sheet, marks: [...sheet.marks, action.mark] }
            : sheet
        );
      }

      return {
        ...prev,
        sheets: newSheets,
        history: {
          ...prev.history,
          past: [...prev.history.past, nextEntry],
          future: newFuture,
        },
      };
    });
  }, []);

  // Reset
  const reset = useCallback(() => {
    if (confirm('Are you sure you want to reset the game? This cannot be undone.')) {
      setState({
        sheets: config.sheets.sheets.map((sheet) => ({
          sheetId: sheet.id,
          marks: [],
        })),
        currentSheetId: config.sheets.initialSheetId || config.sheets.sheets[0].id,
        toolState: {
          currentTool: 'checkbox',
          isPencilMode: false,
        },
        dicePools: config.dice?.pools || [],
        diceHistory: { results: [], maxHistory: config.maxHistorySize || 10 },
        deckStates: config.cards?.initialStates || [],
        history: {
          past: [],
          future: [],
          maxSize: config.maxHistorySize || 50,
        },
        metadata: {},
      });
    }
  }, [config]);

  return {
    state,
    setState,
    getCurrentSheetState,
    addMark,
    removeMark,
    updateMark,
    setCurrentTool,
    togglePencilMode,
    switchSheet,
    undo,
    redo,
    reset,
    canUndo: state.history.past.length > 0,
    canRedo: state.history.future.length > 0,
  };
}
