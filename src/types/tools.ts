import { MarkType, MarkPermanence } from './marks'

/**
 * Tool Types - The currently selected marking instrument
 */

/**
 * Tool configuration
 */
export interface Tool {
  id: string
  type: MarkType
  label: string
  icon?: string
  permanence?: MarkPermanence

  /** Tool-specific configuration */
  config?: ToolConfig
}

/**
 * Tool-specific configuration options
 */
export interface ToolConfig {
  // For number tool
  defaultNumber?: number
  numberRange?: { min: number; max: number }

  // For color tool
  color?: string
  opacity?: number

  // For symbol tool
  symbol?: string

  // For text tool
  fontSize?: number
  alignment?: 'left' | 'center' | 'right'

  // For line tool
  lineStyle?: 'solid' | 'dashed' | 'dotted'
  lineWidth?: number
  lineColor?: string
}

/**
 * Tool palette state
 */
export interface ToolPaletteState {
  availableTools: Tool[]
  selectedToolId: string
  recentlyUsed: string[] // tool IDs
}
