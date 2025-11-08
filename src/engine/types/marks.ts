/**
 * Mark Types
 * Different types of marks that can be placed on hotspots
 */

/** Base mark type that all marks extend from */
export interface BaseMark {
  id: string;
  hotspotId: string;
  createdAt: number;
  isPencil?: boolean; // Temporary vs permanent marks
}

/** Checkbox mark with three states: empty, checked, crossed */
export interface CheckboxMark extends BaseMark {
  type: 'checkbox';
  state: 'empty' | 'checked' | 'crossed';
}

/** Number mark for entering numeric values */
export interface NumberMark extends BaseMark {
  type: 'number';
  value: number;
}

/** Color fill mark for territory/region marking */
export interface ColorMark extends BaseMark {
  type: 'color';
  color: string; // Hex color code
  opacity?: number; // 0-1, default 0.5
}

/** Circle mark with three fill levels */
export interface CircleMark extends BaseMark {
  type: 'circle';
  fillLevel: 'empty' | 'half' | 'full';
}

/** Symbol/icon mark from a predefined set */
export interface SymbolMark extends BaseMark {
  type: 'symbol';
  symbol: string; // Symbol identifier (star, diamond, heart, etc.)
  color?: string;
}

/** Text mark for freeform text entry */
export interface TextMark extends BaseMark {
  type: 'text';
  text: string;
}

/** Line/connection mark between two points */
export interface LineMark extends BaseMark {
  type: 'line';
  fromHotspotId: string;
  toHotspotId: string;
  lineStyle?: 'solid' | 'dashed' | 'dotted';
  lineColor?: string;
  lineWidth?: number;
}

/** Area/region fill mark */
export interface AreaMark extends BaseMark {
  type: 'area';
  hotspotIds: string[]; // All hotspots in the filled area
  color: string;
  pattern?: string; // Optional fill pattern
}

/** Union type of all mark types */
export type Mark =
  | CheckboxMark
  | NumberMark
  | ColorMark
  | CircleMark
  | SymbolMark
  | TextMark
  | LineMark
  | AreaMark;

/** Mark type discriminator */
export type MarkType = Mark['type'];

/** Configuration for allowed mark types in a hotspot */
export interface MarkConstraints {
  allowedTypes: MarkType[];
  maxMarks?: number; // Max number of marks per hotspot, default 1
  numberRange?: { min: number; max: number }; // For number marks
  allowedColors?: string[]; // For color marks
  allowedSymbols?: string[]; // For symbol marks
  maxTextLength?: number; // For text marks
  requireSequence?: boolean; // Marks must be placed in order
  canUnmark?: boolean; // Can marks be removed? Default true
}
