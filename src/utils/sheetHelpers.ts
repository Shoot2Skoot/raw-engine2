import {
  SheetDefinition,
  Hotspot,
  AllowedMarkTypes,
  Size,
  Position,
  Region,
} from '../types'
import { generateSheetId, generateHotspotId, generateRegionId } from './id'

/**
 * Helper functions for creating sheet definitions
 */

interface CreateGridSheetOptions {
  name: string
  rows: number
  columns: number
  cellSize?: number | Size
  gap?: number
  startPosition?: Position
  allowedMarkTypes?: AllowedMarkTypes
  backgroundColor?: string
  cellBackgroundColor?: string
  cellBorderColor?: string
}

/**
 * Create a basic grid sheet (like Yahtzee, Qwixx)
 */
export function createGridSheet(options: CreateGridSheetOptions): SheetDefinition {
  const {
    name,
    rows,
    columns,
    cellSize = 60,
    gap = 2,
    startPosition = { x: 20, y: 20 },
    allowedMarkTypes = ['checkbox', 'number'],
    backgroundColor = '#ffffff',
    cellBackgroundColor = '#ffffff',
    cellBorderColor = '#e5e7eb',
  } = options

  // Calculate cell dimensions
  const actualCellSize: Size =
    typeof cellSize === 'number'
      ? { width: cellSize, height: cellSize }
      : cellSize

  // Generate hotspots for grid
  const hotspots: Hotspot[] = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const x = startPosition.x + col * (actualCellSize.width + gap)
      const y = startPosition.y + row * (actualCellSize.height + gap)

      hotspots.push({
        id: generateHotspotId(),
        shape: {
          type: 'rectangle',
          position: { x, y },
          size: actualCellSize,
        },
        constraints: {
          allowedMarkTypes,
          maxMarks: 1,
          enabled: true,
        },
        backgroundColor: cellBackgroundColor,
        borderColor: cellBorderColor,
        borderWidth: 1,
        metadata: { row, col },
      })
    }
  }

  // Calculate total sheet size
  const sheetWidth =
    startPosition.x * 2 + columns * actualCellSize.width + (columns - 1) * gap
  const sheetHeight =
    startPosition.y * 2 + rows * actualCellSize.height + (rows - 1) * gap

  return {
    id: generateSheetId(),
    name,
    size: { width: sheetWidth, height: sheetHeight },
    backgroundColor,
    hotspots,
    regions: [],
  }
}

interface CreateRegionOptions {
  label: string
  hotspots: Hotspot[]
  position?: Position
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
}

/**
 * Create a region (collection of hotspots)
 */
export function createRegion(options: CreateRegionOptions): Region {
  const {
    label,
    hotspots,
    position,
    backgroundColor,
    borderColor,
    borderWidth,
  } = options

  return {
    id: generateRegionId(),
    label,
    hotspots,
    position,
    backgroundColor,
    borderColor,
    borderWidth,
  }
}

interface CreateResourceTrackOptions {
  label: string
  spaces: number
  orientation?: 'horizontal' | 'vertical'
  spaceSize?: number
  gap?: number
  startPosition?: Position
  allowedMarkTypes?: AllowedMarkTypes
  backgroundColor?: string
}

/**
 * Create a resource track (linear sequence of spaces)
 */
export function createResourceTrack(options: CreateResourceTrackOptions): Region {
  const {
    label,
    spaces,
    orientation = 'horizontal',
    spaceSize = 40,
    gap = 2,
    startPosition = { x: 20, y: 20 },
    allowedMarkTypes = ['checkbox', 'circle'],
    backgroundColor,
  } = options

  const hotspots: Hotspot[] = []

  for (let i = 0; i < spaces; i++) {
    const x =
      orientation === 'horizontal'
        ? startPosition.x + i * (spaceSize + gap)
        : startPosition.x
    const y =
      orientation === 'vertical'
        ? startPosition.y + i * (spaceSize + gap)
        : startPosition.y

    hotspots.push({
      id: generateHotspotId(),
      shape: {
        type: 'circle',
        center: { x: x + spaceSize / 2, y: y + spaceSize / 2 },
        radius: spaceSize / 2,
      },
      constraints: {
        allowedMarkTypes,
        maxMarks: 1,
        enabled: true,
      },
      backgroundColor: backgroundColor || '#f3f4f6',
      borderColor: '#9ca3af',
      borderWidth: 2,
      label: `${i + 1}`,
      metadata: { position: i },
    })
  }

  return createRegion({
    label,
    hotspots,
    position: startPosition,
  })
}

/**
 * Create a custom hotspot
 */
export function createHotspot(
  shape: Hotspot['shape'],
  allowedMarkTypes: AllowedMarkTypes,
  options?: Partial<Hotspot>
): Hotspot {
  return {
    id: generateHotspotId(),
    shape,
    constraints: {
      allowedMarkTypes,
      maxMarks: 1,
      enabled: true,
      ...options?.constraints,
    },
    backgroundColor: options?.backgroundColor,
    borderColor: options?.borderColor || '#e5e7eb',
    borderWidth: options?.borderWidth || 1,
    ...options,
  }
}
