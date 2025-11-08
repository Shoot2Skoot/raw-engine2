/**
 * Hotspot types - interactive regions on sheets where marks can be placed
 */

import type { Mark, MarkType } from './marks';

/** Shape of a hotspot */
export type HotspotShape = 'rectangle' | 'circle' | 'polygon';

/** Position in 2D space */
export interface Position {
  x: number;
  y: number;
}

/** Rectangle dimensions */
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Circle dimensions */
export interface Circle {
  center: Position;
  radius: number;
}

/** Polygon defined by vertices */
export interface Polygon {
  /** Array of vertices defining the polygon (3-50 points) */
  vertices: Position[];
}

/** Base hotspot configuration */
export interface BaseHotspot {
  /** Unique identifier for this hotspot */
  id: string;
  /** Human-readable label (optional) */
  label?: string;
  /** Which mark types are allowed in this hotspot */
  allowedMarkTypes: MarkType[];
  /** Maximum number of marks allowed (undefined = unlimited) */
  maxMarks?: number;
  /** Whether this hotspot is currently interactive (can be dynamically disabled) */
  enabled: boolean;
  /** Whether marks can be removed once placed */
  erasable: boolean;
  /** Optional default/starting value */
  defaultMark?: Mark;
  /** Z-index for layering (higher values on top) */
  zIndex: number;
}

/** Rectangular hotspot */
export interface RectangleHotspot extends BaseHotspot {
  shape: 'rectangle';
  bounds: Rectangle;
}

/** Circular hotspot */
export interface CircleHotspot extends BaseHotspot {
  shape: 'circle';
  bounds: Circle;
}

/** Polygonal hotspot (irregular shape) */
export interface PolygonHotspot extends BaseHotspot {
  shape: 'polygon';
  bounds: Polygon;
}

/** Union type of all hotspot shapes */
export type Hotspot = RectangleHotspot | CircleHotspot | PolygonHotspot;

/** Hotspot with current marks placed on it */
export interface HotspotState {
  /** The hotspot configuration */
  hotspot: Hotspot;
  /** Marks currently placed on this hotspot */
  marks: Mark[];
}

/** Helper to check if a point is inside a hotspot */
export function isPointInHotspot(point: Position, hotspot: Hotspot): boolean {
  switch (hotspot.shape) {
    case 'rectangle': {
      const { x, y, width, height } = hotspot.bounds;
      return (
        point.x >= x &&
        point.x <= x + width &&
        point.y >= y &&
        point.y <= y + height
      );
    }
    case 'circle': {
      const { center, radius } = hotspot.bounds;
      const dx = point.x - center.x;
      const dy = point.y - center.y;
      return dx * dx + dy * dy <= radius * radius;
    }
    case 'polygon': {
      // Ray casting algorithm for point-in-polygon test
      const { vertices } = hotspot.bounds;
      let inside = false;
      for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
        const xi = vertices[i].x;
        const yi = vertices[i].y;
        const xj = vertices[j].x;
        const yj = vertices[j].y;

        const intersect =
          yi > point.y !== yj > point.y &&
          point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }
      return inside;
    }
  }
}
