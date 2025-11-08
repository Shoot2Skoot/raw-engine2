import { useMemo } from 'react';
import type { GridLayout, Mark } from '../../types';
import { HotspotComponent } from './Hotspot';
import { generateGridHotspots } from '../../utils/helpers';

interface GridSheetProps {
  layout: GridLayout;
  marks: Mark[];
  onHotspotClick: (hotspotId: string) => void;
}

export function GridSheet({
  layout,
  marks,
  onHotspotClick,
  
}: GridSheetProps) {
  const hotspots = useMemo(() => {
    const cellWidth = layout.cellWidth || 60;
    const cellHeight = layout.cellHeight || 60;
    const gap = layout.gap || 2;
    const offsetX = layout.offsetX || 0;
    const offsetY = layout.offsetY || 0;

    return generateGridHotspots(
      layout.rows,
      layout.columns,
      cellWidth,
      cellHeight,
      gap,
      offsetX,
      offsetY,
      layout.allowedMarkTypes
    );
  }, [layout]);

  const containerStyle = useMemo(() => {
    const cellWidth = layout.cellWidth || 60;
    const cellHeight = layout.cellHeight || 60;
    const gap = layout.gap || 2;
    const width =
      layout.columns * cellWidth + (layout.columns - 1) * gap + (layout.offsetX || 0) * 2;
    const height =
      layout.rows * cellHeight + (layout.rows - 1) * gap + (layout.offsetY || 0) * 2;

    return {
      width: `${width}px`,
      height: `${height}px`,
      backgroundColor: layout.backgroundColor || 'transparent',
    };
  }, [layout]);

  const getMarksForHotspot = (hotspotId: string) => {
    return marks.filter((m) => m.hotspotId === hotspotId);
  };

  return (
    <div className="relative" style={containerStyle}>
      {hotspots.map((hotspot) => (
        <HotspotComponent
          key={hotspot.id}
          hotspot={hotspot}
          marks={getMarksForHotspot(hotspot.id)}
          onClick={() => onHotspotClick(hotspot.id)}
          
        />
      ))}
    </div>
  );
}
