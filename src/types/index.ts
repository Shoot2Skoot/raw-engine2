/**
 * Roll-and-Write Game Engine - Core Type Definitions
 *
 * This file defines all the core types for the engine including sheets, marks,
 * dice, cards, and game state management.
 */

// ============================================================================
// MARK TYPES
// ============================================================================

/** Types of marks that can be placed on a sheet */
export type MarkType =
  | 'checkbox'    // Empty, checked, or crossed
  | 'number'      // Numeric value
  | 'color'       // Fill color
  | 'circle'      // Empty, half, or full circle
  | 'symbol'      // Icon/symbol from a palette
  | 'text'        // Freeform text
  | 'line'        // Connection between points
  | 'pencil'      // Temporary/erasable mark (lighter appearance)

/** State of a checkbox mark */
export type CheckboxState = 'empty' | 'checked' | 'crossed';

/** State of a circle mark */
export type CircleState = 'empty' | 'half' | 'full';

/** A mark placed on a hotspot */
export interface Mark {
  /** Unique identifier for this mark */
  id: string;
  /** Type of mark */
  type: MarkType;
  /** Is this a temporary (pencil) mark? */
  isPencil?: boolean;

  // Type-specific data
  /** For checkbox marks */
  checkboxState?: CheckboxState;
  /** For number marks */
  numberValue?: number;
  /** For color marks (hex color) */
  colorValue?: string;
  /** For circle marks */
  circleState?: CircleState;
  /** For symbol marks (identifier from symbol palette) */
  symbolId?: string;
  /** For text marks */
  textValue?: string;
  /** For line marks - start and end hotspot IDs */
  lineFrom?: string;
  lineTo?: string;
  /** Line style (for different connection types) */
  lineStyle?: string;
}

// ============================================================================
// HOTSPOT TYPES
// ============================================================================

/** Shape type for a hotspot */
export type HotspotShape =
  | 'rectangle'
  | 'circle'
  | 'polygon';

/** Position and size for rectangular hotspots */
export interface RectangleGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Position and size for circular hotspots */
export interface CircleGeometry {
  cx: number;
  cy: number;
  radius: number;
}

/** Vertices for polygonal hotspots */
export interface PolygonGeometry {
  points: Array<{ x: number; y: number }>;
}

/** Geometry data based on shape type */
export type HotspotGeometry =
  | RectangleGeometry
  | CircleGeometry
  | PolygonGeometry;

/** Constraints on what marks are allowed in a hotspot */
export interface HotspotConstraints {
  /** Which mark types are allowed */
  allowedMarkTypes: MarkType[];
  /** Maximum number of marks (undefined = unlimited) */
  maxMarks?: number;
  /** Can marks be removed after placement? */
  canErase?: boolean;
  /** For number marks: valid range */
  numberRange?: { min: number; max: number };
  /** For color marks: allowed colors */
  allowedColors?: string[];
  /** For symbol marks: allowed symbol IDs */
  allowedSymbols?: string[];
  /** Is this hotspot currently enabled? */
  isEnabled?: boolean;
}

/** An interactive region on a sheet where marks can be placed */
export interface Hotspot {
  /** Unique identifier */
  id: string;
  /** Shape type */
  shape: HotspotShape;
  /** Position and size */
  geometry: HotspotGeometry;
  /** Constraints on marks */
  constraints: HotspotConstraints;
  /** Marks currently placed on this hotspot */
  marks: Mark[];
  /** Optional label for display */
  label?: string;
  /** Default/starting value */
  defaultValue?: Partial<Mark>;
  /** Custom styling */
  style?: React.CSSProperties;
  /** Z-index for overlapping hotspots */
  zIndex?: number;
}

// ============================================================================
// REGION TYPES (Collections of Hotspots)
// ============================================================================

/** Type of region layout */
export type RegionType =
  | 'grid'           // Uniform grid of cells
  | 'freeform'       // Manually positioned hotspots
  | 'track'          // Linear or curved resource track
  | 'territory'      // Area control regions
  | 'connectionGrid' // Grid of connection points for line drawing
  | 'techTree';      // Branching progression tree

