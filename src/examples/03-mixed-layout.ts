// examples/03-mixed-layout.ts

import { SheetBuilder } from '../builders/SheetBuilder';

export const mixedLayoutSheet = SheetBuilder.create('mixed-layout')
  .name('Mixed Layout')
  .size(1000, 800)
  .backgroundColor('#FAF9F6')
  .addGridRegion(
    'tech-tree',
    3,  // rows
    4,  // cols
    60, // cell size
    { x: 50, y: 50 },
    ['checkbox', 'circle']
  )
  .addFreeformRegion('resource-tracks',
    // Linear resource tracks
    Array.from({ length: 10 }, (_, i) => ({
      id: `water-${i}`,
      shape: 'rect' as const,
      position: { x: 100 + i * 50, y: 300 },
      size: { width: 40, height: 40 },
      allowedMarkTypes: ['fill', 'number'] as const,
      maxMarks: 1
    }))
  )
  .addFreeformRegion('planet-map', [
    // Irregular shaped regions using polygons
    {
      id: 'region-alpha',
      shape: 'polygon',
      position: { x: 500, y: 500 }, // Used as reference
      points: [
        { x: 500, y: 500 },
        { x: 580, y: 520 },
        { x: 560, y: 600 },
        { x: 480, y: 580 }
      ],
      allowedMarkTypes: ['symbol', 'fill'],
      maxMarks: 1
    },
    {
      id: 'region-beta',
      shape: 'polygon',
      position: { x: 600, y: 500 },
      points: [
        { x: 600, y: 500 },
        { x: 680, y: 520 },
        { x: 660, y: 600 },
        { x: 580, y: 580 }
      ],
      allowedMarkTypes: ['symbol', 'fill'],
      maxMarks: 1
    }
  ])
  .build();
