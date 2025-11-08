/**
 * Core type definitions for the Roll-and-Write Game Engine
 */

// ============================================================================
// MARK TYPES
// ============================================================================

/**
 * Types of marks that can be placed on hotspots
 */
export type MarkType =
  | 'checkbox'     // Empty/Checked/Crossed states
  | 'number'       // Numeric entry (0-999)
  | 'color'        // Color fill
  | 'circle'       // Empty/Half/Full states
  | 'symbol'       // Icons/symbols
  | 'text'         // Freeform text entry
  | 'line'         // Connection between points
  | 'pencil';      // Temporary/planning mark

/**
 * Checkbox states
 */
export type CheckboxState = 'empty' | 'checked' | 'crossed';

/**
 * Circle fill states
 */
export type CircleState = 'empty' | 'half' | 'full';

/**
 * Mark data structure - polymorphic based on mark type
 */
export type Mark =
  | { type: 'checkbox'; state: CheckboxState; isPencil?: boolean }
  | { type: 'number'; value: number; isPencil?: boolean }
  | { type: 'color'; color: string; opacity?: number }
  | { type: 'circle'; state: CircleState; isPencil?: boolean }
  | { type: 'symbol'; symbol: string; color?: string }
  | { type: 'text'; text: string; isPencil?: boolean }
  | { type: 'line'; fromId: string; toId: string; style?: string; color?: string };

// ============================================================================
// HOTSPOT TYPES
// ============================================================================

/**
 * Shape type for hotspots
 */
export type HotspotShape = 'rectangle' | 'circle' | 'polygon';

/**
 * Position for rectangular hotspots
 */
export interface RectPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Position for circular hotspots
 */
export interface CirclePosition {
  cx: number;
  cy: number;
  radius: number;
}

/**
 * Position for polygonal hotspots
 */
export interface PolygonPosition {
  points: Array<{ x: number; y: number }>;
}

/**
 * Hotspot position (polymorphic based on shape)
 */
export type HotspotPosition =
  | ({ shape: 'rectangle' } & RectPosition)
  | ({ shape: 'circle' } & CirclePosition)
  | ({ shape: 'polygon' } & PolygonPosition);

/**
 * Constraints for what marks are allowed on a hotspot
 */
export interface HotspotConstraints {
  allowedMarkTypes: MarkType[];
  maxMarks?: number;              // Maximum marks allowed (default: 1)
  numberRange?: [number, number]; // For number marks
  requireSequence?: boolean;      // Must follow order
  readOnly?: boolean;             // Display only, no interaction
}

/**
 * A hotspot - an interactive region where marks can be placed
 */
export interface Hotspot {
  id: string;
  position: HotspotPosition;
  constraints: HotspotConstraints;
  defaultValue?: Mark;
  marks: Mark[];                  // Multiple marks per hotspot supported
  visible?: boolean;
  enabled?: boolean;
}

// ============================================================================
// REGION TYPES
// ============================================================================

/**
 * Region layout types
 */
export type RegionLayout = 'grid' | 'freeform' | 'track' | 'territory' | 'connections' | 'tree';

/**
 * Grid configuration for auto-generating hotspots
 */
export interface GridConfig {
  rows: number;
  columns: number;
  cellWidth?: number;
  cellHeight?: number;
  gap?: number;
  offsetX?: number;
  offsetY?: number;
}

/**
 * Track configuration (linear or curved)
 */
export interface TrackConfig {
  spaces: number;
  orientation?: 'horizontal' | 'vertical' | 'custom';
  path?: Array<{ x: number; y: number }>; // For curved tracks
  allowBackward?: boolean;
}

/**
 * Territory configuration
 */
export interface TerritoryConfig {
  territories: Array<{
    id: string;
    bounds: PolygonPosition;
    value?: number;
    type?: string;
  }>;
}

/**
 * Connection grid configuration
 */
export interface ConnectionConfig {
  nodes: Array<{ id: string; x: number; y: number }>;
  allowedConnections?: Array<[string, string]>; // Which nodes can connect
  preventCrossing?: boolean;
}

/**
 * Tech tree configuration
 */
export interface TreeConfig {
  nodes: Array<{
    id: string;
    x: number;
    y: number;
    prerequisites?: string[]; // Node IDs required before this one
  }>;
  layout?: 'vertical' | 'horizontal' | 'radial';
}

/**
 * Region configuration (polymorphic based on layout)
 */
export type RegionConfig =
  | ({ layout: 'grid' } & GridConfig)
  | ({ layout: 'track' } & TrackConfig)
  | ({ layout: 'territory' } & TerritoryConfig)
  | ({ layout: 'connections' } & ConnectionConfig)
  | ({ layout: 'tree' } & TreeConfig)
  | { layout: 'freeform' }; // Manual hotspot definition

/**
 * A region - collection of hotspots with shared properties
 */
export interface Region {
  id: string;
  config: RegionConfig;
  hotspots: Hotspot[];
  backgroundColor?: string;
  borderColor?: string;
  zIndex?: number;
}

// ============================================================================
// SHEET TYPES
// ============================================================================

/**
 * Sheet layout type
 */
