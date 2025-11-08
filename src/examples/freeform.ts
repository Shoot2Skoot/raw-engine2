// examples/freeform.ts - Freeform layout example

import { SheetBuilder } from '../builders/SheetBuilder';

/**
 * Example with various hotspot shapes (circles, polygons, etc.)
 */
export const freeformSheet = SheetBuilder.create('freeform')
  .name('Freeform Layout Demo')
  .size(800, 600)
  .backgroundColor('#E8F4F8')
  .addFreeformRegion('resources', [
    {
      id: 'water-1',
      shape: 'circle',
      position: { x: 120, y: 80 },
      radius: 25,
      allowedMarkTypes: ['checkbox'],
      maxMarks: 1
    },
    {
      id: 'water-2',
      shape: 'circle',
      position: { x: 180, y: 80 },
      radius: 25,
      allowedMarkTypes: ['checkbox'],
      maxMarks: 1
    },
    {
      id: 'energy-track',
      shape: 'rect',
      position: { x: 100, y: 150 },
      size: { width: 150, height: 50 },
      allowedMarkTypes: ['number'],
      maxMarks: 1
    },
    {
      id: 'planet-1',
      shape: 'polygon',
      position: { x: 0, y: 0 }, // reference point
      points: [
        { x: 400, y: 300 },
        { x: 480, y: 320 },
        { x: 460, y: 400 },
        { x: 380, y: 380 }
      ],
      allowedMarkTypes: ['fill', 'symbol'],
      maxMarks: 1
    }
  ])
  .build();
