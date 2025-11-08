/**
 * Sheet Types - Different layout systems for game boards
 */

import type { Hotspot } from './hotspots';
import type { MarkType } from './marks';

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
  gap?: number;
  /** Starting position offset */
  offset?: {
    x: number;
    y: number;
  };
  /** Default mark types allowed in all cells */
  defaultAllowedMarks: MarkType[];
  /** Background color for the grid */
  backgroundColor?: string;
  /** Custom labels for cells (optional, indexed by "row-col") */
  cellLabels?: Record<string, string>;
  /** Custom constraints per cell (optional, indexed by "row-col") */
  cellConstraints?: Record<string, Partial<Hotspot['constraints']>>;
}

/**
 * Image-based layout with custom hotspots
 */
export interface ImageLayout {
  type: 'image';
  /** Background image URL or data URI */
  imageUrl: string;
  /** Image dimensions */
  width: number;
  height: number;
  /** Manually defined hotspots */
  hotspots: Hotspot[];
  /** How image should fit */
  fit?: 'contain' | 'cover' | 'fill';
}

/**
 * Resource track (linear or curved path)
 */
export interface ResourceTrack {
  type: 'track';
  /** Track identifier */
  id: string;
  /** Track label */
  label?: string;
  /** Number of spaces on track */
  spaces: number;
  /** Path points for curved tracks (linear if omitted) */
  path?: Array<{ x: number; y: number }>;
  /** Orientation for linear tracks */
  orientation?: 'horizontal' | 'vertical';
  /** Can move backward? */
  bidirectional?: boolean;
  /** Starting position */
  startPosition?: number;
  /** Labels for specific positions */
  spaceLabels?: Record<number, string>;
  /** Allowed mark types */
  allowedMarks: MarkType[];
}

/**
 * Territory/region map
 */
export interface TerritoryMap {
  type: 'territory';
  /** Background image (optional) */
  backgroundImage?: string;
  /** Defined territories */
  territories: Array<{
    id: string;
    label?: string;
    /** Territory boundary */
    boundary: Hotspot['shape'];
    /** Territory value/properties */
    value?: number;
    category?: string;
    /** Visual style */
    style?: Hotspot['style'];
    /** Allowed marks */
    allowedMarks: MarkType[];
  }>;
}

/**
 * Connection grid for network-building games
 */
export interface ConnectionGrid {
  type: 'connection';
  /** Grid of connection points */
  points: Array<{
    id: string;
    position: { x: number; y: number };
    /** Which other points can this connect to? */
    connectsTo: string[];
  }>;
  /** Allowed line styles */
  lineStyles?: Array<{
    id: string;
    label: string;
    color: string;
    style?: 'solid' | 'dashed' | 'dotted';
    thickness?: number;
  }>;
}

/**
 * Tech tree / progression tree
 */
export interface TechTree {
  type: 'tech-tree';
  /** Tree nodes */
  nodes: Array<{
    id: string;
    label: string;
    position: { x: number; y: number };
    /** Prerequisites (node IDs that must be completed first) */
    prerequisites?: string[];
    /** Visual representation */
    icon?: string;
    description?: string;
  }>;
  /** Layout direction */
  direction?: 'vertical' | 'horizontal' | 'radial';
}

/**
 * Freeform layout - just a container for hotspots
 */
export interface FreeformLayout {
  type: 'freeform';
  /** Width and height of the sheet */
  width: number;
  height: number;
  /** Background image (optional) */
  backgroundImage?: string;
  /** Background color */
  backgroundColor?: string;
  /** Manually placed hotspots */
  hotspots: Hotspot[];
}

/**
 * Union type of all layout types
 */
export type SheetLayout =
  | GridLayout
  | ImageLayout
  | ResourceTrack
  | TerritoryMap
  | ConnectionGrid
  | TechTree
  | FreeformLayout;

/**
 * A region combines multiple hotspots/elements
 */
export interface Region {
  id: string;
  label?: string;
  /** Position on sheet */
  position: { x: number; y: number };
  /** The layout for this region */
  layout: SheetLayout;
  /** Z-index for layering regions */
  zIndex?: number;
}

/**
 * Complete sheet definition
 */
export interface Sheet {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Sheet dimensions */
  width: number;
  height: number;
  /** Background color */
  backgroundColor?: string;
  /** Background image */
  backgroundImage?: string;
  /** Regions on this sheet (can mix multiple layouts) */
  regions: Region[];
  /** Default hotspots (not in any region) */
  hotspots?: Hotspot[];
}