/** Configuration for grid regions */
export interface GridRegionConfig {
  rows: number;
  columns: number;
  cellWidth?: number;
  cellHeight?: number;
  gap?: number;
  startX?: number;
  startY?: number;
}

/** Configuration for track regions */
export interface TrackRegionConfig {
  /** Number of spaces on the track */
  spaces: number;
  /** Path type */
  pathType: 'horizontal' | 'vertical' | 'custom';
  /** For custom paths: array of positions */
  positions?: Array<{ x: number; y: number }>;
  /** Size of each space */
  spaceSize?: number;
}

/** Configuration for connection grid regions */
export interface ConnectionGridConfig {
  rows: number;
  columns: number;
  nodeSize?: number;
  spacing?: number;
  allowDiagonals?: boolean;
}

/** A region is a collection of related hotspots */
export interface Region {
  /** Unique identifier */
  id: string;
  /** Type of region */
  type: RegionType;
  /** Hotspots in this region */
  hotspots: Hotspot[];
  /** Configuration based on region type */
  config?: GridRegionConfig | TrackRegionConfig | ConnectionGridConfig;
  /** Visual styling */
  backgroundColor?: string;
  border?: string;
  /** Position offset */
  offsetX?: number;
  offsetY?: number;
}

// ============================================================================
// SHEET TYPES
// ============================================================================

/** Layout approach for a sheet */
export type SheetLayout =
  | 'grid'         // Pure grid layout
  | 'image'        // Image background with overlaid hotspots
  | 'mixed';       // Combination of different region types

/** A game sheet/board that players mark up */
export interface Sheet {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Layout type */
  layout: SheetLayout;
  /** Regions on this sheet */
  regions: Region[];
  /** Background image URL (for image/mixed layouts) */
  backgroundImage?: string;
  /** Sheet dimensions */
  width: number;
  height: number;
  /** Scaling behavior */
  scaleMode?: 'fit' | 'fill' | 'stretch';
}

// ============================================================================
// DICE TYPES
// ============================================================================

/** Standard die types */
export type StandardDieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

/** Value that can appear on a die face */
export interface DieFaceValue {
  /** Display type */
  type: 'number' | 'symbol' | 'color' | 'text' | 'combination';
  /** For number faces */
  number?: number;
  /** For symbol faces */
  symbolId?: string;
  /** For color faces */
  color?: string;
  /** For text faces */
  text?: string;
  /** For combination faces */
  combination?: Array<DieFaceValue>;
}

/** Custom die definition */
export interface CustomDie {
  /** Die identifier */
  id: string;
  /** Display name */
  name: string;
  /** Faces on this die */
  faces: DieFaceValue[];
  /** Probability weights for each face (optional, for weighted dice) */
  weights?: number[];
  /** Visual appearance */
  color?: string;
  size?: number;
}

/** Either a standard or custom die */
export type DieDefinition = StandardDieType | CustomDie;

/** Current state of a rolled die */
export interface DieResult {
  /** Die identifier */
  id: string;
  /** Die definition being used */
  die: DieDefinition;
  /** Current face value */
  value: number | DieFaceValue;
  /** Is this die locked (won't reroll)? */
  isLocked: boolean;
  /** Has this die been modified? */
  wasModified: boolean;
}

/** A pool of dice that can be rolled together */
export interface DicePool {
  /** Pool identifier */
  id: string;
  /** Display name */
  name: string;
  /** Dice in this pool */
  dice: DieDefinition[];
  /** Current results (after rolling) */
  results: DieResult[];
  /** Roll history */
  history: Array<{
    timestamp: number;
    results: DieResult[];
  }>;
}

// ============================================================================
// CARD TYPES
// ============================================================================

/** Field type on a card */
export type CardFieldType = 'number' | 'text' | 'symbol' | 'color' | 'image';

