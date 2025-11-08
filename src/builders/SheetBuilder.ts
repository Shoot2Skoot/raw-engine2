// builders/SheetBuilder.ts - Fluent API for creating sheet definitions

import type {
  SheetDefinition,
  Region,
  Hotspot,
  Point,
  MarkType
} from '../engine/types';
import { Geometry } from '../utils/geometry';

/**
 * Fluent builder for creating sheet definitions
 *
 * Example:
 * ```typescript
 * const sheet = SheetBuilder.create('yahtzee')
 *   .name('Yahtzee Score Sheet')
 *   .size(400, 700)
 *   .backgroundColor('#F0F0F0')
 *   .addGridRegion('upper-section', 6, 1, 80, { x: 50, y: 100 }, ['number'])
 *   .build();
 * ```
 */
export class SheetBuilder {
  private definition: Partial<SheetDefinition> = {
    regions: []
  };

  /**
   * Create a new sheet builder
   * @param id - Unique identifier for the sheet
   */
  static create(id: string): SheetBuilder {
    const builder = new SheetBuilder();
    builder.definition.id = id;
    return builder;
  }

  /**
   * Set the sheet name (display name)
   */
  name(name: string): this {
    this.definition.name = name;
    return this;
  }

  /**
   * Set the sheet dimensions (SVG viewBox)
   * @param width - Width in SVG units
   * @param height - Height in SVG units
   */
  size(width: number, height: number): this {
    this.definition.width = width;
    this.definition.height = height;
    return this;
  }

  /**
   * Set background image URL
   */
  background(imageUrl: string): this {
    this.definition.backgroundImage = imageUrl;
    return this;
  }

  /**
   * Set background color
   */
  backgroundColor(color: string): this {
    this.definition.backgroundColor = color;
    return this;
  }

  /**
   * Add a grid region with auto-generated hotspots
   * @param id - Region identifier
   * @param rows - Number of rows
   * @param cols - Number of columns
   * @param cellSize - Size of each cell
   * @param origin - Top-left position of the grid
   * @param allowedMarks - Mark types allowed in this region
   * @param gap - Optional gap between cells
   */
  addGridRegion(
    id: string,
    rows: number,
    cols: number,
    cellSize: number,
    origin: Point,
    allowedMarks: MarkType[],
    gap?: number
  ): this {
    const region: Region = {
      id,
      type: 'grid',
      layout: {
        type: 'grid',
        rows,
        cols,
        cellSize,
        origin,
        gap
      },
      hotspots: Geometry.generateGridHotspots(
        { type: 'grid', rows, cols, cellSize, origin, gap },
        allowedMarks
      )
    };
    this.definition.regions!.push(region);
    return this;
  }

  /**
   * Add a freeform region with manually defined hotspots
   * @param id - Region identifier
   * @param hotspots - Array of hotspot definitions
   */
  addFreeformRegion(id: string, hotspots: Hotspot[]): this {
    const region: Region = {
      id,
      type: 'freeform',
      hotspots
    };
    this.definition.regions!.push(region);
    return this;
  }

  /**
   * Add a single hotspot to an existing region
   * @param regionId - ID of the region to add to
   * @param hotspot - Hotspot definition
   */
  addHotspot(regionId: string, hotspot: Hotspot): this {
    const region = this.definition.regions!.find((r) => r.id === regionId);
    if (region) {
      if (!region.hotspots) region.hotspots = [];
      region.hotspots.push(hotspot);
    }
    return this;
  }

  /**
   * Set metadata for the sheet
   */
  metadata(metadata: Record<string, unknown>): this {
    this.definition.metadata = metadata;
    return this;
  }

  /**
   * Build and return the sheet definition
   * @throws Error if required fields are missing
   */
  build(): SheetDefinition {
    if (
      !this.definition.id ||
      !this.definition.width ||
      !this.definition.height
    ) {
      throw new Error('Sheet must have id, width, and height');
    }

    // Set default name if not provided
    if (!this.definition.name) {
      this.definition.name = this.definition.id;
    }

    return this.definition as SheetDefinition;
  }
}
