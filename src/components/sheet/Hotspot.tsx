/**
 * Interactive hotspot component
 */

import { useCallback } from 'react';
import type { Hotspot as HotspotType, PlacedMark } from '../../types';
import { HotspotShape } from '../../types';
import { MarkRenderer } from '../marks/MarkRenderer';
import { useGame } from '../../store/GameContext';

interface HotspotProps {
  hotspot: HotspotType;
  sheetId: string;
  marks: PlacedMark[];
}

export function Hotspot({ hotspot, sheetId, marks }: HotspotProps) {
  const { state, placeMark } = useGame();

  // Find marks for this hotspot
  const hotspotMarks = marks.filter((m) => m.hotspotId === hotspot.id);

  // Handle click
  const handleClick = useCallback(() => {
    if (!state.activeTool) return;
    if (hotspot.enabled === false) return;

    // Check if we can place another mark
    if (
      hotspot.maxMarks &&
      hotspotMarks.length >= hotspot.maxMarks
    ) {
      return;
    }

    // Check if tool is allowed
    if (!hotspot.allowedMarkTypes.includes(state.activeTool.markType)) {
      return;
    }

    // Create mark based on active tool
    const newMark: PlacedMark = {
      id: `mark-${Date.now()}-${Math.random()}`,
      hotspotId: hotspot.id,
      mark: createMarkFromTool(state.activeTool.markType, state.pencilMode),
      timestamp: Date.now(),
    };

    placeMark(sheetId, hotspot.id, newMark);
  }, [
    hotspot,
    sheetId,
    state.activeTool,
    state.pencilMode,
    hotspotMarks.length,
    placeMark,
  ]);

  // Render based on geometry
  const renderGeometry = () => {
    const { geometry } = hotspot;

    let style: React.CSSProperties = {
      position: 'absolute',
      cursor: 'pointer',
      border: '1px solid transparent',
    };

    let className = 'hotspot-interactive hover:bg-blue-100 hover:bg-opacity-20 transition-colors';

    if (state.activeTool && hotspot.allowedMarkTypes.includes(state.activeTool.markType)) {
      className += ' hotspot-active';
    }

    switch (geometry.shape) {
      case HotspotShape.Rectangle:
        style = {
          ...style,
          left: (geometry as any).x,
          top: (geometry as any).y,
          width: (geometry as any).width,
          height: (geometry as any).height,
        };
        break;
      case HotspotShape.Circle:
        style = {
          ...style,
          left: (geometry as any).centerX - (geometry as any).radius,
          top: (geometry as any).centerY - (geometry as any).radius,
          width: (geometry as any).radius * 2,
          height: (geometry as any).radius * 2,
          borderRadius: '50%',
        };
        break;
      case HotspotShape.Polygon:
        // For polygons, we'll use the bounding box for now
        const xs = (geometry as any).points.map((p: any) => p.x);
        const ys = (geometry as any).points.map((p: any) => p.y);
        const minX = Math.min(...xs);
        const minY = Math.min(...ys);
        const maxX = Math.max(...xs);
        const maxY = Math.max(...ys);
        style = {
          ...style,
          left: minX,
          top: minY,
          width: maxX - minX,
          height: maxY - minY,
        };
        break;
    }

    return (
      <div
        className={className}
        style={style}
        onClick={handleClick}
      >
        {/* Render marks */}
        <div className="relative w-full h-full flex items-center justify-center">
          {hotspotMarks.map((placedMark) => (
            <MarkRenderer
              key={placedMark.id}
              mark={placedMark.mark}
              size={Math.min(
                geometry.shape === HotspotShape.Rectangle
                  ? Math.min((geometry as any).width, (geometry as any).height) * 0.8
                  : geometry.shape === HotspotShape.Circle
                  ? (geometry as any).radius * 1.5
                  : 32
              )}
            />
          ))}
        </div>
      </div>
    );
  };

  return renderGeometry();
}

/**
 * Create a default mark from a tool type
 */
function createMarkFromTool(markType: any, pencilMode: boolean): any {
  const temporary = pencilMode;

  switch (markType) {
    case 'checkbox':
      return {
        type: 'checkbox',
        state: 'checked',
        temporary,
      };
    case 'number':
      return {
        type: 'number',
        value: 0,
        temporary,
      };
    case 'color-fill':
      return {
        type: 'color-fill',
        color: '#3b82f6',
        temporary,
      };
    case 'circle':
      return {
        type: 'circle',
        state: 'full',
        temporary,
      };
    case 'text':
      return {
        type: 'text',
        value: '',
        temporary,
      };
    default:
      return {
        type: markType,
        temporary,
      };
  }
}
