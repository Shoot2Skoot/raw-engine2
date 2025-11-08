// examples/mixed-layout.ts

import { SheetBuilder } from '../builders/SheetBuilder';
import type { MarkType } from '../engine/types';

export const mixedLayoutSheet = SheetBuilder.create('mixed-layout')
  .name('Mixed Layout Demo')
  .size(800, 1000)
  .backgroundColor('#F0F4F8')
  .addGridRegion(
    'top-grid',
    3,  // rows
    4,  // cols
    60, // cell size
    { x: 50, y: 50 },
    ['checkbox', 'circle']
  )
  .addFreeformRegion('resource-tracks', [
    // Linear resource track with rectangles
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `resource-${i}`,
      shape: 'rect' as const,
      position: { x: 100 + i * 55, y: 350 },
      size: { width: 50, height: 50 },
      allowedMarkTypes: ['fill', 'number'] as MarkType[],
      maxMarks: 1
    }))
  ])
  .addFreeformRegion('special-zones', [
    {
      id: 'zone-alpha',
      shape: 'circle' as const,
      position: { x: 200, y: 600 },
      radius: 60,
      allowedMarkTypes: ['symbol', 'fill'] as MarkType[],
      maxMarks: 2
    },
    {
      id: 'zone-beta',
      shape: 'circle' as const,
      position: { x: 400, y: 600 },
      radius: 60,
      allowedMarkTypes: ['symbol', 'fill'] as MarkType[],
      maxMarks: 2
    },
    {
      id: 'zone-gamma',
      shape: 'circle' as const,
      position: { x: 600, y: 600 },
      radius: 60,
      allowedMarkTypes: ['symbol', 'fill'] as MarkType[],
      maxMarks: 2
    }
  ])
  .build();
