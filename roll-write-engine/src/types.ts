/**
 * Core type definitions for the Roll-and-Write Game Engine
 */

// ============================================================================
// MARK TYPES
// ============================================================================

/** Types of marks that can be placed on hotspots */
export type MarkType =
  | 'checkbox'    // Empty → Checked → Crossed → Empty
  | 'number'      // Numeric entry (0-999)
  | 'color'       // Color fill
  | 'circle'      // Empty → Half → Full → Empty
  | 'symbol'      // Icon/symbol from palette
  | 'text'        // Freeform text entry
  | 'line';       // Connection between points

/** State of a checkbox mark */
export type CheckboxState = 'empty' | 'checked' | 'crossed';

/** State of a circle mark */
export type CircleState = 'empty' | 'half' | 'full';

/** Base mark interface */
export interface Mark {
  type: MarkType;
  isPermanent: boolean; // Pencil vs Pen mode
}

/** Checkbox mark */
export interface CheckboxMark extends Mark {
  type: 'checkbox';
  state: CheckboxState;
}

/** Number mark */
export interface NumberMark extends Mark {
  type: 'number';
  value: number;
}

/** Color fill mark */
export interface ColorMark extends Mark {
  type: 'color';
  color: string; // Hex color code
}

/** Circle mark */
export interface CircleMark extends Mark {
  type: 'circle';
  state: CircleState;
}

/** Symbol mark */
export interface SymbolMark extends Mark {
  type: 'symbol';
  symbolId: string; // Reference to symbol in palette
}

/** Text mark */
export interface TextMark extends Mark {
  type: 'text';
  text: string;
}

/** Line mark (connection between two hotspots) */
export interface LineMark extends Mark {
  type: 'line';
  fromHotspotId: string;
  toHotspotId: string;
  style?: 'solid' | 'dashed' | 'dotted';
  color?: string;
}

/** Union of all mark types */
export type AnyMark =
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

/** Shape types for hotspots */
export type HotspotShape = 'rectangle' | 'circle' | 'polygon';

/** Hotspot constraint configuration */
export interface HotspotConstraints {
  allowedMarkTypes: MarkType[];        // Which mark types are allowed
  maxMarks?: number;                   // Maximum marks (default: 1)
  numberRange?: [number, number];      // For number marks: [min, max]
  allowedColors?: string[];            // For color marks: specific colors
  allowedSymbols?: string[];           // For symbol marks: specific symbols
  maxTextLength?: number;              // For text marks: character limit
  readOnly?: boolean;                  // Display only, not interactive
  canUnmark?: boolean;                 // Can marks be removed (default: true)
}

/** Rectangle hotspot */
export interface RectangleHotspot {
  id: string;
  shape: 'rectangle';
  x: number;                          // Position in pixels
  y: number;
  width: number;
  height: number;
  constraints: HotspotConstraints;
  marks: AnyMark[];                   // Marks placed on this hotspot
  enabled?: boolean;                  // Can be disabled dynamically
}

/** Circle hotspot */
export interface CircleHotspot {
  id: string;
  shape: 'circle';
  cx: number;                         // Center X
  cy: number;                         // Center Y
  radius: number;
  constraints: HotspotConstraints;
  marks: AnyMark[];
  enabled?: boolean;
}

/** Polygon hotspot */
export interface PolygonHotspot {
  id: string;
  shape: 'polygon';
  points: Array<{ x: number; y: number }>;
  constraints: HotspotConstraints;
  marks: AnyMark[];
  enabled?: boolean;
}

/** Union of all hotspot types */
export type Hotspot = RectangleHotspot | CircleHotspot | PolygonHotspot;

// ============================================================================
// REGION TYPES
// ============================================================================

/** Region groups related hotspots */
export interface Region {
  id: string;
  name?: string;
  hotspots: Hotspot[];
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  zIndex?: number;
}

// ============================================================================
// LAYOUT TYPES
// ============================================================================

/** Layout type for sheets */
export type LayoutType = 'grid' | 'image-overlay' | 'freeform' | 'mixed';

/** Grid layout configuration */
export interface GridLayout {
  type: 'grid';
  rows: number;
  columns: number;
  cellWidth?: number;                 // Auto-calculated if not specified
  cellHeight?: number;
  gap: number;                        // Gap between cells
  offsetX?: number;
  offsetY?: number;
  backgroundColor?: string;
  defaultConstraints: HotspotConstraints;
}

/** Image overlay layout configuration */
export interface ImageOverlayLayout {
  type: 'image-overlay';
  imageSrc: string;                   // URL or data URI
  imageWidth: number;
  imageHeight: number;
  maintainAspectRatio: boolean;
  hotspots: Hotspot[];
}

