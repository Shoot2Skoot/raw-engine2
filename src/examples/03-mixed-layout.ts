// examples/03-mixed-layout.ts
// Mixed layout with different hotspot types

import { SheetBuilder } from '../builders/SheetBuilder';

export const mixedLayoutSheet = SheetBuilder.create('mixed-demo')
  .name('Mixed Demo')
  .size(600, 800)
  .backgroundColor('#E8F4F8')
  .addGridRegion(
    'number-grid',
    5,  // rows
    5,  // cols
    60, // cell size
    { x: 50, y: 50 },
    ['number', 'fill']
  )
  .addFreeformRegion('special-areas', [
    // Circle hotspots
    {
      id: 'circle-1',
      shape: 'circle',
      position: { x: 450, y: 100 },
      radius: 30,
      allowedMarkTypes: ['checkbox', 'circle'],
      maxMarks: 1
    },
    {
      id: 'circle-2',
      shape: 'circle',
      position: { x: 450, y: 180 },
      radius: 30,
      allowedMarkTypes: ['checkbox', 'circle'],
      maxMarks: 1
    },
    {
      id: 'circle-3',
      shape: 'circle',
      position: { x: 450, y: 260 },
      radius: 30,
      allowedMarkTypes: ['checkbox', 'circle'],
      maxMarks: 1
    },
    // Polygon hotspot (triangle)
    {
      id: 'polygon-1',
      shape: 'polygon',
      position: { x: 0, y: 0 },
      points: [
        { x: 300, y: 500 },
        { x: 400, y: 650 },
        { x: 200, y: 650 }
      ],
      allowedMarkTypes: ['fill', 'symbol'],
      maxMarks: 1
    }
  ])
  .build();
