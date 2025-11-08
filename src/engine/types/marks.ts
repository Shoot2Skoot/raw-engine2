/**
 * Mark Types - Different ways players can mark their sheets
 */

/** Checkbox states: empty, checked, or crossed */
export type CheckboxState = 'empty' | 'checked' | 'crossed';

/** Circle fill states: empty, half-filled, or completely filled */
export type CircleState = 'empty' | 'half' | 'full';

/** Mark permanence: pencil (temporary) or pen (permanent) */
export type MarkPermanence = 'pencil' | 'pen';

/**
 * Checkbox mark - cycles through empty → checked → crossed
 */
export interface CheckboxMark {
  type: 'checkbox';
  state: CheckboxState;
  permanence: MarkPermanence;
}

/**
 * Number mark - displays a numeric value
 */
export interface NumberMark {
  type: 'number';
  value: number;
  permanence: MarkPermanence;
  /** Optional constraints */
  min?: number;
  max?: number;
}

/**
 * Color fill mark - fills area with specified color
 */
export interface ColorMark {
  type: 'color';
  color: string; // hex color or color name
  opacity?: number; // 0-1, default 0.5
  permanence: MarkPermanence;
}

/**
 * Circle mark - shows fill level
 */
export interface CircleMark {
  type: 'circle';
  state: CircleState;
  permanence: MarkPermanence;
}

/**
 * Symbol/icon mark
 */
export interface SymbolMark {
  type: 'symbol';
  symbol: string; // icon name from Lucide or custom
  color?: string;
  permanence: MarkPermanence;
}

/**
 * Text mark - freeform text entry
 */
export interface TextMark {
  type: 'text';
  text: string;
  maxLength?: number;
  permanence: MarkPermanence;
}

/**
 * Line/connection mark between two points
 */
export interface LineMark {
  type: 'line';
  from: string; // hotspot ID
  to: string; // hotspot ID
  style?: 'solid' | 'dashed' | 'dotted';
  color?: string;
  thickness?: number;
  permanence: MarkPermanence;
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
  | LineMark;

/**
 * Mark type names for tool selection
 */
export type MarkType = Mark['type'];

/**
 * Multiple marks can be placed on a single hotspot
 */
export interface HotspotMarks {
  hotspotId: string;
  marks: Mark[];
}
