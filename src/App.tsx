// App.tsx

import { useEffect, useMemo } from 'react';
import { SheetEngine } from './engine/SheetEngine';
import { EngineProvider } from './context/EngineContext';
import { SheetCanvas } from './components/SheetCanvas';
import { Toolbar } from './components/Toolbar';
import { SheetTabs } from './components/SheetTabs';
import { yahtzeeSheet, demoSheet, complexSheet } from './examples/sheets';

function App() {
  // Create engine instance with example sheets
  const engine = useMemo(() => {
    return new SheetEngine([yahtzeeSheet, demoSheet, complexSheet]);
  }, []);

  // Example: Hook into game events
  useEffect(() => {
    const unsubscribers = [
      engine.on('markAdded', (event) => {
        console.log('Mark added:', event);
      }),
      engine.on('markRejected', (event) => {
        if (event.type === 'markRejected') {
          console.warn('Mark rejected:', event.reason);
        }
      }),
      engine.on('toolChanged', (event) => {
        if (event.type === 'toolChanged') {
          console.log('Tool changed:', event.previousTool, '->', event.currentTool);
        }
      })
    ];

    return () => unsubscribers.forEach(unsub => unsub());
  }, [engine]);

  return (
    <EngineProvider engine={engine}>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Roll-and-Write Game Engine
            </h1>
            <p className="text-gray-600">
              A web-based drawing/markup engine for roll-and-write board games
            </p>
          </header>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <SheetTabs sheetIds={engine.getAllSheetIds()} />
            <Toolbar />
            <SheetCanvas />
          </div>

          <footer className="mt-8 text-sm text-gray-500">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold mb-2">Keyboard Shortcuts:</h3>
              <ul className="grid grid-cols-2 gap-2">
                <li><kbd className="px-2 py-1 bg-gray-100 rounded">C</kbd> - Checkbox Tool</li>
                <li><kbd className="px-2 py-1 bg-gray-100 rounded">N</kbd> - Number Tool</li>
                <li><kbd className="px-2 py-1 bg-gray-100 rounded">F</kbd> - Fill Tool</li>
                <li><kbd className="px-2 py-1 bg-gray-100 rounded">O</kbd> - Circle Tool</li>
                <li><kbd className="px-2 py-1 bg-gray-100 rounded">P</kbd> - Pencil Tool</li>
                <li><kbd className="px-2 py-1 bg-gray-100 rounded">T</kbd> - Text Tool</li>
                <li><kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+Z</kbd> - Undo</li>
                <li><kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+Shift+Z</kbd> - Redo</li>
              </ul>
            </div>
          </footer>
        </div>
      </div>
    </EngineProvider>
  );
}

export default App;
