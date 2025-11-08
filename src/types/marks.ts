/**
 * Mark Types - All the different ways players can mark hotspots
 */

/**
 * Checkbox mark states: empty, checked, or crossed
 */
export type CheckboxState = 'empty' | 'checked' | 'crossed';

/**
 * Circle fill states: empty, half-filled, or full
 */
export type CircleState = 'empty' | 'half' | 'full';

/**
 * Mark permanence: pencil (temporary, lighter) or pen (permanent)
 */
export type MarkPermanence = 'pencil' | 'pen';

/**
 * Base interface for all marks
 */
export interface BaseMark {
  /** Unique identifier for this mark instance */
  id: string;
  /** Hotspot ID where this mark is placed */
  hotspotId: string;
  /** Whether this is a pencil (temporary) or pen (permanent) mark */
  permanence: MarkPermanence;
  /** Timestamp when mark was created */
  timestamp: number;
}

/**
 * Checkbox mark (empty/checked/crossed)
 */
export interface CheckboxMark extends BaseMark {
  type: 'checkbox';
  state: CheckboxState;
}

/**
 * Number mark (0-999)
 */
export interface NumberMark extends BaseMark {
  type: 'number';
  value: number;
}

/**
 * Color fill mark
 */
export interface ColorMark extends BaseMark {
  type: 'color';
  /** Hex color code */
  color: string;
  /** Opacity 0-100 */
  opacity: number;
}

/**
 * Circle mark (empty/half/full)
 */
export interface CircleMark extends BaseMark {
  type: 'circle';
  state: CircleState;
}

/**
 * Symbol/icon mark
 */
export interface SymbolMark extends BaseMark {
  type: 'symbol';
  /** Symbol identifier (from predefined palette) */
  symbolId: string;
  /** Optional color for the symbol */
  color?: string;
}

/**
 * Text mark
 */
export interface TextMark extends BaseMark {
  type: 'text';
  /** Text content (max 50 characters) */
  text: string;
}

/**
 * Line/connection mark between two points
 */
export interface LineMark extends BaseMark {
  type: 'line';
  /** Starting hotspot ID */
  fromHotspotId: string;
  /** Ending hotspot ID */
  toHotspotId: string;
  /** Line style */
  style: 'solid' | 'dashed' | 'dotted';
  /** Line color */
  color: string;
  /** Line thickness in pixels */
  thickness: number;
}

/**
 * Union type of all possible marks
 */
export type Mark =
  | CheckboxMark
  | NumberMark
  | ColorMark
  | CircleMark
  | SymbolMark
  | TextMark
  | LineMark;

/**
 * Mark type identifier
 */
export type MarkType = Mark['type'];

/**
 * Allowed mark types configuration for hotspots
 */
export interface MarkTypeConfig {
  /** Which mark types are allowed */
  allowedTypes: MarkType[];
  /** Maximum number of marks allowed (undefined = unlimited) */
  maxMarks?: number;
  /** For number marks: min value */
  numberMin?: number;
  /** For number marks: max value */
  numberMax?: number;
  /** For color marks: available colors */
  colorPalette?: string[];
  /** For symbol marks: available symbols */
  symbolPalette?: string[];
  /** Whether marks can be erased after placement */
  erasable?: boolean;
}
