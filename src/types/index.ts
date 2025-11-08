/**
 * Core type definitions for the Roll-and-Write Game Engine
 */

// ============================================================================
// MARK TYPES
// ============================================================================

/** Base mark type that all marks extend from */
export interface BaseMark {
  id: string;
  hotspotId: string;
  type: MarkType;
  createdAt: number;
  isPencil?: boolean; // temporary vs permanent mark
}

/** All supported mark types */
export type MarkType =
  | 'checkbox'
  | 'number'
  | 'color'
  | 'circle'
  | 'symbol'
  | 'text'
  | 'line';

/** Checkbox mark with three states */
export interface CheckboxMark extends BaseMark {
  type: 'checkbox';
  state: 'empty' | 'checked' | 'crossed';
}

/** Number mark */
export interface NumberMark extends BaseMark {
  type: 'number';
  value: number;
}

/** Color fill mark */
export interface ColorMark extends BaseMark {
  type: 'color';
  color: string; // hex color
  opacity?: number; // 0-1
}

/** Circle mark with fill levels */
export interface CircleMark extends BaseMark {
  type: 'circle';
  fill: 'empty' | 'half' | 'full';
}

/** Symbol/icon mark */
export interface SymbolMark extends BaseMark {
  type: 'symbol';
  symbol: string; // icon name or unicode
  color?: string;
}

/** Text entry mark */
export interface TextMark extends BaseMark {
  type: 'text';
  text: string;
}

/** Line/connection mark */
export interface LineMark extends BaseMark {
  type: 'line';
  fromHotspotId: string;
  toHotspotId: string;
  style?: 'solid' | 'dashed' | 'dotted';
  color?: string;
  thickness?: number;
}

/** Union type of all mark types */
export type Mark =
  | CheckboxMark
  | NumberMark
  | ColorMark
  | CircleMark
  | SymbolMark
  | TextMark
  | LineMark;

// ============================================================================
// HOTSPOT TYPES
// ============================================================================

/** Base hotspot configuration */
export interface BaseHotspot {
  id: string;
  allowedMarkTypes: MarkType[];
  maxMarks?: number; // undefined = unlimited
  disabled?: boolean;
  readonly?: boolean;
}

/** Rectangular hotspot */
export interface RectHotspot extends BaseHotspot {
  shape: 'rect';
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Circular hotspot */
export interface CircleHotspot extends BaseHotspot {
  shape: 'circle';
  cx: number;
  cy: number;
  radius: number;
}

/** Polygon hotspot for irregular shapes */
export interface PolygonHotspot extends BaseHotspot {
  shape: 'polygon';
  points: Array<{ x: number; y: number }>;
}

/** Union type of all hotspot shapes */
export type Hotspot = RectHotspot | CircleHotspot | PolygonHotspot;

// ============================================================================
// LAYOUT TYPES
// ============================================================================

/** Grid layout configuration */
export interface GridLayout {
  type: 'grid';
  rows: number;
  columns: number;
  cellWidth?: number; // auto if not specified
  cellHeight?: number; // auto if not specified
  gap?: number; // spacing between cells
  offsetX?: number;
  offsetY?: number;
  backgroundColor?: string;
  defaultAllowedMarks: MarkType[];
  cellOverrides?: Record<string, Partial<BaseHotspot>>; // override specific cells
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

/** Freeform layout with manually positioned hotspots */
export interface FreeformLayout {
  type: 'freeform';
  width: number;
  height: number;
  hotspots: Hotspot[];
  backgroundColor?: string;
}

/** Mixed layout combining multiple regions */
export interface MixedLayout {
  type: 'mixed';
  width: number;
  height: number;
  regions: Array<{
    id: string;
    layout: GridLayout | ImageLayout | FreeformLayout;
    x: number;
    y: number;
    zIndex?: number;
  }>;
}

/** Union type of all layout types */
export type Layout = GridLayout | ImageLayout | FreeformLayout | MixedLayout;

// ============================================================================
// SHEET TYPES
// ============================================================================

/** Sheet configuration */
export interface Sheet {
  id: string;
  name: string;
  layout: Layout;
}

// ============================================================================
// DICE TYPES
// ============================================================================

/** Standard numeric die */
export interface NumericDie {
  id: string;
  type: 'numeric';
  sides: 4 | 6 | 8 | 10 | 12 | 20;
  currentValue?: number;
  locked?: boolean;
}

/** Custom die with arbitrary faces */
export interface CustomDie {
  id: string;
  type: 'custom';
  faces: DieFace[];
  currentFaceIndex?: number;
  locked?: boolean;
}

/** A face on a custom die */
export interface DieFace {
  value: number | string;
  symbol?: string;
  color?: string;
  weight?: number; // for weighted dice
}

/** Union type of all die types */
export type Die = NumericDie | CustomDie;

/** Dice pool containing multiple dice */
export interface DicePool {
  id: string;
  label: string;
  dice: Die[];
  visible?: boolean;
}

// ============================================================================
// CARD TYPES
// ============================================================================

/** Card field definition */
export interface CardField {
  name: string;
  value: number | string;
  symbol?: string;
  color?: string;
}

/** A single card */
export interface Card {
  id: string;
  fields: Record<string, CardField>;
}

/** Deck of cards */
export interface Deck {
  id: string;
  label: string;
  drawPile: Card[];
  discardPile: Card[];
  currentCard?: Card;
}

// ============================================================================
// GAME STATE TYPES
// ============================================================================

/** Complete game state */
export interface GameState {
  id: string;
  name: string;
  sheets: Sheet[];
  currentSheetId: string;
  marks: Mark[];
  dicePools: DicePool[];
  decks: Deck[];
  currentTool: MarkType;
  history: HistoryEntry[];
  historyIndex: number;
}

/** History entry for undo/redo */
export interface HistoryEntry {
  type: 'add-mark' | 'remove-mark' | 'modify-mark' | 'roll-dice' | 'draw-card';
  timestamp: number;
  data: unknown;
}

// ============================================================================
// GAME CONFIGURATION TYPES
// ============================================================================

/** Game configuration provided by developer */
export interface GameConfig {
  name: string;
  sheets: Sheet[];
  dicePools?: DicePool[];
  decks?: Deck[];
  defaultTool?: MarkType;
  colorPalette?: string[];
  symbolPalette?: string[];
}

// ============================================================================
// UI TYPES
// ============================================================================

/** Tool selection for marking */
export interface Tool {
  type: MarkType;
  icon: string;
  label: string;
  enabled: boolean;
}

/** Position for coordinates */
export interface Position {
  x: number;
  y: number;
}

/** Size dimensions */
export interface Size {
  width: number;
  height: number;
}

/** Bounding box */
export interface BoundingBox extends Position, Size {}
