/**
 * Sheet Types - Defines sheet layouts, hotspots, and configurations
 */

import type { MarkType } from './marks';

export type Position = {
  x: number;
  y: number;
};

export type HotspotShape = 'rect' | 'circle' | 'polygon';

export interface BaseHotspot {
  id: string;
  sheetId: string;
  shape: HotspotShape;
  allowedMarks: MarkType[];
  maxMarks?: number; // Default: 1, undefined = unlimited
  disabled?: boolean;
  readOnly?: boolean;
}

export interface RectHotspot extends BaseHotspot {
  shape: 'rect';
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CircleHotspot extends BaseHotspot {
  shape: 'circle';
  centerX: number;
  centerY: number;
  radius: number;
}

export interface PolygonHotspot extends BaseHotspot {
  shape: 'polygon';
  points: Position[];
}

export type Hotspot = RectHotspot | CircleHotspot | PolygonHotspot;

export type LayoutType = 'grid' | 'image' | 'mixed' | 'track' | 'tree' | 'connection';

export interface GridLayoutConfig {
  type: 'grid';
  rows: number;
  columns: number;
  cellSize?: number; // pixels, auto-calculated if not provided
  gap?: number; // pixels, default: 2
  offsetX?: number; // pixels, default: 0
  offsetY?: number; // pixels, default: 0
  backgroundColor?: string;
  allowedMarks: MarkType[]; // Default allowed marks for all cells
}

export interface ImageLayoutConfig {
  type: 'image';
  imageUrl: string;
  width: number;
  height: number;
  maintainAspectRatio?: boolean; // Default: true
}

export interface TrackLayoutConfig {
  type: 'track';
  spaces: number;
  orientation?: 'horizontal' | 'vertical' | 'custom';
  path?: Position[]; // For custom curved tracks
  spaceSize?: number;
  gap?: number;
  allowedMarks: MarkType[];
}

export interface TreeLayoutConfig {
  type: 'tree';
  layout?: 'vertical' | 'horizontal' | 'radial';
  nodes: TreeNode[];
}

export interface TreeNode {
  id: string;
  label: string;
  prerequisites?: string[]; // IDs of required nodes
  position?: Position; // Custom position if not auto-layout
  allowedMarks: MarkType[];
}

export interface ConnectionLayoutConfig {
  type: 'connection';
  rows: number;
  columns: number;
  pointSize?: number;
  gap?: number;
  allowDiagonal?: boolean;
}

export interface MixedLayoutConfig {
  type: 'mixed';
  regions: LayoutRegion[];
}

export interface LayoutRegion {
  id: string;
  config: GridLayoutConfig | ImageLayoutConfig | TrackLayoutConfig;
  position: Position;
  zIndex?: number;
}

export type LayoutConfig =
  | GridLayoutConfig
  | ImageLayoutConfig
  | TrackLayoutConfig
  | TreeLayoutConfig
  | ConnectionLayoutConfig
  | MixedLayoutConfig;

export interface Sheet {
  id: string;
  name: string;
  layout: LayoutConfig;
  hotspots: Hotspot[];
  backgroundColor?: string;
  backgroundImage?: string;
}
