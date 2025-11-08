/**
 * Game Definition Builder
 *
 * Converts developer-friendly game definitions into full game state
 */

import type {
  GameDefinition,
  GameState,
  Sheet,
  Region,
  Hotspot,
  GridRegionConfig,
  TrackRegionConfig,
  ConnectionGridConfig,
  MarkType,
  Deck,
} from '../types';
import {
  generateHotspotId,
  range,
} from '../utils/helpers';

/** Build a complete game state from a game definition */
export function buildGameFromDefinition(definition: GameDefinition): GameState {
  const sheets = definition.sheets.map(sheetDef => buildSheet(sheetDef));

  const dicePools = definition.dicePools?.map(poolDef => ({
    id: poolDef.id,
    name: poolDef.name,
    dice: poolDef.dice,
    results: [],
    history: [],
  })) || [];

  const decks: Deck[] = definition.decks?.map(deckDef => ({
    id: deckDef.id,
    name: deckDef.name,
    cards: deckDef.cards,
    discardPile: [],
    currentCard: undefined,
    isFaceUp: deckDef.isFaceUp,
  })) || [];

  return {
    id: definition.id,
    name: definition.name,
    sheets,
    activeSheetId: sheets[0]?.id || '',
    dicePools,
    decks,
    selectedTool: {
      markType: definition.defaultTool || 'checkbox',
      isPencilMode: false,
    },
    history: [],
    historyIndex: 0,
  };
}

/** Build a sheet from definition */
function buildSheet(definition: any): Sheet {
  const regions = definition.regions.map((regionDef: any) =>
    buildRegion(regionDef)
  );

  return {
    id: definition.id,
    name: definition.name,
    layout: definition.layout,
    regions,
    backgroundImage: definition.backgroundImage,
    width: definition.width || 1000,
    height: definition.height || 800,
    scaleMode: definition.scaleMode || 'fit',
  };
}

/** Build a region from definition */
function buildRegion(definition: any): Region {
  const hotspots = buildHotspotsForRegion(definition);

  return {
    id: definition.id,
    type: definition.type,
    hotspots,
    config: definition.config,
    backgroundColor: definition.backgroundColor,
    border: definition.border,
    offsetX: definition.offsetX || 0,
    offsetY: definition.offsetY || 0,
  };
}

/** Build hotspots for a region based on its type */
function buildHotspotsForRegion(regionDef: any): Hotspot[] {
  const hotspots: Hotspot[] = [];

  switch (regionDef.type) {
    case 'grid':
      hotspots.push(...buildGridHotspots(regionDef));
      break;
    case 'track':
      hotspots.push(...buildTrackHotspots(regionDef));
      break;
    case 'connectionGrid':
      hotspots.push(...buildConnectionGridHotspots(regionDef));
      break;
    case 'freeform':
      // Freeform regions require manual hotspot definition
      hotspots.push(...(regionDef.hotspots || []));
      break;
    default:
      break;
  }

  return hotspots;
}

/** Build hotspots for a grid region */
function buildGridHotspots(regionDef: any): Hotspot[] {
  const config = regionDef.config as GridRegionConfig;
  const hotspots: Hotspot[] = [];

  const cellWidth = config.cellWidth || 50;
  const cellHeight = config.cellHeight || 50;
  const gap = config.gap || 2;
  const startX = config.startX || 0;
  const startY = config.startY || 0;

  const allowedMarkTypes: MarkType[] = regionDef.constraints?.allowedMarkTypes || ['checkbox'];

  for (let row = 0; row < config.rows; row++) {
    for (let col = 0; col < config.columns; col++) {
      const index = row * config.columns + col;
      const id = generateHotspotId(regionDef.id, index);

      const x = startX + col * (cellWidth + gap);
      const y = startY + row * (cellHeight + gap);

      hotspots.push({
        id,
        shape: 'rectangle',
        geometry: {
          x,
          y,
          width: cellWidth,
          height: cellHeight,
        },
        constraints: {
          allowedMarkTypes,
          maxMarks: regionDef.constraints?.maxMarks || 1,
          canErase: regionDef.constraints?.canErase !== false,
          isEnabled: true,
        },
        marks: [],
        label: regionDef.generateLabels?.(row, col),
        style: regionDef.style,
        zIndex: 0,
      });
    }
  }

  return hotspots;
}

