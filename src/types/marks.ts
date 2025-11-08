/**
 * Mark Types
 * Defines all possible marks that can be placed on hotspots
 */

/** Checkbox state: empty, checked, or crossed */
export type CheckboxState = 'empty' | 'checked' | 'crossed';

/** Circle fill state: empty, half-filled, or full */
export type CircleFillState = 'empty' | 'half' | 'full';

/** Base mark interface - all marks extend this */
export interface BaseMark {
  /** Unique identifier for this mark instance */
  id: string;
  /** Type of mark */
  type: MarkType;
  /** Whether this is a temporary (pencil) or permanent (pen) mark */
  mode: 'pencil' | 'pen';
  /** Timestamp when mark was created */
  timestamp: number;
}

/** Checkbox mark (empty/checked/crossed) */
export interface CheckboxMark extends BaseMark {
  type: 'checkbox';
  state: CheckboxState;
}

/** Number mark (single or multi-digit) */
export interface NumberMark extends BaseMark {
  type: 'number';
  value: number;
}

/** Color fill mark */
export interface ColorMark extends BaseMark {
  type: 'color';
  /** Hex color code (e.g., "#ff0000") */
  color: string;
  /** Opacity from 0.1 to 1.0 */
  opacity: number;
}

/** Circle mark (empty/half/full) */
export interface CircleMark extends BaseMark {
  type: 'circle';
  state: CircleFillState;
}

/** Symbol/icon mark */
export interface SymbolMark extends BaseMark {
  type: 'symbol';
  /** Symbol identifier (e.g., "star", "diamond", "heart") */
  symbolId: string;
  /** Optional color override */
  color?: string;
}

/** Text mark (freeform text entry) */
export interface TextMark extends BaseMark {
  type: 'text';
  text: string;
}

/** Line/connection mark between two points */
export interface LineMark extends BaseMark {
  type: 'line';
  /** Starting hotspot ID */
  fromHotspotId: string;
  /** Ending hotspot ID */
  toHotspotId: string;
  /** Line style (color, dash pattern, etc.) */
  style: LineStyle;
}

/** Line style configuration */
export interface LineStyle {
  /** Line color (hex code) */
  color: string;
  /** Line thickness in pixels */
  thickness: number;
  /** Dash pattern (empty array = solid line) */
  dashPattern: number[];
}

/** Union type of all mark types */
export type Mark =
  | CheckboxMark
  | NumberMark
  | ColorMark
  | CircleMark
  | SymbolMark
  | TextMark
  | LineMark;

/** All possible mark type identifiers */
export type MarkType = Mark['type'];

/** Mark configuration - defines what marks are allowed in a hotspot */
export interface MarkConfig {
  /** Allowed mark types for this hotspot */
  allowedTypes: MarkType[];
  /** Maximum number of marks allowed (0 = unlimited) */
  maxMarks: number;
  /** For number marks: minimum allowed value */
  minValue?: number;
  /** For number marks: maximum allowed value */
  maxValue?: number;
  /** For color marks: allowed color palette */
  allowedColors?: string[];
  /** For symbol marks: allowed symbols */
  allowedSymbols?: string[];
  /** Whether marks can be removed after placement */
  canRemove: boolean;
  /** Default mark mode (pencil or pen) */
  defaultMode: 'pencil' | 'pen';
}
