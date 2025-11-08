// App.tsx

import { useMemo } from 'react';
import { SheetEngine } from './engine/SheetEngine';
import { EngineProvider } from './context/EngineContext';
import { SheetCanvas } from './components/SheetCanvas';
import { Toolbar } from './components/Toolbar';
import { SheetTabs } from './components/SheetTabs';
import { yahtzeeSheet, simpleGridSheet } from './examples/01-simple-grid';
import { imageHotspotSheet } from './examples/02-image-hotspots';
import { mixedLayoutSheet } from './examples/03-mixed-layout';

function App() {
  // Initialize engine with example sheets
  const engine = useMemo(() => {
    return new SheetEngine([
      simpleGridSheet,
      yahtzeeSheet,
      imageHotspotSheet,
      mixedLayoutSheet
    ]);
  }, []);

  const sheetIds = engine.getAllSheetIds();

  return (
    <EngineProvider engine={engine}>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Roll & Write Engine
            </h1>
            <p className="text-gray-600">
              A web-based drawing/markup engine for roll-and-write board games
            </p>
          </header>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <Toolbar />
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <SheetTabs sheetIds={sheetIds} />
            <div className="p-6">
              <SheetCanvas />
            </div>
          </div>

          <footer className="mt-8 text-center text-sm text-gray-500">
            <p>
              Click on hotspots to mark them. Use keyboard shortcuts (C, N, F, O, P, T) to switch tools.
            </p>
            <p className="mt-2">
              Ctrl+Z to undo, Ctrl+Shift+Z to redo
            </p>
          </footer>
        </div>
      </div>
    </EngineProvider>
  );
}

export default App;
