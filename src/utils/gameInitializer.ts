/**
 * Utility for creating initial game state from configuration
 */

import type { GameConfig, GameState, SheetState, DicePool, DeckState, Die, MarkType, DieConfig, DeckConfig } from '../types';

/**
 * Creates initial game state from a game configuration
 */
export function createInitialGameState(config: GameConfig): GameState {
  const firstSheet = config.sheets[0];
  const firstSheetId = firstSheet ? firstSheet.name.toLowerCase().replace(/\s+/g, '-') : '';

  return {
    id: config.id,
    name: config.name,
    sheets: config.sheets.map(sheetConfig => createSheetState(sheetConfig)),
    dicePools: config.dicePools?.map(poolConfig => createDicePool(poolConfig)) ?? [],
    decks: config.decks?.map(deckConfig => createDeckState(deckConfig)) ?? [],
    currentSheetId: firstSheetId,
    currentTool: {
      markType: config.defaultTool ?? 'checkbox'
    },
    diceHistory: [],
    actionHistory: [],
    historyIndex: -1
  };
}

/**
 * Creates sheet state from sheet configuration
 */
function createSheetState(config: GameConfig['sheets'][number]): SheetState {
  return {
    id: config.name.toLowerCase().replace(/\s+/g, '-'),
    config: {
      ...config,
      regions: config.regions.map(region => ({
        ...region,
        // Auto-generate hotspots for grid layouts
        hotspots: region.config.layout === 'grid'
          ? generateGridHotspots(region.config, region.id)
          : region.hotspots ?? []
      }))
    }
  };
}

/**
 * Auto-generates hotspots for grid regions
 */
function generateGridHotspots(
  config: Extract<GameConfig['sheets'][number]['regions'][number]['config'], { layout: 'grid' }>,
  regionId: string
) {
  const hotspots = [];
  const cellWidth = config.cellWidth ?? 50;
  const cellHeight = config.cellHeight ?? 50;
  const gap = config.gap ?? 2;
  const offsetX = config.offsetX ?? 0;
  const offsetY = config.offsetY ?? 0;

  for (let row = 0; row < config.rows; row++) {
    for (let col = 0; col < config.columns; col++) {
      const id = `${regionId}-r${row}-c${col}`;
      const x = offsetX + col * (cellWidth + gap);
      const y = offsetY + row * (cellHeight + gap);

      hotspots.push({
        id,
        position: {
          shape: 'rectangle' as const,
          x,
          y,
          width: cellWidth,
          height: cellHeight
        },
        constraints: {
          allowedMarkTypes: ['checkbox', 'number', 'color', 'circle', 'symbol', 'text'] as MarkType[],
          maxMarks: 1
        },
        marks: []
      });
    }
  }

  return hotspots;
}

/**
 * Creates dice pool from configuration
 */
function createDicePool(poolConfig: { id: string; name: string; dice: DieConfig[] }): DicePool {
  return {
    id: poolConfig.id,
    name: poolConfig.name,
    dice: poolConfig.dice.map((dieConfig: DieConfig, index: number) => createDie(dieConfig, `${poolConfig.id}-die-${index}`)),
    visible: true
  };
}

/**
 * Creates a die instance from configuration
 */
function createDie(config: Die['config'], id: string): Die {
  return {
    id,
    config,
    locked: false,
    modified: false
  };
}

/**
 * Creates deck state from configuration
 */
function createDeckState(deckConfig: DeckConfig): DeckState {
  return {
    id: deckConfig.id,
    name: deckConfig.name,
    drawPile: [...deckConfig.cards], // Copy cards
    discardPile: [],
    currentCard: undefined
  };
}
