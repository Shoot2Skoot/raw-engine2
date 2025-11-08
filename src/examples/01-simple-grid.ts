// examples/01-simple-grid.ts

import { SheetBuilder } from '../builders/SheetBuilder';

export const yahtzeeSheet = SheetBuilder.create('yahtzee')
  .name('Yahtzee Score Sheet')
  .size(400, 700)
  .backgroundColor('#F5F5F5')
  .addGridRegion(
    'upper-section',
    6,  // rows
    1,  // cols
    60, // cell size
    { x: 50, y: 50 },
    ['number']
  )
  .addGridRegion(
    'lower-section',
    7,  // rows
    1,  // cols
    60, // cell size
    { x: 50, y: 450 },
    ['number', 'checkbox']
  )
  .build();

export const simpleGridSheet = SheetBuilder.create('simple-grid')
  .name('Simple Grid')
  .size(600, 600)
  .backgroundColor('#FFFFFF')
  .addGridRegion(
    'main-grid',
    5,  // rows
    5,  // cols
    100, // cell size
    { x: 50, y: 50 },
    ['number', 'checkbox', 'fill']
  )
  .build();
