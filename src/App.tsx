// App.tsx

import { useMemo } from 'react';
import { SheetEngine } from './engine/SheetEngine';
import { EngineProvider } from './context/EngineContext';
import { SheetCanvas } from './components/SheetCanvas';
import { Toolbar } from './components/Toolbar';
import { SheetTabs } from './components/SheetTabs';
import { yahtzeeSheet } from './examples/01-simple-grid';
import { mixedLayoutSheet } from './examples/02-mixed-layout';

function App() {
  // Initialize the engine with example sheets
  const engine = useMemo(() => {
    return new SheetEngine([yahtzeeSheet, mixedLayoutSheet]);
  }, []);

  const sheetIds = engine.getAllSheetIds();

  return (
    <EngineProvider engine={engine}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Roll-and-Write Engine
            </h1>
            <p className="text-gray-600">
              A powerful drawing/markup engine for roll-and-write board games
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            {/* Sheet Tabs */}
            <SheetTabs sheetIds={sheetIds} />

            {/* Canvas Container */}
            <div className="p-6">
              <SheetCanvas />
            </div>

            {/* Toolbar */}
            <div className="p-6 pt-0">
              <Toolbar />
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Instructions</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Tools</h3>
                <ul className="space-y-1">
                  <li><kbd className="px-2 py-1 bg-gray-100 rounded">C</kbd> - Checkbox</li>
                  <li><kbd className="px-2 py-1 bg-gray-100 rounded">N</kbd> - Number</li>
                  <li><kbd className="px-2 py-1 bg-gray-100 rounded">F</kbd> - Fill</li>
                  <li><kbd className="px-2 py-1 bg-gray-100 rounded">O</kbd> - Circle</li>
                  <li><kbd className="px-2 py-1 bg-gray-100 rounded">P</kbd> - Pencil</li>
                  <li><kbd className="px-2 py-1 bg-gray-100 rounded">T</kbd> - Text</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Actions</h3>
                <ul className="space-y-1">
                  <li><kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+Z</kbd> - Undo</li>
                  <li><kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+Shift+Z</kbd> - Redo</li>
                  <li><kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+S</kbd> - Save</li>
                  <li>Click on cells to mark them</li>
                  <li>Use toolbar buttons for save/load/export</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-gray-600 text-sm">
            <p>Built with React, TypeScript, and Tailwind CSS</p>
            <p className="mt-2">A specialized drawing tool for roll-and-write games</p>
          </div>
        </div>
      </div>
    </EngineProvider>
  );
}

export default App;
