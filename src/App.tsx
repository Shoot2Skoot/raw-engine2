import { useEffect } from 'react'
import { GameProvider } from './context/GameContext'
import { GameInterface } from './components/GameInterface'
import { createYahtzeeGame } from './games/yahtzee'

function App() {
  const gameConfig = createYahtzeeGame()

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z or Cmd+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        // Undo will be handled by the context
      }
      // Ctrl+Shift+Z or Cmd+Shift+Z for redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault()
        // Redo will be handled by the context
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <GameProvider config={gameConfig}>
      <GameInterface />
    </GameProvider>
  )
}

export default App
