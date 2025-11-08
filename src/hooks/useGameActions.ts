/**
 * Game Actions Hook - provides convenient methods for common game actions
 */

import { useCallback } from 'react';
import { useGameContext } from '../context/GameContext';
import type { Mark } from '../types';
import { rollDice, rerollUnlocked } from '../types';

export function useGameActions() {
  const { state, dispatch } = useGameContext();

  /** Place a mark on a hotspot */
  const placeMark = useCallback(
    (sheetId: string, hotspotId: string, mark: Mark) => {
      dispatch({
        type: 'PLACE_MARK',
        payload: { sheetId, hotspotId, mark },
      });
    },
    [dispatch]
  );

  /** Remove a mark from a hotspot */
  const removeMark = useCallback(
    (sheetId: string, hotspotId: string, markId: string) => {
      dispatch({
        type: 'REMOVE_MARK',
        payload: { sheetId, hotspotId, markId },
      });
    },
    [dispatch]
  );

  /** Roll all dice in a pool */
  const rollDicePool = useCallback(
    (poolId: string) => {
      const pool = state.dicePools.find((p) => p.pool.id === poolId);
      if (!pool) return;

      const results = rollDice(pool.pool.dice);
      dispatch({
        type: 'ROLL_DICE',
        payload: { poolId, results },
      });
    },
    [state.dicePools, dispatch]
  );

  /** Reroll unlocked dice in a pool */
  const rerollDicePool = useCallback(
    (poolId: string) => {
      const pool = state.dicePools.find((p) => p.pool.id === poolId);
      if (!pool || !pool.results.length) return;

      const results = rerollUnlocked(pool.results);
      dispatch({
        type: 'ROLL_DICE',
        payload: { poolId, results },
      });
    },
    [state.dicePools, dispatch]
  );

  /** Toggle lock on a specific die */
  const toggleDieLock = useCallback(
    (poolId: string, dieIndex: number) => {
      dispatch({
        type: 'TOGGLE_DIE_LOCK',
        payload: { poolId, dieIndex },
      });
    },
    [dispatch]
  );

  /** Switch to a different sheet */
  const switchSheet = useCallback(
    (sheetIndex: number) => {
      dispatch({
        type: 'SWITCH_SHEET',
        payload: { sheetIndex },
      });
    },
    [dispatch]
  );

  /** Select a tool */
  const selectTool = useCallback(
    (toolIndex: number) => {
      dispatch({
        type: 'SELECT_TOOL',
        payload: { toolIndex },
      });
    },
    [dispatch]
  );

  /** Toggle between pencil and pen mode */
  const toggleMarkMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_MARK_MODE' });
  }, [dispatch]);

  /** Undo last action */
  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, [dispatch]);

  /** Redo last undone action */
  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, [dispatch]);

  /** Reset game to initial state */
  const reset = useCallback(() => {
    if (
      window.confirm(
        'Are you sure you want to reset? This will clear all your progress.'
      )
    ) {
      dispatch({ type: 'RESET' });
    }
  }, [dispatch]);

  return {
    // Mark actions
    placeMark,
    removeMark,

    // Dice actions
    rollDicePool,
    rerollDicePool,
    toggleDieLock,

    // Sheet actions
    switchSheet,

    // Tool actions
    selectTool,
    toggleMarkMode,

    // Undo/redo actions
    undo,
    redo,
    reset,
  };
}
