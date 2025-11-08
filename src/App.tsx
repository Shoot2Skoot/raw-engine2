import { useMemo, useState } from 'react';
import { SheetEngine } from './engine/SheetEngine';
import { EngineProvider } from './context/EngineContext';
import { SheetCanvas } from './components/SheetCanvas';
import { Toolbar } from './components/Toolbar';
import { yahtzeeSheet, demoSheet, mixedSheet } from './examples/simple-grid';

function App() {
  // Initialize engine with example sheets
  const engine = useMemo(() => {
    return new SheetEngine([demoSheet, yahtzeeSheet, mixedSheet]);
  }, []);

  const [currentSheetId, setCurrentSheetId] = useState(demoSheet.id);

  const sheets = engine.getAllSheets();

  const handleSheetChange = (sheetId: string) => {
    engine.switchSheet(sheetId);
    setCurrentSheetId(sheetId);
  };

  return (
    <EngineProvider engine={engine}>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Roll & Write Engine
            </h1>
            <p className="text-gray-600">
              A specialized drawing tool for roll-and-write board games
            </p>
          </header>

          {/* Sheet Tabs */}
          <div className="flex gap-1 border-b border-gray-300 bg-gray-50 mb-4">
            {sheets.map(sheet => (
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
          <Toolbar />

          {/* Canvas */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <SheetCanvas />
          </div>

          {/* Instructions */}
          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              How to Use
            </h2>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Select a tool from the toolbar (or use keyboard shortcuts: C, N, F, O, P, T)</li>
              <li>• Click on cells to mark them</li>
              <li>• Number/Fill/Symbol tools will show a picker</li>
              <li>• Checkbox and Circle tools cycle through states on click</li>
              <li>• Use Ctrl+Z to undo, Ctrl+Shift+Z to redo</li>
              <li>• Use Ctrl+S to save your progress</li>
            </ul>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Features</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Multiple mark types</li>
                <li>✓ Undo/Redo support</li>
                <li>✓ Save/Load state</li>
                <li>✓ Keyboard shortcuts</li>
                <li>✓ Touch-friendly</li>
              </ul>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Mark Types</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>☐ Checkbox (cycling)</li>
                <li># Number (0-9)</li>
                <li>🎨 Fill (8 colors)</li>
                <li>○ Circle (empty/half/full)</li>
                <li>✏️ Pencil (erasable)</li>
                <li>★ Symbol (8 symbols)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </EngineProvider>
  );
}

export default App;