/** Freeform layout configuration */
export interface FreeformLayout {
  type: 'freeform';
  width: number;
  height: number;
  hotspots: Hotspot[];
}

/** Mixed layout (combines multiple layouts) */
export interface MixedLayout {
  type: 'mixed';
  width: number;
  height: number;
  regions: Region[];
}

/** Union of all layout types */
export type Layout = GridLayout | ImageOverlayLayout | FreeformLayout | MixedLayout;

// ============================================================================
// SHEET TYPES
// ============================================================================

/** Game sheet configuration */
export interface Sheet {
  id: string;
  name: string;
  layout: Layout;
}

// ============================================================================
// DICE TYPES
// ============================================================================

/** Standard die types */
export type StandardDieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

/** Custom die face */
export interface DieFace {
  value: number | string;             // Can be number, text, or symbol reference
  symbol?: string;                    // Symbol ID if applicable
  color?: string;                     // Color if applicable
  weight?: number;                    // Probability weight (default: 1)
}

/** Custom die definition */
export interface CustomDie {
  id: string;
  name: string;
  faces: DieFace[];
}

/** Die instance (either standard or custom) */
export interface Die {
  id: string;
  type: StandardDieType | string;    // Standard type or custom die ID
  currentValue?: number | string;
  locked: boolean;                   // Locked for re-rolling
  modified?: boolean;                 // Has been modified from original roll
}

/** Dice pool */
export interface DicePool {
  id: string;
  name: string;
  dice: Die[];
}

// ============================================================================
// CARD TYPES
// ============================================================================

/** Card field definition */
export interface CardField {
  name: string;
  type: 'number' | 'text' | 'symbol' | 'color' | 'image';
  value: number | string;
}

/** Card definition */
export interface Card {
  id: string;
  fields: CardField[];
}

/** Deck configuration */
export interface Deck {
  id: string;
  name: string;
  cards: Card[];                      // All cards in deck (shuffled order)
  drawPile: Card[];                   // Cards still to be drawn
  discardPile: Card[];                // Cards that have been used
  currentCard?: Card;                 // Currently active card
}

// ============================================================================
// TOOL TYPES
// ============================================================================

/** Active tool for marking */
export interface Tool {
  type: MarkType;
  isPermanent: boolean;               // Pen vs Pencil mode
  value?: number | string;            // Pre-selected value for tool
  color?: string;                     // Pre-selected color
  symbolId?: string;                  // Pre-selected symbol
}

// ============================================================================
// GAME STATE TYPES
// ============================================================================

/** Action types for history/undo system */
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

/** Base action interface */
export interface GameAction {
  type: ActionType;
  timestamp: number;
}

/** Place mark action */
export interface PlaceMarkAction extends GameAction {
  type: 'PLACE_MARK';
  sheetId: string;
  hotspotId: string;
  mark: AnyMark;
}

/** Remove mark action */
export interface RemoveMarkAction extends GameAction {
  type: 'REMOVE_MARK';
  sheetId: string;
  hotspotId: string;
  markIndex: number;
}

/** Roll dice action */
export interface RollDiceAction extends GameAction {
  type: 'ROLL_DICE';
  poolId: string;
  diceIds?: string[];                 // Specific dice to roll (undefined = all)
  results: Array<{ dieId: string; value: number | string }>;
}

/** Union of all action types */
export type AnyAction =
  | PlaceMarkAction
  | RemoveMarkAction
  | RollDiceAction;

/** Game state */
export interface GameState {
  sheets: Sheet[];
  dicePools: DicePool[];
  decks: Deck[];
  currentSheetId: string;
  currentTool: Tool;
  history: AnyAction[];              // For undo
  historyIndex: number;              // Current position in history
  customDice: CustomDie[];           // Custom die definitions
  customSymbols: Record<string, string>; // Symbol ID → SVG path or emoji
  colorPalette: string[];            // Available colors
}

// ============================================================================
// GAME CONFIGURATION TYPES
// ============================================================================

/** Symbol palette definition */
export interface SymbolPalette {
  [symbolId: string]: {
    name: string;
    svg?: string;                     // SVG path or element
    emoji?: string;                   // Emoji character
    unicode?: string;                 // Unicode character
  };
}

/** Game configuration */
export interface GameConfig {
  name: string;
  sheets: Sheet[];
  dicePools?: DicePool[];
  decks?: Deck[];
  customDice?: CustomDie[];
  symbolPalette?: SymbolPalette;
  colorPalette?: string[];
  defaultTool?: Tool;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/** Point for coordinates */
export interface Point {
  x: number;
  y: number;
}

/** Bounding box */
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Save file structure */
export interface SaveFile {
  version: string;
  timestamp: number;
  gameName: string;
  state: GameState;
}
