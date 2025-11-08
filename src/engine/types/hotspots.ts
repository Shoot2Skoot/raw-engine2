/**
 * Hotspot Types - Interactive regions on sheets where marks can be placed
 */

import type { MarkType } from './marks';

/**
 * Position in 2D space
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Rectangular boundary
 */
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Circular boundary
 */
export interface Circle {
  center: Position;
  radius: number;
}

/**
 * Polygonal boundary (arbitrary shape)
 */
export interface Polygon {
  vertices: Position[];
}

/**
 * Hotspot shape types
 */
export type HotspotShape = Rectangle | Circle | Polygon;

/**
 * Helper type guards
 */
export function isRectangle(shape: HotspotShape): shape is Rectangle {
  return 'width' in shape && 'height' in shape;
}

export function isCircle(shape: HotspotShape): shape is Circle {
  return 'center' in shape && 'radius' in shape;
}

export function isPolygon(shape: HotspotShape): shape is Polygon {
  return 'vertices' in shape;
}

/**
 * Hotspot constraint options
 */
export interface HotspotConstraints {
  /** Allowed mark types for this hotspot */
  allowedMarkTypes: MarkType[];
  /** Maximum number of marks allowed (undefined = unlimited) */
  maxMarks?: number;
  /** Can marks be removed after placement? */
  erasable?: boolean;
  /** Is this hotspot currently interactive? */
  enabled?: boolean;
  /** Number range constraints for number marks */
  numberRange?: {
    min: number;
    max: number;
  };
  /** Color palette for color marks */
  colorPalette?: string[];
  /** Symbol set for symbol marks */
  symbolSet?: string[];
}

/**
 * A single interactive hotspot on a sheet
 */
export interface Hotspot {
  /** Unique identifier */
  id: string;
  /** Visual/functional label (optional) */
  label?: string;
  /** Shape and position */
  shape: HotspotShape;
  /** What marks are allowed and how */
  constraints: HotspotConstraints;
  /** Visual styling */
  style?: {
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    opacity?: number;
  };
  /** Z-index for layering */
  zIndex?: number;
  /** Custom metadata for game-specific logic */
  metadata?: Record<string, unknown>;
}

/**
 * Connection point for line-based games
 */
export interface ConnectionPoint extends Hotspot {
  /** IDs of points this can connect to */
  connectsTo?: string[];
}
