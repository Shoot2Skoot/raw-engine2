// examples/02-image-hotspots.ts

import { SheetBuilder } from '../builders/SheetBuilder';

export const imageHotspotSheet = SheetBuilder.create('image-hotspots')
  .name('Image with Hotspots')
  .size(800, 1000)
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
      id: 'water-3',
      shape: 'circle',
      position: { x: 240, y: 80 },
      radius: 25,
      allowedMarkTypes: ['checkbox'],
      maxMarks: 1
    },
    {
      id: 'energy-track',
      shape: 'rect',
      position: { x: 100, y: 150 },
      size: { width: 200, height: 50 },
      allowedMarkTypes: ['number'],
      maxMarks: 1
    }
  ])
  .addFreeformRegion('planets', [
    {
      id: 'planet-1',
      shape: 'rect',
      position: { x: 300, y: 300 },
      size: { width: 50, height: 50 },
      allowedMarkTypes: ['fill', 'symbol'],
      maxMarks: 1
    },
    {
      id: 'planet-2',
      shape: 'rect',
      position: { x: 380, y: 300 },
      size: { width: 50, height: 50 },
      allowedMarkTypes: ['fill', 'symbol'],
      maxMarks: 1
    },
    {
      id: 'planet-3',
      shape: 'rect',
      position: { x: 460, y: 300 },
      size: { width: 50, height: 50 },
      allowedMarkTypes: ['fill', 'symbol'],
      maxMarks: 1
    }
  ])
  .build();
