/**
 * Mark Types - Different ways players can mark cells/hotspots
 */

export type MarkType =
  | 'checkbox'
  | 'number'
  | 'color'
  | 'symbol'
  | 'circle'
  | 'text'
  | 'line'
  | 'fill';

/**
 * Checkbox states: empty, checked, or crossed
 */
export type CheckboxState = 'empty' | 'checked' | 'crossed';

/**
 * Circle fill states: empty, half-filled, or full
 */
export type CircleState = 'empty' | 'half' | 'full';

/**
 * Base mark interface - all marks extend this
 */
export interface BaseMark {
  id: string;
  hotspotId: string;
  type: MarkType;
  timestamp: number;
  isPencil?: boolean; // Temporary vs permanent mark
}

/**
 * Checkbox mark
 */
export interface CheckboxMark extends BaseMark {
  type: 'checkbox';
  state: CheckboxState;
}

/**
 * Number mark
 */
export interface NumberMark extends BaseMark {
  type: 'number';
  value: number;
  minValue?: number;
  maxValue?: number;
}

/**
 * Color fill mark
 */
export interface ColorMark extends BaseMark {
  type: 'color';
  color: string; // Hex color
  opacity?: number; // 0-1
}

/**
 * Symbol/Icon mark
 */
export interface SymbolMark extends BaseMark {
  type: 'symbol';
  symbol: string; // Icon name or Unicode character
  color?: string;
}

/**
 * Circle mark with fill levels
 */
export interface CircleMark extends BaseMark {
  type: 'circle';
  state: CircleState;
}

/**
 * Text mark
 */
export interface TextMark extends BaseMark {
  type: 'text';
  text: string;
  maxLength?: number;
}

/**
 * Line/Connection mark between two points
 */
export interface LineMark extends BaseMark {
  type: 'line';
  fromHotspotId: string;
  toHotspotId: string;
  lineStyle?: 'solid' | 'dashed' | 'railroad' | 'road';
  color?: string;
  thickness?: number;
}

/**
 * Area/Region fill mark
 */
export interface FillMark extends BaseMark {
  type: 'fill';
  hotspotIds: string[]; // Multiple hotspots filled together
  color: string;
  pattern?: 'solid' | 'striped' | 'dotted';
}

/**
 * Union type for all mark types
 */
export type Mark =
  | CheckboxMark
  | NumberMark
  | ColorMark
  | SymbolMark
  | CircleMark
  | TextMark
  | LineMark
  | FillMark;

/**
 * Tool configuration for marking
 */
export interface ToolConfig {
  type: MarkType;
  label: string;
  icon: string; // Icon component name
  defaultValue?: unknown;
  options?: {
    colors?: string[]; // Color palette for color marks
    symbols?: string[]; // Symbol palette for symbol marks
    minValue?: number; // For number marks
    maxValue?: number; // For number marks
  };
}
