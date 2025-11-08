// examples/sheets.ts

import { SheetBuilder } from '../builders/SheetBuilder';

/** Example 1: Simple Grid (Yahtzee-style) */
export const yahtzeeSheet = SheetBuilder.create('yahtzee')
  .name('Yahtzee Score Sheet')
  .size(400, 700)
  .backgroundColor('#FEFEFE')
  .addGridRegion(
    'upper-section',
    6,  // rows (Ones, Twos, Threes, Fours, Fives, Sixes)
    1,  // cols
    80, // cell size
    { x: 50, y: 100 },
    ['number']
  )
  .addGridRegion(
    'lower-section',
    7,  // rows (3 of a kind, 4 of a kind, Full House, etc.)
    1,  // cols
    80, // cell size
    { x: 50, y: 600 },
    ['number']
  )
  .build();

/** Example 2: Mixed Layout */
export const demoSheet = SheetBuilder.create('demo')
  .name('Demo Sheet')
  .size(600, 800)
  .backgroundColor('#F5F5F5')
  .addGridRegion(
    'main-grid',
    5,  // rows
    5,  // cols
    80, // cell size
    { x: 50, y: 50 },
    ['number', 'checkbox', 'fill']
  )
  .addFreeformRegion('resources', [
    {
      id: 'resource-1',
      shape: 'circle',
      position: { x: 500, y: 100 },
      radius: 30,
      allowedMarkTypes: ['checkbox'],
      maxMarks: 1
    },
    {
      id: 'resource-2',
      shape: 'circle',
      position: { x: 500, y: 180 },
      radius: 30,
      allowedMarkTypes: ['checkbox'],
      maxMarks: 1
    },
    {
      id: 'resource-3',
      shape: 'circle',
      position: { x: 500, y: 260 },
      radius: 30,
      allowedMarkTypes: ['checkbox'],
      maxMarks: 1
    }
  ])
  .build();

/** Example 3: Complex Layout with Multiple Regions */
export const complexSheet = SheetBuilder.create('complex')
  .name('Complex Game Sheet')
  .size(800, 1000)
  .backgroundColor('#FFFFFF')
  .addGridRegion(
    'top-grid',
    3,
    6,
    60,
    { x: 50, y: 50 },
    ['number', 'symbol']
  )
  .addGridRegion(
    'bottom-grid',
    4,
    4,
    80,
    { x: 100, y: 600 },
    ['fill', 'checkbox']
  )
  .addFreeformRegion('special-areas', [
    {
      id: 'polygon-1',
      shape: 'polygon',
      position: { x: 500, y: 400 },
      points: [
        { x: 550, y: 350 },
        { x: 650, y: 380 },
        { x: 630, y: 450 },
        { x: 520, y: 430 }
      ],
      allowedMarkTypes: ['symbol', 'fill'],
      maxMarks: 1
    },
    {
      id: 'rect-special',
      shape: 'rect',
      position: { x: 50, y: 450 },
      size: { width: 100, height: 50 },
      allowedMarkTypes: ['text'],
      maxMarks: 1
    }
  ])
  .build();
