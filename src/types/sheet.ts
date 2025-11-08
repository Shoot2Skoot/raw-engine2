/**
 * Sheet types - game boards/scorecards that players mark up
 */

import type { Hotspot, HotspotState } from './hotspot';
import type { MarkType } from './marks';

/** Layout type for a sheet */
export type SheetLayoutType = 'grid' | 'image-overlay' | 'custom';

/** Grid configuration for auto-generating hotspots */
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
  /** Starting X position */
  offsetX: number;
  /** Starting Y position */
  offsetY: number;
  /** Background color for grid */
  backgroundColor?: string;
  /** Default mark types allowed in all cells */
  allowedMarkTypes: MarkType[];
  /** Whether cells can have multiple marks */
  multiMark: boolean;
}

/** Image overlay configuration */
export interface ImageOverlayConfig {
  /** Image URL or data URI */
  imageUrl: string;
  /** Image width in pixels */
  width: number;
  /** Image height in pixels */
  height: number;
  /** Whether to maintain aspect ratio */
  maintainAspectRatio: boolean;
}

/** Resource track configuration (linear sequence of hotspots) */
export interface ResourceTrackConfig {
  /** Number of spaces on the track */
  spaces: number;
  /** Track orientation */
  orientation: 'horizontal' | 'vertical';
  /** Starting position */
  startPosition: { x: number; y: number };
  /** Space size */
  spaceSize: number;
  /** Gap between spaces */
  gap: number;
  /** Allowed mark types */
  allowedMarkTypes: MarkType[];
  /** Labels for specific positions */
  labels?: Record<number, string>;
}

/** Region/territory configuration */
export interface RegionConfig {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Hotspots that make up this region */
  hotspots: Hotspot[];
  /** Visual properties */
  borderColor?: string;
  borderWidth?: number;
  backgroundColor?: string;
}

/** Base sheet configuration */
export interface BaseSheet {
  /** Unique identifier for this sheet */
  id: string;
  /** Display name */
  name: string;
  /** Sheet dimensions */
  width: number;
  height: number;
  /** Background color */
  backgroundColor?: string;
  /** Background image (optional) */
  backgroundImage?: string;
}

/** Grid-based sheet */
export interface GridSheet extends BaseSheet {
  type: 'grid';
  /** Grid configuration (auto-generates hotspots) */
  gridConfig: GridConfig;
  /** Additional custom hotspots beyond the grid */
  customHotspots?: Hotspot[];
}

/** Image overlay sheet */
export interface ImageOverlaySheet extends BaseSheet {
  type: 'image-overlay';
  /** Image configuration */
  imageConfig: ImageOverlayConfig;
  /** Hotspots positioned over the image */
  hotspots: Hotspot[];
}

/** Custom layout sheet */
export interface CustomSheet extends BaseSheet {
  type: 'custom';
  /** All hotspots manually defined */
  hotspots: Hotspot[];
  /** Optional regions grouping hotspots */
  regions?: RegionConfig[];
  /** Optional resource tracks */
  tracks?: ResourceTrackConfig[];
}

/** Union type of all sheet types */
export type Sheet = GridSheet | ImageOverlaySheet | CustomSheet;

/** Sheet state including all marks */
export interface SheetState {
  /** The sheet configuration */
  sheet: Sheet;
  /** Current state of all hotspots */
  hotspots: Map<string, HotspotState>;
  /** Currently active sheet */
  isActive: boolean;
}

/** Helper to generate hotspots from a grid config */
export function generateGridHotspots(config: GridConfig): Hotspot[] {
  const hotspots: Hotspot[] = [];
  const cellWidth = config.cellWidth === 'auto' ? 50 : config.cellWidth;
  const cellHeight = config.cellHeight === 'auto' ? 50 : config.cellHeight;

  for (let row = 0; row < config.rows; row++) {
    for (let col = 0; col < config.columns; col++) {
      const x = config.offsetX + col * (cellWidth + config.gap);
      const y = config.offsetY + row * (cellHeight + config.gap);

      hotspots.push({
        id: `cell-${row}-${col}`,
        shape: 'rectangle',
        bounds: { x, y, width: cellWidth, height: cellHeight },
        allowedMarkTypes: config.allowedMarkTypes,
        maxMarks: config.multiMark ? undefined : 1,
        enabled: true,
        erasable: true,
        zIndex: 0,
      });
    }
  }

  return hotspots;
}

/** Helper to generate hotspots from a resource track config */
export function generateTrackHotspots(config: ResourceTrackConfig): Hotspot[] {
  const hotspots: Hotspot[] = [];
  const isHorizontal = config.orientation === 'horizontal';

  for (let i = 0; i < config.spaces; i++) {
    const x = isHorizontal
      ? config.startPosition.x + i * (config.spaceSize + config.gap)
      : config.startPosition.x;
    const y = isHorizontal
      ? config.startPosition.y
      : config.startPosition.y + i * (config.spaceSize + config.gap);

    hotspots.push({
      id: `track-${i}`,
      label: config.labels?.[i],
      shape: 'rectangle',
      bounds: {
        x,
        y,
        width: config.spaceSize,
        height: config.spaceSize,
      },
      allowedMarkTypes: config.allowedMarkTypes,
      maxMarks: 1,
      enabled: true,
      erasable: true,
      zIndex: 0,
    });
  }

  return hotspots;
}
