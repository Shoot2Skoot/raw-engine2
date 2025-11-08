/**
 * Mark Types - Defines all possible mark types that can be placed on sheets
 */

export type MarkType =
  | 'checkbox'
  | 'number'
  | 'color'
  | 'circle'
  | 'symbol'
  | 'text'
  | 'line'
  | 'fill';

export type CheckboxState = 'empty' | 'checked' | 'crossed';
export type CircleState = 'empty' | 'half' | 'full';

export interface BaseMark {
  id: string;
  hotspotId: string;
  type: MarkType;
  isPencil?: boolean; // Temporary vs permanent mark
  timestamp: number;
}

export interface CheckboxMark extends BaseMark {
  type: 'checkbox';
  state: CheckboxState;
}

export interface NumberMark extends BaseMark {
  type: 'number';
  value: number;
}

export interface ColorMark extends BaseMark {
  type: 'color';
  color: string; // Hex color code
}

export interface CircleMark extends BaseMark {
  type: 'circle';
  state: CircleState;
}

export interface SymbolMark extends BaseMark {
  type: 'symbol';
  symbolId: string; // Reference to symbol in palette
}

export interface TextMark extends BaseMark {
  type: 'text';
  value: string;
}

export interface LineMark extends BaseMark {
  type: 'line';
  fromHotspotId: string;
  toHotspotId: string;
  style?: 'solid' | 'dashed' | 'railroad' | 'road';
  color?: string;
}

export interface FillMark extends BaseMark {
  type: 'fill';
  color: string;
  opacity?: number; // 0-1
}

export type Mark =
  | CheckboxMark
  | NumberMark
  | ColorMark
  | CircleMark
  | SymbolMark
  | TextMark
  | LineMark
  | FillMark;
