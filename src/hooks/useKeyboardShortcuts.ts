/**
 * Keyboard Shortcuts Hook - handles keyboard shortcuts for game actions
 */

import { useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import { useGameActions } from './useGameActions';

export function useKeyboardShortcuts() {
  const { state, canUndo, canRedo } = useGameContext();
  const { undo, redo, selectTool, switchSheet, toggleMarkMode } = useGameActions();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Check for modifier keys
      const isCmdOrCtrl = event.metaKey || event.ctrlKey;

      // Undo: Cmd/Ctrl + Z
      if (isCmdOrCtrl && event.key === 'z' && !event.shiftKey) {
        if (canUndo) {
          event.preventDefault();
          undo();
        }
        return;
      }

      // Redo: Cmd/Ctrl + Shift + Z or Cmd/Ctrl + Y
      if (
        (isCmdOrCtrl && event.key === 'z' && event.shiftKey) ||
        (isCmdOrCtrl && event.key === 'y')
      ) {
        if (canRedo) {
          event.preventDefault();
          redo();
        }
        return;
      }

      // Don't handle shortcuts if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Tool shortcuts (1-9)
      if (event.key >= '1' && event.key <= '9') {
        const toolIndex = parseInt(event.key) - 1;
        if (toolIndex < state.tools.availableTools.length) {
          event.preventDefault();
          selectTool(toolIndex);
        }
        return;
      }

      // Sheet navigation (Alt + 1-9)
      if (event.altKey && event.key >= '1' && event.key <= '9') {
        const sheetIndex = parseInt(event.key) - 1;
        if (sheetIndex < state.sheets.length) {
          event.preventDefault();
          switchSheet(sheetIndex);
        }
        return;
      }

      // Toggle pencil/pen mode (P key)
      if (event.key === 'p' || event.key === 'P') {
        event.preventDefault();
        toggleMarkMode();
        return;
      }

      // Eraser shortcut (E key)
      if (event.key === 'e' || event.key === 'E') {
        const eraserIndex = state.tools.availableTools.findIndex(
          (tool) => tool.type === 'eraser'
        );
        if (eraserIndex !== -1) {
          event.preventDefault();
          selectTool(eraserIndex);
        }
        return;
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    state.tools.availableTools,
    state.sheets.length,
    canUndo,
    canRedo,
    undo,
    redo,
    selectTool,
    switchSheet,
    toggleMarkMode,
  ]);
}
