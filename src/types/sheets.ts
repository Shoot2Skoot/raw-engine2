import { Hotspot, Region, ConnectionPoint } from './hotspots';
import { MarkTypeConfig } from './marks';

/**
 * Sheet Types - Different layout configurations for game sheets
 */

/**
 * Grid layout configuration
 */
export interface GridLayout {
  type: 'grid';
  /** Number of rows */
  rows: number;
  /** Number of columns */
  columns: number;
  /** Cell size in pixels (or 'auto') */
  cellSize: number | 'auto';
  /** Gap between cells in pixels */
  gap: number;
  /** Starting position offset */
  offset?: { x: number; y: number };
  /** Background color */
  backgroundColor?: string;
  /** Default mark configuration for all cells */
  defaultMarkConfig: MarkTypeConfig;
  /** Cell-specific overrides (key is "row-col" like "0-0", "1-2") */
  cellOverrides?: Record<string, Partial<MarkTypeConfig>>;
}

/**
 * Image-based layout with custom hotspots
 */
export interface ImageLayout {
  type: 'image';
  /** Image source URL */
  imageSrc: string;
  /** Image dimensions */
  imageSize: { width: number; height: number };
  /** Whether to maintain aspect ratio */
  maintainAspectRatio: boolean;
  /** Manually defined hotspots overlaid on image */
  hotspots: Hotspot[];
}

/**
 * Resource track layout (linear or curved path)
 */
export interface TrackLayout {
  type: 'track';
  /** Track path type */
  pathType: 'linear' | 'curved';
  /** For linear: 'horizontal' or 'vertical' */
  direction?: 'horizontal' | 'vertical';
  /** For curved: array of positions defining the path */
  path?: { x: number; y: number }[];
  /** Number of spaces on track */
  spaces: number;
  /** Space size */
  spaceSize: number;
  /** Mark configuration for track spaces */
  markConfig: MarkTypeConfig;
  /** Whether movement is restricted (forward only, etc.) */
  movementRestriction?: 'forward' | 'backward' | 'bidirectional';
  /** Labels for specific positions */
  spaceLabels?: Record<number, string>;
}

/**
 * Territory/region map layout
 */
export interface TerritoryLayout {
  type: 'territory';
  /** Territories defined as polygonal regions */
  territories: {
    id: string;
    name: string;
    /** Polygon vertices */
    boundary: { x: number; y: number }[];
    /** Mark configuration */
    markConfig: MarkTypeConfig;
    /** Territory properties */
    properties?: Record<string, any>;
  }[];
}

/**
 * Connection grid layout (for drawing connections between points)
 */
export interface ConnectionLayout {
  type: 'connection';
  /** Connection points (dots/nodes) */
  points: ConnectionPoint[];
  /** Grid dimensions if points are in a regular grid */
  gridDimensions?: { rows: number; columns: number };
  /** Allowed connection types */
  connectionTypes: {
    id: string;
    label: string;
    color: string;
    style: 'solid' | 'dashed' | 'dotted';
  }[];
  /** Whether diagonal connections are allowed */
  allowDiagonal: boolean;
  /** Whether crossing lines are allowed */
  allowCrossing: boolean;
}

/**
 * Tech tree layout
 */
export interface TechTreeLayout {
  type: 'techtree';
  /** Tree layout direction */
  direction: 'vertical' | 'horizontal' | 'radial';
  /** Nodes in the tree */
  nodes: {
    id: string;
    label: string;
    position: { x: number; y: number };
    /** Node IDs that must be acquired first */
    prerequisites?: string[];
    /** Node data (cost, benefit, etc.) */
    data?: Record<string, any>;
  }[];
  /** Visual connections between nodes */
  showConnections: boolean;
}

/**
 * Freeform layout (completely custom positioning)
 */
export interface FreeformLayout {
  type: 'freeform';
  /** Custom regions */
  regions: Region[];
  /** Custom hotspots */
  hotspots: Hotspot[];
}

/**
 * Composite layout (combines multiple layout types)
 */
export interface CompositeLayout {
  type: 'composite';
  /** Child layouts with positioning */
  layouts: Array<{
    layout: SheetLayout;
    position: { x: number; y: number };
    zIndex?: number;
  }>;
}

/**
 * Union type of all layout types
 */
export type SheetLayout =
  | GridLayout
  | ImageLayout
  | TrackLayout
  | TerritoryLayout
  | ConnectionLayout
  | TechTreeLayout
  | FreeformLayout
  | CompositeLayout;

/**
 * Complete sheet definition
 */
export interface Sheet {
  /** Unique identifier */
  id: string;
  /** Sheet name (displayed in navigation) */
  name: string;
  /** Sheet dimensions */
  dimensions: { width: number; height: number };
  /** Layout configuration */
  layout: SheetLayout;
  /** Background color */
  backgroundColor?: string;
  /** Background image (optional, behind layout) */
  backgroundImage?: string;
}
