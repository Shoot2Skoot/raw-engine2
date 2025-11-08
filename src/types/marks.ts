/**
 * Mark Types - Different ways players can mark cells/hotspots
 */

/**
 * Checkbox states: empty, checked, or crossed
 */
export type CheckboxState = 'empty' | 'checked' | 'crossed'

/**
 * Circle fill states: empty, half-filled, or full
 */
export type CircleState = 'empty' | 'half' | 'full'

/**
 * Mark permanence: pencil marks can be easily erased, pen marks are more permanent
 */
export type MarkPermanence = 'pencil' | 'pen'

/**
 * Base mark interface - all marks extend this
 */
export interface BaseMark {
  id: string
  hotspotId: string
  permanence: MarkPermanence
  timestamp: number
}

/**
 * Checkbox mark (empty/checked/crossed)
 */
export interface CheckboxMark extends BaseMark {
  type: 'checkbox'
  state: CheckboxState
}

/**
 * Number mark (0-999)
 */
export interface NumberMark extends BaseMark {
  type: 'number'
  value: number
}

/**
 * Color fill mark
 */
export interface ColorMark extends BaseMark {
  type: 'color'
  color: string // hex color code
  opacity?: number // 0-1, default 0.5
}

/**
 * Circle mark (empty/half/full)
 */
export interface CircleMark extends BaseMark {
  type: 'circle'
  state: CircleState
}

/**
 * Symbol/icon mark
 */
export interface SymbolMark extends BaseMark {
  type: 'symbol'
  symbol: string // icon name or Unicode symbol
  color?: string
}

/**
 * Text mark (freeform text)
 */
export interface TextMark extends BaseMark {
  type: 'text'
  text: string
  fontSize?: number
  alignment?: 'left' | 'center' | 'right'
}

/**
 * Line/connection mark between two points
 */
export interface LineMark extends BaseMark {
  type: 'line'
  fromHotspotId: string
  toHotspotId: string
  lineStyle?: 'solid' | 'dashed' | 'dotted'
  lineWidth?: number
  color?: string
}

/**
 * Union type of all mark types
 */
export type Mark =
  | CheckboxMark
  | NumberMark
  | ColorMark
  | CircleMark
  | SymbolMark
  | TextMark
  | LineMark

/**
 * Mark type identifier
 */
export type MarkType = Mark['type']

/**
 * Allowed mark types for a hotspot
 */
export type AllowedMarkTypes = MarkType[]
