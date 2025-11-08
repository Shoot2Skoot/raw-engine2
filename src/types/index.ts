/**
 * Roll-and-Write Game Engine Types
 *
 * This file exports all type definitions for the game engine.
 */

// Marks
export type {
  CheckboxState,
  CircleState,
  MarkMode,
  BaseMark,
  CheckboxMark,
  NumberMark,
  ColorMark,
  CircleMark,
  SymbolMark,
  TextMark,
  LineMark,
  Mark,
  MarkType,
} from './marks';

export { isMarkType } from './marks';

// Hotspots
export type {
  HotspotShape,
  Position,
  Rectangle,
  Circle,
  Polygon,
  BaseHotspot,
  RectangleHotspot,
  CircleHotspot,
  PolygonHotspot,
  Hotspot,
  HotspotState,
} from './hotspot';

export { isPointInHotspot } from './hotspot';

// Sheets
export type {
  SheetLayoutType,
  GridConfig,
  ImageOverlayConfig,
  ResourceTrackConfig,
  RegionConfig,
  BaseSheet,
  GridSheet,
  ImageOverlaySheet,
  CustomSheet,
  Sheet,
  SheetState,
} from './sheet';

export { generateGridHotspots, generateTrackHotspots } from './sheet';

// Dice
export type {
  StandardDieType,
  DieFace,
  StandardDie,
  CustomDie,
  Die,
  DieResult,
  DicePool,
  DicePoolState,
} from './dice';

export {
  rollDie,
  rollDice,
  rerollUnlocked,
  modifyDieValue,
  getDieSides,
} from './dice';

// Cards
export type {
  CardFieldType,
  CardField,
  Card,
  Deck,
  DeckState,
} from './cards';

export {
  shuffleArray,
  shuffleDeck,
  drawCard,
  discardCurrentCard,
  reshuffleDiscard,
  splitDeck,
  peekCards,
  createNumberedDeck,
  getCardField,
  getCardFieldNumber,
  getCardFieldString,
} from './cards';

// Tools
export type {
  ToolType,
  Tool,
  ToolSettings,
  ToolState,
} from './tools';

export { DEFAULT_TOOLS } from './tools';

// Game State
export type {
  ActionType,
  GameAction,
  GameConfig,
  GameState,
  SavedGame,
} from './gameState';

export {
  createInitialGameState,
  serializeGameState,
  deserializeGameState,
  saveToLocalStorage,
  loadFromLocalStorage,
  saveToFile,
  loadFromFile,
} from './gameState';
