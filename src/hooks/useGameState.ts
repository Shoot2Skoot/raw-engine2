/**
 * Game state management hook
 */

import { useState, useCallback, useEffect } from 'react';
import type {
  GameState,
  GameConfig,
  Tool,
  Mark,
  CheckboxMark,
  NumberMark,
  ColorMark,
  CircleMark,
  SymbolMark,
  TextMark,
  GameAction,
} from '../types';

const MAX_HISTORY_SIZE = 50;

export function useGameState(initialConfig: GameConfig) {
  const [state, setState] = useState<GameState>(() => {
    // Initialize game state
    const defaultTool = initialConfig.tools.find(
      (t) => t.type === initialConfig.defaultTool
    ) || initialConfig.tools[0];

    return {
      config: initialConfig,
      currentSheetId: initialConfig.sheets[0]?.id || '',
      currentTool: defaultTool,
      history: {
        past: [],
        future: [],
        maxSize: MAX_HISTORY_SIZE,
      },
      dirty: false,
    };
  });

  // Auto-save to localStorage
  useEffect(() => {
    if (state.dirty) {
      const saveData = {
        sheetMarks: state.config.sheets.map((sheet) => ({
          id: sheet.id,
          hotspots: sheet.hotspots.map((h) => ({
            id: h.id,
            marks: h.marks,
          })),
        })),
        currentSheetId: state.currentSheetId,
        currentToolType: state.currentTool.type,
        timestamp: Date.now(),
      };

      localStorage.setItem(
        `game-${state.config.id}`,
        JSON.stringify(saveData)
      );
    }
  }, [state, state.dirty]);

  // Switch to a different sheet
  const switchSheet = useCallback((sheetId: string) => {
    setState((prev) => ({
      ...prev,
      currentSheetId: sheetId,
    }));
  }, []);

  // Switch to a different tool
  const switchTool = useCallback((tool: Tool) => {
    setState((prev) => ({
      ...prev,
      currentTool: tool,
    }));
  }, []);

  // Add a mark to a hotspot
  const addMark = useCallback((sheetId: string, hotspotId: string, mark: Mark) => {
    setState((prev) => {
      const newConfig = { ...prev.config };
      const sheet = newConfig.sheets.find((s) => s.id === sheetId);
      if (!sheet) return prev;

      const hotspot = sheet.hotspots.find((h) => h.id === hotspotId);
      if (!hotspot) return prev;

      // Check constraints
      const maxMarks = hotspot.constraints.maxMarks ?? 1;
      if (hotspot.marks.length >= maxMarks) {
        // Replace last mark if at max
        hotspot.marks = [...hotspot.marks.slice(0, -1), mark];
      } else {
        hotspot.marks = [...hotspot.marks, mark];
      }

      // Add to history
      const action: GameAction = {
        type: 'ADD_MARK',
        sheetId,
        hotspotId,
        mark,
        timestamp: Date.now(),
      };

      const newPast = [...prev.history.past, action].slice(-MAX_HISTORY_SIZE);

      return {
        ...prev,
        config: newConfig,
        history: {
          ...prev.history,
          past: newPast,
          future: [], // Clear redo stack
        },
        dirty: true,
      };
    });
  }, []);

  // Handle hotspot click based on current tool
  const handleHotspotClick = useCallback(
    (hotspotId: string) => {
      const sheet = state.config.sheets.find((s) => s.id === state.currentSheetId);
      if (!sheet) return;

      const hotspot = sheet.hotspots.find((h) => h.id === hotspotId);
      if (!hotspot || !hotspot.enabled || hotspot.readOnly) return;

      const tool = state.currentTool;
      const now = Date.now();

      switch (tool.type) {
        case 'checkbox': {
          // Find existing checkbox mark or create new one
          const existingMark = hotspot.marks.find(
            (m) => m.type === 'checkbox'
          ) as CheckboxMark | undefined;

          let newState: CheckboxMark['state'];
          if (!existingMark || existingMark.state === 'empty') {
            newState = tool.settings?.checkboxState || 'checked';
          } else if (existingMark.state === 'checked') {
            newState = 'crossed';
          } else {
            newState = 'empty';
          }

          const newMark: CheckboxMark = {
            type: 'checkbox',
            state: newState,
            timestamp: now,
          };

          // Remove existing checkbox mark
          if (existingMark) {
            setState((prev) => {
              const newConfig = { ...prev.config };
              const s = newConfig.sheets.find((sh) => sh.id === state.currentSheetId);
              const h = s?.hotspots.find((hs) => hs.id === hotspotId);
              if (h) {
                h.marks = h.marks.filter((m) => m.type !== 'checkbox');
              }
              return { ...prev, config: newConfig };
            });
          }

          addMark(state.currentSheetId, hotspotId, newMark);
          break;
        }

        case 'number': {
          const number = tool.settings?.number ?? 0;
          const newMark: NumberMark = {
            type: 'number',
            value: number,
            temporary: tool.settings?.temporary,
            timestamp: now,
          };
          addMark(state.currentSheetId, hotspotId, newMark);
          break;
        }

        case 'color': {
          const color = tool.settings?.color || '#3b82f6';
          const newMark: ColorMark = {
            type: 'color',
            color,
            timestamp: now,
          };
          addMark(state.currentSheetId, hotspotId, newMark);
          break;
        }

        case 'circle': {
          const existingMark = hotspot.marks.find(
            (m) => m.type === 'circle'
          ) as CircleMark | undefined;

          let newState: CircleMark['state'];
          if (!existingMark || existingMark.state === 'empty') {
            newState = tool.settings?.circleState || 'half';
          } else if (existingMark.state === 'half') {
            newState = 'full';
          } else {
            newState = 'empty';
          }

          const newMark: CircleMark = {
            type: 'circle',
            state: newState,
            timestamp: now,
          };

          if (existingMark) {
            setState((prev) => {
              const newConfig = { ...prev.config };
              const s = newConfig.sheets.find((sh) => sh.id === state.currentSheetId);
              const h = s?.hotspots.find((hs) => hs.id === hotspotId);
              if (h) {
                h.marks = h.marks.filter((m) => m.type !== 'circle');
              }
              return { ...prev, config: newConfig };
            });
          }

          addMark(state.currentSheetId, hotspotId, newMark);
          break;
        }

        case 'symbol': {
          const symbol = tool.settings?.symbol || 'Star';
          const newMark: SymbolMark = {
            type: 'symbol',
            symbol,
            color: tool.settings?.color,
            timestamp: now,
          };
          addMark(state.currentSheetId, hotspotId, newMark);
          break;
        }

        case 'text': {
          // For text, we'd need a prompt - for now just placeholder
          const newMark: TextMark = {
            type: 'text',
            value: 'Text',
            temporary: tool.settings?.temporary,
            timestamp: now,
          };
          addMark(state.currentSheetId, hotspotId, newMark);
          break;
        }

        case 'eraser': {
          // Remove last mark from hotspot
          setState((prev) => {
            const newConfig = { ...prev.config };
            const s = newConfig.sheets.find((sh) => sh.id === state.currentSheetId);
            const h = s?.hotspots.find((hs) => hs.id === hotspotId);
            if (h && h.marks.length > 0) {
              h.marks = h.marks.slice(0, -1);
            }
            return { ...prev, config: newConfig, dirty: true };
          });
          break;
        }
      }
    },
    [state.currentSheetId, state.currentTool, state.config.sheets, addMark]
  );

  // Undo last action
  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.history.past.length === 0) return prev;

      const newPast = [...prev.history.past];
      const action = newPast.pop();
      if (!action) return prev;

      // Reverse the action
      const newConfig = { ...prev.config };
      if (action.type === 'ADD_MARK') {
        const sheet = newConfig.sheets.find((s) => s.id === action.sheetId);
        const hotspot = sheet?.hotspots.find((h) => h.id === action.hotspotId);
        if (hotspot) {
          hotspot.marks = hotspot.marks.slice(0, -1);
        }
      }

      return {
        ...prev,
        config: newConfig,
        history: {
          ...prev.history,
          past: newPast,
          future: [action, ...prev.history.future].slice(0, MAX_HISTORY_SIZE),
        },
        dirty: true,
      };
    });
  }, []);

  // Redo last undone action
  const redo = useCallback(() => {
    setState((prev) => {
      if (prev.history.future.length === 0) return prev;

      const newFuture = [...prev.history.future];
      const action = newFuture.shift();
      if (!action) return prev;

      // Reapply the action
      const newConfig = { ...prev.config };
      if (action.type === 'ADD_MARK') {
        const sheet = newConfig.sheets.find((s) => s.id === action.sheetId);
        const hotspot = sheet?.hotspots.find((h) => h.id === action.hotspotId);
        if (hotspot) {
          hotspot.marks = [...hotspot.marks, action.mark];
        }
      }

      return {
        ...prev,
        config: newConfig,
        history: {
          ...prev.history,
          past: [...prev.history.past, action],
          future: newFuture,
        },
        dirty: true,
      };
    });
  }, []);

  // Reset game
  const reset = useCallback(() => {
    if (confirm('Are you sure you want to reset the entire game? This cannot be undone.')) {
      setState((prev) => {
        const newConfig = { ...prev.config };
        newConfig.sheets.forEach((sheet) => {
          sheet.hotspots.forEach((hotspot) => {
            hotspot.marks = [];
          });
        });

        return {
          ...prev,
          config: newConfig,
          history: {
            past: [],
            future: [],
            maxSize: MAX_HISTORY_SIZE,
          },
          dirty: true,
        };
      });
    }
  }, []);

  return {
    state,
    currentSheet: state.config.sheets.find((s) => s.id === state.currentSheetId),
    switchSheet,
    switchTool,
    handleHotspotClick,
    undo,
    redo,
    reset,
    canUndo: state.history.past.length > 0,
    canRedo: state.history.future.length > 0,
  };
}
