/**
 * Sheet Renderer - Renders any type of sheet layout
 */

import type { Sheet } from '../../types';
import { GridSheet } from './GridSheet';

interface SheetRendererProps {
  sheet: Sheet;
}

export function SheetRenderer({ sheet }: SheetRendererProps) {
  const { layout } = sheet;

  if (layout.type === 'grid') {
    return <GridSheet sheetId={sheet.id} layout={layout} />;
  }

  if (layout.type === 'image') {
    return (
      <div className="text-gray-500 p-8">
        Image-based sheets coming soon...
      </div>
    );
  }

  if (layout.type === 'freeform') {
    return (
      <div className="text-gray-500 p-8">
        Freeform sheets coming soon...
      </div>
    );
  }

  if (layout.type === 'mixed') {
    return (
      <div className="text-gray-500 p-8">
        Mixed layout sheets coming soon...
      </div>
    );
  }

  return <div className="text-red-500 p-8">Unknown sheet type</div>;
}
