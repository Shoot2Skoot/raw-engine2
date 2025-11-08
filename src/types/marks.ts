/**
 * Mark type definitions - representing player actions on the sheet
 */

import type { Color, ID, MarkType } from './core';

/**
 * Checkbox mark states
 */
export const CheckboxState = {
  Empty: 'empty',
  Checked: 'checked',
  Crossed: 'crossed',
} as const;

export type CheckboxState = (typeof CheckboxState)[keyof typeof CheckboxState];

/**
 * Checkbox mark
 */
export interface CheckboxMark {
  type: 'checkbox';
  state: CheckboxState;
  /** Whether this is a temporary (pencil) mark */
  temporary?: boolean;
}

/**
 * Number mark
 */
export interface NumberMark {
  type: 'number';
  value: number;
  /** Number range constraints */
  min?: number;
  max?: number;
  /** Whether this is a temporary (pencil) mark */
  temporary?: boolean;
}

/**
 * Color fill mark
 */
export interface ColorFillMark {
  type: 'color-fill';
  color: Color;
  /** Opacity (0-1) */
  opacity?: number;
  /** Whether this is a temporary (pencil) mark */
  temporary?: boolean;
}

/**
 * Circle mark states
 */
export const CircleState = {
  Empty: 'empty',
  Half: 'half',
  Full: 'full',
} as const;

export type CircleState = (typeof CircleState)[keyof typeof CircleState];

/**
 * Circle mark
 */
export interface CircleMark {
  type: 'circle';
  state: CircleState;
  /** Which half is filled (for half state) */
  halfFillDirection?: 'left' | 'right' | 'top' | 'bottom';
  /** Whether this is a temporary (pencil) mark */
  temporary?: boolean;
}

/**
 * Symbol/icon mark
 */
export interface SymbolMark {
  type: 'symbol';
  /** Symbol identifier (e.g., 'star', 'diamond', 'custom-icon-1') */
  symbolId: string;
  /** Symbol color */
  color?: Color;
  /** Symbol size multiplier */
  scale?: number;
  /** Whether this is a temporary (pencil) mark */
  temporary?: boolean;
}

/**
 * Text mark
 */
export interface TextMark {
  type: 'text';
  value: string;
  /** Maximum character length */
  maxLength?: number;
  /** Text alignment */
  alignment?: 'left' | 'center' | 'right';
  /** Font size */
  fontSize?: number;
  /** Whether this is a temporary (pencil) mark */
  temporary?: boolean;
}

/**
 * Line/connection mark
 */
export interface LineMark {
  type: 'line';
  /** Start hotspot ID */
  from: ID;
  /** End hotspot ID */
  to: ID;
  /** Line style */
  style?: {
    color?: Color;
    thickness?: number;
    dashPattern?: number[];
  };
  /** Line type identifier (e.g., 'road', 'rail', 'pipe') */
  lineType?: string;
  /** Whether this is a temporary (pencil) mark */
  temporary?: boolean;
}

/**
 * Union type for all mark types
 */
export type Mark =
  | CheckboxMark
  | NumberMark
  | ColorFillMark
  | CircleMark
  | SymbolMark
  | TextMark
  | LineMark;

/**
 * Mark instance on a specific hotspot
 */
export interface PlacedMark {
  /** Unique identifier for this mark instance */
  id: ID;
  /** Which hotspot this mark is on */
  hotspotId: ID;
  /** The mark data */
  mark: Mark;
  /** Timestamp when mark was placed */
  timestamp: number;
  /** Custom metadata */
  metadata?: Record<string, any>;
}

/**
 * Tool configuration for each mark type
 */
export interface ToolConfig {
  /** Mark type this tool creates */
  markType: MarkType;
  /** Display name */
  name: string;
  /** Icon identifier */
  icon: string;
  /** Keyboard shortcut */
  shortcut?: string;
  /** Whether pencil mode is available */
  supportsPencilMode?: boolean;
  /** Tool-specific configuration */
  config?: any;
}

/**
 * Color palette configuration
 */
export interface ColorPalette {
  /** Palette identifier */
  id: ID;
  /** Display name */
  name: string;
  /** Available colors */
  colors: {
    id: string;
    color: Color;
    name: string;
  }[];
}

/**
 * Symbol palette configuration
 */
export interface SymbolPalette {
  /** Palette identifier */
  id: ID;
  /** Display name */
  name: string;
  /** Available symbols */
  symbols: {
    id: string;
    /** SVG path or icon component name */
    icon: string;
    name: string;
  }[];
}
