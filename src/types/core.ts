/**
 * Core type definitions for the roll-and-write game engine
 */

/**
 * Unique identifier for hotspots, regions, sheets, etc.
 */
export type ID = string;

/**
 * 2D coordinate position
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Rectangular dimensions
 */
export interface Dimensions {
  width: number;
  height: number;
}

/**
 * RGB or hex color
 */
export type Color = string;

/**
 * Layout types for sheets
 */
export const LayoutType = {
  Grid: 'grid',
  ImageOverlay: 'image-overlay',
  Freeform: 'freeform',
  Mixed: 'mixed',
} as const;

export type LayoutType = (typeof LayoutType)[keyof typeof LayoutType];

/**
 * Shape types for hotspots
 */
export const HotspotShape = {
  Rectangle: 'rectangle',
  Circle: 'circle',
  Polygon: 'polygon',
} as const;

export type HotspotShape = (typeof HotspotShape)[keyof typeof HotspotShape];

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
  points: Position[];
}

/**
 * Union type for all hotspot shapes
 */
export type HotspotGeometry = RectangleHotspot | CircleHotspot | PolygonHotspot;

/**
 * Mark types that can be placed on hotspots
 */
export const MarkType = {
  Checkbox: 'checkbox',
  Number: 'number',
  ColorFill: 'color-fill',
  Circle: 'circle',
  Symbol: 'symbol',
  Text: 'text',
  Line: 'line',
} as const;

export type MarkType = (typeof MarkType)[keyof typeof MarkType];

/**
 * Hotspot configuration defining an interactive region on a sheet
 */
export interface Hotspot {
  /** Unique identifier */
  id: ID;
  /** Visual/semantic label */
  label?: string;
  /** Geometric shape and position */
  geometry: HotspotGeometry;
  /** Allowed mark types for this hotspot */
  allowedMarkTypes: MarkType[];
  /** Maximum number of marks (undefined = unlimited) */
  maxMarks?: number;
  /** Default/starting value */
  defaultValue?: any;
  /** Whether hotspot can be unmarked after marking */
  canUnmark?: boolean;
  /** Whether hotspot is currently enabled */
  enabled?: boolean;
  /** Custom data for game-specific logic */
  metadata?: Record<string, any>;
}

/**
 * Grid layout configuration
 */
export interface GridLayout {
  type: 'grid';
  /** Number of rows */
  rows: number;
  /** Number of columns */
  columns: number;
  /** Cell width in pixels (or 'auto') */
  cellWidth: number | 'auto';
  /** Cell height in pixels (or 'auto') */
  cellHeight: number | 'auto';
  /** Gap between cells in pixels */
  gap?: number;
  /** Starting position offset */
  offset?: Position;
  /** Background color for grid region */
  backgroundColor?: Color;
  /** Border color for cells */
  borderColor?: Color;
  /** Default mark types allowed in all cells */
  allowedMarkTypes: MarkType[];
  /** Whether to show grid lines */
  showGridLines?: boolean;
}

/**
 * Image overlay layout configuration
 */
export interface ImageOverlayLayout {
  type: 'image-overlay';
  /** URL or path to background image */
  imageUrl: string;
  /** Image dimensions (for scaling reference) */
  imageDimensions: Dimensions;
  /** Whether to maintain aspect ratio */
  maintainAspectRatio?: boolean;
  /** Hotspots positioned over the image */
  hotspots: Hotspot[];
  /** Whether to show hotspot boundaries in debug mode */
  debugMode?: boolean;
}

/**
 * Freeform layout configuration
 */
export interface FreeformLayout {
  type: 'freeform';
  /** Canvas dimensions */
  dimensions: Dimensions;
  /** Hotspots positioned freely */
  hotspots: Hotspot[];
  /** Background color */
  backgroundColor?: Color;
}

/**
 * Mixed layout combining multiple layout types
 */
export interface MixedLayout {
  type: 'mixed';
  /** Canvas dimensions */
  dimensions: Dimensions;
  /** Multiple regions of different types */
  regions: Region[];
  /** Background color */
  backgroundColor?: Color;
}

/**
 * Union type for all layout configurations
 */
export type Layout = GridLayout | ImageOverlayLayout | FreeformLayout | MixedLayout;

/**
 * Region grouping multiple hotspots with shared properties
 */
export interface Region {
  /** Unique identifier */
  id: ID;
  /** Descriptive name */
  name: string;
  /** Layout type for this region */
  layout: GridLayout | ImageOverlayLayout | FreeformLayout;
  /** Position within parent layout (for mixed layouts) */
  position?: Position;
  /** Z-index for layering */
  zIndex?: number;
  /** Whether region is visible */
  visible?: boolean;
  /** Custom data */
  metadata?: Record<string, any>;
}

/**
 * Sheet definition
 */
export interface Sheet {
  /** Unique identifier */
  id: ID;
  /** Display name */
  name: string;
  /** Layout configuration */
  layout: Layout;
  /** Custom styling */
  style?: {
    backgroundColor?: Color;
    borderColor?: Color;
    padding?: number;
  };
  /** Custom data */
  metadata?: Record<string, any>;
}

/**
 * Complete game definition
 */
export interface GameDefinition {
  /** Game identifier */
  id: ID;
  /** Game name */
  name: string;
  /** Game description */
  description?: string;
  /** All sheets in the game */
  sheets: Sheet[];
  /** Dice pools configuration */
  dice?: any[]; // DicePoolConfig[] - defined in dice.ts
  /** Card decks configuration */
  decks?: any[]; // DeckConfig[] - defined in cards.ts
  /** Custom data */
  metadata?: Record<string, any>;
}
