/**
 * Roll-and-Write Game Engine - Type Definitions
 *
 * This module exports all TypeScript types and interfaces used throughout the engine.
 */

// Mark types
export type {
  CheckboxState,
  CircleState,
  MarkPermanence,
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
  MarkTypeConfig,
} from './marks';

// Hotspot types
export type {
  Position,
  Size,
  BaseHotspot,
  RectangularHotspot,
  CircularHotspot,
  PolygonalHotspot,
  Hotspot,
  ConnectionPoint,
  Region,
} from './hotspots';

// Sheet types
export type {
  GridLayout,
  ImageLayout,
  TrackLayout,
  TerritoryLayout,
  ConnectionLayout,
  TechTreeLayout,
  FreeformLayout,
  CompositeLayout,
  SheetLayout,
  Sheet,
} from './sheets';

// Dice types
export type {
  StandardDieType,
  DieFace,
  StandardDie,
  CustomDie,
  Die,
  DieResult,
  DicePool,
  RollHistoryEntry,
  DiceState,
} from './dice';

// Card types
export type {
  FieldValue,
  CardField,
  Card,
  DeckConfig,
  DeckState,
  CardState,
} from './cards';

// Game state types
export type {
  ToolType,
  Tool,
  GameAction,
  HistoryState,
  GameState,
  GameConfig,
  SavedGame,
} from './game';
