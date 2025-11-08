/**
 * Hotspot Types
 * Interactive regions on sheets where marks can be placed
 */

import type { MarkConstraints } from './marks';

/** Position in 2D space */
export interface Position {
  x: number;
  y: number;
}

/** Rectangular dimensions */
export interface Dimensions {
  width: number;
  height: number;
}

/** Base hotspot interface */
export interface BaseHotspot {
  id: string;
  type: HotspotType;
  position: Position;
  constraints: MarkConstraints;
  regionId?: string; // Optional region grouping
  metadata?: Record<string, unknown>; // Custom data
  disabled?: boolean; // Can be enabled/disabled dynamically
  defaultValue?: unknown; // Starting value
  readonly?: boolean; // Display only, not interactive
}

/** Rectangular hotspot */
export interface RectHotspot extends BaseHotspot {
  type: 'rect';
  dimensions: Dimensions;
}

/** Circular hotspot */
export interface CircleHotspot extends BaseHotspot {
  type: 'circle';
  radius: number;
}

/** Polygonal hotspot with arbitrary shape */
export interface PolygonHotspot extends BaseHotspot {
  type: 'polygon';
  vertices: Position[]; // Array of points defining the polygon
}

/** Grid cell hotspot (part of a grid layout) */
export interface GridCellHotspot extends BaseHotspot {
  type: 'gridcell';
  row: number;
  col: number;
  dimensions: Dimensions;
}

/** Connection point hotspot (for line drawing) */
export interface NodeHotspot extends BaseHotspot {
  type: 'node';
  radius: number;
  connectsTo?: string[]; // IDs of valid connection targets
}

/** Union type of all hotspot types */
export type Hotspot =
  | RectHotspot
  | CircleHotspot
  | PolygonHotspot
  | GridCellHotspot
  | NodeHotspot;

/** Hotspot type discriminator */
export type HotspotType = Hotspot['type'];

/** Region - a collection of related hotspots */
export interface Region {
  id: string;
  name: string;
  hotspotIds: string[];
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  zIndex?: number;
  metadata?: Record<string, unknown>;
}