/** Build hotspots for a track region */
function buildTrackHotspots(regionDef: any): Hotspot[] {
  const config = regionDef.config as TrackRegionConfig;
  const hotspots: Hotspot[] = [];

  const spaceSize = config.spaceSize || 40;
  const allowedMarkTypes: MarkType[] = regionDef.constraints?.allowedMarkTypes || ['checkbox'];

  let positions: Array<{ x: number; y: number }>;

  if (config.pathType === 'custom' && config.positions) {
    positions = config.positions;
  } else if (config.pathType === 'horizontal') {
    positions = range(0, config.spaces).map(i => ({
      x: i * (spaceSize + 5),
      y: 0,
    }));
  } else {
    // vertical
    positions = range(0, config.spaces).map(i => ({
      x: 0,
      y: i * (spaceSize + 5),
    }));
  }

  positions.forEach((pos, index) => {
    const id = generateHotspotId(regionDef.id, index);

    hotspots.push({
      id,
      shape: 'circle',
      geometry: {
        cx: pos.x + spaceSize / 2,
        cy: pos.y + spaceSize / 2,
        radius: spaceSize / 2,
      },
      constraints: {
        allowedMarkTypes,
        maxMarks: 1,
        canErase: true,
        isEnabled: true,
      },
      marks: [],
      label: `${index + 1}`,
      zIndex: 0,
    });
  });

  return hotspots;
}

/** Build hotspots for a connection grid region */
function buildConnectionGridHotspots(regionDef: any): Hotspot[] {
  const config = regionDef.config as ConnectionGridConfig;
  const hotspots: Hotspot[] = [];

  const nodeSize = config.nodeSize || 10;
  const spacing = config.spacing || 60;

  for (let row = 0; row < config.rows; row++) {
    for (let col = 0; col < config.columns; col++) {
      const index = row * config.columns + col;
      const id = generateHotspotId(regionDef.id, index);

      const x = col * spacing;
      const y = row * spacing;

      hotspots.push({
        id,
        shape: 'circle',
        geometry: {
          cx: x,
          cy: y,
          radius: nodeSize,
        },
        constraints: {
          allowedMarkTypes: ['line'],
          maxMarks: undefined, // Unlimited connections
          canErase: true,
          isEnabled: true,
        },
        marks: [],
        zIndex: 0,
      });
    }
  }

  return hotspots;
}

/** Helper to create a simple grid sheet definition */
export function createGridSheet(
  id: string,
  name: string,
  rows: number,
  columns: number,
  options?: {
    cellWidth?: number;
    cellHeight?: number;
    gap?: number;
    allowedMarkTypes?: MarkType[];
  }
) {
  return {
    id,
    name,
    layout: 'grid' as const,
    regions: [
      {
        id: `${id}-grid`,
        type: 'grid' as const,
        config: {
          rows,
          columns,
          cellWidth: options?.cellWidth,
          cellHeight: options?.cellHeight,
          gap: options?.gap,
        },
        constraints: {
          allowedMarkTypes: options?.allowedMarkTypes || ['number'],
        },
      },
    ],
  };
}

/** Helper to create a track sheet definition */
export function createTrackSheet(
  id: string,
  name: string,
  spaces: number,
  pathType: 'horizontal' | 'vertical' = 'horizontal'
) {
  return {
    id,
    name,
    layout: 'grid' as const,
    regions: [
      {
        id: `${id}-track`,
        type: 'track' as const,
        config: {
          spaces,
          pathType,
        },
        constraints: {
          allowedMarkTypes: ['checkbox' as MarkType],
        },
      },
    ],
  };
}
