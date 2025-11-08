/**
 * Game State Management
 * Core logic for managing game state and history
 */

import {
  GameConfig,
  GameState,
  GameAction,
  PlacedMark,
  Tool,
  HistoryEntry,
} from '../../types';
import { generateId } from '../../utils/common';
import { createDeckInstance } from '../cards/cardEngine';
import { createDieInstance } from '../dice/diceEngine';

/**
 * Create initial game state from configuration
 */
export function createInitialState(config: GameConfig): GameState {
  const dicePools = config.dicePools?.map((poolConfig) => ({
    id: generateId(),
    configId: poolConfig.id,
    dice: poolConfig.diceConfigs.map((dieConfig) =>
      createDieInstance(dieConfig)
    ),
    rollHistory: [],
  })) ?? [];

  const decks = config.decks?.map((deckConfig) =>
    createDeckInstance(deckConfig)
  ) ?? [];

  return {
    configId: config.id,
    currentSheetId: config.sheets[0]?.id ?? '',
    marks: [],
    dicePools,
    decks,
    selectedTool: config.tools[0],
    history: [],
    historyIndex: -1,
    lastSaved: Date.now(),
  };
}

/**
 * Add a mark to the game state
 */
export function addMark(
  state: GameState,
  hotspotId: string,
  mark: PlacedMark['mark']
): GameState {
  const placedMark: PlacedMark = {
    id: generateId(),
    hotspotId,
    mark,
    timestamp: Date.now(),
  };

  const action: GameAction = {
    type: 'place-mark',
    mark: placedMark,
  };

  return applyAction(state, action);
}

/**
 * Remove a mark from the game state
 */
export function removeMark(state: GameState, markId: string): GameState {
  const action: GameAction = {
    type: 'remove-mark',
    markId,
  };

  return applyAction(state, action);
}

/**
 * Remove all marks from a hotspot
 */
export function removeMarksFromHotspot(
  state: GameState,
  hotspotId: string
): GameState {
  let newState = state;

  const marksToRemove = state.marks.filter(
    (m) => m.hotspotId === hotspotId
  );

  for (const mark of marksToRemove) {
    newState = removeMark(newState, mark.id);
  }

  return newState;
}

/**
 * Get marks for a specific hotspot
 */
export function getMarksForHotspot(
  state: GameState,
  hotspotId: string
): PlacedMark[] {
  return state.marks.filter((m) => m.hotspotId === hotspotId);
}

/**
 * Change the selected tool
 */
export function selectTool(state: GameState, tool: Tool): GameState {
  return {
    ...state,
    selectedTool: tool,
  };
}

/**
 * Change the current sheet
 */
export function changeSheet(state: GameState, sheetId: string): GameState {
  return {
    ...state,
    currentSheetId: sheetId,
  };
}

/**
 * Apply an action to the state and add to history
 */
function applyAction(state: GameState, action: GameAction): GameState {
  // Truncate history if we're not at the end
  const history =
    state.historyIndex < state.history.length - 1
      ? state.history.slice(0, state.historyIndex + 1)
      : state.history;

  const historyEntry: HistoryEntry = {
    action,
    timestamp: Date.now(),
  };

  const newHistory = [...history, historyEntry];
  const newHistoryIndex = newHistory.length - 1;

  let newState = { ...state };

  // Apply the action
  switch (action.type) {
    case 'place-mark':
      newState.marks = [...state.marks, action.mark];
      break;
    case 'remove-mark':
      newState.marks = state.marks.filter((m) => m.id !== action.markId);
      break;
    // Add other action types as needed
  }

  newState.history = newHistory;
  newState.historyIndex = newHistoryIndex;
  newState.lastSaved = Date.now();

  return newState;
}

/**
 * Undo the last action
 */
export function undo(state: GameState): GameState {
  if (state.historyIndex < 0) {
    return state; // Nothing to undo
  }

  const newHistoryIndex = state.historyIndex - 1;
  return reconstructState(state, newHistoryIndex);
}

/**
 * Redo the next action
 */
export function redo(state: GameState): GameState {
  if (state.historyIndex >= state.history.length - 1) {
    return state; // Nothing to redo
  }

  const newHistoryIndex = state.historyIndex + 1;
  return reconstructState(state, newHistoryIndex);
}

/**
 * Reconstruct state up to a specific history index
 */
function reconstructState(
  state: GameState,
  targetIndex: number
): GameState {
  // Start with empty marks
  let marks: PlacedMark[] = [];

  // Replay all actions up to targetIndex
  for (let i = 0; i <= targetIndex; i++) {
    const action = state.history[i].action;

    switch (action.type) {
      case 'place-mark':
        marks.push(action.mark);
        break;
      case 'remove-mark':
        marks = marks.filter((m) => m.id !== action.markId);
        break;
      // Add other action types as needed
    }
  }

  return {
    ...state,
    marks,
    historyIndex: targetIndex,
  };
}

/**
 * Reset the game state
 */
export function resetState(
  config: GameConfig,
  resetMarks = true,
  resetDice = true,
  resetCards = true
): GameState {
  const initialState = createInitialState(config);

  return {
    ...initialState,
    marks: resetMarks ? [] : initialState.marks,
    dicePools: resetDice ? initialState.dicePools : initialState.dicePools,
    decks: resetCards ? initialState.decks : initialState.decks,
  };
}
