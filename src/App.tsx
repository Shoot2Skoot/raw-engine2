// App.tsx

import { useMemo } from 'react';
import { SheetEngine } from './engine/SheetEngine';
import { EngineProvider } from './context/EngineContext';
import { SheetCanvas } from './components/SheetCanvas';
import { Toolbar } from './components/Toolbar';
import { SheetTabs } from './components/SheetTabs';
import { yahtzeeSheet } from './examples/01-simple-grid';
import { demoSheet } from './examples/02-mixed-layout';

function App() {
  // Initialize engine with example sheets
  const engine = useMemo(() => {
    return new SheetEngine([yahtzeeSheet, demoSheet]);
  }, []);

  const sheetIds = engine.getAllSheetIds();

  return (
    <EngineProvider engine={engine}>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Roll-and-Write Engine
            </h1>
            <p className="text-gray-600">
              A specialized drawing tool for roll-and-write board games. Click cells to mark them,
              use keyboard shortcuts (C, N, F, O, P, T), and try undo/redo (Ctrl+Z/Ctrl+Shift+Z).
            </p>
          </header>

          {/* Sheet Tabs */}
          {sheetIds.length > 1 && (
            <div className="mb-4">
              <SheetTabs sheetIds={sheetIds} />
            </div>
          )}

          {/* Toolbar */}
          <div className="mb-4">
            <Toolbar />
          </div>

          {/* Canvas */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <SheetCanvas />
          </div>

          {/* Instructions */}
          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              Quick Start Guide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h3 className="font-semibold mb-2">Tools:</h3>
                <ul className="space-y-1">
                  <li>• <strong>Checkbox (C)</strong>: Click to toggle check/cross</li>
                  <li>• <strong>Number (N)</strong>: Shows number picker</li>
                  <li>• <strong>Fill (F)</strong>: Shows color picker</li>
                  <li>• <strong>Circle (O)</strong>: Click to cycle empty/half/full</li>
                  <li>• <strong>Pencil (P)</strong>: Erasable marks (lighter)</li>
                  <li>• <strong>Text (T)</strong>: Free text input</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Features:</h3>
                <ul className="space-y-1">
                  <li>• <strong>Undo/Redo</strong>: Ctrl+Z / Ctrl+Shift+Z</li>
                  <li>• <strong>Save/Load</strong>: Persistent state in localStorage</li>
                  <li>• <strong>Multi-sheet</strong>: Switch between tabs</li>
                  <li>• <strong>Hover</strong>: Blue highlight shows clickable areas</li>
                  <li>• <strong>Dev Mode</strong>: Red dashed lines show hotspot boundaries</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-8 text-center text-sm text-gray-500">
            <p>
              Built with React + TypeScript + Tailwind CSS + Vite
            </p>
            <p className="mt-1">
              A framework for interactive roll-and-write game sheets
            </p>
          </footer>
        </div>
      </div>
    </EngineProvider>
  );
}

export default App;
