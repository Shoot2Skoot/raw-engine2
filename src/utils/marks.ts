/**
 * Utility functions for working with marks
 */

import type {
  MarkType,
  CheckboxMark,
  CheckboxState,
  CircleMark,
  CircleState,
  MarkPermanence,
  NumberMark,
  ColorMark,
  SymbolMark,
  TextMark,
  LineMark,
} from '../types';

/**
 * Generate a unique ID for marks
 */
export function generateMarkId(): string {
  return `mark_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Create a checkbox mark
 */
export function createCheckboxMark(
  state: CheckboxState = 'empty',
  permanence: MarkPermanence = 'pen'
): CheckboxMark {
  return {
    id: generateMarkId(),
    type: 'checkbox',
    state,
    permanence,
    timestamp: Date.now(),
  };
}

/**
 * Create a number mark
 */
export function createNumberMark(
  value: number,
  permanence: MarkPermanence = 'pen'
): NumberMark {
  return {
    id: generateMarkId(),
    type: 'number',
    value,
    permanence,
    timestamp: Date.now(),
  };
}

/**
 * Create a color mark
 */
export function createColorMark(
  color: string,
  opacity: number = 0.5,
  permanence: MarkPermanence = 'pen'
): ColorMark {
  return {
    id: generateMarkId(),
    type: 'color',
    color,
    opacity,
    permanence,
    timestamp: Date.now(),
  };
}

/**
 * Create a circle mark
 */
export function createCircleMark(
  state: CircleState = 'empty',
  permanence: MarkPermanence = 'pen'
): CircleMark {
  return {
    id: generateMarkId(),
    type: 'circle',
    state,
    permanence,
    timestamp: Date.now(),
  };
}

/**
 * Create a symbol mark
 */
export function createSymbolMark(
  symbol: string,
  color?: string,
  permanence: MarkPermanence = 'pen'
): SymbolMark {
  return {
    id: generateMarkId(),
    type: 'symbol',
    symbol,
    color,
    permanence,
    timestamp: Date.now(),
  };
}

/**
 * Create a text mark
 */
export function createTextMark(
  text: string,
  permanence: MarkPermanence = 'pen'
): TextMark {
  return {
    id: generateMarkId(),
    type: 'text',
    text,
    permanence,
    timestamp: Date.now(),
  };
}

/**
 * Create a line mark
 */
export function createLineMark(
  from: string,
  to: string,
  style: 'solid' | 'dashed' | 'dotted' = 'solid',
  color?: string,
  thickness: number = 2,
  permanence: MarkPermanence = 'pen'
): LineMark {
  return {
    id: generateMarkId(),
    type: 'line',
    from,
    to,
    style,
    color,
    thickness,
    permanence,
    timestamp: Date.now(),
  };
}

/**
 * Cycle checkbox state
 */
export function cycleCheckboxState(current: CheckboxState, threeState: boolean = true): CheckboxState {
  if (!threeState) {
    return current === 'empty' ? 'checked' : 'empty';
  }

  switch (current) {
    case 'empty':
      return 'checked';
    case 'checked':
      return 'crossed';
    case 'crossed':
      return 'empty';
  }
}

/**
 * Cycle circle state
 */
export function cycleCircleState(current: CircleState): CircleState {
  switch (current) {
    case 'empty':
      return 'half';
    case 'half':
      return 'full';
    case 'full':
      return 'empty';
  }
}

/**
 * Check if a mark type is allowed by constraints
 */
export function isMarkTypeAllowed(type: MarkType, allowedTypes: MarkType[]): boolean {
  return allowedTypes.includes(type);
}

/**
 * Validate number is within range
 */
export function isNumberInRange(value: number, range?: [number, number]): boolean {
  if (!range) return true;
  return value >= range[0] && value <= range[1];
}

/**
 * Validate color is in palette
 */
export function isColorInPalette(color: string, palette?: string[]): boolean {
  if (!palette) return true;
  return palette.includes(color);
}

/**
 * Validate symbol is in set
 */
export function isSymbolInSet(symbol: string, symbolSet?: string[]): boolean {
  if (!symbolSet) return true;
  return symbolSet.includes(symbol);
}
