/**
 * Sheet and Hotspot Types - Define game boards and interactive regions
 */

import type { MarkType } from './marks';

/**
 * Layout types for sheets
 */
export type LayoutType = 'grid' | 'image-overlay' | 'freeform' | 'mixed';

/**
 * Hotspot shape types
 */
export type HotspotShape = 'rectangle' | 'circle' | 'polygon' | 'point';

/**
 * Position in 2D space
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
 * Hotspot constraint configuration
 */
export interface HotspotConstraints {
  allowedMarkTypes: MarkType[];
  maxMarks?: number; // Max number of marks (undefined = unlimited)
  requireSequence?: boolean; // Must mark in order
  canUnmark?: boolean; // Can remove marks after placing
  defaultValue?: unknown;
  isReadOnly?: boolean;
  condition?: string; // Conditional availability (evaluated at runtime)
}

/**
 * Base hotspot definition
 */
export interface Hotspot {
  id: string;
  sheetId: string;
  shape: HotspotShape;
  position: Position;
  size?: Size; // For rectangles
  radius?: number; // For circles
  vertices?: Position[]; // For polygons
  constraints: HotspotConstraints;
  label?: string;
  group?: string; // Group ID for related hotspots
  zIndex?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Grid layout configuration
 */
export interface GridLayout {
  type: 'grid';
  rows: number;
  columns: number;
  cellSize?: number | 'auto';
  gap?: number;
  offset?: Position;
  backgroundColor?: string;
  defaultConstraints: HotspotConstraints;
}

/**
 * Image overlay layout configuration
 */
export interface ImageOverlayLayout {
  type: 'image-overlay';
  imageUrl: string;
  aspectRatio?: number;
  fitMode?: 'contain' | 'cover' | 'stretch';
  hotspots: Hotspot[];
}

/**
 * Freeform layout configuration
 */
export interface FreeformLayout {
  type: 'freeform';
  size: Size;
  hotspots: Hotspot[];
  backgroundColor?: string;
}

/**
 * Mixed layout configuration (combines multiple regions)
 */
export interface MixedLayout {
  type: 'mixed';
  size: Size;
  regions: Region[];
}

/**
 * Region in a mixed layout
 */
export interface Region {
  id: string;
  type: 'grid' | 'image-overlay' | 'freeform' | 'track' | 'territory';
  position: Position;
  layout: GridLayout | ImageOverlayLayout | FreeformLayout | TrackLayout | TerritoryLayout;
  zIndex?: number;
  label?: string;
}

/**
 * Track layout for resource tracks, progress bars, etc.
 */
export interface TrackLayout {
  type: 'track';
  spaces: number;
  orientation?: 'horizontal' | 'vertical' | 'custom';
  path?: Position[]; // Custom curved path
  spaceSize?: number;
  gap?: number;
  direction?: 'forward' | 'backward' | 'bidirectional';
  defaultConstraints: HotspotConstraints;
}

/**
 * Territory layout for area control games
 */
export interface TerritoryLayout {
  type: 'territory';
  territories: Territory[];
}

/**
 * Territory definition
 */
export interface Territory {
  id: string;
  vertices: Position[];
  constraints: HotspotConstraints;
  label?: string;
  value?: number;
  borderColor?: string;
  borderWidth?: number;
}

/**
 * Sheet definition
 */
export interface SheetDefinition {
  id: string;
  name: string;
  layout: GridLayout | ImageOverlayLayout | FreeformLayout | MixedLayout;
  order?: number; // Display order in multi-sheet games
  description?: string;
}

/**
 * Sheet state (runtime)
 */
export interface SheetState {
  id: string;
  hotspots: Hotspot[];
  marks: Map<string, string[]>; // hotspotId -> markIds
}
