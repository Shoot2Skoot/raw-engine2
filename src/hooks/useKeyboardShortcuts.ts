/**
 * Hook for keyboard shortcuts
 */

import { useEffect } from 'react';
import { useGame } from '../state/GameContext';
import type { MarkType } from '../types';

interface ShortcutConfig {
  undo?: string;
  redo?: string;
  save?: string;
  tools?: Partial<Record<MarkType, string>>;
  sheets?: string[];
}

const defaultShortcuts: ShortcutConfig = {
  undo: 'z',
  redo: 'Z', // Shift+Z
  save: 's',
  tools: {
    checkbox: '1',
    number: '2',
    color: '3',
    circle: '4',
    symbol: '5',
    text: '6',
    line: '7',
  },
  sheets: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
};

export function useKeyboardShortcuts(config: ShortcutConfig = defaultShortcuts) {
  const { undo, redo, dispatch, state } = useGame();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Check for modifier keys (Ctrl/Cmd)
      const isMod = e.ctrlKey || e.metaKey;

      // Undo (Ctrl/Cmd + Z)
      if (isMod && e.key.toLowerCase() === config.undo?.toLowerCase()) {
        e.preventDefault();
        if (e.shiftKey && config.redo) {
          redo();
        } else {
          undo();
        }
        return;
      }

      // Save (Ctrl/Cmd + S)
      if (isMod && e.key.toLowerCase() === config.save?.toLowerCase()) {
        e.preventDefault();
        // Trigger save (handled by auto-save, but we can add export here)
        return;
      }

      // Don't handle shortcuts when typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Tool shortcuts (without modifier keys)
      if (!isMod && config.tools) {
        for (const [tool, key] of Object.entries(config.tools)) {
          if (e.key === key) {
            e.preventDefault();
            dispatch({ type: 'SELECT_TOOL', tool: tool as MarkType });
            return;
          }
        }
      }

      // Sheet shortcuts (number keys 1-9)
      if (!isMod && config.sheets) {
        const keyIndex = config.sheets.indexOf(e.key);
        if (keyIndex !== -1 && keyIndex < state.sheets.length) {
          e.preventDefault();
          dispatch({ type: 'SWITCH_SHEET', sheetIndex: keyIndex });
          return;
        }
      }

      // Permanence toggle (P key)
      if (!isMod && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        dispatch({
          type: 'SET_PERMANENCE',
          permanence: state.permanence === 'pen' ? 'pencil' : 'pen',
        });
        return;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [config, undo, redo, dispatch, state]);
}
