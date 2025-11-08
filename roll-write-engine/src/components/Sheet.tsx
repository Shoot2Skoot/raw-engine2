/**
 * Sheet rendering component with different layout types
 */

import React, { useMemo } from 'react';
import type { Sheet as SheetType, Hotspot as HotspotType, RectangleHotspot } from '../types';
import { Hotspot } from './Hotspot';
import { useGame } from '../gameState';

interface SheetProps {
  sheet: SheetType;
  showHotspotBorders?: boolean;
}

export const Sheet: React.FC<SheetProps> = ({ sheet, showHotspotBorders = false }) => {
  const { state, placeMark } = useGame();
  const layout = sheet.layout;

  // Generate hotspots for grid layout
  const gridHotspots = useMemo((): HotspotType[] => {
    if (layout.type !== 'grid') return [];

    const hotspots: RectangleHotspot[] = [];
    const cellWidth = layout.cellWidth || 60;
    const cellHeight = layout.cellHeight || 60;
    const offsetX = layout.offsetX || 0;
    const offsetY = layout.offsetY || 0;

    for (let row = 0; row < layout.rows; row++) {
      for (let col = 0; col < layout.columns; col++) {
        const id = `grid-${row}-${col}`;
        const x = offsetX + col * (cellWidth + layout.gap);
        const y = offsetY + row * (cellHeight + layout.gap);

        hotspots.push({
          id,
          shape: 'rectangle',
          x,
          y,
          width: cellWidth,
          height: cellHeight,
          constraints: { ...layout.defaultConstraints },
          marks: [],
          enabled: true,
        });
      }
    }

    return hotspots;
  }, [layout]);

  const handleHotspotClick = (hotspot: HotspotType) => {
    const tool = state.currentTool;

    // Create mark based on current tool
    if (tool.type === 'checkbox') {
      // Cycle through states
      const existingCheckbox = hotspot.marks.find((m) => m.type === 'checkbox');
      if (existingCheckbox && existingCheckbox.type === 'checkbox') {
        const states: Array<'empty' | 'checked' | 'crossed'> = ['empty', 'checked', 'crossed'];
        const currentIndex = states.indexOf(existingCheckbox.state);
        const nextIndex = (currentIndex + 1) % states.length;
        existingCheckbox.state = states[nextIndex];
      } else {
        placeMark(sheet.id, hotspot.id, {
          type: 'checkbox',
          state: 'checked',
          isPermanent: tool.isPermanent,
        });
      }
    } else if (tool.type === 'number') {
      const value = tool.value !== undefined ? Number(tool.value) : 0;
      placeMark(sheet.id, hotspot.id, {
        type: 'number',
        value,
        isPermanent: tool.isPermanent,
      });
    } else if (tool.type === 'color') {
      const color = tool.color || state.colorPalette[0];
      placeMark(sheet.id, hotspot.id, {
        type: 'color',
        color,
        isPermanent: tool.isPermanent,
      });
    } else if (tool.type === 'circle') {
      const existingCircle = hotspot.marks.find((m) => m.type === 'circle');
      if (existingCircle && existingCircle.type === 'circle') {
        const states: Array<'empty' | 'half' | 'full'> = ['empty', 'half', 'full'];
        const currentIndex = states.indexOf(existingCircle.state);
        const nextIndex = (currentIndex + 1) % states.length;
        existingCircle.state = states[nextIndex];
      } else {
        placeMark(sheet.id, hotspot.id, {
          type: 'circle',
          state: 'half',
          isPermanent: tool.isPermanent,
        });
      }
    } else if (tool.type === 'symbol') {
      const symbolId = tool.symbolId || 'star';
      placeMark(sheet.id, hotspot.id, {
        type: 'symbol',
        symbolId,
        isPermanent: tool.isPermanent,
      });
    } else if (tool.type === 'text') {
      const text = tool.value?.toString() || '';
      placeMark(sheet.id, hotspot.id, {
        type: 'text',
        text,
        isPermanent: tool.isPermanent,
      });
    }
  };

  const renderLayout = () => {
    if (layout.type === 'grid') {
      const width = layout.columns * ((layout.cellWidth || 60) + layout.gap) + (layout.offsetX || 0);
      const height = layout.rows * ((layout.cellHeight || 60) + layout.gap) + (layout.offsetY || 0);

      return (
        <svg width={width} height={height} className="border border-slate-300 bg-white">
          {layout.backgroundColor && (
            <rect x={0} y={0} width={width} height={height} fill={layout.backgroundColor} />
          )}
          {gridHotspots.map((hotspot) => (
            <Hotspot
              key={hotspot.id}
              hotspot={hotspot}
              customSymbols={state.customSymbols}
              onClick={() => handleHotspotClick(hotspot)}
              showBorders={showHotspotBorders}
            />
          ))}
        </svg>
      );
    } else if (layout.type === 'image-overlay') {
      return (
        <div className="relative border border-slate-300">
          <img
            src={layout.imageSrc}
            alt={sheet.name}
            className={layout.maintainAspectRatio ? 'object-contain' : 'object-cover'}
            style={{
              width: layout.imageWidth,
              height: layout.imageHeight,
            }}
          />
          <svg
            className="absolute top-0 left-0 pointer-events-none"
            width={layout.imageWidth}
            height={layout.imageHeight}
          >
            {layout.hotspots.map((hotspot) => (
              <Hotspot
                key={hotspot.id}
                hotspot={hotspot}
                customSymbols={state.customSymbols}
                onClick={() => handleHotspotClick(hotspot)}
                showBorders={showHotspotBorders}
              />
            ))}
          </svg>
        </div>
      );
    } else if (layout.type === 'freeform') {
      return (
        <svg width={layout.width} height={layout.height} className="border border-slate-300 bg-white">
          {layout.hotspots.map((hotspot) => (
            <Hotspot
              key={hotspot.id}
              hotspot={hotspot}
              customSymbols={state.customSymbols}
              onClick={() => handleHotspotClick(hotspot)}
              showBorders={showHotspotBorders}
            />
          ))}
        </svg>
      );
    } else if (layout.type === 'mixed') {
      return (
        <svg width={layout.width} height={layout.height} className="border border-slate-300 bg-white">
          {layout.regions
            .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
            .map((region) => (
              <g key={region.id}>
                {region.backgroundColor && (
                  <rect
                    x={0}
                    y={0}
                    width={layout.width}
                    height={layout.height}
                    fill={region.backgroundColor}
                  />
                )}
                {region.hotspots.map((hotspot) => (
                  <Hotspot
                    key={hotspot.id}
                    hotspot={hotspot}
                    customSymbols={state.customSymbols}
                    onClick={() => handleHotspotClick(hotspot)}
                    showBorders={showHotspotBorders}
                  />
                ))}
              </g>
            ))}
        </svg>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl font-bold mb-4">{sheet.name}</h2>
      {renderLayout()}
    </div>
  );
};
