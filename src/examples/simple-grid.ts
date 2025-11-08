// examples/simple-grid.ts - Simple grid example for testing

import { SheetBuilder } from '../builders/SheetBuilder';

/**
 * A simple 5x5 grid for testing all mark types
 */
export const simpleGridSheet = SheetBuilder.create('simple-grid')
  .name('Simple Grid Demo')
  .size(600, 600)
  .backgroundColor('#FFFFFF')
  .addGridRegion(
    'main-grid',
    5, // rows
    5, // cols
    100, // cell size
    { x: 50, y: 50 }, // origin
    ['number', 'checkbox', 'fill', 'circle', 'symbol', 'text', 'pencil'], // all mark types
    5 // gap between cells
  )
  .build();
