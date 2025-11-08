// examples/02-mixed-layout.ts

import { SheetBuilder } from '../builders/SheetBuilder';

export const demoSheet = SheetBuilder.create('demo-mixed')
  .name('Demo Sheet')
  .size(800, 1000)
  .backgroundColor('#FFFFFF')
  .addGridRegion(
    'main-grid',
    5,  // rows
    5,  // cols
    100, // cell size
    { x: 50, y: 50 },
    ['number', 'checkbox', 'fill']
  )
  .addFreeformRegion('bonus-circles', [
    {
      id: 'bonus-1',
      shape: 'circle',
      position: { x: 650, y: 100 },
      radius: 30,
      allowedMarkTypes: ['circle', 'checkbox'],
      maxMarks: 1
    },
    {
      id: 'bonus-2',
      shape: 'circle',
      position: { x: 650, y: 200 },
      radius: 30,
      allowedMarkTypes: ['circle', 'checkbox'],
      maxMarks: 1
    },
    {
      id: 'bonus-3',
      shape: 'circle',
      position: { x: 650, y: 300 },
      radius: 30,
      allowedMarkTypes: ['circle', 'checkbox'],
      maxMarks: 1
    },
  ])
  .addFreeformRegion('symbols', [
    {
      id: 'symbol-1',
      shape: 'rect',
      position: { x: 50, y: 650 },
      size: { width: 80, height: 80 },
      allowedMarkTypes: ['symbol', 'fill'],
      maxMarks: 1
    },
    {
      id: 'symbol-2',
      shape: 'rect',
      position: { x: 150, y: 650 },
      size: { width: 80, height: 80 },
      allowedMarkTypes: ['symbol', 'fill'],
      maxMarks: 1
    },
    {
      id: 'symbol-3',
      shape: 'rect',
      position: { x: 250, y: 650 },
      size: { width: 80, height: 80 },
      allowedMarkTypes: ['symbol', 'fill'],
      maxMarks: 1
    },
  ])
  .build();
