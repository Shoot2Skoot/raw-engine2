/**
 * Core Type Definitions for Roll-and-Write Game Engine
 */

// ==================== Mark Types ====================

/**
 * Checkbox mark states: empty, checked, or crossed
 */
export type CheckboxState = 'empty' | 'checked' | 'crossed';

/**
 * Circle mark states: empty, half-filled, or full
 */
export type CircleState = 'empty' | 'half' | 'full';

/**
 * Mark permanence: pencil (temporary) or pen (permanent)
 */
export type MarkPermanence = 'pencil' | 'pen';

/**
 * All supported mark types in the engine
 */
export type MarkType =
  | 'checkbox'
  | 'number'
  | 'color'
  | 'circle'
  | 'symbol'
  | 'text'
  | 'line';

/**
 * Base interface for all marks
 */
export interface BaseMark {
  id: string;
  type: MarkType;
  hotspotId: string;
  permanence: MarkPermanence;
  timestamp: number;
}

/**
 * Checkbox mark with state
 */
export interface CheckboxMark extends BaseMark {
  type: 'checkbox';
  state: CheckboxState;
}

/**
 * Number mark with value
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
  color: string; // hex color code
  opacity: number; // 0-1
}

/**
 * Circle mark with fill state
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
  symbol: string; // symbol identifier
}

/**
 * Text mark
 */
export interface TextMark extends BaseMark {
  type: 'text';
  text: string;
}

/**
 * Line/connection mark between two points
 */
export interface LineMark extends BaseMark {
  type: 'line';
  fromHotspotId: string;
  toHotspotId: string;
  style: LineStyle;
}

