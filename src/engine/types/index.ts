/**
 * Engine Types Index
 * Central export for all type definitions
 */

// Mark types
export type {
  BaseMark,
  CheckboxMark,
  NumberMark,
  ColorMark,
  CircleMark,
  SymbolMark,
  TextMark,
  LineMark,
  AreaMark,
  Mark,
  MarkType,
  MarkConstraints,
} from './marks';

// Hotspot types
export type {
  Position,
  Dimensions,
  BaseHotspot,
  RectHotspot,
  CircleHotspot,
  PolygonHotspot,
  GridCellHotspot,
  NodeHotspot,
  Hotspot,
  HotspotType,
  Region,
} from './hotspots';

// Sheet types
export type {
  LayoutType,
  GridLayout,
  FreeformLayout,
  ImageOverlayLayout,
  MixedLayout,
  Layout,
  Sheet,
  SheetConfig,
} from './sheets';

// Dice types
export type {
  StandardDieType,
  FaceValue,
  DieFace,
  CustomDie,
  StandardDie,
  DieInstance,
  DicePool,
  DiceRollResult,
  DiceRollHistory,
  DiceConfig,
  DiceModification,
} from './dice';

// Card types
export type {
  CardFieldType,
  CardField,
  Card,
  CardInstance,
  Deck,
  DeckPile,
  DeckState,
  CardDeckConfig,
  CardOperation,
} from './cards';

// State types
export type {
  ToolType,
  ToolState,
  Action,
  HistoryEntry,
  History,
  SheetState,
  GameState,
  SavedGame,
  AutoSaveConfig,
} from './state';

// Game types
export type {
  SymbolPalette,
  ColorPalette,
  GameMetadata,
  GameConfig,
  GameInstance,
} from './game';
