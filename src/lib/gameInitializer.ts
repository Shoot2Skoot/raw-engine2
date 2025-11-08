import { GameConfig, GameState } from '../types';

/**
 * Creates initial game state from configuration
 */
export function createInitialState(config: GameConfig): GameState {
  const now = Date.now();

  return {
    metadata: {
      name: config.name,
      version: config.version,
      created: now,
      modified: now,
    },

    sheets: config.sheets,

    activeSheetId: config.sheets[0]?.id || '',

    marks: Object.fromEntries(config.sheets.map(sheet => [sheet.id, []])),

    dice: {
      pools: config.dicePools || [],
      history: [],
    },

    cards: {
      decks: config.cardDecks || {},
    },

    currentTool: {
      type: 'checkbox',
      permanence: 'pen',
      ...config.defaultTool,
    },

    history: {
      past: [],
      future: [],
    },

    ui: {
      showDicePanel: (config.dicePools?.length || 0) > 0,
      showCardPanel: Object.keys(config.cardDecks || {}).length > 0,
      zoomLevel: 1.0,
      debugMode: false,
    },
  };
}

/**
 * Resets game state to initial values
 */
export function resetGameState(config: GameConfig): GameState {
  return createInitialState(config);
}
