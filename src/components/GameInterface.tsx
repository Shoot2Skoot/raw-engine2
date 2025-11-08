import { Download, Upload, RotateCcw } from 'lucide-react'
import { useGame } from '../context/GameContext'
import { ToolPalette } from './ToolPalette'
import { SheetRenderer } from './SheetRenderer'
import { exportToFile, importFromFile } from '../utils/storage'

export function GameInterface() {
  const { state, changeSheet, resetSheet, resetGame } = useGame()
  const currentSheet = state.sheets[state.currentSheetIndex]

  const handleExport = () => {
    exportToFile(state)
  }

  const handleImport = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const imported = await importFromFile(file)
        // Would need to add LOAD_GAME action to context
        console.log('Imported:', imported)
        alert('Import successful! Please refresh to see changes.')
      } catch (error) {
        alert('Failed to import file')
        console.error(error)
      }
    }
    input.click()
  }

  const handleResetSheet = () => {
    if (confirm('Reset this sheet? This cannot be undone.')) {
      resetSheet(state.currentSheetIndex)
    }
  }

  const handleResetGame = () => {
    if (confirm('Reset entire game? This cannot be undone.')) {
      resetGame()
    }
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{state.gameName}</h1>
            <p className="text-sm text-gray-500">Roll & Write Game Engine</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              title="Export game"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={handleImport}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              title="Import game"
            >
              <Upload size={18} />
              <span className="hidden sm:inline">Import</span>
            </button>
            <button
              onClick={handleResetSheet}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              title="Reset current sheet"
            >
              <RotateCcw size={18} />
              <span className="hidden sm:inline">Reset Sheet</span>
            </button>
            <button
              onClick={handleResetGame}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              title="Reset entire game"
            >
              <RotateCcw size={18} />
              <span className="hidden sm:inline">Reset All</span>
            </button>
          </div>
        </div>

        {/* Sheet tabs */}
        {state.sheets.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {state.sheets.map((sheet, index) => (
              <button
                key={sheet.definition.id}
                onClick={() => changeSheet(index)}
                className={`
                  px-4 py-2 rounded-lg whitespace-nowrap transition-colors
                  ${
                    index === state.currentSheetIndex
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {sheet.definition.name}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Tool palette */}
        <aside className="w-64 overflow-y-auto">
          <ToolPalette />
        </aside>

        {/* Sheet renderer */}
        <main className="flex-1 overflow-hidden">
          {currentSheet ? (
            <SheetRenderer sheet={currentSheet} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No sheet available</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
