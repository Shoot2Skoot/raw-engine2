/**
 * Game Configuration Types
 * Main configuration for defining a complete game
 */

import type { SheetConfig } from './sheets';
import type { DiceConfig } from './dice';
import type { CardDeckConfig } from './cards';
import type { AutoSaveConfig } from './state';

/** Symbol palette for symbol marks */
export interface SymbolPalette {
  id: string;
  name: string;
  symbols: Array<{
    id: string;
    icon: string; // Icon name from Lucide React
    label: string;
    color?: string;
  }>;
}

/** Color palette for color marks */
export interface ColorPalette {
  id: string;
  name: string;
  colors: Array<{
    id: string;
    hex: string;
    label: string;
  }>;
}

/** Game metadata */
export interface GameMetadata {
  name: string;
  version: string;
  description?: string;
  author?: string;
  minPlayers?: number;
  maxPlayers?: number;
  playTime?: string;
  complexity?: 'beginner' | 'intermediate' | 'advanced';
}

/** Complete game configuration */
export interface GameConfig {
  metadata: GameMetadata;
  sheets: SheetConfig;
  dice?: DiceConfig;
  cards?: CardDeckConfig;
  symbolPalettes?: SymbolPalette[];
  colorPalettes?: ColorPalette[];
  autoSave?: AutoSaveConfig;
  enableHistory?: boolean;
  maxHistorySize?: number;
  customRules?: {
    onMarkPlaced?: (mark: unknown) => void;
    onDiceRolled?: (results: unknown) => void;
    onCardDrawn?: (card: unknown) => void;
    validateMark?: (mark: unknown) => boolean;
  };
}

/** Game instance (runtime) */
export interface GameInstance {
  config: GameConfig;
  state: unknown; // GameState, imported separately to avoid circular deps
  initialized: boolean;
  paused: boolean;
}
