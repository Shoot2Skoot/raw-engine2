/**
 * Mark Types and Interfaces
 * Defines all possible mark types that can be placed on a sheet
 */

/** Checkbox mark with three possible states */
export type CheckboxState = 'empty' | 'checked' | 'crossed';

/** Circle mark with three fill levels */
export type CircleState = 'empty' | 'half' | 'full';

/** Base mark type identifier */
export type MarkType =
  | 'checkbox'
  | 'number'
  | 'color'
  | 'circle'
  | 'symbol'
  | 'text'
  | 'line';

/** Checkbox mark */
export interface CheckboxMark {
  type: 'checkbox';
  state: CheckboxState;
  isPermanent: boolean; // pen vs pencil
}

/** Number mark */
export interface NumberMark {
  type: 'number';
  value: number;
  isPermanent: boolean;
}

/** Color fill mark */
export interface ColorMark {
  type: 'color';
  color: string; // hex color code
  opacity: number; // 0-1
  isPermanent: boolean;
}

/** Circle mark */
export interface CircleMark {
  type: 'circle';
  state: CircleState;
  isPermanent: boolean;
}

/** Symbol/icon mark */
export interface SymbolMark {
  type: 'symbol';
  symbol: string; // icon name or unicode
  color?: string;
  isPermanent: boolean;
}

/** Text mark */
export interface TextMark {
  type: 'text';
  text: string;
  isPermanent: boolean;
}

/** Line/connection mark */
export interface LineMark {
  type: 'line';
  fromHotspotId: string;
  toHotspotId: string;
  style: 'solid' | 'dashed' | 'dotted';
  color: string;
  thickness: number;
  lineType?: string; // e.g., 'road', 'rail' for Railroad Ink
  isPermanent: boolean;
}

/** Union type of all possible marks */
export type Mark =
  | CheckboxMark
  | NumberMark
  | ColorMark
  | CircleMark
  | SymbolMark
  | TextMark
  | LineMark;

/** Mark with its placement information */
export interface PlacedMark {
  id: string;
  hotspotId: string;
  mark: Mark;
  timestamp: number;
}
