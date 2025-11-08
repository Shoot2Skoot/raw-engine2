import { GameConfig, SheetState, Tool } from '../types'
import { createGridSheet } from '../utils/sheetHelpers'
import { generateToolId } from '../utils/id'

/**
 * Yahtzee Game Definition
 *
 * Simple grid-based game with:
 * - Upper section: 6 rows for ones through sixes
 * - Lower section: 7 rows for combinations (3-of-kind, 4-of-kind, full house, etc.)
 * - Number marks only
 */

export function createYahtzeeGame(): GameConfig {
  // Create the score sheet
  const upperSection = createGridSheet({
    name: 'Yahtzee Score Sheet',
    rows: 13,
    columns: 2,
    cellSize: { width: 150, height: 50 },
    gap: 4,
    startPosition: { x: 40, y: 80 },
    allowedMarkTypes: ['number'],
    backgroundColor: '#fef3c7',
    cellBackgroundColor: '#ffffff',
  })

  // Add labels to the sheet by creating text hotspots
  // (In a real implementation, you might want to add labels as SVG text elements)

  const sheet: SheetState = {
    definition: upperSection,
    markIds: [],
  }

  // Define tools for Yahtzee (just number entry)
  const tools: Tool[] = [
    {
      id: generateToolId(),
      type: 'number',
      label: 'Score',
      icon: 'hash',
      permanence: 'pen',
      config: {
        numberRange: { min: 0, max: 50 },
      },
    },
  ]

  return {
    name: 'Yahtzee',
    sheets: [sheet],
    tools: {
      availableTools: tools,
      selectedToolId: tools[0]!.id,
      recentlyUsed: [],
    },
  }
}
