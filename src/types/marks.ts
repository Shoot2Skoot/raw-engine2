/**
 * Mark types for the roll-and-write engine
 */

/** State of a checkbox mark */
export type CheckboxState = 'empty' | 'checked' | 'crossed';

/** State of a circle mark */
export type CircleState = 'empty' | 'half' | 'full';

/** Mark permanence - pencil marks are temporary/erasable, pen marks are permanent */
export type MarkMode = 'pencil' | 'pen';

/** Base interface for all marks */
export interface BaseMark {
  /** Unique identifier for this mark */
  id: string;
  /** Type of mark */
  type: MarkType;
  /** When this mark was created */
  timestamp: number;
  /** Whether this is a temporary (pencil) or permanent (pen) mark */
  mode: MarkMode;
}

/** Checkbox mark (empty/checked/crossed) */
export interface CheckboxMark extends BaseMark {
  type: 'checkbox';
  state: CheckboxState;
}

/** Number mark (0-999) */
export interface NumberMark extends BaseMark {
  type: 'number';
  value: number;
}

/** Color fill mark */
export interface ColorMark extends BaseMark {
  type: 'color';
  /** Hex color code (e.g., '#FF0000') */
  color: string;
  /** Opacity 0-1 */
  opacity: number;
}

/** Circle mark (empty/half/full) */
export interface CircleMark extends BaseMark {
  type: 'circle';
  state: CircleState;
}

/** Symbol/Icon mark */
export interface SymbolMark extends BaseMark {
  type: 'symbol';
  /** Symbol identifier (e.g., 'star', 'diamond', 'astronaut') */
  symbol: string;
  /** Optional color for the symbol */
  color?: string;
}

/** Text mark (freeform text entry) */
export interface TextMark extends BaseMark {
  type: 'text';
  /** Text content (max 50 chars) */
  text: string;
}

/** Line/connection mark between two points */
export interface LineMark extends BaseMark {
  type: 'line';
  /** Starting point hotspot ID */
  from: string;
  /** Ending point hotspot ID */
  to: string;
  /** Line style (solid, dashed, etc.) */
  style: 'solid' | 'dashed' | 'dotted';
  /** Line color */
  color?: string;
  /** Line thickness in pixels */
  thickness: number;
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

/** String literal type for mark types */
export type MarkType = Mark['type'];

/** Type guard to check if a mark is of a specific type */
export function isMarkType<T extends MarkType>(
  mark: Mark,
  type: T
): mark is Extract<Mark, { type: T }> {
  return mark.type === type;
}
