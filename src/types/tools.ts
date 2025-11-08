/**
 * Tool Types - Player tools for marking sheets
 */

import type { MarkType } from './marks';

/** Available marking tools */
export type ToolType = MarkType | 'eraser';

/** Tool configuration */
export interface Tool {
  /** Tool type */
  type: ToolType;
  /** Display name */
  name: string;
  /** Icon name (from Lucide React) */
  icon: string;
  /** Keyboard shortcut (optional) */
  shortcut?: string;
  /** Tool-specific settings */
  settings?: {
    /** For number tool: selected number */
    number?: number;
    /** For color tool: selected color */
    color?: string;
    /** For symbol tool: selected symbol */
    symbol?: string;
    /** For line tool: line style */
    lineStyle?: 'solid' | 'dashed' | 'dotted';
    /** For checkbox tool: target state */
    checkboxState?: 'checked' | 'crossed';
    /** For circle tool: target state */
    circleState?: 'half' | 'full';
    /** Whether marks are temporary (pencil mode) */
    temporary?: boolean;
  };
}
