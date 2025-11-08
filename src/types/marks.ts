/**
 * Mark Types - Different ways players can mark hotspots on sheets
 */

/** Base mark type that all marks extend from */
export interface BaseMark {
  type: MarkType;
  timestamp: number;
}

/** Mark type enumeration */
export type MarkType = 'checkbox' | 'number' | 'color' | 'circle' | 'symbol' | 'text' | 'line';

/** Checkbox mark with three states: empty, checked, crossed */
export interface CheckboxMark extends BaseMark {
  type: 'checkbox';
  state: 'empty' | 'checked' | 'crossed';
}

/** Number mark for entering numeric values */
export interface NumberMark extends BaseMark {
  type: 'number';
  value: number;
  /** Whether this is a temporary (pencil) or permanent (pen) mark */
  temporary?: boolean;
}

/** Color fill mark for claiming territories or marking terrain types */
export interface ColorMark extends BaseMark {
  type: 'color';
  color: string; // hex color code
  opacity?: number; // 0-1, default 0.5
}

/** Circle mark with three fill levels: empty, half, full */
export interface CircleMark extends BaseMark {
  type: 'circle';
  state: 'empty' | 'half' | 'full';
}

/** Symbol/icon mark for resource types or categories */
export interface SymbolMark extends BaseMark {
  type: 'symbol';
  symbol: string; // icon name from Lucide React
  color?: string;
}

/** Text entry mark for notes or custom labels */
export interface TextMark extends BaseMark {
  type: 'text';
  value: string;
  temporary?: boolean;
}

/** Line/connection mark for drawing routes between points */
export interface LineMark extends BaseMark {
  type: 'line';
  from: string; // hotspot ID
  to: string; // hotspot ID
  style?: 'solid' | 'dashed' | 'dotted';
  color?: string;
  thickness?: number; // 1-5px
}

/** Union type of all mark types */
export type Mark = CheckboxMark | NumberMark | ColorMark | CircleMark | SymbolMark | TextMark | LineMark;

/** Configuration for what mark types are allowed in a hotspot */
export interface MarkConstraints {
  /** Which mark types are allowed */
  allowedTypes: MarkType[];
  /** Maximum number of marks allowed (default: 1) */
  maxMarks?: number;
  /** For number marks: min/max values */
  numberRange?: { min: number; max: number };
  /** For color marks: available color palette */
  colorPalette?: string[];
  /** For symbol marks: available symbols */
  symbolPalette?: string[];
  /** Can marks be removed/changed after placement */
  erasable?: boolean;
}
