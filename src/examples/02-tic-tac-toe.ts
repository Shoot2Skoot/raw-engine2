// examples/02-tic-tac-toe.ts
// Simple Tic-Tac-Toe game to demonstrate checkboxes and symbols

import { SheetBuilder } from '../builders/SheetBuilder';

export const ticTacToeSheet = SheetBuilder.create('tic-tac-toe')
  .name('Tic-Tac-Toe')
  .size(400, 400)
  .backgroundColor('#FFFFFF')
  .addGridRegion(
    'board',
    3,  // rows
    3,  // cols
    100, // cell size
    { x: 50, y: 50 },
    ['symbol', 'text']
  )
  .build();
