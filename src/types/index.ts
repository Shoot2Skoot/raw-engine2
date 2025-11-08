/**
 * Roll & Write Game Engine - Core Type Definitions
 *
 * This file contains all TypeScript types and interfaces for the game engine.
 */

// ============================================================================
// MARK TYPES
// ============================================================================

/** State of a checkbox mark */
export type CheckboxState = 'empty' | 'checked' | 'crossed';

/** State of a circle mark */
export type CircleState = 'empty' | 'half' | 'full';

/** A color value (hex or named color) */
export type Color = string;

/** A symbol/icon identifier */
export type Symbol = string;

/** Base interface for all mark types */
export interface BaseMark {
  id: string;
  hotspotId: string;
  createdAt: number;
  isPermanent?: boolean; // false = pencil mark (temporary)
}

/** Checkbox mark */
export interface CheckboxMark extends BaseMark {
  type: 'checkbox';
  state: CheckboxState;
}

/** Number mark */
export interface NumberMark extends BaseMark {
  type: 'number';
  value: number;
}

/** Color fill mark */
export interface ColorMark extends BaseMark {
  type: 'color';
  color: Color;
  opacity?: number; // 0-1, default 0.5
}

/** Circle mark */
export interface CircleMark extends BaseMark {
  type: 'circle';
  state: CircleState;
}

/** Symbol/icon mark */
export interface SymbolMark extends BaseMark {
  type: 'symbol';
  symbol: Symbol;
  color?: Color;
}

/** Text mark */
export interface TextMark extends BaseMark {
  type: 'text';
  text: string;
}

