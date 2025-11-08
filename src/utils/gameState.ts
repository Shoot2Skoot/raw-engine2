/**
 * Utility functions for game state management
 */

import type {
  GameState,
  GameConfig,
  GameAction,
  Mark,
  Sheet,
  Hotspot,
  DicePool,
  Deck,
  ActiveTool,
  DieConfig,
} from '../types';

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create initial game state from configuration
 */
export function createInitialGameState(config: GameConfig): GameState {
  const sheets: Sheet[] = config.sheets.map((sheetConfig) => ({
    id: sheetConfig.id,
    name: sheetConfig.name,
    layout: sheetConfig.layout,
    hotspots: generateHotspotsFromLayout(sheetConfig),
    regions: sheetConfig.regions,
  }));

  const dicePools: DicePool[] =
    config.dicePools?.map((poolConfig) => ({
      id: poolConfig.id,
      label: poolConfig.label,
      dice: poolConfig.dice,
      results: [],
    })) || [];

  const decks: Deck[] =
    config.decks?.map((deckConfig) => ({
      id: deckConfig.id,
      label: deckConfig.label,
      cards: [...deckConfig.cards],
      drawPile: shuffleArray([...deckConfig.cards]),
      discardPile: [],
      faceDown: deckConfig.faceDown,
    })) || [];

  const defaultTool: ActiveTool = {
    config: config.tools[0],
    permanence: 'pen',
  };

  return {
    id: generateId(),
    name: config.name,
    sheets,
    marks: [],
    dicePools,
    decks,
    currentSheetId: sheets[0]?.id || '',
    activeTool: defaultTool,
    history: [],
    historyIndex: -1,
    diceRollHistory: [],
    createdAt: Date.now(),
    lastModified: Date.now(),
  };
}

/**
 * Generate hotspots from layout configuration
 */
function generateHotspotsFromLayout(sheetConfig: {
  id: string;
  layout: any;
}): Hotspot[] {
  const hotspots: Hotspot[] = [];

  if (sheetConfig.layout.type === 'grid' && sheetConfig.layout.generateHotspots) {
    const layout = sheetConfig.layout;
    const cellWidth = layout.cellWidth || 60;
    const cellHeight = layout.cellHeight || 60;

    for (let row = 0; row < layout.rows; row++) {
      for (let col = 0; col < layout.columns; col++) {
        const x = layout.offsetX + col * (cellWidth + layout.gap);
        const y = layout.offsetY + row * (cellHeight + layout.gap);

        hotspots.push({
          id: `${sheetConfig.id}-cell-${row}-${col}`,
          sheetId: sheetConfig.id,
          shape: {
            type: 'rect',
            x,
            y,
            width: cellWidth,
            height: cellHeight,
          },
          constraints: layout.defaultConstraints,
        });
      }
    }
  } else if (sheetConfig.layout.type === 'image') {
    hotspots.push(...sheetConfig.layout.hotspots);
  } else if (sheetConfig.layout.type === 'freeform') {
    sheetConfig.layout.regions?.forEach((region: any) => {
      hotspots.push(...region.hotspots);
    });
  }

  return hotspots;
}

/**
 * Fisher-Yates shuffle algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Roll a die and get result
 */
export function rollDie(config: DieConfig): number | any {
  if (config.type === 'standard') {
    const sides = parseInt(config.dieType.substring(1));
    return Math.floor(Math.random() * sides) + 1;
  } else {
    const faces = config.customDie.faces;
    const totalWeight = faces.reduce((sum, face) => sum + (face.weight || 1), 0);
    let random = Math.random() * totalWeight;

    for (const face of faces) {
      random -= face.weight || 1;
      if (random <= 0) {
        return face;
      }
    }

    return faces[faces.length - 1];
  }
}

/**
 * Check if a point is inside a hotspot
 */
