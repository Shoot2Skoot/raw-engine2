/**
 * Sheet Types
 * Defines game sheets and their layouts
 */

import type { Hotspot } from './hotspots';
import type { Point } from './hotspots';

/** Sheet layout types */
export type SheetLayoutType = 'grid' | 'image-overlay' | 'mixed' | 'custom';

/** Base sheet interface */
export interface BaseSheet {
  /** Unique identifier for this sheet */
  id: string;
  /** Display name for the sheet */
  name: string;
  /** Layout type */
  layoutType: SheetLayoutType;
  /** All hotspots on this sheet */
  hotspots: Hotspot[];
  /** Sheet dimensions in pixels */
  dimensions: {
    width: number;
    height: number;
  };
  /** Background styling */
  background?: BackgroundConfig;
  /** Optional metadata */
  metadata?: Record<string, unknown>;
}

/** Grid-based sheet layout */
export interface GridSheet extends BaseSheet {
  layoutType: 'grid';
  /** Grid configuration */
  grid: GridConfig;
}

/** Image overlay sheet layout */
export interface ImageOverlaySheet extends BaseSheet {
  layoutType: 'image-overlay';
  /** Background image configuration */
  image: ImageConfig;
}

/** Mixed layout sheet (combines multiple regions) */
export interface MixedSheet extends BaseSheet {
  layoutType: 'mixed';
  /** Multiple regions on this sheet */
  regions: SheetRegion[];
}

/** Custom layout sheet */
export interface CustomSheet extends BaseSheet {
  layoutType: 'custom';
  /** Custom renderer component name or function */
  customRenderer?: string;
}

/** Union type of all sheet types */
export type Sheet = GridSheet | ImageOverlaySheet | MixedSheet | CustomSheet;

/** Grid configuration */
export interface GridConfig {
  /** Number of rows */
  rows: number;
  /** Number of columns */
  columns: number;
  /** Cell width in pixels (or 'auto') */
  cellWidth: number | 'auto';
  /** Cell height in pixels (or 'auto') */
  cellHeight: number | 'auto';
  /** Gap between cells in pixels */
  gap: number;
  /** Starting position offset */
  offset?: Point;
  /** Show grid lines */
  showGridLines?: boolean;
  /** Grid line color */
  gridLineColor?: string;
  /** Grid line width */
  gridLineWidth?: number;
}

/** Image configuration */
export interface ImageConfig {
  /** Image source URL or path */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** How image should fit in the sheet */
  fit: 'contain' | 'cover' | 'fill' | 'none';
  /** Image position */
  position?: Point;
}

/** Sheet region (for mixed layouts) */
export interface SheetRegion {
  /** Region identifier */
  id: string;
  /** Region type */
  type: 'grid' | 'track' | 'territory' | 'connections' | 'custom';
  /** Region position on sheet */
  position: Point;
  /** Region dimensions */
  dimensions: {
    width: number;
    height: number;
  };
  /** Hotspots in this region */
  hotspotIds: string[];
  /** Optional region-specific config */
  config?: GridConfig | TrackConfig | TerritoryConfig | ConnectionConfig;
  /** Visual styling */
  style?: {
    borderColor?: string;
    borderWidth?: number;
    backgroundColor?: string;
    backgroundOpacity?: number;
  };
}

/** Resource track configuration */
export interface TrackConfig {
  /** Track identifier */
  trackId: string;
  /** Number of spaces on track */
  spaces: number;
  /** Track path points (for curved tracks) */
  path?: Point[];
  /** Track direction */
  direction?: 'horizontal' | 'vertical' | 'custom';
  /** Space labels */
  labels?: (string | number)[];
  /** Show space numbers */
  showNumbers?: boolean;
}

/** Territory/region map configuration */
export interface TerritoryConfig {
  /** Territory definitions */
  territories: {
    id: string;
    name?: string;
    hotspotIds: string[];
    value?: number;
    type?: string;
  }[];
}

/** Connection grid configuration */
export interface ConnectionConfig {
  /** Grid of connection points */
  points: Point[];
  /** Valid connection rules */
  connectionRules?: {
    /** Allow diagonal connections */
    allowDiagonal?: boolean;
    /** Maximum distance for valid connection */
    maxDistance?: number;
    /** Prevent line crossings */
    preventCrossings?: boolean;
  };
}

/** Background configuration */
export interface BackgroundConfig {
  /** Background color */
  color?: string;
  /** Background image */
  image?: string;
  /** Background pattern */
  pattern?: 'grid' | 'dots' | 'lines' | 'none';
}