/** Line/connection mark */
export interface LineMark extends BaseMark {
  type: 'line';
  from: string; // hotspot ID
  to: string; // hotspot ID
  style?: 'solid' | 'dashed' | 'railroad' | 'road';
  color?: Color;
  thickness?: number; // pixels
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

/** Mark type identifier */
export type MarkType = Mark['type'];

// ============================================================================
// HOTSPOT TYPES
// ============================================================================

/** Position in 2D space */
export interface Position {
  x: number;
  y: number;
}

/** Size dimensions */
export interface Size {
  width: number;
  height: number;
}

/** Rectangular area definition */
export interface Rectangle extends Position, Size {}

/** Circular area definition */
export interface Circle {
  center: Position;
  radius: number;
}

/** Polygonal area definition */
export interface Polygon {
  vertices: Position[];
}

/** Base hotspot configuration */
export interface BaseHotspot {
  id: string;
  sheetId: string;
  allowedMarkTypes: MarkType[];
  maxMarks?: number; // undefined = unlimited
  isDisabled?: boolean;
  metadata?: Record<string, unknown>; // for custom game logic
}

/** Rectangular hotspot */
export interface RectangularHotspot extends BaseHotspot {
  shape: 'rectangle';
  bounds: Rectangle;
}

/** Circular hotspot */
export interface CircularHotspot extends BaseHotspot {
  shape: 'circle';
  bounds: Circle;
}

/** Polygonal hotspot */
export interface PolygonalHotspot extends BaseHotspot {
  shape: 'polygon';
  bounds: Polygon;
}

/** Union type of all hotspot shapes */
export type Hotspot = RectangularHotspot | CircularHotspot | PolygonalHotspot;

// ============================================================================
// SHEET/LAYOUT TYPES
// ============================================================================

/** Grid cell configuration */
export interface GridCell {
  row: number;
  col: number;
  allowedMarkTypes?: MarkType[]; // overrides grid defaults
  isDisabled?: boolean;
  label?: string;
  metadata?: Record<string, unknown>;
}

/** Grid layout configuration */
export interface GridLayout {
  type: 'grid';
  rows: number;
  cols: number;
  cellSize?: Size; // auto-calculated if not specified
  gap?: number; // pixels between cells
  offset?: Position; // starting position
  backgroundColor?: Color;
  defaultAllowedMarkTypes: MarkType[];
  cells?: GridCell[]; // for customizing specific cells
}

/** Image-based layout with custom hotspots */
export interface ImageLayout {
  type: 'image';
  imageUrl: string;
  aspectRatio?: number; // width/height, for scaling
  hotspots: Hotspot[];
}

/** Resource track layout */
export interface ResourceTrack {
  id: string;
  type: 'linear' | 'curved';
  spaces: number;
  path?: Position[]; // for curved tracks
  orientation?: 'horizontal' | 'vertical'; // for linear tracks
  allowedMarkTypes: MarkType[];
  labels?: string[]; // one per space
  metadata?: Record<string, unknown>;
}

/** Territory/region definition */
export interface Territory {
  id: string;
  shape: Polygon;
  allowedMarkTypes: MarkType[];
  value?: number;
  label?: string;
  metadata?: Record<string, unknown>;
}

/** Freeform layout with custom regions */
export interface FreeformLayout {
  type: 'freeform';
  width: number;
  height: number;
  backgroundImage?: string;
  hotspots?: Hotspot[];
  tracks?: ResourceTrack[];
  territories?: Territory[];
}

/** Mixed layout combining multiple layout types */
export interface MixedLayout {
  type: 'mixed';
  width: number;
  height: number;
  backgroundImage?: string;
  grids?: (GridLayout & { position: Position })[];
  hotspots?: Hotspot[];
  tracks?: ResourceTrack[];
  territories?: Territory[];
}

/** Union type of all layout types */
export type Layout = GridLayout | ImageLayout | FreeformLayout | MixedLayout;

/** Sheet definition */
export interface Sheet {
  id: string;
  name: string;
  layout: Layout;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// DICE TYPES
// ============================================================================

/** Standard die types */
export type StandardDieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

/** Die face content */
export interface DieFace {
  value: number | string;
  symbol?: Symbol;
  color?: Color;
  weight?: number; // for uneven probability distributions, default 1
}

/** Standard numeric die */
export interface StandardDie {
  type: 'standard';
  dieType: StandardDieType;
  id: string;
  currentValue?: number;
  isLocked?: boolean;
}

/** Custom die with configurable faces */
export interface CustomDie {
  type: 'custom';
  id: string;
  faces: DieFace[];
  currentFace?: DieFace;
  isLocked?: boolean;
  label?: string;
}

/** Union type of all die types */
export type Die = StandardDie | CustomDie;

/** Dice pool */
export interface DicePool {
  id: string;
  label: string;
  dice: Die[];
  rollHistory?: DieRoll[];
}

/** Single die roll result */
export interface DieRollResult {
  dieId: string;
  value: number | string;
  face?: DieFace; // for custom dice
  timestamp: number;
}

/** Complete roll action */
export interface DieRoll {
  poolId: string;
  results: DieRollResult[];
  timestamp: number;
}

// ============================================================================
// CARD TYPES
// ============================================================================

/** Card field value types */
export type CardFieldValue = number | string | Symbol | Color;

/** Card field definition */
export interface CardField {
  name: string;
  value: CardFieldValue;
}

/** Card definition */
export interface Card {
  id: string;
  fields: CardField[];
  metadata?: Record<string, unknown>;
}

/** Deck configuration */
export interface DeckConfig {
  id: string;
  label: string;
  cards: Card[];
  metadata?: Record<string, unknown>;
}

/** Deck state during game */
export interface DeckState {
  id: string;
  label: string;
  drawPile: Card[];
  discardPile: Card[];
  currentCard?: Card;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// GAME STATE TYPES
// ============================================================================

/** Tool selection */
export interface Tool {
  type: MarkType;
  config?: Partial<Mark>; // pre-configured values (e.g., specific color)
}

/** Action types for undo/redo */
export type ActionType =
  | 'ADD_MARK'
  | 'REMOVE_MARK'
  | 'MODIFY_MARK'
  | 'ROLL_DICE'
  | 'LOCK_DIE'
  | 'UNLOCK_DIE'
  | 'MODIFY_DIE'
  | 'DRAW_CARD'
  | 'DISCARD_CARD'
  | 'SHUFFLE_DECK'
  | 'SPLIT_DECK'
  | 'RESHUFFLE_DECK';

/** Base action interface */
export interface BaseAction {
  type: ActionType;
  timestamp: number;
}

/** Add mark action */
export interface AddMarkAction extends BaseAction {
  type: 'ADD_MARK';
  mark: Mark;
  sheetId: string;
}

/** Remove mark action */
export interface RemoveMarkAction extends BaseAction {
  type: 'REMOVE_MARK';
  markId: string;
  sheetId: string;
  previousMark: Mark; // for undo
}

/** Modify mark action */
export interface ModifyMarkAction extends BaseAction {
  type: 'MODIFY_MARK';
  markId: string;
  sheetId: string;
  previousMark: Mark;
  newMark: Mark;
}

/** Roll dice action */
export interface RollDiceAction extends BaseAction {
  type: 'ROLL_DICE';
  poolId: string;
  previousResults?: DieRollResult[];
  newResults: DieRollResult[];
}

/** Lock die action */
export interface LockDieAction extends BaseAction {
  type: 'LOCK_DIE';
  poolId: string;
  dieId: string;
}

/** Unlock die action */
export interface UnlockDieAction extends BaseAction {
  type: 'UNLOCK_DIE';
  poolId: string;
  dieId: string;
}

/** Modify die action */
export interface ModifyDieAction extends BaseAction {
  type: 'MODIFY_DIE';
  poolId: string;
  dieId: string;
  previousValue: number | DieFace;
  newValue: number | DieFace;
}

/** Draw card action */
export interface DrawCardAction extends BaseAction {
  type: 'DRAW_CARD';
  deckId: string;
  card: Card;
}

/** Discard card action */
export interface DiscardCardAction extends BaseAction {
  type: 'DISCARD_CARD';
  deckId: string;
  card: Card;
}

/** Shuffle deck action */
export interface ShuffleDeckAction extends BaseAction {
  type: 'SHUFFLE_DECK';
  deckId: string;
  previousOrder?: string[]; // card IDs for undo
}

/** Split deck action */
export interface SplitDeckAction extends BaseAction {
  type: 'SPLIT_DECK';
  deckId: string;
  numberOfPiles: number;
  newDeckIds: string[];
}

/** Reshuffle deck action */
export interface ReshuffleDeckAction extends BaseAction {
  type: 'RESHUFFLE_DECK';
  deckId: string;
}

/** Union type of all actions */
export type Action =
  | AddMarkAction
  | RemoveMarkAction
  | ModifyMarkAction
  | RollDiceAction
  | LockDieAction
  | UnlockDieAction
  | ModifyDieAction
  | DrawCardAction
  | DiscardCardAction
  | ShuffleDeckAction
  | SplitDeckAction
  | ReshuffleDeckAction;

/** Sheet state (marks on a sheet) */
export interface SheetState {
  sheetId: string;
  marks: Mark[];
}

/** Complete game state */
export interface GameState {
  id: string;
  name: string;
  sheets: Sheet[];
  sheetStates: SheetState[];
  dicePools: DicePool[];
  decks: DeckState[];
  currentSheetId: string;
  currentTool: Tool;
  history: Action[];
  historyIndex: number; // for undo/redo
  createdAt: number;
  updatedAt: number;
  metadata?: Record<string, unknown>;
}

/** Game definition (configuration for creating a new game) */
export interface GameDefinition {
  id: string;
  name: string;
  description?: string;
  sheets: Sheet[];
  dicePools?: Omit<DicePool, 'rollHistory'>[];
  decks?: DeckConfig[];
  defaultTool?: Tool;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/** Saved game data for export/import */
export interface SavedGame {
  version: string;
  state: GameState;
  exportedAt: number;
}

/** Color palette for tools */
export interface ColorPalette {
  colors: Color[];
  labels?: string[];
}

/** Symbol palette for tools */
export interface SymbolPalette {
  symbols: Symbol[];
  labels?: string[];
}
