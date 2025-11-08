/**
 * Core type definitions for the Roll-and-Write Game Engine
 *
 * This file contains all the fundamental types that define sheets, marks,
 * dice, cards, and game state management.
 */

// =============================================================================
// Mark Types
// =============================================================================

/**
 * Available mark types that can be placed on hotspots
 */
export type MarkType =
  | 'checkbox'   // Empty/checked/crossed states
  | 'number'     // Numeric values (0-999)
  | 'color'      // Color fills
  | 'circle'     // Empty/half/full circles
  | 'symbol'     // Icons and symbols
  | 'text'       // Freeform text
  | 'line';      // Lines between points

/**
 * Checkbox states
 */
export type CheckboxState = 'empty' | 'checked' | 'crossed';

/**
 * Circle fill states
 */
export type CircleState = 'empty' | 'half' | 'full';

/**
 * Mark permanence - pencil marks are temporary, pen marks are permanent
 */
export type MarkPermanence = 'pencil' | 'pen';

/**
 * Base mark interface - all marks extend this
 */
export interface BaseMark {
  id: string;
  type: MarkType;
  permanence: MarkPermanence;
  timestamp: number; // For undo/redo ordering
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
 * Symbol/icon mark
 */
export interface SymbolMark extends BaseMark {
  type: 'symbol';
  symbol: string; // Symbol identifier or emoji
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
 * Line mark (connects two points)
 */
export interface LineMark extends BaseMark {
  type: 'line';
  from: string; // Hotspot ID
  to: string;   // Hotspot ID
  style?: 'solid' | 'dashed' | 'dotted';
  color?: string;
  thickness?: number; // px
}

/**
 * Union type for all marks
 */
export type Mark =
  | CheckboxMark
  | NumberMark
  | ColorMark
  | CircleMark
  | SymbolMark
  | TextMark
  | LineMark;

// =============================================================================
// Hotspot Types (Interactive Regions)
// =============================================================================

/**
 * 2D coordinate
 */
export interface Coordinate {
  x: number;
  y: number;
}

/**
 * Rectangular area
 */
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Circular area
 */
export interface Circle {
  center: Coordinate;
  radius: number;
}

/**
 * Polygonal area (arbitrary shape)
 */
export interface Polygon {
  vertices: Coordinate[];
}

/**
 * Hotspot shape types
 */
export type HotspotShape = Rectangle | Circle | Polygon;

/**
 * Constraint on number of marks per hotspot
 */
export interface MarkConstraint {
  allowedTypes: MarkType[];        // Which mark types are allowed
  maxMarks?: number;               // Max marks (1, 2, 3, unlimited = undefined)
  allowUnmark?: boolean;           // Can marks be removed after placement
  requireSequence?: boolean;       // Must marks follow a specific order
  numberRange?: [number, number];  // For number marks, allowed range
  colorPalette?: string[];         // For color marks, allowed colors
  symbolSet?: string[];            // For symbol marks, allowed symbols
}

/**
 * Interactive hotspot on a sheet
 */
export interface Hotspot {
  id: string;
  shape: HotspotShape;
  constraints: MarkConstraint;
  defaultValue?: Mark;          // Starting value (optional)
  readOnly?: boolean;           // Display only, not interactive
  label?: string;               // Optional label
  metadata?: Record<string, unknown>; // Custom game-specific data
}

// =============================================================================
// Region Types
// =============================================================================

/**
 * Grid region configuration
 */
export interface GridRegion {
  type: 'grid';
  id: string;
  position: Coordinate;
  rows: number;
  columns: number;
  cellSize: number | 'auto';
  gap: number;                  // Spacing between cells
  constraints: MarkConstraint;  // Applied to all cells in grid
  backgroundColor?: string;
  label?: string;
}

/**
 * Track region (linear or curved path)
 */
export interface TrackRegion {
  type: 'track';
  id: string;
  spaces: number;
  path: Coordinate[];           // Path the track follows
  constraints: MarkConstraint;
  direction?: 'forward' | 'backward' | 'bidirectional';
  spaceProperties?: Array<{     // Properties for specific spaces
    index: number;
    label?: string;
    bonus?: string;
    metadata?: Record<string, unknown>;
  }>;
}

/**
 * Territory region (area control)
 */
export interface TerritoryRegion {
  type: 'territory';
  id: string;
  shape: Polygon;
  constraints: MarkConstraint;
  value?: number;
  territoryType?: string;
  label?: string;
  borderColor?: string;
  borderWidth?: number;
}

/**
 * Connection grid (for drawing paths)
 */
export interface ConnectionRegion {
  type: 'connection';
  id: string;
  points: Coordinate[];         // Connection points (nodes)
  allowedConnections?: Array<[number, number]>; // Pairs of point indices
  lineStyles?: string[];        // Available line styles
  preventCrossing?: boolean;    // Prevent lines from crossing
}

/**
 * Tech tree region
 */
export interface TechTreeNode {
  id: string;
  position: Coordinate;
  label: string;
  prerequisites?: string[];     // IDs of required nodes
  cost?: Record<string, number>;
  benefit?: string;
  constraints: MarkConstraint;
}

export interface TechTreeRegion {
  type: 'techTree';
  id: string;
  nodes: TechTreeNode[];
  layout?: 'vertical' | 'horizontal' | 'radial';
}

/**
 * Freeform region (image-based with custom hotspots)
 */
export interface FreeformRegion {
  type: 'freeform';
  id: string;
  backgroundImage?: string;     // URL or data URI
  hotspots: Hotspot[];
  width: number;
  height: number;
}

/**
 * Union type for all region types
 */
export type Region =
  | GridRegion
  | TrackRegion
  | TerritoryRegion
  | ConnectionRegion
  | TechTreeRegion
  | FreeformRegion;

// =============================================================================
// Sheet Types
// =============================================================================

/**
 * A game sheet (scorecard/board)
 */
export interface Sheet {
  id: string;
  name: string;
  width: number;               // Total sheet width in px
  height: number;              // Total sheet height in px
  regions: Region[];           // Regions on this sheet
  backgroundColor?: string;
  backgroundImage?: string;    // Optional background image
}

// =============================================================================
// Dice Types
// =============================================================================

/**
 * Standard dice types
 */
export type StandardDieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

/**
 * Die face - can be number, text, symbol, or combination
 */
export interface DieFace {
  display: string | number;    // What to show
  value?: number;              // Numeric value (optional)
  color?: string;              // Color indicator
  symbol?: string;             // Symbol/icon
  weight?: number;             // Probability weight (default 1)
}

/**
 * Custom die definition
 */
export interface CustomDie {
  id: string;
  name: string;
  faces: DieFace[];
  currentValue?: DieFace;      // Current rolled value
  locked?: boolean;            // Locked from rerolling
  modified?: boolean;          // Has been modified this turn
}

/**
 * Standard die instance
 */
export interface StandardDie {
  id: string;
  type: StandardDieType;
  currentValue?: number;
  locked?: boolean;
  modified?: boolean;
}

/**
 * Union type for dice
 */
export type Die = StandardDie | CustomDie;

/**
 * Dice pool (collection of dice)
 */
export interface DicePool {
  id: string;
  name: string;
  dice: Die[];
}

/**
 * Dice roll history entry
 */
export interface DiceRollHistory {
  timestamp: number;
  poolId: string;
  results: Array<{
    dieId: string;
    value: number | DieFace;
  }>;
}

// =============================================================================
// Card Types
// =============================================================================

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
  displayTemplate?: string;     // Optional: custom display template
}

/**
 * Deck state
 */
export interface Deck {
  id: string;
  name: string;
  cards: Card[];               // Draw pile
  discard: Card[];             // Discard pile
  currentCard?: Card;          // Currently revealed card
  faceDown?: boolean;          // Show discard pile face down
}

// =============================================================================
// Game State Types
// =============================================================================

/**
 * Current player state for a single sheet
 */
export interface SheetState {
  sheetId: string;
  marks: Map<string, Mark[]>;  // Hotspot ID -> marks on that hotspot
}

/**
 * Complete game state
 */
export interface GameState {
  gameId: string;
  sheets: Sheet[];
  currentSheetIndex: number;
  sheetStates: SheetState[];
  dicePools: DicePool[];
  diceHistory: DiceRollHistory[];
  decks: Deck[];
  selectedTool: MarkType;
  selectedColor?: string;
  selectedSymbol?: string;
  permanence: MarkPermanence;
  metadata?: Record<string, unknown>; // Custom game data
}

/**
 * Action types for state management
 */
export type Action =
  | { type: 'PLACE_MARK'; sheetId: string; hotspotId: string; mark: Mark }
  | { type: 'REMOVE_MARK'; sheetId: string; hotspotId: string; markId: string }
  | { type: 'CLEAR_HOTSPOT'; sheetId: string; hotspotId: string }
  | { type: 'SWITCH_SHEET'; sheetIndex: number }
  | { type: 'SELECT_TOOL'; tool: MarkType }
  | { type: 'SELECT_COLOR'; color: string }
  | { type: 'SELECT_SYMBOL'; symbol: string }
  | { type: 'SET_PERMANENCE'; permanence: MarkPermanence }
  | { type: 'ROLL_DICE'; poolId: string; diceIds?: string[] }
  | { type: 'LOCK_DIE'; poolId: string; dieId: string }
  | { type: 'UNLOCK_DIE'; poolId: string; dieId: string }
  | { type: 'MODIFY_DIE'; poolId: string; dieId: string; newValue: number | DieFace }
  | { type: 'SHUFFLE_DECK'; deckId: string }
  | { type: 'DRAW_CARD'; deckId: string; count?: number }
  | { type: 'DISCARD_CARD'; deckId: string; cardId: string }
  | { type: 'RESHUFFLE_DISCARD'; deckId: string }
  | { type: 'RESET_SHEET'; sheetId: string }
  | { type: 'RESET_GAME' }
  | { type: 'LOAD_STATE'; state: GameState }
  | { type: 'UNDO' }
  | { type: 'REDO' };

/**
 * History entry for undo/redo
 */
export interface HistoryEntry {
  state: GameState;
  action: Action;
  timestamp: number;
}

/**
 * State with undo/redo support
 */
export interface StateWithHistory {
  current: GameState;
  past: HistoryEntry[];
  future: HistoryEntry[];
}

// =============================================================================
// Game Configuration
// =============================================================================

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
  colorPalette?: string[];     // Available colors for the game
  symbolSet?: string[];        // Available symbols for the game
  defaultTool?: MarkType;
  metadata?: Record<string, unknown>;
}

// =============================================================================
// UI Configuration
// =============================================================================

/**
 * Tool palette configuration
 */
export interface ToolPaletteConfig {
  availableTools: MarkType[];
  colorPalette?: string[];
  symbolSet?: string[];
  showPermanenceToggle?: boolean;
}

/**
 * Keyboard shortcuts
 */
export interface KeyboardShortcuts {
  undo: string;                // Default: 'Ctrl+Z' or 'Cmd+Z'
  redo: string;                // Default: 'Ctrl+Shift+Z' or 'Cmd+Shift+Z'
  save: string;                // Default: 'Ctrl+S' or 'Cmd+S'
  tools: Record<MarkType, string>; // Shortcuts for each tool
  sheets: string[];            // Shortcuts for switching sheets (1-9)
}
