import React from 'react';
import type { Sheet as SheetType } from '../types';
import { GridSheet } from './GridSheet';

interface SheetProps {
  sheet: SheetType;
}

export const Sheet: React.FC<SheetProps> = ({ sheet }) => {
  const renderLayout = () => {
    switch (sheet.layout.type) {
      case 'grid':
        return <GridSheet layout={sheet.layout} sheetId={sheet.id} />;

      case 'image':
      case 'freeform':
      case 'mixed':
        // To be implemented
        return (
          <div className="p-8 text-gray-500">
            {sheet.layout.type} layout - Coming soon
          </div>
        );

      default:
        return <div className="p-8 text-red-500">Unknown layout type</div>;
    }
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-xl p-4">{renderLayout()}</div>
    </div>
  );
};
