/**
 * Sheet Types
 * Game boards/scorecards that players mark up
 */

import type { Hotspot, Region } from './hotspots';
import type { MarkConstraints } from './marks';

/** Layout type for sheet structure */
export type LayoutType = 'grid' | 'freeform' | 'image-overlay' | 'mixed';

/** Grid layout configuration */
export interface GridLayout {
  type: 'grid';
  rows: number;
  columns: number;
  cellSize?: number; // Size in pixels, or auto-calculate
  gap?: number; // Spacing between cells (0-20px)
  startPosition?: { x: number; y: number }; // Grid offset
  backgroundColor?: string;
  defaultConstraints: MarkConstraints; // Applied to all cells
}

/** Freeform layout configuration */
export interface FreeformLayout {
  type: 'freeform';
  dimensions: { width: number; height: number };
  hotspots: Hotspot[]; // Manually defined hotspots
}

/** Image overlay layout configuration */
export interface ImageOverlayLayout {
  type: 'image-overlay';
  backgroundImage: string; // URL or path to image
  imageSize: { width: number; height: number };
  maintainAspectRatio?: boolean;
  hotspots: Hotspot[]; // Hotspots positioned over image
}

/** Mixed layout combining multiple layout types */
export interface MixedLayout {
  type: 'mixed';
  dimensions: { width: number; height: number };
  grids?: Array<GridLayout & { position: { x: number; y: number } }>;
  hotspots?: Hotspot[];
  backgroundImage?: string;
}

/** Union type of all layouts */
export type Layout = GridLayout | FreeformLayout | ImageOverlayLayout | MixedLayout;

/** Sheet definition */
export interface Sheet {
  id: string;
  name: string;
  layout: Layout;
  regions?: Region[];
  metadata?: Record<string, unknown>;
}

/** Sheet configuration for multi-sheet games */
export interface SheetConfig {
  sheets: Sheet[];
  initialSheetId?: string; // Which sheet to show first
  sharedDice?: boolean; // Share dice pools across sheets
  sharedCards?: boolean; // Share card decks across sheets
}
