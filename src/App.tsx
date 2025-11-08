// App.tsx

import { useMemo } from 'react';
import { SheetEngine } from './engine/SheetEngine';
import { EngineProvider } from './context/EngineContext';
import { SheetCanvas } from './components/SheetCanvas';
import { Toolbar } from './components/Toolbar';
import { SheetTabs } from './components/SheetTabs';

// Import example sheets
import { yahtzeeSheet } from './examples/01-simple-grid';
import { ticTacToeSheet } from './examples/02-tic-tac-toe';
import { mixedLayoutSheet } from './examples/03-mixed-layout';

function App() {
  // Initialize engine with example sheets
  const engine = useMemo(() => {
    return new SheetEngine([yahtzeeSheet, ticTacToeSheet, mixedLayoutSheet]);
  }, []);

  return (
    <EngineProvider engine={engine}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Roll & Write Engine
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              A web-based drawing/markup engine for roll-and-write board games
            </p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="space-y-6">
            {/* Toolbar */}
            <Toolbar />

            {/* Sheet Tabs */}
            <SheetTabs />

            {/* Main Canvas */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <SheetCanvas />
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="font-bold text-blue-900 mb-2">Quick Start:</h2>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Click a tool button or use keyboard shortcuts (C, N, F, O, P, T)</li>
                <li>• Click on any cell to mark it</li>
                <li>• Use Ctrl+Z to undo, Ctrl+Shift+Z to redo</li>
                <li>• Switch between sheets using the tabs</li>
                <li>• Click Save to store your progress locally</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </EngineProvider>
  );
}

export default App;