export type SheetLayout = 'grid' | 'image-overlay' | 'mixed';

/**
 * Image background configuration
 */
export interface ImageBackground {
  src: string;
  width: number;
  height: number;
  maintainAspectRatio?: boolean;
}

/**
 * Sheet configuration
 */
export interface SheetConfig {
  name: string;
  layout: SheetLayout;
  width: number;
  height: number;
  background?: ImageBackground;
  regions: Region[];
}

/**
 * Sheet state during gameplay
 */
export interface SheetState {
  id: string;
  config: SheetConfig;
  // Hotspot states are stored in regions
}

// ============================================================================
// DICE TYPES
// ============================================================================

/**
 * Standard die types
 */
export type StandardDieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

/**
 * Custom die face can show various content
 */
export type DieFace =
  | { type: 'number'; value: number }
  | { type: 'symbol'; symbol: string; color?: string }
  | { type: 'text'; text: string }
  | { type: 'color'; color: string }
  | { type: 'combination'; content: Array<{ type: 'number' | 'symbol' | 'text' | 'color'; value: string | number }> };

/**
 * Die configuration (standard or custom)
 */
export type DieConfig =
  | { type: 'standard'; sides: StandardDieType }
  | { type: 'custom'; faces: DieFace[]; weights?: number[] }; // Optional probability weights

/**
 * Die instance with current state
 */
export interface Die {
  id: string;
  config: DieConfig;
  currentFace?: DieFace | number; // Current result
  locked?: boolean;               // Locked from re-rolling
  modified?: boolean;             // Has been modified this turn
}

/**
 * Dice pool - collection of dice
 */
export interface DicePool {
  id: string;
  name: string;
  dice: Die[];
  visible?: boolean;
}

/**
 * Dice roll history entry
 */
export interface DiceRollHistory {
  timestamp: number;
  poolId: string;
  results: Array<{ dieId: string; result: DieFace | number }>;
}

// ============================================================================
// CARD TYPES
// ============================================================================

/**
 * Card field type
 */
export type CardFieldType = 'number' | 'text' | 'symbol' | 'color' | 'image';

/**
 * Card field value
 */
export type CardFieldValue =
  | { type: 'number'; value: number }
  | { type: 'text'; value: string }
  | { type: 'symbol'; value: string; color?: string }
  | { type: 'color'; value: string }
  | { type: 'image'; src: string };

/**
 * Card definition
 */
export interface Card {
  id: string;
  fields: Record<string, CardFieldValue>;
}

/**
 * Deck configuration
 */
export interface DeckConfig {
  id: string;
  name: string;
  cards: Card[];
}

/**
 * Deck state during gameplay
 */
export interface DeckState {
  id: string;
  name: string;
  drawPile: Card[];
  discardPile: Card[];
  currentCard?: Card;
  splitPiles?: Card[][]; // For games that split deck into multiple piles
}

// ============================================================================
// TOOL TYPES
// ============================================================================

/**
 * Currently selected tool
 */
export interface ToolState {
  markType: MarkType;
  isPencilMode?: boolean;
  // Tool-specific settings
  numberValue?: number;
  colorValue?: string;
  symbolValue?: string;
  textValue?: string;
}

// ============================================================================
// GAME STATE TYPES
// ============================================================================

/**
 * Action types for undo/redo
 */
export type GameAction =
  | { type: 'ADD_MARK'; sheetId: string; hotspotId: string; mark: Mark }
  | { type: 'REMOVE_MARK'; sheetId: string; hotspotId: string; markIndex: number }
  | { type: 'UPDATE_MARK'; sheetId: string; hotspotId: string; markIndex: number; mark: Mark }
  | { type: 'ROLL_DICE'; poolId: string; results: Array<{ dieId: string; result: DieFace | number }> }
  | { type: 'LOCK_DIE'; poolId: string; dieId: string }
  | { type: 'UNLOCK_DIE'; poolId: string; dieId: string }
  | { type: 'MODIFY_DIE'; poolId: string; dieId: string; newValue: DieFace | number }
  | { type: 'DRAW_CARD'; deckId: string; card: Card }
  | { type: 'DISCARD_CARD'; deckId: string; card: Card }
  | { type: 'SHUFFLE_DECK'; deckId: string }
  | { type: 'RESHUFFLE_DISCARD'; deckId: string };

/**
 * Complete game state
 */
export interface GameState {
  id: string;
  name: string;
  sheets: SheetState[];
  dicePools: DicePool[];
  decks: DeckState[];
  currentSheetId: string;
  currentTool: ToolState;
  diceHistory: DiceRollHistory[];
  actionHistory: GameAction[];
  historyIndex: number; // For undo/redo
}

/**
 * Game configuration - defines how to set up a game
 */
export interface GameConfig {
  id: string;
  name: string;
  description?: string;
  sheets: SheetConfig[];
  dicePools?: Array<{ id: string; name: string; dice: DieConfig[] }>;
  decks?: DeckConfig[];
  defaultTool?: MarkType;
}

/**
 * Saved game data structure
 */
export interface SavedGame {
  version: string;
  timestamp: number;
  config: GameConfig;
  state: GameState;
}
