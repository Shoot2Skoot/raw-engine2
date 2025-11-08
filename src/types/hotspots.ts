import { AllowedMarkTypes } from './marks'

/**
 * Hotspot Types - Interactive regions on sheets where marks can be placed
 */

/**
 * Position in 2D space (pixels or percentage)
 */
export interface Position {
  x: number
  y: number
}

/**
 * Size dimensions
 */
export interface Size {
  width: number
  height: number
}

/**
 * Rectangular hotspot shape
 */
export interface RectangularShape {
  type: 'rectangle'
  position: Position
  size: Size
}

/**
 * Circular hotspot shape
 */
export interface CircularShape {
  type: 'circle'
  center: Position
  radius: number
}

/**
 * Polygonal hotspot shape
 */
export interface PolygonalShape {
  type: 'polygon'
  vertices: Position[]
}

/**
 * Union of all hotspot shapes
 */
export type HotspotShape = RectangularShape | CircularShape | PolygonalShape

/**
 * Constraints on what can be marked in a hotspot
 */
export interface HotspotConstraints {
  /** Which mark types are allowed */
  allowedMarkTypes: AllowedMarkTypes

  /** Maximum number of marks allowed (undefined = unlimited) */
  maxMarks?: number

  /** Minimum value for number marks */
  minValue?: number

  /** Maximum value for number marks */
  maxValue?: number

  /** Available colors for color marks */
  availableColors?: string[]

  /** Available symbols for symbol marks */
  availableSymbols?: string[]

  /** Is the hotspot currently enabled/interactive */
  enabled?: boolean

  /** Is the hotspot read-only (display only) */
  readOnly?: boolean

  /** Default value for new marks */
  defaultValue?: string | number
}

/**
 * Hotspot definition
 */
export interface Hotspot {
  id: string
  shape: HotspotShape
  constraints: HotspotConstraints

  /** Visual appearance */
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number

  /** Z-index for layering */
  zIndex?: number

  /** Label or name for this hotspot */
  label?: string

  /** Group ID for related hotspots */
  groupId?: string

  /** Custom data for game-specific logic */
  metadata?: Record<string, unknown>
}

/**
 * Hotspot with current marks
 */
export interface HotspotState extends Hotspot {
  markIds: string[]
}
