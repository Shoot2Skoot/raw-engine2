#!/bin/bash

# Fix unused imports and variables

# Fix GameEngine.tsx - remove Save import and activeHotspotId
sed -i 's/Undo2, Redo2, Save, RotateCcw/Undo2, Redo2, RotateCcw/g' src/components/GameEngine.tsx
sed -i '/const \[activeHotspotId, setActiveHotspotId\]/d' src/components/GameEngine.tsx
sed -i 's/activeHotspotId={activeHotspotId}//g' src/components/GameEngine.tsx
sed -i 's/isActive={activeHotspotId === hotspot.id}//g' src/components/Sheet/GridSheet.tsx

# Fix MarkRenderer.tsx - remove hotspotSize
sed -i 's/hotspotSize?: { width: number; height: number };//g' src/components/Marks/MarkRenderer.tsx
sed -i 's/{ marks, hotspotSize }/{ marks }/g' src/components/Marks/MarkRenderer.tsx

# Fix SheetRenderer.tsx - remove activeHotspotId
sed -i '/activeHotspotId?: string;/d' src/components/Sheet/SheetRenderer.tsx
sed -i 's/activeHotspotId,//g' src/components/Sheet/SheetRenderer.tsx

# Fix Hotspot.tsx - remove isActive
sed -i '/isActive?: boolean;/d' src/components/Sheet/Hotspot.tsx
sed -i 's/{ hotspot, marks, onClick, isActive }/{ hotspot, marks, onClick }/g' src/components/Sheet/Hotspot.tsx
sed -i "s/stroke={isActive ? '#3B82F6' : 'transparent'}/stroke='transparent'/g" src/components/Sheet/Hotspot.tsx
sed -i "s/isActive ? 'border-blue-500' : 'border-transparent'/'border-transparent'/g" src/components/Sheet/Hotspot.tsx

# Fix GridSheet.tsx - remove activeHotspotId
sed -i '/activeHotspotId?: string;/d' src/components/Sheet/GridSheet.tsx
sed -i 's/activeHotspotId,//g' src/components/Sheet/GridSheet.tsx

# Fix welcome-to-the-moon.ts - remove unused CardField import
sed -i 's/, CardField//g' src/games/welcome-to-the-moon.ts

# Fix yahtzee.ts - remove unused generateId import
sed -i 's/generateId, //g' src/games/yahtzee.ts

echo "Fixed TypeScript errors"