export interface LineStyle {
  color: string;
  thickness: number;
  dashPattern?: number[];
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

// ==================== Hotspot Types ====================

/**
 * 2D point coordinates
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Rectangular hotspot area
 */
export interface RectHotspot {
  type: 'rect';
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Circular hotspot area
 */
export interface CircleHotspot {
  type: 'circle';
  center: Point;
  radius: number;
}

/**
 * Polygonal hotspot area (arbitrary shape)
 */
export interface PolygonHotspot {
  type: 'polygon';
  vertices: Point[];
}

/**
 * Union type of hotspot shapes
 */
export type HotspotShape = RectHotspot | CircleHotspot | PolygonHotspot;

/**
 * Constraints on what marks are allowed in a hotspot
 */
export interface HotspotConstraints {
  allowedMarkTypes: MarkType[];
  maxMarks?: number; // undefined = unlimited
  numberRange?: { min: number; max: number };
  allowedColors?: string[];
  allowedSymbols?: string[];
  canErase?: boolean;
  requiresSequence?: boolean; // marks must follow order
}

/**
 * Interactive region on a sheet where marks can be placed
 */
export interface Hotspot {
  id: string;
  sheetId: string;
  shape: HotspotShape;
  constraints: HotspotConstraints;
  defaultValue?: Mark;
  label?: string;
  regionId?: string; // optional group identifier
  zIndex?: number;
}

// ==================== Layout Types ====================

/**
 * Grid layout configuration
 */
export interface GridLayout {
  type: 'grid';
  rows: number;
  columns: number;
  cellWidth?: number; // auto-calculate if not provided
  cellHeight?: number;
  gap: number;
  offsetX: number;
  offsetY: number;
  backgroundColor?: string;
  generateHotspots: boolean; // auto-generate hotspot per cell
  defaultConstraints: HotspotConstraints;
}

/**
 * Image-based layout with custom hotspots
 */
export interface ImageLayout {
  type: 'image';
  imageUrl: string;
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  hotspots: Hotspot[]; // manually defined hotspots
}

/**
 * Freeform layout with arbitrary positioned regions
 */
export interface FreeformLayout {
  type: 'freeform';
  width: number;
  height: number;
  backgroundColor?: string;
  regions: Region[];
}

/**
 * Resource track layout (linear or curved path)
 */
export interface TrackLayout {
  type: 'track';
  path: Point[]; // sequence of points forming the track
  spaces: number;
  direction: 'forward' | 'bidirectional';
  allowMultiplePerSpace: boolean;
  spaceProperties?: Record<number, { label?: string; bonus?: string }>;
}

/**
 * Union type of all layout types
 */
export type Layout = GridLayout | ImageLayout | FreeformLayout | TrackLayout;

/**
 * A region groups multiple hotspots with shared properties
 */
export interface Region {
  id: string;
  label?: string;
  hotspots: Hotspot[];
  borderColor?: string;
  borderWidth?: number;
  backgroundColor?: string;
}

// ==================== Sheet Types ====================

/**
 * A sheet is a game board or scorecard that players mark up
 */
export interface Sheet {
  id: string;
  name: string;
  layout: Layout;
  hotspots: Hotspot[];
  regions?: Region[];
  width?: number;
  height?: number;
}

// ==================== Dice Types ====================

/**
 * Standard polyhedral dice types
 */
export type StandardDiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

/**
 * Face of a custom die
 */
export interface DieFace {
  display: string | number; // what shows on the face
  weight?: number; // probability weight (optional, for weighted dice)
  color?: string;
  symbol?: string;
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
 * Die configuration (standard or custom)
 */
export type DieConfig =
  | { type: 'standard'; dieType: StandardDiceType }
  | { type: 'custom'; customDie: CustomDie };

/**
 * Result of rolling a single die
 */
export interface DieResult {
  dieId: string;
  config: DieConfig;
  result: DieFace | number; // number for standard, DieFace for custom
  locked: boolean;
  modified: boolean; // has been modified from original roll
}

/**
 * A pool of dice that can be rolled together
 */
export interface DicePool {
  id: string;
  label: string;
  dice: DieConfig[];
  results: DieResult[];
}

/**
 * History entry for a dice roll
 */
export interface DiceRollHistory {
  timestamp: number;
  poolId: string;
  results: DieResult[];
}

// ==================== Card Types ====================

/**
 * Field on a card
 */
export interface CardField {
  name: string;
  type: 'number' | 'text' | 'symbol' | 'color' | 'image';
  value: string | number;
  displayProperties?: {
    fontSize?: number;
    color?: string;
    position?: Point;
  };
}

/**
 * A card with multiple fields of information
 */
export interface Card {
  id: string;
  fields: CardField[];
  imageUrl?: string; // optional card artwork
}

/**
 * A deck of cards
 */
export interface Deck {
  id: string;
  label: string;
  cards: Card[];
  drawPile: Card[];
  discardPile: Card[];
  currentCard?: Card;
  faceDown: boolean;
}

// ==================== Tool Types ====================

/**
 * Configuration for a tool
 */
export interface ToolConfig {
  type: MarkType;
  label: string;
  icon: string; // icon identifier from Lucide
  defaultPermanence: MarkPermanence;
  // Type-specific configs
  colorPalette?: string[];
  symbolPalette?: string[];
  numberRange?: { min: number; max: number };
}

/**
 * Currently active tool state
 */
export interface ActiveTool {
  config: ToolConfig;
  // Selected values for current tool
  selectedColor?: string;
  selectedSymbol?: string;
  permanence: MarkPermanence;
}

// ==================== Game State Types ====================

/**
 * Action for undo/redo system
 */
export interface GameAction {
  id: string;
  type: 'addMark' | 'removeMark' | 'modifyMark' | 'rollDice' | 'drawCard' | 'shuffleDeck';
  timestamp: number;
  data: any; // action-specific data
  inverse?: GameAction; // inverse action for undo
}

/**
 * Complete game state
 */
export interface GameState {
  id: string;
  name: string;
  sheets: Sheet[];
  marks: Mark[];
  dicePools: DicePool[];
  decks: Deck[];
  currentSheetId: string;
  activeTool: ActiveTool;
  history: GameAction[];
  historyIndex: number; // current position in history
  diceRollHistory: DiceRollHistory[];
  createdAt: number;
  lastModified: number;
}

/**
 * Game configuration for developers
 */
export interface GameConfig {
  name: string;
  description?: string;
  sheets: SheetConfig[];
  tools: ToolConfig[];
  dicePools?: DicePoolConfig[];
  decks?: DeckConfig[];
}

/**
 * Configuration for creating a sheet
 */
export interface SheetConfig {
  id: string;
  name: string;
  layout: Layout;
  regions?: Region[];
}

/**
 * Configuration for creating a dice pool
 */
export interface DicePoolConfig {
  id: string;
  label: string;
  dice: DieConfig[];
}

/**
 * Configuration for creating a deck
 */
export interface DeckConfig {
  id: string;
  label: string;
  cards: Card[];
  faceDown: boolean;
}

// ==================== Event Types ====================

/**
 * Events that can be emitted by the game engine
 */
export type GameEvent =
  | { type: 'markAdded'; mark: Mark }
  | { type: 'markRemoved'; markId: string }
  | { type: 'markModified'; mark: Mark }
  | { type: 'diceRolled'; poolId: string; results: DieResult[] }
  | { type: 'cardDrawn'; deckId: string; card: Card }
  | { type: 'deckShuffled'; deckId: string }
  | { type: 'sheetChanged'; sheetId: string }
  | { type: 'toolChanged'; tool: ActiveTool }
  | { type: 'undo'; action: GameAction }
  | { type: 'redo'; action: GameAction };

/**
 * Event handler type
 */
export type GameEventHandler = (event: GameEvent) => void;

// ==================== Utility Types ====================

/**
 * Serializable game state for save/load
 */
export type SerializedGameState = Omit<GameState, 'createdAt' | 'lastModified'> & {
  createdAt: string;
  lastModified: string;
};
