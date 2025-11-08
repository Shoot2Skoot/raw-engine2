/**
 * Roll-and-Write Game Engine - Core Type Definitions
 *
 * These types define the complete structure for roll-and-write games
 * including sheets, marks, dice, cards, and game state.
 */

// ============================================================================
// MARK TYPES
// ============================================================================

/**
 * Types of marks that can be placed on hotspots
 */
export type MarkType =
  | 'checkbox'     // Empty/Checked/Crossed
  | 'number'       // Numeric value (0-999)
  | 'color'        // Color fill
  | 'circle'       // Empty/Half/Full circle
  | 'symbol'       // Icon/symbol from palette
  | 'text'         // Freeform text
  | 'line';        // Connection between points

/**
 * Checkbox states
 */
export type CheckboxState = 'empty' | 'checked' | 'crossed';

/**
 * Circle fill states
 */
export type CircleState = 'empty' | 'half' | 'full';

/**
 * Line style for connections
 */
export interface LineStyle {
  color: string;
  width: number;
  dashPattern?: number[]; // For dashed lines [dash, gap]
}

/**
 * Base mark interface - all marks extend this
 */
export interface BaseMark {
  id: string;
  hotspotId: string;
  type: MarkType;
  isPencil: boolean; // Temporary vs permanent
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
  color: string;
  opacity: number; // 0.1 to 0.9
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
  symbol: string; // Icon name or symbol ID
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
  style: LineStyle;
}

/**
 * Union type for all mark types
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
// HOTSPOT AND REGION TYPES
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
 * Hotspot constraints - what marks are allowed
 */
export interface HotspotConstraints {
  allowedMarkTypes: MarkType[];
  maxMarks: number; // How many marks can be placed (1 = only one, -1 = unlimited)
  numberRange?: { min: number; max: number }; // For number marks
  requireSequence?: boolean; // Marks must follow order
  canUnmark?: boolean; // Can marks be removed after placing
  readonly?: boolean; // Display only, no interaction
}

/**
 * Base hotspot - interactive region on sheet
 */
export interface BaseHotspot {
  id: string;
  shape: HotspotShape;
  position: Position;
  constraints: HotspotConstraints;
  defaultValue?: Mark; // Starting mark (if any)
}

/**
 * Rectangular hotspot
 */
export interface RectangleHotspot extends BaseHotspot {
  shape: 'rectangle';
  dimensions: Dimensions;
}

/**
 * Circular hotspot
 */
export interface CircleHotspot extends BaseHotspot {
  shape: 'circle';
  radius: number;
}

/**
 * Polygonal hotspot (3-50 vertices)
 */
export interface PolygonHotspot extends BaseHotspot {
  shape: 'polygon';
  vertices: Position[]; // Array of points defining the polygon
}

/**
 * Union type for all hotspot shapes
 */
export type Hotspot = RectangleHotspot | CircleHotspot | PolygonHotspot;

/**
 * Region - collection of hotspots with shared properties
 */
export interface Region {
  id: string;
  name: string;
  hotspots: Hotspot[];
  backgroundColor?: string;
  border?: {
    color: string;
    width: number;
  };
  zIndex: number; // For layering
}

// ============================================================================
// SHEET LAYOUT TYPES
// ============================================================================

/**
 * Layout types for sheets
 */
export type LayoutType = 'grid' | 'image' | 'mixed';

/**
 * Grid configuration for auto-generating hotspots
 */
export interface GridConfig {
  rows: number; // 1-50
  columns: number; // 1-50
  cellSize?: number; // px, or auto-calculate
  gap: number; // spacing between cells (0-20px)
  startPosition: Position;
  constraints: HotspotConstraints; // Applied to all cells
}

/**
 * Image background configuration
 */
export interface ImageBackground {
  src: string; // Image URL
  aspectRatio: number; // width/height
  fitMode: 'contain' | 'cover' | 'stretch';
}

/**
 * Grid layout - uniform grid of cells
 */
export interface GridLayout {
  type: 'grid';
  grid: GridConfig;
}

/**
 * Image layout - custom hotspots over artwork
 */
export interface ImageLayout {
  type: 'image';
  background: ImageBackground;
  regions: Region[];
}

/**
 * Mixed layout - multiple grids and regions combined
 */
export interface MixedLayout {
  type: 'mixed';
  background?: ImageBackground;
  grids: (GridConfig & { id: string })[];
  regions: Region[];
}

/**
 * Union type for all layout types
 */
export type SheetLayout = GridLayout | ImageLayout | MixedLayout;

/**
 * Sheet definition - a single game board/scorecard
 */
export interface Sheet {
  id: string;
  name: string;
  layout: SheetLayout;
  dimensions: Dimensions; // Overall sheet size
}

