/**
 * Main sheet renderer - handles all layout types
 */

import type { Sheet } from '../../types';
import { LayoutType } from '../../types';
import { GridLayout } from './GridLayout';
import { useGame } from '../../store/GameContext';

interface SheetRendererProps {
  sheet: Sheet;
}

export function SheetRenderer({ sheet }: SheetRendererProps) {
  const { state } = useGame();
  const sheetState = state.sheets[sheet.id];
  const marks = sheetState?.marks || [];

  const renderLayout = () => {
    switch (sheet.layout.type) {
      case LayoutType.Grid:
        return (
          <GridLayout
            layout={sheet.layout as any}
            sheetId={sheet.id}
            marks={marks}
          />
        );
      case LayoutType.ImageOverlay:
        return (
          <div
            className="relative"
            style={{
              width: (sheet.layout as any).imageDimensions.width,
              height: (sheet.layout as any).imageDimensions.height,
            }}
          >
            <img
              src={(sheet.layout as any).imageUrl}
              alt={sheet.name}
              className="absolute inset-0 w-full h-full object-contain"
              style={{
                objectFit: (sheet.layout as any).maintainAspectRatio
                  ? 'contain'
                  : 'fill',
              }}
            />
            {/* TODO: Render hotspots */}
          </div>
        );
      case LayoutType.Freeform:
        return (
          <div
            className="relative"
            style={{
              width: (sheet.layout as any).dimensions.width,
              height: (sheet.layout as any).dimensions.height,
              backgroundColor: (sheet.layout as any).backgroundColor,
            }}
          >
            {/* TODO: Render hotspots */}
          </div>
        );
      case LayoutType.Mixed:
        return (
          <div
            className="relative"
            style={{
              width: (sheet.layout as any).dimensions.width,
              height: (sheet.layout as any).dimensions.height,
              backgroundColor: (sheet.layout as any).backgroundColor,
            }}
          >
            {/* TODO: Render regions */}
          </div>
        );
      default:
        return <div>Unsupported layout type</div>;
    }
  };

  return (
    <div
      className="sheet-container bg-white rounded-lg shadow-lg p-4"
      style={{
        backgroundColor: sheet.style?.backgroundColor,
        borderColor: sheet.style?.borderColor,
        padding: sheet.style?.padding,
      }}
    >
      <h2 className="text-xl font-bold mb-4">{sheet.name}</h2>
      <div className="sheet-content">{renderLayout()}</div>
    </div>
  );
}
