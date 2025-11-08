/**
 * useKeyboardShortcuts Hook
 * Handles keyboard shortcuts for the game
 */

import { useEffect } from 'react';

interface UseKeyboardShortcutsProps {
  onUndo: () => void;
  onRedo: () => void;
  onTogglePencilMode?: () => void;
  onSwitchSheet?: (index: number) => void;
  enabled?: boolean;
}

export function useKeyboardShortcuts({
  onUndo,
  onRedo,
  onTogglePencilMode,
  onSwitchSheet,
  enabled = true,
}: UseKeyboardShortcutsProps) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for modifiers
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Undo: Ctrl/Cmd + Z
      if (modifier && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        onUndo();
        return;
      }

      // Redo: Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y
      if (modifier && (e.shiftKey && e.key === 'z') || e.key === 'y') {
        e.preventDefault();
        onRedo();
        return;
      }

      // Toggle pencil mode: P
      if (e.key === 'p' && !modifier && onTogglePencilMode) {
        e.preventDefault();
        onTogglePencilMode();
        return;
      }

      // Switch sheets: 1-9
      if (onSwitchSheet && !modifier) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= 9) {
          e.preventDefault();
          onSwitchSheet(num - 1);
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onUndo, onRedo, onTogglePencilMode, onSwitchSheet]);
}