/** A field on a card */
export interface CardField {
  /** Field name/identifier */
  name: string;
  /** Field type */
  type: CardFieldType;
  /** Current value */
  value: number | string;
  /** Display properties */
  displayConfig?: {
    fontSize?: number;
    color?: string;
    position?: { x: number; y: number };
  };
}

/** A single card */
export interface Card {
  /** Unique identifier */
  id: string;
  /** Card type/name */
  type: string;
  /** Fields on this card */
  fields: CardField[];
  /** Background image */
  backgroundImage?: string;
}

/** A deck of cards */
export interface Deck {
  /** Deck identifier */
  id: string;
  /** Display name */
  name: string;
  /** All cards in deck (draw pile) */
  cards: Card[];
  /** Cards that have been discarded */
  discardPile: Card[];
  /** Current/active card being shown */
  currentCard?: Card;
  /** Is deck face-up or face-down? */
  isFaceUp?: boolean;
}

// ============================================================================
// GAME STATE TYPES
// ============================================================================

/** Selected tool for marking */
export interface SelectedTool {
  /** Mark type to place */
  markType: MarkType;
  /** For color tool: selected color */
  selectedColor?: string;
  /** For symbol tool: selected symbol */
  selectedSymbol?: string;
  /** Is pencil mode enabled? */
  isPencilMode?: boolean;
}

/** An action that can be undone/redone */
export interface GameAction {
  /** Action type */
  type: 'addMark' | 'removeMark' | 'updateMark' | 'rollDice' | 'drawCard' | 'discardCard';
  /** Timestamp */
  timestamp: number;
  /** Action-specific data */
  data: unknown;
}

/** Complete game state */
export interface GameState {
  /** Unique game ID */
  id: string;
  /** Game name/title */
  name: string;
  /** All sheets in this game */
  sheets: Sheet[];
  /** Currently active sheet ID */
  activeSheetId: string;
  /** Dice pools in this game */
  dicePools?: DicePool[];
  /** Decks in this game */
  decks?: Deck[];
  /** Currently selected tool */
  selectedTool: SelectedTool;
  /** Undo history */
  history: GameAction[];
  /** Current position in history (for undo/redo) */
  historyIndex: number;
  /** Last saved timestamp */
  lastSaved?: number;
}

// ============================================================================
// GAME DEFINITION TYPES (for developers to define games)
// ============================================================================

/** Developer-friendly game configuration */
export interface GameDefinition {
  /** Game ID */
  id: string;
  /** Game name */
  name: string;
  /** Sheet definitions */
  sheets: SheetDefinition[];
  /** Dice pool definitions */
  dicePools?: DicePoolDefinition[];
  /** Deck definitions */
  decks?: DeckDefinition[];
  /** Default tool */
  defaultTool?: MarkType;
}

/** Developer-friendly sheet configuration */
export interface SheetDefinition {
  id: string;
  name: string;
  layout: SheetLayout;
  regions: RegionDefinition[];
  backgroundImage?: string;
  width?: number;
  height?: number;
}

/** Developer-friendly region configuration */
export interface RegionDefinition {
  id: string;
  type: RegionType;
  config: GridRegionConfig | TrackRegionConfig | ConnectionGridConfig | Record<string, unknown>;
  constraints?: Partial<HotspotConstraints>;
  style?: React.CSSProperties;
}

/** Developer-friendly dice pool configuration */
export interface DicePoolDefinition {
  id: string;
  name: string;
  dice: Array<StandardDieType | CustomDie>;
}

/** Developer-friendly deck configuration */
export interface DeckDefinition {
  id: string;
  name: string;
  cards: Card[];
  isFaceUp?: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/** Color palette for a game */
export interface ColorPalette {
  colors: Array<{
    id: string;
    hex: string;
    name: string;
  }>;
}

/** Symbol palette for a game */
export interface SymbolPalette {
  symbols: Array<{
    id: string;
    iconName: string; // Lucide icon name
    label: string;
  }>;
}

/** Export/import format for save files */
export interface SaveFile {
  version: string;
  gameState: GameState;
  exportedAt: number;
}
