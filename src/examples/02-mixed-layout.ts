// examples/02-mixed-layout.ts

import { SheetBuilder } from '../builders/SheetBuilder';
import type { MarkType } from '../engine/types';

export const mixedLayoutSheet = SheetBuilder.create('mixed')
  .name('Mixed Layout Demo')
  .size(600, 800)
  .backgroundColor('#FFFFFF')
  .addGridRegion(
    'number-grid',
    5,  // rows
    5,  // cols
    60, // cell size
    { x: 50, y: 50 },
    ['number', 'fill'],
    5   // gap
  )
  .addGridRegion(
    'checkbox-column',
    10, // rows
    1,  // cols
    40, // cell size
    { x: 450, y: 50 },
    ['checkbox'],
    5   // gap
  )
  .addFreeformRegion('circles', [
    {
      id: 'circle-1',
      shape: 'circle',
      position: { x: 100, y: 500 },
      radius: 30,
      allowedMarkTypes: ['circle' as MarkType],
      maxMarks: 1
    },
    {
      id: 'circle-2',
      shape: 'circle',
      position: { x: 200, y: 500 },
      radius: 30,
      allowedMarkTypes: ['circle' as MarkType],
      maxMarks: 1
    },
    {
      id: 'circle-3',
      shape: 'circle',
      position: { x: 300, y: 500 },
      radius: 30,
      allowedMarkTypes: ['circle' as MarkType],
      maxMarks: 1
    }
  ])
  .addFreeformRegion('polygons', [
    {
      id: 'poly-1',
      shape: 'polygon',
      position: { x: 0, y: 0 },
      points: [
        { x: 100, y: 600 },
        { x: 150, y: 650 },
        { x: 150, y: 700 },
        { x: 100, y: 750 },
        { x: 50, y: 700 },
        { x: 50, y: 650 }
      ],
      allowedMarkTypes: ['symbol' as MarkType],
      maxMarks: 1
    },
    {
      id: 'poly-2',
      shape: 'polygon',
      position: { x: 0, y: 0 },
      points: [
        { x: 250, y: 600 },
        { x: 300, y: 650 },
        { x: 300, y: 700 },
        { x: 250, y: 750 },
        { x: 200, y: 700 },
        { x: 200, y: 650 }
      ],
      allowedMarkTypes: ['fill' as MarkType],
      maxMarks: 1
    }
  ])
  .build();
