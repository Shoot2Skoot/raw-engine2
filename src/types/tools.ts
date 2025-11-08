/**
 * Tool types - marking instruments that players use
 */

import type { MarkType } from './marks';

/** Tool identifiers */
export type ToolType = MarkType | 'eraser' | 'select';

/** Tool configuration */
export interface Tool {
  /** Tool type */
  type: ToolType;
  /** Display name */
  name: string;
  /** Icon identifier (from Lucide React) */
  icon: string;
  /** Keyboard shortcut (optional) */
  shortcut?: string;
  /** Tool-specific settings */
  settings?: ToolSettings;
}

/** Tool-specific settings */
export interface ToolSettings {
  /** For number tool: min/max range */
  numberRange?: { min: number; max: number };

  /** For color tool: available colors */
  colorPalette?: string[];

  /** For symbol tool: available symbols */
  symbolPalette?: string[];

  /** For checkbox tool: cycle through states */
  checkboxStates?: ('empty' | 'checked' | 'crossed')[];

  /** For circle tool: cycle through states */
  circleStates?: ('empty' | 'half' | 'full')[];

  /** For line tool: line style */
  lineStyle?: 'solid' | 'dashed' | 'dotted';
  lineColor?: string;
  lineThickness?: number;

  /** For text tool: max length */
  maxTextLength?: number;
}

/** Current tool state */
export interface ToolState {
  /** Currently selected tool */
  currentTool: Tool;
  /** Available tools */
  availableTools: Tool[];
  /** Current mark mode (pencil or pen) */
  markMode: 'pencil' | 'pen';
}

/** Default tool configurations */
export const DEFAULT_TOOLS: Tool[] = [
  {
    type: 'checkbox',
    name: 'Checkbox',
    icon: 'CheckSquare',
    shortcut: '1',
  },
  {
    type: 'number',
    name: 'Number',
    icon: 'Hash',
    shortcut: '2',
    settings: {
      numberRange: { min: 0, max: 999 },
    },
  },
  {
    type: 'color',
    name: 'Color Fill',
    icon: 'Palette',
    shortcut: '3',
    settings: {
      colorPalette: [
        '#EF4444', // red
        '#3B82F6', // blue
        '#10B981', // green
        '#F59E0B', // yellow
        '#8B5CF6', // purple
        '#EC4899', // pink
        '#14B8A6', // teal
        '#F97316', // orange
      ],
    },
  },
  {
    type: 'circle',
    name: 'Circle',
    icon: 'Circle',
    shortcut: '4',
  },
  {
    type: 'symbol',
    name: 'Symbol',
    icon: 'Star',
    shortcut: '5',
    settings: {
      symbolPalette: ['star', 'diamond', 'heart', 'square', 'triangle', 'hexagon'],
    },
  },
  {
    type: 'text',
    name: 'Text',
    icon: 'Type',
    shortcut: '6',
    settings: {
      maxTextLength: 50,
    },
  },
  {
    type: 'line',
    name: 'Line',
    icon: 'Minus',
    shortcut: '7',
    settings: {
      lineStyle: 'solid',
      lineThickness: 3,
    },
  },
  {
    type: 'eraser',
    name: 'Eraser',
    icon: 'Eraser',
    shortcut: 'e',
  },
];
