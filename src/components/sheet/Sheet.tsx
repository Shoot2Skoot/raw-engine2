import { useMemo } from 'react';
import type { Sheet as SheetType, Mark, MarkType, Hotspot as HotspotType } from '../../types';
import { Hotspot } from './Hotspot';

interface SheetProps {
  sheet: SheetType;
  marks: Mark[];
  selectedTool: MarkType | null;
  onPlaceMark: (mark: Mark) => void;
  onRemoveMark: (markId: string) => void;
}

export function Sheet({
  sheet,
  marks,
  selectedTool,
  onPlaceMark,
  onRemoveMark,
}: SheetProps) {
  // Generate hotspots based on layout
  const hotspots = useMemo(() => {
    return generateHotspots(sheet);
  }, [sheet]);

  const renderLayout = () => {
    const { layout, dimensions } = sheet;

    const baseStyles = {
      position: 'relative' as const,
      width: dimensions.width,
      height: dimensions.height,
      backgroundColor: '#ffffff',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      overflow: 'hidden',
    };

    // Render background image if present
    const renderBackground = () => {
      if (layout.type === 'image' || (layout.type === 'mixed' && layout.background)) {
        const background = layout.type === 'image' ? layout.background : layout.background!;
        return (
          <img
            src={background.src}
            alt="Sheet background"
            className="absolute inset-0 w-full h-full"
            style={{
              objectFit: background.fitMode === 'stretch' ? 'fill' : background.fitMode,
            }}
          />
        );
      }
      return null;
    };

    return (
      <div style={baseStyles}>
        {renderBackground()}

        {/* Render all hotspots */}
        <div className="relative w-full h-full">
          {hotspots.map((hotspot) => {
            const hotspotMarks = marks.filter(
              (m) => m.hotspotId === hotspot.id
            );

            return (
              <Hotspot
                key={hotspot.id}
                hotspot={hotspot}
                marks={hotspotMarks}
                selectedTool={selectedTool}
                onPlaceMark={onPlaceMark}
                onRemoveMark={onRemoveMark}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center p-8">
      {renderLayout()}
    </div>
  );
}

// ============================================================================
// HOTSPOT GENERATION
// ============================================================================

function generateHotspots(sheet: SheetType): HotspotType[] {
  const { layout } = sheet;
  const hotspots: HotspotType[] = [];

  switch (layout.type) {
    case 'grid': {
      const { grid } = layout;
      const cellSize = grid.cellSize || 60;

      for (let row = 0; row < grid.rows; row++) {
        for (let col = 0; col < grid.columns; col++) {
          const x = grid.startPosition.x + col * (cellSize + grid.gap);
          const y = grid.startPosition.y + row * (cellSize + grid.gap);

          hotspots.push({
            id: `cell-${row}-${col}`,
            shape: 'rectangle',
            position: { x, y },
            dimensions: { width: cellSize, height: cellSize },
            constraints: grid.constraints,
          });
        }
      }
      break;
    }

    case 'image': {
      // Add all regions' hotspots
      layout.regions.forEach((region) => {
        hotspots.push(...region.hotspots);
      });
      break;
    }

    case 'mixed': {
      // Add grid hotspots
      layout.grids.forEach((grid) => {
        const cellSize = grid.cellSize || 60;

        for (let row = 0; row < grid.rows; row++) {
          for (let col = 0; col < grid.columns; col++) {
            const x = grid.startPosition.x + col * (cellSize + grid.gap);
            const y = grid.startPosition.y + row * (cellSize + grid.gap);

            hotspots.push({
              id: `${grid.id}-${row}-${col}`,
              shape: 'rectangle',
              position: { x, y },
              dimensions: { width: cellSize, height: cellSize },
              constraints: grid.constraints,
            });
          }
        }
      });

      // Add region hotspots
      layout.regions.forEach((region) => {
        hotspots.push(...region.hotspots);
      });
      break;
    }
  }

  return hotspots;
}
