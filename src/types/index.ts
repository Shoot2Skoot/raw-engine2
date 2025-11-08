/**
 * Core type definitions for the Roll-and-Write Game Engine
 */

// ============================================================================
// Mark Types
// ============================================================================

/**
 * Available mark types that can be placed on hotspots
 */
export type MarkType =
  | 'checkbox'  // Empty/checked/crossed states
  | 'number'    // Numeric value entry
  | 'color'     // Color fill
  | 'circle'    // Empty/half/full circle
  | 'symbol'    // Icon/symbol from palette
  | 'text'      // Freeform text entry
  | 'line';     // Line connection between points

/**
 * Checkbox states
 */
export type CheckboxState = 'empty' | 'checked' | 'crossed';

/**
 * Circle fill states
 */
export type CircleState = 'empty' | 'half' | 'full';

/**
 * Mark style (temporary vs permanent)
 */
export type MarkStyle = 'pencil' | 'pen';

/**
 * Base mark interface
 */
export interface BaseMark {
  id: string;
  type: MarkType;
  hotspotId: string;
  style: MarkStyle;
  timestamp: number;
}

/**
 * Checkbox mark
 */
export interface CheckboxMark extends BaseMark {
  type: 'checkbox';
  state: CheckboxState;
}

/**
 * Number mark
 */
export interface NumberMark extends BaseMark {
  type: 'number';
  value: number;
}

/**
 * Color mark
 */
export interface ColorMark extends BaseMark {
  type: 'color';
  color: string; // Hex color code
  opacity?: number; // 0-1, default 0.5
}

/**
 * Circle mark
 */
export interface CircleMark extends BaseMark {
  type: 'circle';
  state: CircleState;
}

/**
 * Symbol mark
 */
export interface SymbolMark extends BaseMark {
  type: 'symbol';
  symbolId: string; // References symbol from palette
  color?: string;
}

/**
 * Text mark
 */
export interface TextMark extends BaseMark {
  type: 'text';
  text: string;
}

/**
 * Line mark (connection between two hotspots)
 */
export interface LineMark extends BaseMark {
  type: 'line';
  fromHotspotId: string;
  toHotspotId: string;
  lineStyle: LineStyle;
}

export interface LineStyle {
  color: string;
  width: number; // pixels
  dashPattern?: number[]; // For dashed lines
}

/**
 * Union type of all mark types
 */
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

/**
 * Hotspot shape types
 */
export type HotspotShape = 'rectangle' | 'circle' | 'polygon';

/**
 * Base hotspot configuration
 */
export interface BaseHotspot {
  id: string;
  shape: HotspotShape;
  allowedMarkTypes: MarkType[];
  maxMarks?: number; // Max marks per hotspot, default 1
  readOnly?: boolean; // Display only, not interactive
  disabled?: boolean; // Temporarily disabled
}

/**
 * Rectangular hotspot
 */
