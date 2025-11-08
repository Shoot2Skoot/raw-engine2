// utils/coordinates.ts - Coordinate transformation utilities

import type { Point } from '../engine/types';

/**
 * Coordinate transformation utilities for converting between screen and SVG sheet coordinates
 */
export class CoordinateTransform {
  /**
   * Convert screen click to SVG sheet coordinates
   * Handles scaling, pan, zoom
   *
   * @param screenPoint - Point in screen coordinates (from mouse/touch event)
   * @param svgElement - The SVG element to transform coordinates for
   * @returns Point in SVG sheet coordinate space
   */
  static screenToSheet(
    screenPoint: Point,
    svgElement: SVGSVGElement
  ): Point {
    const ctm = svgElement.getScreenCTM();
    if (!ctm) return screenPoint;

    const inverse = ctm.inverse();
    return {
      x: inverse.a * screenPoint.x + inverse.c * screenPoint.y + inverse.e,
      y: inverse.b * screenPoint.x + inverse.d * screenPoint.y + inverse.f
    };
  }

  /**
   * Convert SVG sheet coordinates to screen coordinates
   * Useful for positioning UI elements relative to hotspots
   *
   * @param sheetPoint - Point in SVG sheet coordinates
   * @param svgElement - The SVG element to transform coordinates from
   * @returns Point in screen coordinate space
   */
  static sheetToScreen(
    sheetPoint: Point,
    svgElement: SVGSVGElement
  ): Point {
    const ctm = svgElement.getScreenCTM();
    if (!ctm) return sheetPoint;

    return {
      x: ctm.a * sheetPoint.x + ctm.c * sheetPoint.y + ctm.e,
      y: ctm.b * sheetPoint.x + ctm.d * sheetPoint.y + ctm.f
    };
  }
}
