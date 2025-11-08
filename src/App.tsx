// App.tsx

import { useMemo } from 'react';
import { SheetEngine } from './engine/SheetEngine';
import { EngineProvider } from './context/EngineContext';
import { SheetCanvas } from './components/SheetCanvas';
import { Toolbar } from './components/Toolbar';
import { SheetTabs } from './components/SheetTabs';
import { yahtzeeSheet } from './examples/yahtzee';
import { simpleGridSheet } from './examples/simple-grid';
import { mixedLayoutSheet } from './examples/mixed-layout';

function App() {
  // Create engine instance (only once)
  const engine = useMemo(() => {
    const sheets = [simpleGridSheet, yahtzeeSheet, mixedLayoutSheet];
    const sheetEngine = new SheetEngine(sheets);

    // Optional: Load saved state
    sheetEngine.loadFromLocalStorage();

    // Optional: Hook into events for game logic
    sheetEngine.on('markAdded', (event) => {
      console.log('Mark added:', event);
    });

    sheetEngine.on('markRejected', (event) => {
      if (event.type === 'markRejected') {
        console.warn('Mark rejected:', event.reason);
      }
    });

    return sheetEngine;
  }, []);

  return (
    <EngineProvider engine={engine}>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Roll-and-Write Game Engine
            </h1>
            <p className="text-lg text-gray-600">
              A specialized drawing tool for roll-and-write board games
            </p>
          </div>

          {/* Sheet Tabs */}
          <div className="mb-4">
            <SheetTabs sheetIds={engine.getAllSheetIds()} />
          </div>

          {/* Main Canvas */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
            <SheetCanvas />
          </div>

          {/* Toolbar */}
          <Toolbar />

          {/* Instructions */}
          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="text-xl font-bold text-blue-900 mb-3">
              How to Use
            </h2>
            <ul className="space-y-2 text-blue-800">
              <li><strong>Select a tool:</strong> Click a tool button or use keyboard shortcuts (C, N, F, O, P, T)</li>
              <li><strong>Mark cells:</strong> Click on cells to place marks. For numbers, fills, and symbols, a picker will appear</li>
              <li><strong>Toggle marks:</strong> Checkboxes and circles cycle through states when clicked</li>
              <li><strong>Undo/Redo:</strong> Use the buttons or Ctrl+Z / Ctrl+Shift+Z</li>
              <li><strong>Save:</strong> Click Save to store your progress in browser storage</li>
              <li><strong>Switch sheets:</strong> Use the tabs above to navigate between different sheets</li>
            </ul>
          </div>

          {/* Features */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">Multiple Mark Types</h3>
              <p className="text-sm text-gray-600">
                Checkboxes, numbers, fills, circles, symbols, text, and pencil marks
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">Undo/Redo System</h3>
              <p className="text-sm text-gray-600">
                Full command pattern implementation with unlimited undo/redo
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">Developer Friendly</h3>
              <p className="text-sm text-gray-600">
                Fluent API for defining sheets, event hooks for game logic
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Built with React, TypeScript, and Tailwind CSS</p>
            <p className="mt-1">
              Open the browser console to see event logs
            </p>
          </div>
        </div>
      </div>
    </EngineProvider>
  );
}

export default App;
