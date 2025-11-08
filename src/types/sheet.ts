/**
 * Sheet and Hotspot Types - Define game board layouts and interactive regions
 */

import type { Mark, MarkConstraints } from './marks';

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

/** Rectangle definition */
export interface Rectangle extends Position, Size {}

/** Circle definition */
export interface Circle {
  center: Position;
  radius: number;
}

/** Polygon definition with arbitrary vertices */
export interface Polygon {
  vertices: Position[];
}

/** Hotspot shape types */
export type HotspotShape =
  | { type: 'rectangle'; bounds: Rectangle }
  | { type: 'circle'; bounds: Circle }
  | { type: 'polygon'; bounds: Polygon };

/** Interactive region where players can place marks */
export interface Hotspot {
  /** Unique identifier */
  id: string;
  /** Visual/display label (optional) */
  label?: string;
  /** Shape and position of the hotspot */
  shape: HotspotShape;
  /** What marks are allowed here */
  constraints: MarkConstraints;
  /** Current marks placed on this hotspot */
  marks: Mark[];
  /** Whether this hotspot is currently interactive */
  enabled?: boolean;
  /** Read-only hotspots show information but aren't interactive */
  readOnly?: boolean;
  /** Default/starting value (for display) */
  defaultValue?: string | number;
  /** Optional styling */
  style?: {
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  };
}

/** Grid layout configuration */
export interface GridLayout {
  type: 'grid';
  rows: number;
  columns: number;
  /** Cell size in pixels, or 'auto' to calculate */
  cellSize: number | 'auto';
  /** Gap between cells in pixels */
  gap?: number;
  /** Starting position offset */
  offset?: Position;
  /** Background color for grid region */
  backgroundColor?: string;
  /** Default constraints for all cells (can be overridden per cell) */
  defaultConstraints: MarkConstraints;
  /** Override constraints for specific cells (by row,col) */
  cellConstraints?: Map<string, MarkConstraints>; // key: "row,col"
}

/** Image overlay layout with custom hotspots */
export interface ImageLayout {
  type: 'image';
  /** Image URL or data URI */
  imageUrl: string;
  /** How image should scale */
  imageMode?: 'fit' | 'fill' | 'stretch';
  /** Maintain aspect ratio */
  aspectRatio?: number; // width/height
  /** Custom hotspots positioned over the image */
  hotspots: Hotspot[];
}

/** Resource track layout (linear or curved path) */
export interface TrackLayout {
  type: 'track';
  /** Number of spaces on the track */
  spaces: number;
  /** Path the track follows */
  path: 'horizontal' | 'vertical' | 'custom';
  /** For custom paths: list of positions */
  customPath?: Position[];
  /** Space size */
  spaceSize: number;
  /** Direction constraints */
  direction?: 'forward' | 'backward' | 'bidirectional';
  /** Constraints for track spaces */
  constraints: MarkConstraints;
}

/** Territory/region map layout */
export interface RegionLayout {
  type: 'region';
  /** Collection of territory regions */
  territories: Array<{
    id: string;
    shape: Polygon;
    constraints: MarkConstraints;
    label?: string;
    value?: number;
  }>;
}

/** Connection grid layout for drawing paths */
export interface ConnectionLayout {
  type: 'connection';
  /** Grid of connection points */
  points: Position[];
  /** Which connections are allowed */
  allowedConnections?: Array<{ from: number; to: number }>; // indices into points array
  /** Visual style for connections */
  connectionStyle?: {
    color?: string;
    thickness?: number;
    style?: 'solid' | 'dashed';
  };
}

/** Mixed/composite layout combining multiple layout types */
export interface CompositeLayout {
  type: 'composite';
  /** Multiple regions that can be positioned independently */
  regions: Array<{
    id: string;
    layout: GridLayout | ImageLayout | TrackLayout | RegionLayout | ConnectionLayout;
    position: Position;
    zIndex?: number;
  }>;
}

/** Union type of all layout types */
export type SheetLayout =
  | GridLayout
  | ImageLayout
  | TrackLayout
  | RegionLayout
  | ConnectionLayout
  | CompositeLayout;

/** A game sheet/board that players interact with */
export interface Sheet {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Sheet layout configuration */
  layout: SheetLayout;
  /** Generated hotspots (auto-generated for grids, manually defined for images) */
  hotspots: Hotspot[];
  /** Sheet dimensions */
  dimensions?: Size;
  /** Background color */
  backgroundColor?: string;
}
