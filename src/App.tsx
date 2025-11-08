/**
 * Main App Component
 * Root component that manages the game interface
 */

import { useState } from 'react';
import { GameProvider, useGame } from './hooks/useGameState';
import { GameConfig } from './types';
import { Sheet } from './components/sheet/Sheet';
import { ToolPalette } from './components/ui/ToolPalette';
import { ControlPanel } from './components/ui/ControlPanel';
import { SheetTabs } from './components/ui/SheetTabs';
import { DicePool } from './components/dice/DicePool';
import { CardDeck } from './components/cards/CardDeck';
import { Menu } from 'lucide-react';

interface AppProps {
  config: GameConfig;
}

export function App({ config }: AppProps) {
  return (
    <GameProvider config={config}>
      <GameInterface />
    </GameProvider>
  );
}

function GameInterface() {
  const game = useGame();
  const [showSidebar, setShowSidebar] = useState(true);

  const currentSheet = game.present.sheets.find(
    (s) => s.id === game.present.currentSheetId
  );

  if (!currentSheet) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">No sheet found</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg touch-manipulation no-tap-highlight"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">{game.config.name}</h1>
        </div>
        <div className="text-sm text-gray-500">
          Auto-saved {new Date(game.present.timestamp).toLocaleTimeString()}
        </div>
      </header>

      {/* Control Panel */}
      <ControlPanel
        canUndo={game.canUndo}
        canRedo={game.canRedo}
        onUndo={game.undo}
        onRedo={game.redo}
        onResetGame={game.resetGame}
        onResetSheet={() => game.resetSheet(currentSheet.id)}
        gameState={game.present}
        onLoadGame={game.loadGame}
      />

      {/* Tool Palette */}
      <ToolPalette
        tools={game.config.tools}
        currentTool={game.currentTool}
        onSelectTool={game.setCurrentTool}
      />

      {/* Sheet Tabs */}
      <SheetTabs
        sheets={game.present.sheets}
        currentSheetId={game.present.currentSheetId}
        onChangeSheet={game.changeSheet}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sheet Area */}
        <Sheet
          sheet={currentSheet}
          currentTool={game.currentTool}
          onPlaceMark={(mark) => game.placeMark(currentSheet.id, mark)}
          onRemoveMark={(markId) => game.removeMark(currentSheet.id, markId)}
        />

        {/* Sidebar for Dice and Cards */}
        {(game.present.dicePools.length > 0 || game.present.decks.length > 0) && (
          <aside
            className={`
              ${showSidebar ? 'block' : 'hidden lg:block'}
              w-full lg:w-80 bg-gray-50 border-l border-gray-200 overflow-y-auto p-4 space-y-4
            `}
          >
            {/* Dice Pools */}
            {game.present.dicePools.map((pool) => (
              <DicePool
                key={pool.id}
                pool={pool}
                onRoll={() => game.rollDice(pool.id)}
                onLockDie={(dieId) => game.lockDie(pool.id, dieId)}
                onUnlockDie={(dieId) => game.unlockDie(pool.id, dieId)}
              />
            ))}

            {/* Card Decks */}
            {game.present.decks.map((deck) => (
              <CardDeck
                key={deck.id}
                deck={deck}
                onDraw={() => game.drawCard(deck.id)}
                onDiscard={() => game.discardCard(deck.id)}
                onShuffle={() => game.shuffleDeck(deck.id)}
                onReshuffle={() => game.reshuffleDiscard(deck.id)}
              />
            ))}
          </aside>
        )}
      </div>
    </div>
  );
}
