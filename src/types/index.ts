/**
 * Roll-and-Write Game Engine - Core Type Definitions
 *
 * Comprehensive type system for defining sheets, marks, dice, cards, and game state
 */

// ============================================================================
// MARK TYPES
// ============================================================================

/** Base mark type that all marks extend */
export interface BaseMark {
  id: string;
  hotspotId: string;
  type: MarkType;
  timestamp: number;
  isPencil?: boolean; // Temporary vs permanent marks
}

/** All available mark types */
export type MarkType =
  | 'checkbox'
  | 'number'
  | 'color'
  | 'circle'
  | 'symbol'
  | 'text'
  | 'line'
  | 'region-fill';

/** Checkbox mark with three states */
export interface CheckboxMark extends BaseMark {
  type: 'checkbox';
  state: 'empty' | 'checked' | 'crossed';
}

/** Number entry mark */
export interface NumberMark extends BaseMark {
  type: 'number';
  value: number;
}

/** Color fill mark */
export interface ColorMark extends BaseMark {
  type: 'color';
  color: string; // Hex color code
  opacity?: number; // 0-1
}

/** Circle mark with fill levels */
export interface CircleMark extends BaseMark {
  type: 'circle';
  fillLevel: 'empty' | 'half' | 'full';
}

/** Symbol/icon mark */
export interface SymbolMark extends BaseMark {
  type: 'symbol';
  symbolId: string; // References symbol from palette
}

/** Text entry mark */
export interface TextMark extends BaseMark {
  type: 'text';
  value: string;
}

/** Line/connection mark */
export interface LineMark extends BaseMark {
  type: 'line';
  fromHotspotId: string;
  toHotspotId: string;
  lineStyle?: string; // Color, dash pattern, etc.
}

/** Region fill mark */
export interface RegionFillMark extends BaseMark {
  type: 'region-fill';
  regionId: string;
  fillColor: string;
}

/** Union type of all possible marks */
export type Mark =
  | CheckboxMark
  | NumberMark
  | ColorMark
  | CircleMark
  | SymbolMark
  | TextMark
  | LineMark
  | RegionFillMark;

// ============================================================================
// HOTSPOT & LAYOUT TYPES
// ============================================================================

/** Position in 2D space */
export interface Position {
  x: number;
  y: number;
}

/** Rectangular dimensions */
export interface Dimensions {
  width: number;
  height: number;
}

