/**
 * Keyboard shortcuts hook for the game engine
 */

import { useEffect } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  action: () => void;
  description: string;
}

/**
 * Hook to register keyboard shortcuts
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = !shortcut.ctrl || event.ctrlKey || event.metaKey;
        const shiftMatches = !shortcut.shift || event.shiftKey;
        const altMatches = !shortcut.alt || event.altKey;
        const metaMatches = !shortcut.meta || event.metaKey;

        // If all modifiers are false, ensure none are pressed
        const noModifiers = !shortcut.ctrl && !shortcut.shift && !shortcut.alt && !shortcut.meta;
        const noModifiersPressed = !event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey;

        if (keyMatches) {
          if (noModifiers && noModifiersPressed) {
            event.preventDefault();
            shortcut.action();
            break;
          } else if (!noModifiers && ctrlMatches && shiftMatches && altMatches && metaMatches) {
            // Ensure the required modifiers are pressed
            const requiredCtrl = shortcut.ctrl ? event.ctrlKey || event.metaKey : true;
            const requiredShift = shortcut.shift ? event.shiftKey : true;
            const requiredAlt = shortcut.alt ? event.altKey : true;
            const requiredMeta = shortcut.meta ? event.metaKey : true;

            if (requiredCtrl && requiredShift && requiredAlt && requiredMeta) {
              event.preventDefault();
              shortcut.action();
              break;
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts, enabled]);
}

/**
 * Get default keyboard shortcuts for the game engine
 */
export function getDefaultShortcuts(actions: {
  undo?: () => void;
  redo?: () => void;
  save?: () => void;
  switchSheet?: (index: number) => void;
  toggleTool?: (index: number) => void;
}): KeyboardShortcut[] {
  const shortcuts: KeyboardShortcut[] = [];

  if (actions.undo) {
    shortcuts.push({
      key: 'z',
      ctrl: true,
      action: actions.undo,
      description: 'Undo last action',
    });
  }

  if (actions.redo) {
    shortcuts.push({
      key: 'z',
      ctrl: true,
      shift: true,
      action: actions.redo,
      description: 'Redo action',
    });

    // Alternative redo shortcut
    shortcuts.push({
      key: 'y',
      ctrl: true,
      action: actions.redo,
      description: 'Redo action (alternative)',
    });
  }

  if (actions.save) {
    shortcuts.push({
      key: 's',
      ctrl: true,
      action: actions.save,
      description: 'Save game',
    });
  }

  // Sheet switching (1-9)
  if (actions.switchSheet) {
    for (let i = 1; i <= 9; i++) {
      shortcuts.push({
        key: i.toString(),
        action: () => actions.switchSheet!(i - 1),
        description: `Switch to sheet ${i}`,
      });
    }
  }

  // Tool switching (Alt + 1-9)
  if (actions.toggleTool) {
    for (let i = 1; i <= 9; i++) {
      shortcuts.push({
        key: i.toString(),
        alt: true,
        action: () => actions.toggleTool!(i - 1),
        description: `Switch to tool ${i}`,
      });
    }
  }

  return shortcuts;
}

/**
 * Format shortcut for display
 */
export function formatShortcut(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];

  if (shortcut.ctrl) parts.push('Ctrl');
  if (shortcut.shift) parts.push('Shift');
  if (shortcut.alt) parts.push('Alt');
  if (shortcut.meta) parts.push('Cmd');

  parts.push(shortcut.key.toUpperCase());

  return parts.join('+');
}
