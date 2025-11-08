import { MarkTypeConfig } from './marks';

/**
 * Hotspot Types - Interactive regions on sheets where marks can be placed
 */

/**
 * Position in 2D space (pixels or percentage)
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Size dimensions
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * Base interface for all hotspots
 */
export interface BaseHotspot {
  /** Unique identifier */
  id: string;
  /** Optional label for debugging/display */
  label?: string;
  /** Mark type configuration */
  markConfig: MarkTypeConfig;
  /** Whether this hotspot is currently enabled */
  enabled: boolean;
  /** Whether this is read-only (display only) */
  readonly: boolean;
  /** Default/starting value (if any) */
  defaultValue?: any;
}

/**
 * Rectangular hotspot
 */
export interface RectangularHotspot extends BaseHotspot {
  shape: 'rectangle';
  position: Position;
  size: Size;
}

/**
 * Circular hotspot
 */
export interface CircularHotspot extends BaseHotspot {
  shape: 'circle';
  center: Position;
  radius: number;
}

/**
 * Polygonal hotspot (for irregular shapes)
 */
export interface PolygonalHotspot extends BaseHotspot {
  shape: 'polygon';
  /** Array of vertices defining the polygon */
  vertices: Position[];
}

/**
 * Union type of all hotspot shapes
 */
export type Hotspot = RectangularHotspot | CircularHotspot | PolygonalHotspot;

/**
 * Connection point for line drawing (used in connection grids)
 */
export interface ConnectionPoint {
  id: string;
  position: Position;
  /** IDs of points this can connect to */
  allowedConnections?: string[];
}

/**
 * Region - a collection of hotspots with shared properties
 */
export interface Region {
  id: string;
  name: string;
  /** Hotspots in this region */
  hotspotIds: string[];
  /** Visual styling */
  style?: {
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  };
  /** Z-index for layering */
  zIndex?: number;
}
