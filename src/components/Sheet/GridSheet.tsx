import { useMemo } from 'react';
import type { GridLayout, Mark, Hotspot } from '../../types';
import { generateGridHotspots } from '../../utils/hotspots';
import { HotspotCell } from './HotspotCell';

interface GridSheetProps {
  sheetId: string;
  layout: GridLayout;
  marks: Mark[];
  selectedHotspotId?: string;
  onHotspotClick?: (hotspot: Hotspot) => void;
}

export function GridSheet({
  sheetId,
  layout,
  marks,
  selectedHotspotId,
  onHotspotClick,
}: GridSheetProps) {
  // Generate hotspots for the grid
  const hotspots = useMemo(
    () => generateGridHotspots(sheetId, layout),
    [sheetId, layout]
  );

  // Calculate container size
  const cellSize = layout.cellSize === 'auto' ? 50 : layout.cellSize || 50;
  const gap = layout.gap || 0;
  const offset = layout.offset || { x: 0, y: 0 };

  const containerWidth = layout.columns * cellSize + (layout.columns - 1) * gap + offset.x * 2;
  const containerHeight = layout.rows * cellSize + (layout.rows - 1) * gap + offset.y * 2;

  // Group marks by hotspot ID for efficient lookup
  const marksByHotspot = useMemo(() => {
    const map = new Map<string, Mark[]>();
    marks.forEach(mark => {
      const existing = map.get(mark.hotspotId) || [];
      map.set(mark.hotspotId, [...existing, mark]);
    });
    return map;
  }, [marks]);

  return (
    <div
      className="relative"
      style={{
        width: containerWidth,
        height: containerHeight,
        backgroundColor: layout.backgroundColor || 'transparent',
      }}
    >
      {hotspots.map(hotspot => (
        <HotspotCell
          key={hotspot.id}
          hotspot={hotspot}
          marks={marksByHotspot.get(hotspot.id) || []}
          isSelected={hotspot.id === selectedHotspotId}
          onClick={onHotspotClick}
        />
      ))}
    </div>
  );
}
