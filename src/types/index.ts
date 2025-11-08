/**
 * Roll-and-Write Game Engine Types
 * Central export for all type definitions
 */

// Mark types
export type {
  CheckboxState,
  CircleFillState,
  BaseMark,
  CheckboxMark,
  NumberMark,
  ColorMark,
  CircleMark,
  SymbolMark,
  TextMark,
  LineMark,
  LineStyle,
  Mark,
  MarkType,
  MarkConfig,
} from './marks';

// Hotspot types
export type {
  Point,
  Rectangle,
  Circle,
  Polygon,
  HotspotShape,
  BaseHotspot,
  CellHotspot,
  ConnectionPointHotspot,
  RegionHotspot,
  TrackSpaceHotspot,
  Hotspot,
  HotspotType,
  HotspotStyle,
  HotspotConstraint,
} from './hotspots';

// Sheet types
export type {
  SheetLayoutType,
  BaseSheet,
  GridSheet,
  ImageOverlaySheet,
  MixedSheet,
  CustomSheet,
  Sheet,
  GridConfig,
  ImageConfig,
  SheetRegion,
  TrackConfig,
  TerritoryConfig,
  ConnectionConfig,
  BackgroundConfig,
} from './sheets';

// Dice types
export type {
  StandardDieType,
  DieFaceValue,
  DieFaceComplex,
  CustomFace,
  StandardDie,
  CustomDie,
  Die,
  DicePool,
  RollResult,
  DiceModification,
  DiceConfig,
} from './dice';

// Card types
export type {
  CardFieldValue,
  CardField,
  Card,
  Deck,
  DeckConfig,
  DeckAction,
  DrawResult,
  DeckSnapshot,
} from './cards';

// Game state types
export type {
  ToolType,
  ActiveTool,
  GameAction,
  HistoryEntry,
  GameStateSnapshot,
  GameState,
  GameMetadata,
  GameConfig,
  ToolPaletteItem,
} from './game';
