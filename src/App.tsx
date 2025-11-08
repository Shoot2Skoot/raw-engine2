// App.tsx - Main application component

import { useState } from 'react';
import { SheetEngine } from './engine/SheetEngine';
import { EngineProvider } from './context/EngineContext';
import { SheetCanvas } from './components/SheetCanvas';
import { Toolbar } from './components/Toolbar';
import { simpleGridSheet } from './examples/simple-grid';
import { yahtzeeSheet } from './examples/yahtzee';
import { freeformSheet } from './examples/freeform';

function App() {
  const [engine] = useState(() => {
    // Create engine with example sheets
    const newEngine = new SheetEngine([simpleGridSheet, yahtzeeSheet, freeformSheet]);

    // Try to load saved state
    const savedState = localStorage.getItem('roll-and-write-save');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        newEngine.importState(state);
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }

    return newEngine;
  });

  const [currentSheetId, setCurrentSheetId] = useState(simpleGridSheet.id);

  // Sheet tabs
  const sheets = [
    { id: simpleGridSheet.id, name: simpleGridSheet.name },
    { id: yahtzeeSheet.id, name: yahtzeeSheet.name },
    { id: freeformSheet.id, name: freeformSheet.name }
  ];

  const handleSheetChange = (sheetId: string) => {
    engine.switchSheet(sheetId);
    setCurrentSheetId(sheetId);
  };

  return (
    <EngineProvider engine={engine}>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Roll-and-Write Game Engine
            </h1>
            <p className="text-gray-600">
              A specialized drawing tool for roll-and-write board games
            </p>
          </header>

          {/* Sheet Tabs */}
          <div className="mb-4 flex gap-1 border-b border-gray-300">
            {sheets.map((sheet) => (
              <button
                key={sheet.id}
                onClick={() => handleSheetChange(sheet.id)}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  currentSheetId === sheet.id
                    ? 'bg-white border-t-2 border-l border-r border-blue-500 text-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {sheet.name}
              </button>
            ))}
          </div>

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
            <ul className="space-y-2 text-blue-800">
              <li>• Select a tool from the toolbar (or use keyboard shortcuts: C, N, F, O, P, T)</li>
              <li>• Click on cells to place marks</li>
              <li>• For numbers, colors, and symbols, a picker will appear</li>
              <li>• Use Ctrl+Z to undo, Ctrl+Shift+Z to redo</li>
              <li>• Click "Save" to save your progress to localStorage</li>
              <li>• Switch between different sheet examples using the tabs</li>
            </ul>
          </div>

          {/* Footer */}
          <footer className="mt-8 text-center text-gray-500 text-sm">
            <p>
              Built with React, TypeScript, and SVG • Open source and extensible
            </p>
          </footer>
        </div>
      </div>
    </EngineProvider>
  );
}

export default App;
