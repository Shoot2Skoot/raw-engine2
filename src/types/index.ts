/**
 * Core type definitions for the Roll & Write Game Engine
 */

// ============================================================================
// Mark Types
// ============================================================================

export type MarkType =
  | 'checkbox'
  | 'number'
  | 'color'
  | 'circle'
  | 'symbol'
  | 'text'
  | 'line';

export type CheckboxState = 'empty' | 'checked' | 'crossed';
export type CircleState = 'empty' | 'half' | 'full';

export interface BaseMark {
  id: string;
  type: MarkType;
  hotspotId: string;
  timestamp: number;
  isPencil?: boolean; // temporary vs permanent
}

export interface CheckboxMark extends BaseMark {
  type: 'checkbox';
  state: CheckboxState;
}

export interface NumberMark extends BaseMark {
  type: 'number';
  value: number;
}

export interface ColorMark extends BaseMark {
  type: 'color';
  color: string;
}

export interface CircleMark extends BaseMark {
  type: 'circle';
  state: CircleState;
}

export interface SymbolMark extends BaseMark {
  type: 'symbol';
  symbol: string;
}

export interface TextMark extends BaseMark {
  type: 'text';
  text: string;
}

export interface LineMark extends BaseMark {
  type: 'line';
  fromHotspotId: string;
  toHotspotId: string;
  style?: 'solid' | 'dashed' | 'dotted';
  color?: string;
}

export type Mark =
  | CheckboxMark
  | NumberMark
  | ColorMark
  | CircleMark
  | SymbolMark
  | TextMark
  | LineMark;

// ============================================================================
// Hotspot Types
// ============================================================================

export type HotspotShape = 'rectangle' | 'circle' | 'polygon';

export interface HotspotConstraints {
  allowedMarkTypes: MarkType[];
  maxMarks?: number; // undefined = unlimited
  requireSequence?: boolean;
  isReadOnly?: boolean;
  canUnmark?: boolean;
  numberRange?: { min: number; max: number };
  textMaxLength?: number;
}

export interface BaseHotspot {
  id: string;
  shape: HotspotShape;
  constraints: HotspotConstraints;
  label?: string;
  defaultValue?: Mark;
}

export interface RectangleHotspot extends BaseHotspot {
  shape: 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CircleHotspot extends BaseHotspot {
  shape: 'circle';
  cx: number;
  cy: number;
  r: number;
}

export interface PolygonHotspot extends BaseHotspot {
  shape: 'polygon';
  points: { x: number; y: number }[];
}

export type Hotspot = RectangleHotspot | CircleHotspot | PolygonHotspot;

// ============================================================================
// Layout Types
// ============================================================================

export type LayoutType = 'grid' | 'image-overlay' | 'freeform' | 'mixed';

export interface GridLayoutConfig {
  type: 'grid';
  rows: number;
  cols: number;
  cellSize?: number; // if undefined, auto-calculate
  gap?: number;
  x?: number; // offset position
  y?: number;
  backgroundColor?: string;
  defaultConstraints: HotspotConstraints;
  cellLabels?: { [key: string]: string }; // row-col index to label
}

export interface ImageOverlayLayoutConfig {
  type: 'image-overlay';
  imageUrl: string;
  width: number;
  height: number;
  hotspots: Hotspot[];
  maintainAspectRatio?: boolean;
}

export interface FreeformLayoutConfig {
  type: 'freeform';
  width: number;
  height: number;
  hotspots: Hotspot[];
  backgroundColor?: string;
}

export interface MixedLayoutConfig {
  type: 'mixed';
  width: number;
  height: number;
  regions: (GridLayoutConfig | ImageOverlayLayoutConfig | FreeformLayoutConfig)[];
}

export type LayoutConfig =
  | GridLayoutConfig
  | ImageOverlayLayoutConfig
  | FreeformLayoutConfig
  | MixedLayoutConfig;

// ============================================================================
// Sheet Types
// ============================================================================

export interface Sheet {
  id: string;
  name: string;
  layout: LayoutConfig;
  marks: Mark[];
}

// ============================================================================
// Dice Types
// ============================================================================

export type DieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'custom';

export interface DieFace {
  value: number | string;
  symbol?: string;
  color?: string;
  weight?: number; // for weighted dice
}

export interface DieConfig {
  id: string;
  type: DieType;
  label?: string;
  faces?: DieFace[]; // for custom dice
  color?: string; // visual color of the die
}

export interface DieResult {
  dieId: string;
  faceIndex: number;
  value: number | string;
  isLocked: boolean;
  timestamp: number;
}

export interface DicePool {
  id: string;
  label: string;
  dice: DieConfig[];
  results: DieResult[];
}

// ============================================================================
// Card Types
// ============================================================================

export interface CardField {
  name: string;
  type: 'number' | 'text' | 'symbol' | 'color' | 'image';
  value: number | string;
}

export interface Card {
  id: string;
  fields: CardField[];
}

export interface Deck {
  id: string;
  label: string;
  cards: Card[];
  drawPile: string[]; // card IDs
  discardPile: string[]; // card IDs
  currentCard?: Card;
}

// ============================================================================
// Game State Types
// ============================================================================

export interface GameState {
  id: string;
  name: string;
  sheets: Sheet[];
  currentSheetId: string;
  dicePools: DicePool[];
  decks: Deck[];
  timestamp: number;
}

export interface HistoryEntry {
  timestamp: number;
  action: GameAction;
  state: GameState;
}

export type GameAction =
  | { type: 'PLACE_MARK'; sheetId: string; mark: Mark }
  | { type: 'REMOVE_MARK'; sheetId: string; markId: string }
  | { type: 'ROLL_DICE'; poolId: string }
  | { type: 'LOCK_DIE'; poolId: string; dieId: string }
  | { type: 'UNLOCK_DIE'; poolId: string; dieId: string }
  | { type: 'DRAW_CARD'; deckId: string }
  | { type: 'DISCARD_CARD'; deckId: string }
  | { type: 'SHUFFLE_DECK'; deckId: string }
  | { type: 'CHANGE_SHEET'; sheetId: string }
  | { type: 'RESET_GAME' }
  | { type: 'RESET_SHEET'; sheetId: string };

// ============================================================================
// Tool Types
// ============================================================================

export interface Tool {
  type: MarkType;
  label: string;
  icon: string; // icon name from lucide-react
  config?: {
    // Tool-specific configuration
    colors?: string[]; // for color tool
    symbols?: string[]; // for symbol tool
    numberRange?: { min: number; max: number }; // for number tool
  };
}

// ============================================================================
// Game Configuration Types
// ============================================================================

export interface GameConfig {
  id: string;
  name: string;
  description?: string;
  sheets: Omit<Sheet, 'marks'>[]; // sheets without initial marks
  dicePools?: DicePool[];
  decks?: Deck[];
  tools: Tool[];
  initialSheetId?: string;
}