/** Rectangular hotspot */
export interface RectHotspot {
  shape: 'rect';
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Circular hotspot */
export interface CircleHotspot {
  shape: 'circle';
  centerX: number;
  centerY: number;
  radius: number;
}

/** Polygonal hotspot */
export interface PolygonHotspot {
  shape: 'polygon';
  points: Position[]; // Array of vertices
}

/** Union of hotspot shapes */
export type HotspotShape = RectHotspot | CircleHotspot | PolygonHotspot;

/** Interactive hotspot on a sheet */
export interface Hotspot {
  id: string;
  shape: HotspotShape;
  allowedMarkTypes: MarkType[]; // Which mark types can be placed here
  maxMarks?: number; // Maximum number of marks (default: 1)
  label?: string; // Optional label for the hotspot
  defaultValue?: string | number; // Starting value
  readOnly?: boolean; // Display only, not interactive
  regionId?: string; // If part of a region
}

/** Grid layout configuration */
export interface GridLayout {
  type: 'grid';
  rows: number;
  columns: number;
  cellWidth?: number; // Auto-calculate if not provided
  cellHeight?: number; // Auto-calculate if not provided
  gap?: number; // Spacing between cells
  offsetX?: number; // Starting X position
  offsetY?: number; // Starting Y position
  allowedMarkTypes: MarkType[]; // Applies to all cells
  backgroundColor?: string;
}

/** Image-based layout with custom hotspots */
export interface ImageLayout {
  type: 'image';
  imageUrl: string;
  width: number;
  height: number;
  hotspots: Hotspot[];
  maintainAspectRatio?: boolean;
}

/** Resource track layout */
export interface TrackLayout {
  type: 'track';
  spaces: number;
  path: Position[]; // Array of coordinates for each space
  allowedMarkTypes: MarkType[];
  direction?: 'forward' | 'bidirectional';
  labels?: string[]; // Optional label per space
}

/** Connection grid for network building */
export interface ConnectionLayout {
  type: 'connection';
  gridWidth: number;
  gridHeight: number;
  nodeSpacing: number;
  allowDiagonal?: boolean;
  lineStyles?: string[]; // Different connection types
}

/** Freeform layout with manually defined hotspots */
export interface FreeformLayout {
  type: 'freeform';
  width: number;
  height: number;
  regions: Region[];
  hotspots: Hotspot[];
}

/** Region grouping multiple hotspots */
export interface Region {
  id: string;
  name: string;
  hotspotIds: string[];
  backgroundColor?: string;
  border?: string;
  zIndex?: number;
}

/** Union of all layout types */
export type Layout =
  | GridLayout
  | ImageLayout
  | TrackLayout
  | ConnectionLayout
  | FreeformLayout;

// ============================================================================
// SHEET TYPES
// ============================================================================

/** A game sheet/board that players mark up */
export interface Sheet {
  id: string;
  name: string;
  layouts: Layout[]; // Can have multiple layouts on one sheet
  hotspots: Hotspot[]; // All interactive hotspots
  regions?: Region[]; // Optional grouping
  width?: number; // Overall sheet dimensions
  height?: number;
}

// ============================================================================
// DICE TYPES
// ============================================================================

/** Standard numeric die */
export interface StandardDie {
  id: string;
  type: 'standard';
  sides: 4 | 6 | 8 | 10 | 12 | 20;
  currentValue?: number;
  locked?: boolean;
}

/** Face of a custom die */
export interface DieFace {
  value: string | number;
  displayType: 'number' | 'text' | 'symbol' | 'color';
  color?: string;
  symbol?: string;
  weight?: number; // Probability weight (default: 1)
}

/** Custom die with defined faces */
export interface CustomDie {
  id: string;
  type: 'custom';
  faces: DieFace[];
  currentFaceIndex?: number;
  locked?: boolean;
}

/** Union of die types */
export type Die = StandardDie | CustomDie;

/** Collection of dice */
export interface DicePool {
  id: string;
  name: string;
  dice: Die[];
  visible?: boolean;
}

/** Result of a dice roll */
export interface DiceRollResult {
  dieId: string;
  value: number | string;
  timestamp: number;
}

/** History of dice rolls */
export interface DiceRollHistory {
  rolls: DiceRollResult[][];
  maxHistory?: number;
}

// ============================================================================
// CARD & DECK TYPES
// ============================================================================

/** Field on a card */
export interface CardField {
  name: string;
  type: 'number' | 'text' | 'symbol' | 'color' | 'image';
  value: string | number;
}

/** A single card */
export interface Card {
  id: string;
  fields: CardField[];
}

/** Deck of cards */
export interface Deck {
  id: string;
  name: string;
  drawPile: Card[];
  discardPile: Card[];
  currentCard?: Card;
  faceDown?: boolean;
}

// ============================================================================
// TOOL & INTERACTION TYPES
// ============================================================================

/** Currently selected marking tool */
export interface Tool {
  type: MarkType;
  value?: string | number | undefined; // For number, color, symbol tools
  isPencilMode?: boolean;
}

// ============================================================================
// GAME STATE TYPES
// ============================================================================

/** Action in undo/redo history */
export interface Action {
  id: string;
  type: 'place-mark' | 'remove-mark' | 'modify-mark' | 'roll-dice' | 'draw-card' | 'discard-card';
  timestamp: number;
  data: unknown; // Action-specific data
  sheetId?: string;
}

/** Complete game state */
export interface GameState {
  gameId: string;
  gameName: string;
  sheets: Sheet[];
  marks: Record<string, Mark[]>; // sheetId -> marks
  dicePool: DicePool[];
  decks: Deck[];
  currentSheetId: string;
  currentTool: Tool;
  history: Action[];
  historyIndex: number;
  colorPalette?: string[]; // Available colors
  symbolPalette?: string[]; // Available symbols
  timestamp: number; // Last updated
}

/** Game configuration/definition */
export interface GameDefinition {
  id: string;
  name: string;
  description?: string;
  sheets: Sheet[];
  dicePool?: DicePool[];
  decks?: Deck[];
  colorPalette?: string[];
  symbolPalette?: string[];
  defaultTool?: MarkType;
}

// ============================================================================
// SAVE/LOAD TYPES
// ============================================================================

/** Serializable save state */
export interface SaveState {
  version: string;
  gameDefinition: GameDefinition;
  gameState: GameState;
  timestamp: number;
}
