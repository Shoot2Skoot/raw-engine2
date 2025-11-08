/**
 * Sheet Tabs Component
 * Navigation between multiple sheets
 */

import { Sheet } from '../../types';

interface SheetTabsProps {
  sheets: Sheet[];
  currentSheetId: string;
  onChangeSheet: (sheetId: string) => void;
}

export function SheetTabs({ sheets, currentSheetId, onChangeSheet }: SheetTabsProps) {
  if (sheets.length <= 1) {
    return null; // No need for tabs with single sheet
  }

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm overflow-x-auto">
      <div className="flex px-4">
        {sheets.map((sheet, index) => {
          const isActive = sheet.id === currentSheetId;
          return (
            <button
              key={sheet.id}
              onClick={() => onChangeSheet(sheet.id)}
              className={`
                px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                touch-manipulation no-tap-highlight
                ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }
              `}
            >
              {sheet.name}
              <span className="ml-2 text-xs text-gray-400">({index + 1})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
