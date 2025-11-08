/**
 * Mark utilities - Create, update, remove marks
 */

import type {
  Mark,
  CheckboxMark,
  NumberMark,
  ColorMark,
  CircleMark,
  SymbolMark,
  TextMark,
  LineMark,
  FillMark,
  CheckboxState,
  CircleState,
  Hotspot,
} from '../types';

/**
 * Create a checkbox mark
 */
export function createCheckboxMark(
  hotspotId: string,
  state: CheckboxState = 'empty',
  isPencil: boolean = false
): CheckboxMark {
  return {
    id: crypto.randomUUID(),
    hotspotId,
    type: 'checkbox',
    state,
    isPencil,
    timestamp: Date.now(),
  };
}

/**
 * Cycle checkbox state
 */
export function cycleCheckboxState(state: CheckboxState): CheckboxState {
  const cycle: CheckboxState[] = ['empty', 'checked', 'crossed'];
  const currentIndex = cycle.indexOf(state);
  return cycle[(currentIndex + 1) % cycle.length];
}

/**
 * Create a number mark
 */
export function createNumberMark(
  hotspotId: string,
  value: number,
  isPencil: boolean = false
): NumberMark {
  return {
    id: crypto.randomUUID(),
    hotspotId,
    type: 'number',
    value,
    isPencil,
    timestamp: Date.now(),
  };
}

/**
 * Create a color fill mark
 */
export function createColorMark(
  hotspotId: string,
  color: string,
  isPencil: boolean = false
): ColorMark {
  return {
    id: crypto.randomUUID(),
    hotspotId,
    type: 'color',
    color,
    isPencil,
    timestamp: Date.now(),
  };
}

/**
 * Create a circle mark
 */
export function createCircleMark(
  hotspotId: string,
  state: CircleState = 'empty',
  isPencil: boolean = false
): CircleMark {
  return {
    id: crypto.randomUUID(),
    hotspotId,
    type: 'circle',
    state,
    isPencil,
    timestamp: Date.now(),
  };
}

/**
 * Cycle circle state
 */
export function cycleCircleState(state: CircleState): CircleState {
  const cycle: CircleState[] = ['empty', 'half', 'full'];
  const currentIndex = cycle.indexOf(state);
  return cycle[(currentIndex + 1) % cycle.length];
}

/**
 * Create a symbol mark
 */
export function createSymbolMark(
  hotspotId: string,
  symbolId: string,
  isPencil: boolean = false
): SymbolMark {
  return {
    id: crypto.randomUUID(),
    hotspotId,
    type: 'symbol',
    symbolId,
    isPencil,
    timestamp: Date.now(),
  };
}

/**
 * Create a text mark
 */
export function createTextMark(
  hotspotId: string,
  value: string,
  isPencil: boolean = false
): TextMark {
  return {
    id: crypto.randomUUID(),
    hotspotId,
    type: 'text',
    value,
    isPencil,
    timestamp: Date.now(),
  };
}

/**
 * Create a line mark
 */
export function createLineMark(
  fromHotspotId: string,
  toHotspotId: string,
  style: 'solid' | 'dashed' | 'railroad' | 'road' = 'solid',
  color?: string,
  isPencil: boolean = false
): LineMark {
  return {
    id: crypto.randomUUID(),
    hotspotId: fromHotspotId,
    type: 'line',
    fromHotspotId,
    toHotspotId,
    style,
    color,
    isPencil,
    timestamp: Date.now(),
  };
}

/**
 * Create a fill mark
 */
export function createFillMark(
  hotspotId: string,
  color: string,
  opacity: number = 0.5,
  isPencil: boolean = false
): FillMark {
  return {
    id: crypto.randomUUID(),
    hotspotId,
    type: 'fill',
    color,
    opacity,
    isPencil,
    timestamp: Date.now(),
  };
}

/**
 * Get all marks for a specific hotspot
 */
export function getMarksForHotspot(hotspotId: string, marks: Mark[]): Mark[] {
  return marks.filter((mark) => mark.hotspotId === hotspotId);
}

/**
 * Get all marks for a specific sheet
 */
export function getMarksForSheet(sheetId: string, marks: Mark[], hotspots: Hotspot[]): Mark[] {
  const sheetHotspotIds = new Set(hotspots.filter((h) => h.sheetId === sheetId).map((h) => h.id));
  return marks.filter((mark) => sheetHotspotIds.has(mark.hotspotId));
}

/**
 * Check if a hotspot can accept more marks
 */
export function canAddMark(hotspot: Hotspot, existingMarks: Mark[]): boolean {
  if (hotspot.disabled || hotspot.readOnly) {
    return false;
  }

  if (hotspot.maxMarks === undefined) {
    return true; // Unlimited marks
  }

  const currentMarkCount = existingMarks.filter(
    (mark) => mark.hotspotId === hotspot.id
  ).length;

  return currentMarkCount < hotspot.maxMarks;
}

/**
 * Check if a mark type is allowed on a hotspot
 */
export function isMarkTypeAllowed(hotspot: Hotspot, markType: string): boolean {
  return hotspot.allowedMarks.includes(markType as any);
}

/**
 * Remove a mark by ID
 */
export function removeMark(marks: Mark[], markId: string): Mark[] {
  return marks.filter((mark) => mark.id !== markId);
}

/**
 * Update a mark
 */
export function updateMark(marks: Mark[], updatedMark: Mark): Mark[] {
  return marks.map((mark) => (mark.id === updatedMark.id ? updatedMark : mark));
}

/**
 * Toggle mark pencil mode
 */
export function toggleMarkPencilMode(mark: Mark): Mark {
  return {
    ...mark,
    isPencil: !mark.isPencil,
  };
}