export interface RectHotspot extends BaseHotspot {
  shape: 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Circular hotspot
 */
export interface CircleHotspot extends BaseHotspot {
  shape: 'circle';
  cx: number; // Center x
  cy: number; // Center y
  r: number;  // Radius
}

/**
 * Polygonal hotspot
 */
export interface PolygonHotspot extends BaseHotspot {
  shape: 'polygon';
  points: Array<{ x: number; y: number }>;
}

/**
 * Union type of all hotspot types
 */
export type Hotspot = RectHotspot | CircleHotspot | PolygonHotspot;

// ============================================================================
// Layout Types
// ============================================================================

/**
 * Layout types for sheets
 */
export type LayoutType = 'grid' | 'image-overlay' | 'freeform' | 'mixed';

/**
 * Grid layout configuration
 */
export interface GridLayout {
  type: 'grid';
  rows: number;
  columns: number;
  cellWidth?: number;  // Auto if not specified
  cellHeight?: number; // Auto if not specified
  gap?: number;        // Spacing between cells
  offsetX?: number;    // Starting x position
  offsetY?: number;    // Starting y position
  backgroundColor?: string;
  allowedMarkTypes: MarkType[]; // Default for all cells
}

/**
 * Image overlay layout
 */
export interface ImageOverlayLayout {
  type: 'image-overlay';
  imageUrl: string;
  width: number;
  height: number;
  maintainAspectRatio?: boolean;
  hotspots: Hotspot[];
}

/**
 * Freeform layout (manually positioned hotspots)
 */
export interface FreeformLayout {
  type: 'freeform';
  width: number;
  height: number;
  hotspots: Hotspot[];
}

/**
 * Mixed layout (combines multiple layout types)
 */
export interface MixedLayout {
  type: 'mixed';
  width: number;
  height: number;
  regions: Array<GridLayout | ImageOverlayLayout | FreeformLayout>;
}

/**
 * Union type of all layout types
 */
export type Layout = GridLayout | ImageOverlayLayout | FreeformLayout | MixedLayout;

// ============================================================================
// Sheet Types
// ============================================================================

/**
 * Sheet configuration
 */
export interface Sheet {
  id: string;
  name: string;
  layout: Layout;
  backgroundColor?: string;
}

// ============================================================================
// Dice Types
// ============================================================================

/**
 * Standard die types
 */
export type StandardDieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

/**
 * Die face content
 */
export interface DieFace {
  value: number | string;
  color?: string;
  symbol?: string;
  display?: string; // Custom display text
}

/**
 * Base die configuration
 */
export interface BaseDie {
  id: string;
  type: 'standard' | 'custom';
}

/**
 * Standard numeric die
 */
export interface StandardDie extends BaseDie {
  type: 'standard';
  sides: 4 | 6 | 8 | 10 | 12 | 20;
}

/**
 * Custom die with arbitrary faces
 */
export interface CustomDie extends BaseDie {
  type: 'custom';
  faces: DieFace[];
}

/**
 * Die instance in a pool (tracks current value and state)
 */
export interface DieInstance {
  id: string;
  dieConfig: StandardDie | CustomDie;
  currentFace?: DieFace | number; // Current rolled value
  locked: boolean;
  modified: boolean; // Has been modified since roll
}

/**
 * Dice pool configuration
 */
export interface DicePool {
  id: string;
  name: string;
  dice: DieInstance[];
}

// ============================================================================
// Card Types
// ============================================================================

/**
 * Card field types
 */
export type CardFieldType = 'number' | 'text' | 'symbol' | 'color' | 'image';

/**
 * Card field definition
 */
export interface CardField {
  name: string;
  type: CardFieldType;
  value: number | string;
}

/**
 * Card definition
 */
export interface Card {
  id: string;
  fields: CardField[];
}

/**
 * Deck configuration
 */
export interface Deck {
  id: string;
  name: string;
  cards: Card[];
  drawPile: Card[];
  discardPile: Card[];
  currentCard?: Card;
}

// ============================================================================
// Game State Types
// ============================================================================

/**
 * Action types for undo/redo
 */
export type ActionType =
  | 'mark-placed'
  | 'mark-removed'
  | 'mark-modified'
  | 'dice-rolled'
  | 'die-locked'
  | 'die-modified'
  | 'card-drawn'
  | 'card-discarded'
  | 'deck-shuffled';

/**
 * Action for undo/redo history
 */
export interface Action {
  id: string;
  type: ActionType;
  timestamp: number;
  data: unknown; // Action-specific data
  sheetId?: string;
}

/**
 * Complete game state
 */
export interface GameState {
  gameId: string;
  gameName: string;
  sheets: Sheet[];
  currentSheetId: string;
  marks: Record<string, Mark[]>; // Keyed by sheet ID
  dicePools: DicePool[];
  decks: Deck[];
  history: Action[];
  historyIndex: number;
  lastSaved?: number;
}

// ============================================================================
// Tool Types
// ============================================================================

/**
 * Available tools for marking
 */
export interface Tool {
  type: MarkType;
  icon: string;
  label: string;
  shortcut?: string;
}

/**
 * Tool configuration
 */
export interface ToolConfig {
  selectedTool: MarkType;
  markStyle: MarkStyle;
  // Tool-specific settings
  numberRange?: { min: number; max: number };
  colorPalette?: string[];
  symbolPalette?: Array<{ id: string; icon: string; label: string }>;
}

// ============================================================================
// Game Configuration
// ============================================================================

/**
 * Complete game configuration
 */
export interface GameConfig {
  name: string;
  description?: string;
  sheets: Sheet[];
  dicePools?: DicePool[];
  decks?: Deck[];
  tools?: Tool[];
  colorPalette?: string[];
  symbolPalette?: Array<{ id: string; icon: string; label: string }>;
}
