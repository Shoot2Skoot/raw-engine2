import { SheetBuilder } from '../builders/SheetBuilder';

// Example 1: Simple Grid (Yahtzee-style)
export const yahtzeeSheet = SheetBuilder.create('yahtzee')
  .name('Yahtzee Score Sheet')
  .size(400, 700)
  .backgroundColor('#FEFEFE')
  .addGridRegion(
    'upper-section',
    6,  // rows
    1,  // cols
    80, // cell size
    { x: 50, y: 100 },
    ['number']
  )
  .addGridRegion(
    'lower-section',
    7,  // rows
    1,  // cols
    80, // cell size
    { x: 50, y: 600 },
    ['number']
  )
  .build();

// Example 2: Grid with multiple mark types
export const demoSheet = SheetBuilder.create('demo')
  .name('Demo Sheet')
  .size(600, 600)
  .backgroundColor('#F5F5F5')
  .addGridRegion(
    'main-grid',
    5,  // rows
    5,  // cols
    100, // cell size
    { x: 50, y: 50 },
    ['number', 'checkbox', 'fill', 'circle', 'symbol']
  )
  .build();

// Example 3: Mixed layout with different regions
export const mixedSheet = SheetBuilder.create('mixed')
  .name('Mixed Layout')
  .size(800, 600)
  .backgroundColor('#FFFFFF')
  .addGridRegion(
    'checkbox-grid',
    3,
    4,
    60,
    { x: 50, y: 50 },
    ['checkbox']
  )
  .addGridRegion(
    'number-grid',
    2,
    5,
    70,
    { x: 50, y: 300 },
    ['number']
  )
  .addFreeformRegion('custom', [
    {
      id: 'circle-1',
      shape: 'circle',
      position: { x: 600, y: 100 },
      radius: 40,
      allowedMarkTypes: ['fill'],
      maxMarks: 1
    },
    {
      id: 'circle-2',
      shape: 'circle',
      position: { x: 700, y: 100 },
      radius: 40,
      allowedMarkTypes: ['fill'],
      maxMarks: 1
    },
    {
      id: 'polygon-1',
      shape: 'polygon',
      position: { x: 0, y: 0 },
      points: [
        { x: 550, y: 200 },
        { x: 650, y: 200 },
        { x: 650, y: 280 },
        { x: 550, y: 280 }
      ],
      allowedMarkTypes: ['symbol'],
      maxMarks: 1
    }
  ])
  .build();
