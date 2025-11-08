/**
 * Sheet and Hotspot Types
 * Defines the structure of game sheets and interactive areas
 */

import { MarkType } from './marks';

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

/** Hotspot shape types */
export type HotspotShape = 'rectangle' | 'circle' | 'polygon';

/** Base hotspot properties */
export interface BaseHotspot {
  id: string;
  shape: HotspotShape;
  allowedMarkTypes: MarkType[];
  maxMarks: number; // maximum marks allowed (1 for most cases, N for combinations)
  canUnmark: boolean; // whether marks can be removed after placement
  isEnabled: boolean; // can be disabled based on game state
  metadata?: Record<string, unknown>; // custom data for game-specific logic
}

/** Rectangular hotspot */
export interface RectangleHotspot extends BaseHotspot {
  shape: 'rectangle';
  position: Position;
  dimensions: Dimensions;
}

/** Circular hotspot */
export interface CircleHotspot extends BaseHotspot {
  shape: 'circle';
  center: Position;
  radius: number;
}

/** Polygonal hotspot */
export interface PolygonHotspot extends BaseHotspot {
  shape: 'polygon';
  vertices: Position[];
}

/** Union type of all hotspot shapes */
export type Hotspot = RectangleHotspot | CircleHotspot | PolygonHotspot;

/** Grid configuration for auto-generating hotspots */
export interface GridConfig {
  rows: number;
  columns: number;
  cellWidth: number;
  cellHeight: number;
  gap: number; // spacing between cells
  startPosition: Position;
  allowedMarkTypes: MarkType[];
  maxMarks?: number;
  canUnmark?: boolean;
}

/** Image background configuration */
export interface ImageBackground {
  url: string;
  width: number;
  height: number;
  maintainAspectRatio: boolean;
}

/** Sheet layout type */
export type SheetLayout = 'grid' | 'image-overlay' | 'freeform' | 'mixed';

/** Region - a logical grouping of hotspots */
export interface Region {
  id: string;
  name: string;
  hotspotIds: string[];
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  zIndex?: number;
}

/** Sheet definition */
export interface SheetDefinition {
  id: string;
  name: string;
  layout: SheetLayout;
  dimensions: Dimensions;
  background?: ImageBackground | string; // image or solid color
  hotspots: Hotspot[];
  regions?: Region[];
  gridConfig?: GridConfig; // for grid-based layouts
}