export function isPointInHotspot(point: { x: number; y: number }, hotspot: Hotspot): boolean {
  const { shape } = hotspot;

  if (shape.type === 'rect') {
    return (
      point.x >= shape.x &&
      point.x <= shape.x + shape.width &&
      point.y >= shape.y &&
      point.y <= shape.y + shape.height
    );
  } else if (shape.type === 'circle') {
    const dx = point.x - shape.center.x;
    const dy = point.y - shape.center.y;
    return dx * dx + dy * dy <= shape.radius * shape.radius;
  } else if (shape.type === 'polygon') {
    // Ray casting algorithm for point-in-polygon
    const vertices = shape.vertices;
    let inside = false;
    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
      const xi = vertices[i].x;
      const yi = vertices[i].y;
      const xj = vertices[j].x;
      const yj = vertices[j].y;

      const intersect =
        yi > point.y !== yj > point.y &&
        point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;

      if (intersect) inside = !inside;
    }
    return inside;
  }

  return false;
}

/**
 * Find hotspot at a point
 */
export function findHotspotAtPoint(
  point: { x: number; y: number },
  hotspots: Hotspot[]
): Hotspot | undefined {
  // Find hotspots at point, sorted by z-index (highest first)
  const matches = hotspots
    .filter((h) => isPointInHotspot(point, h))
    .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));

  return matches[0];
}

/**
 * Get all marks for a specific hotspot
 */
export function getMarksForHotspot(hotspotId: string, marks: Mark[]): Mark[] {
  return marks.filter((m) => m.hotspotId === hotspotId);
}

/**
 * Check if a mark can be placed on a hotspot
 */
export function canPlaceMark(
  hotspot: Hotspot,
  mark: Partial<Mark>,
  existingMarks: Mark[]
): { allowed: boolean; reason?: string } {
  const { constraints } = hotspot;

  // Check if mark type is allowed
  if (!constraints.allowedMarkTypes.includes(mark.type!)) {
    return { allowed: false, reason: 'Mark type not allowed on this hotspot' };
  }

  // Check max marks limit
  const currentMarks = getMarksForHotspot(hotspot.id, existingMarks);
  if (constraints.maxMarks && currentMarks.length >= constraints.maxMarks) {
    return { allowed: false, reason: 'Maximum marks reached for this hotspot' };
  }

  // Check number range for number marks
  if (mark.type === 'number' && constraints.numberRange) {
    const value = (mark as any).value;
    if (value < constraints.numberRange.min || value > constraints.numberRange.max) {
      return { allowed: false, reason: 'Number outside allowed range' };
    }
  }

  // Check allowed colors for color marks
  if (mark.type === 'color' && constraints.allowedColors) {
    const color = (mark as any).color;
    if (!constraints.allowedColors.includes(color)) {
      return { allowed: false, reason: 'Color not allowed on this hotspot' };
    }
  }

  // Check allowed symbols for symbol marks
  if (mark.type === 'symbol' && constraints.allowedSymbols) {
    const symbol = (mark as any).symbol;
    if (!constraints.allowedSymbols.includes(symbol)) {
      return { allowed: false, reason: 'Symbol not allowed on this hotspot' };
    }
  }

  return { allowed: true };
}

/**
 * Create inverse action for undo
 */
export function createInverseAction(action: GameAction): GameAction {
  switch (action.type) {
    case 'addMark':
      return {
        id: generateId(),
        type: 'removeMark',
        timestamp: Date.now(),
        data: { markId: action.data.mark.id },
      };

    case 'removeMark':
      return {
        id: generateId(),
        type: 'addMark',
        timestamp: Date.now(),
        data: { mark: action.data.removedMark },
      };

    case 'modifyMark':
      return {
        id: generateId(),
        type: 'modifyMark',
        timestamp: Date.now(),
        data: {
          markId: action.data.markId,
          previousState: action.data.newState,
          newState: action.data.previousState,
        },
      };

    default:
      return action;
  }
}

/**
 * Serialize game state for saving
 */
export function serializeGameState(state: GameState): string {
  const serialized = {
    ...state,
    createdAt: new Date(state.createdAt).toISOString(),
    lastModified: new Date(state.lastModified).toISOString(),
  };
  return JSON.stringify(serialized, null, 2);
}

/**
 * Deserialize game state from saved data
 */
export function deserializeGameState(data: string): GameState {
  const parsed = JSON.parse(data);
  return {
    ...parsed,
    createdAt: new Date(parsed.createdAt).getTime(),
    lastModified: new Date(parsed.lastModified).getTime(),
  };
}
