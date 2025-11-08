import { Hotspot, Position, Size } from './hotspots'
import { AllowedMarkTypes } from './marks'

/**
 * Sheet Types - Game boards/scorecards that players mark up
 */

/**
 * Grid layout configuration
 */
export interface GridLayout {
  type: 'grid'
  rows: number
  columns: number
  cellSize?: Size | 'auto'
  gap?: number
  startPosition?: Position
  backgroundColor?: string
  allowedMarkTypes?: AllowedMarkTypes
}

/**
 * Image-based layout with background image
 */
export interface ImageLayout {
  type: 'image'
  imageUrl: string
  imageSize?: Size
  aspectRatio?: 'preserve' | 'stretch' | 'cover'
  backgroundColor?: string
}

/**
 * Freeform layout with custom positioned hotspots
 */
export interface FreeformLayout {
  type: 'freeform'
  size: Size
  backgroundColor?: string
}

/**
 * Resource track layout (linear or curved path)
 */
export interface ResourceTrackLayout {
  type: 'track'
  spaces: number
  orientation?: 'horizontal' | 'vertical' | 'custom'
  path?: Position[] // for custom curved paths
  spaceSize?: Size
  gap?: number
  startPosition?: Position
  allowedMarkTypes?: AllowedMarkTypes
  showPositionNumbers?: boolean
}

/**
 * Union of all layout types
 */
export type SheetLayout = GridLayout | ImageLayout | FreeformLayout | ResourceTrackLayout

/**
 * Region definition - a collection of related hotspots
 */
export interface Region {
  id: string
  label: string
  hotspots: Hotspot[]
  layout?: SheetLayout
  position?: Position
  size?: Size
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  zIndex?: number
}

/**
 * Sheet definition
 */
export interface SheetDefinition {
  id: string
  name: string
  size: Size
  backgroundColor?: string

  /** Primary layout for the sheet */
  layout?: SheetLayout

  /** Regions on this sheet */
  regions: Region[]

  /** Individual hotspots not part of any region */
  hotspots: Hotspot[]

  /** Background image URL */
  backgroundImage?: string

  /** Custom metadata */
  metadata?: Record<string, unknown>
}

/**
 * Sheet state (definition + current marks)
 */
export interface SheetState {
  definition: SheetDefinition
  markIds: string[] // IDs of marks on this sheet
}

/**
 * Multi-sheet game configuration
 */
export interface MultiSheetConfig {
  sheets: SheetDefinition[]
  currentSheetIndex: number
}
