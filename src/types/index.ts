/**
 * Core type definitions for the Roll-and-Write Game Engine
 */

// ============================================================================
// MARK TYPES
// ============================================================================

/**
 * All possible mark types that can be placed on hotspots
 */
export type MarkType =
  | 'checkbox'     // Empty/Checked/Crossed states
  | 'number'       // Numeric values
  | 'color'        // Color fill
  | 'circle'       // Empty/Half/Full circle
  | 'symbol'       // Icons/symbols
  | 'text'         // Freeform text
  | 'line';        // Connection lines

/**
 * Checkbox states: empty, checked, or crossed
 */
export type CheckboxState = 'empty' | 'checked' | 'crossed';

/**
 * Circle fill states: empty, half-filled, or full
 */
export type CircleState = 'empty' | 'half' | 'full';

/**
 * Mark permanence: pencil (temporary/erasable) or pen (permanent)
 */
export type MarkPermanence = 'pencil' | 'pen';

/**
 * Base mark interface - all marks extend this
 */
export interface BaseMark {
  id: string;
  type: MarkType;
  hotspotId: string;
  permanence: MarkPermanence;
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
 * Color fill mark
 */
export interface ColorMark extends BaseMark {
  type: 'color';
  color: string; // Hex color code
  opacity?: number; // 0-1, defaults to 0.6
}

/**
 * Circle mark
 */
export interface CircleMark extends BaseMark {
  type: 'circle';
  state: CircleState;
}

/**
 * Symbol/icon mark
 */
export interface SymbolMark extends BaseMark {
  type: 'symbol';
  symbolId: string; // References a symbol from the symbol palette
}

/**
 * Text mark
 */
export interface TextMark extends BaseMark {
  type: 'text';
  text: string;
}

/**
 * Line/connection mark
 */
export interface LineMark extends BaseMark {
  type: 'line';
  fromHotspotId: string;
  toHotspotId: string;
  style?: 'solid' | 'dashed' | 'dotted';
  color?: string;
  thickness?: number;
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
// HOTSPOT TYPES
// ============================================================================

/**
 * Shape types for hotspots
 */
export type HotspotShape = 'rectangle' | 'circle' | 'polygon';

/**
 * Position and dimensions
 */
export interface Position {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

/**
 * Rectangle hotspot definition
 */
export interface RectangleHotspot {
  shape: 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Circle hotspot definition
 */
export interface CircleHotspot {
  shape: 'circle';
  centerX: number;
  centerY: number;
  radius: number;
}

/**
 * Polygon hotspot definition
 */
export interface PolygonHotspot {
  shape: 'polygon';
  points: Position[]; // Array of vertices
}

/**
 * Base hotspot configuration
 */
export interface Hotspot {
  id: string;
  geometry: RectangleHotspot | CircleHotspot | PolygonHotspot;
  allowedMarkTypes: MarkType[];
  maxMarks?: number; // Maximum marks allowed (default: unlimited)
  readonly?: boolean; // If true, cannot be modified
  defaultValue?: Partial<Mark>; // Starting value
  metadata?: Record<string, unknown>; // Custom game-specific data
}

// ============================================================================
// REGION/LAYOUT TYPES
// ============================================================================

/**
 * Grid configuration for structured layouts
 */
export interface GridRegion {
  type: 'grid';
  id: string;
  rows: number;
  columns: number;
  cellWidth: number;
  cellHeight: number;
  gap?: number; // Spacing between cells
  offsetX?: number; // Starting X position
  offsetY?: number; // Starting Y position
  allowedMarkTypes: MarkType[];
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

/**
 * Freeform region with custom hotspots
 */
export interface FreeformRegion {
  type: 'freeform';
  id: string;
  hotspots: Hotspot[];
  backgroundImage?: string; // URL or data URI
  width?: number;
  height?: number;
}

/**
 * Resource track (linear or curved path)
 */
export interface ResourceTrack {
  type: 'track';
  id: string;
  spaces: Hotspot[];
  path?: Position[]; // Custom path for curved tracks
  direction?: 'horizontal' | 'vertical' | 'custom';
  allowBackward?: boolean;
  showPositionIndicator?: boolean;
}

/**
 * Territory/area region
 */
export interface Territory {
  type: 'territory';
  id: string;
  boundary: PolygonHotspot;
  allowedMarkTypes: MarkType[];
  fillColor?: string;
  borderColor?: string;
  borderWidth?: number;
  value?: number; // Territory value/score
  metadata?: Record<string, unknown>;
}

/**
 * Connection grid for path-building games
 */
export interface ConnectionGrid {
  type: 'connection';
  id: string;
  nodes: Position[]; // Connection points
  allowedConnections?: Array<[number, number]>; // Valid node pairs (indices)
  lineStyles?: Record<string, { color: string; thickness: number; dash?: number[] }>;
}

/**
 * Union type of all region types
 */
export type Region =
  | GridRegion
  | FreeformRegion
  | ResourceTrack
  | Territory
  | ConnectionGrid;

// ============================================================================
// SHEET TYPES
// ============================================================================

/**
 * Complete sheet definition
 */
export interface Sheet {
  id: string;
  name: string;
  width: number;
  height: number;
  regions: Region[];
  backgroundImage?: string;
  backgroundColor?: string;
}

// ============================================================================
// DICE TYPES
// ============================================================================

/**
 * Standard numeric die types
 */
export type StandardDieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

/**
 * Die face can contain multiple elements
 */
export interface DieFace {
  number?: number;
  text?: string;
  symbol?: string;
  color?: string;
  weight?: number; // Probability weight (default: 1)
}

/**
 * Custom die definition
 */
export interface CustomDie {
  id: string;
  name: string;
  faces: DieFace[];
}

/**
 * Die configuration for a game
 */
export interface DieConfig {
  id: string;
  type: StandardDieType | 'custom';
  customDie?: CustomDie; // Required if type is 'custom'
  quantity: number;
}

/**
 * Result of a single die roll
 */
export interface DieResult {
  dieId: string;
  faceIndex: number;
  face: DieFace | number; // DieFace for custom, number for standard
  locked?: boolean;
}

/**
 * Dice pool - collection of dice that can be rolled together
 */
export interface DicePool {
  id: string;
  name: string;
  dice: DieConfig[];
  results: DieResult[];
}

// ============================================================================
// CARD TYPES
// ============================================================================

/**
 * Card field definition
 */
export interface CardField {
  name: string;
  type: 'number' | 'text' | 'symbol' | 'color' | 'image';
  value: string | number;
}

/**
 * Card definition
 */
export interface Card {
  id: string;
  fields: CardField[];
  metadata?: Record<string, unknown>;
}

/**
 * Deck configuration
 */
export interface Deck {
  id: string;
  name: string;
  cards: Card[];
  drawPile: string[]; // Card IDs in order
  discardPile: string[]; // Card IDs
  currentCard?: string; // Currently revealed card ID
  autoReshuffle?: boolean; // Reshuffle when empty
}

// ============================================================================
// GAME STATE TYPES
// ============================================================================

/**
 * Action for undo/redo system
 */
export interface GameAction {
  id: string;
  type: 'mark_place' | 'mark_remove' | 'mark_modify' | 'dice_roll' | 'card_draw' | 'card_discard';
  timestamp: number;
  data: unknown;
  sheetId?: string;
}

/**
 * Complete game configuration
 */
export interface GameConfig {
  id: string;
  name: string;
  description?: string;
  sheets: Sheet[];
  dicePools?: DicePool[];
  decks?: Deck[];
  colorPalette?: string[]; // Available colors for color marks
  symbolPalette?: Array<{ id: string; icon: string; label?: string }>; // Available symbols
}

/**
 * Runtime game state
 */
export interface GameState {
  config: GameConfig;
  currentSheetId: string;
  marks: Record<string, Mark[]>; // Marks by sheet ID
  dicePools: DicePool[];
  decks: Deck[];
  history: GameAction[];
  historyIndex: number; // Current position in history for undo/redo
  lastSaved?: number; // Timestamp of last save
}

/**
 * Tool selection state
 */
export interface ToolState {
  currentMarkType: MarkType;
  permanence: MarkPermanence;
  selectedColor?: string;
  selectedSymbol?: string;
  numberValue?: number;
}

// ============================================================================
// UI TYPES
// ============================================================================

/**
 * View mode for sheets
 */
export type ViewMode = 'normal' | 'debug'; // Debug shows hotspot boundaries

/**
 * Zoom level
 */
export interface ZoomState {
  level: number; // 0.5 to 2.0
  offsetX: number;
  offsetY: number;
}

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * Type guard to check if a mark is of a specific type
 */
export function isMarkType<T extends Mark>(mark: Mark, type: MarkType): mark is T {
  return mark.type === type;
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
