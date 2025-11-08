/**
 * Hotspot Types
 * Defines interactive regions on sheets where marks can be placed
 */

import type { Mark, MarkConfig } from './marks';

/** Point in 2D space */
export interface Point {
  x: number;
  y: number;
}

/** Rectangle defined by position and dimensions */
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Circle defined by center and radius */
export interface Circle {
  center: Point;
  radius: number;
}

/** Polygon defined by vertices */
export interface Polygon {
  vertices: Point[];
}

/** Hotspot shape types */
export type HotspotShape = Rectangle | Circle | Polygon;

/** Base hotspot interface */
export interface BaseHotspot {
  /** Unique identifier for this hotspot */
  id: string;
  /** Type of hotspot */
  type: HotspotType;
  /** Shape defining the interactive area */
  shape: HotspotShape;
  /** Mark configuration for this hotspot */
  markConfig: MarkConfig;
  /** Current marks placed on this hotspot */
  marks: Mark[];
  /** Visual styling */
  style?: HotspotStyle;
  /** Whether this hotspot is currently enabled/interactive */
  enabled: boolean;
  /** Optional label or display text */
  label?: string;
  /** Optional metadata for custom game logic */
  metadata?: Record<string, unknown>;
}

/** Cell hotspot (grid cell) */
export interface CellHotspot extends BaseHotspot {
  type: 'cell';
  /** Grid position (row, column) */
  gridPosition?: { row: number; col: number };
}

/** Connection point hotspot (for line drawing) */
export interface ConnectionPointHotspot extends BaseHotspot {
  type: 'connection-point';
  /** IDs of hotspots this can connect to */
  connectableTo: string[];
}

/** Region hotspot (territory, zone, area) */
export interface RegionHotspot extends BaseHotspot {
  type: 'region';
  /** Optional region category/type */
  regionType?: string;
}

/** Track space hotspot (resource track position) */
export interface TrackSpaceHotspot extends BaseHotspot {
  type: 'track-space';
  /** Position index on the track */
  trackPosition: number;
  /** Track this space belongs to */
  trackId: string;
}

/** Union type of all hotspot types */
export type Hotspot =
  | CellHotspot
  | ConnectionPointHotspot
  | RegionHotspot
  | TrackSpaceHotspot;

/** All possible hotspot type identifiers */
export type HotspotType = Hotspot['type'];

/** Visual styling for hotspots */
export interface HotspotStyle {
  /** Border color */
  borderColor?: string;
  /** Border width in pixels */
  borderWidth?: number;
  /** Background color */
  backgroundColor?: string;
  /** Background opacity (0-1) */
  backgroundOpacity?: number;
  /** Border radius for rounded corners */
  borderRadius?: number;
  /** Z-index for layering */
  zIndex?: number;
}

/** Constraint function type for custom hotspot rules */
export type HotspotConstraint = (
  hotspot: Hotspot,
  mark: Mark,
  allHotspots: Hotspot[]
) => boolean | string; // true if valid, false or error message if invalid