// ============================================================================
// DICE TYPES
// ============================================================================

/**
 * Types of content that can appear on die faces
 */
export type DieFaceContent =
  | { type: 'number'; value: number }
  | { type: 'symbol'; symbol: string; color?: string }
  | { type: 'text'; text: string }
  | { type: 'color'; color: string }
  | { type: 'combined'; items: DieFaceContent[] }; // Multiple elements on one face

/**
 * Die face definition
 */
export interface DieFace {
  content: DieFaceContent;
  weight?: number; // For weighted probabilities (default 1)
}

/**
 * Die definition
 */
export interface DieDefinition {
  id: string;
  name: string;
  faces: DieFace[];
}

/**
 * Standard die types (d4, d6, d8, d10, d12, d20)
 */
export type StandardDieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

/**
 * Die instance (actual die that can be rolled)
 */
export interface DieInstance {
  id: string;
  definitionId: string; // References DieDefinition or standard type
  currentFace: number; // Index of current face showing
  isLocked: boolean;
  isModified: boolean; // Has been manually changed
}

/**
 * Dice pool - group of dice
 */
export interface DicePool {
  id: string;
  name: string;
  dice: DieInstance[];
}

/**
 * Dice roll history entry
 */
export interface DiceRollHistory {
  timestamp: number;
  poolId: string;
  results: { dieId: string; face: number }[];
}

// ============================================================================
// CARD TYPES
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
  value: number | string; // Actual value
  display?: {
    fontSize?: number;
    color?: string;
    position?: Position;
  };
}

/**
 * Card definition
 */
export interface Card {
  id: string;
  fields: CardField[];
}

/**
 * Deck definition
 */
export interface DeckDefinition {
  id: string;
  name: string;
  cards: Card[];
}

/**
 * Deck instance (actual deck that can be used)
 */
export interface DeckInstance {
  id: string;
  definitionId: string;
  drawPile: string[]; // Card IDs
  discardPile: string[]; // Card IDs
  currentCard: string | null; // Currently revealed card ID
}

// ============================================================================
// GAME STATE AND ACTIONS
// ============================================================================

/**
 * Action types for undo/redo
 */
export type ActionType =
  | 'PLACE_MARK'
  | 'REMOVE_MARK'
  | 'ROLL_DICE'
  | 'LOCK_DIE'
  | 'MODIFY_DIE'
  | 'DRAW_CARD'
  | 'DISCARD_CARD'
  | 'SHUFFLE_DECK'
  | 'SPLIT_DECK';

/**
 * Base action interface
 */
export interface BaseAction {
  id: string;
  type: ActionType;
  timestamp: number;
  sheetId?: string;
}

/**
 * Place mark action
 */
export interface PlaceMarkAction extends BaseAction {
  type: 'PLACE_MARK';
  mark: Mark;
  sheetId: string;
}

/**
 * Remove mark action
 */
export interface RemoveMarkAction extends BaseAction {
  type: 'REMOVE_MARK';
  markId: string;
  sheetId: string;
  previousMark: Mark; // For undo
}

/**
 * Roll dice action
 */
export interface RollDiceAction extends BaseAction {
  type: 'ROLL_DICE';
  poolId: string;
  results: { dieId: string; face: number }[];
}

/**
 * Union type for all actions
 */
export type Action = PlaceMarkAction | RemoveMarkAction | RollDiceAction;

/**
 * Sheet state - marks placed on a specific sheet
 */
export interface SheetState {
  sheetId: string;
  marks: Mark[];
}

/**
 * Complete game state
 */
export interface GameState {
  gameId: string;
  sheets: SheetState[];
  dicePools: DicePool[];
  decks: DeckInstance[];
  history: Action[]; // For undo
  historyIndex: number; // Current position in history
  currentSheetId: string; // Active sheet
  selectedTool: MarkType | null;
}

// ============================================================================
// GAME CONFIGURATION
// ============================================================================

/**
 * Tool palette configuration
 */
export interface ToolPalette {
  availableTools: MarkType[];
  numberRange?: { min: number; max: number };
  colorPalette?: string[]; // 6-12 colors
  symbolPalette?: string[]; // 6-12 symbols
}

/**
 * Complete game configuration
 */
export interface GameConfig {
  id: string;
  name: string;
  description: string;
  sheets: Sheet[];
  diceDefinitions?: DieDefinition[];
  standardDice?: { type: StandardDieType; count: number }[]; // e.g., 5d6 for Yahtzee
  deckDefinitions?: DeckDefinition[];
  toolPalette: ToolPalette;
  initialState?: Partial<GameState>;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Save file format
 */
export interface SaveFile {
  version: string; // Engine version
  config: GameConfig;
  state: GameState;
  savedAt: number; // timestamp
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
