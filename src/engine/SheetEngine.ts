import type {
  SheetDefinition,
  SheetState,
  MarkType,
  Point,
  Hotspot,
  Mark,
  SaveState,
  EngineEvent
} from './types';
import { EventBus } from './EventBus';
import { HistoryManager, AddMarkCommand, RemoveMarkCommand } from './History';
import { Geometry } from '../utils/geometry';

type EventCallback = (event: EngineEvent) => void;

export class SheetEngine {
  private sheets: Map<string, SheetState> = new Map();
  private currentSheetId: string;
  private currentTool: MarkType = 'checkbox';
  private currentValue: string | number = '';
  private eventBus: EventBus = new EventBus();
  private history: HistoryManager = new HistoryManager();

  constructor(sheetDefinitions: SheetDefinition[]) {
    // Initialize sheets with hotspot generation
    sheetDefinitions.forEach(def => {
      const regions = def.regions.map(region => {
        if (region.type === 'grid' && region.layout) {
          // Auto-generate hotspots for grid
          const hotspots = Geometry.generateGridHotspots(
            region.layout,
            ['number', 'checkbox'] // Default, can be overridden
          );
          return { ...region, hotspots };
        }
        return region;
      });

      this.sheets.set(def.id, {
        definition: { ...def, regions },
        marks: new Map()
      });
    });

    this.currentSheetId = sheetDefinitions[0]?.id || '';
  }

  // Event subscription
  on(eventType: EngineEvent['type'], callback: EventCallback): () => void {
    return this.eventBus.on(eventType, callback);
  }

  // Sheet management
  getCurrentSheet(): SheetState | undefined {
    return this.sheets.get(this.currentSheetId);
  }

  getAllSheets(): SheetDefinition[] {
    return Array.from(this.sheets.values()).map(state => state.definition);
  }

  switchSheet(sheetId: string): void {
    const previousId = this.currentSheetId;
    if (this.sheets.has(sheetId)) {
      this.currentSheetId = sheetId;
      this.eventBus.emit({
        type: 'sheetChanged',
        previousSheetId: previousId,
        currentSheetId: sheetId
      });
    }
  }

  // Tool management
  setCurrentTool(tool: MarkType): void {
    const previous = this.currentTool;
    this.currentTool = tool;
    this.eventBus.emit({
      type: 'toolChanged',
      previousTool: previous,
      currentTool: tool
    });
  }

  getCurrentTool(): MarkType {
    return this.currentTool;
  }

  setCurrentValue(value: string | number): void {
    this.currentValue = value;
  }

  getCurrentValue(): string | number {
    return this.currentValue;
  }

  // Hit detection
  getHotspotAt(point: Point): Hotspot | null {
    const sheet = this.getCurrentSheet();
    if (!sheet) return null;

    // Check all regions, respecting z-index
    const sortedRegions = [...sheet.definition.regions].sort(
      (a, b) => (b.zIndex || 0) - (a.zIndex || 0)
    );

    for (const region of sortedRegions) {
      const hotspots = region.hotspots || [];
      for (const hotspot of hotspots) {
        if (Geometry.isPointInHotspot(point, hotspot)) {
          return hotspot;
        }
      }
    }

    return null;
  }

  // Mark operations
  canPlaceMark(hotspot: Hotspot): boolean {
    // Check if tool is allowed
    if (!hotspot.allowedMarkTypes.includes(this.currentTool)) {
      return false;
    }

    // Check mark limit
    if (hotspot.maxMarks && hotspot.currentMark) {
      return false; // Already at limit
    }

    return true;
  }

  addMark(hotspotId: string, value?: string | number): boolean {
    const sheet = this.getCurrentSheet();
    if (!sheet) return false;

    // Find hotspot
    let targetHotspot: Hotspot | undefined;
    for (const region of sheet.definition.regions) {
      targetHotspot = region.hotspots?.find(h => h.id === hotspotId);
      if (targetHotspot) break;
    }

    if (!targetHotspot || !this.canPlaceMark(targetHotspot)) {
      this.eventBus.emit({
        type: 'markRejected',
        sheetId: this.currentSheetId,
        hotspotId,
        reason: 'Tool not allowed or hotspot full'
      });
      return false;
    }

    // Handle cycling for checkbox and circle types
    if (targetHotspot.currentMark) {
      if (this.currentTool === 'checkbox') {
        return this.cycleCheckbox(hotspotId, targetHotspot);
      } else if (this.currentTool === 'circle') {
        return this.cycleCircle(hotspotId, targetHotspot);
      }
    }

    // Create mark
    const markValue = value ?? (this.currentValue || this.getDefaultValue(this.currentTool));
    const mark: Mark = {
      id: `${hotspotId}-${Date.now()}`,
      type: this.currentTool,
      value: markValue,
      timestamp: Date.now(),
      isPermanent: this.currentTool !== 'pencil'
    };

    // Execute via history
    const command = new AddMarkCommand(
      this.currentSheetId,
      hotspotId,
      mark,
      this.sheets
    );
    this.history.execute(command);

    // Update hotspot reference
    targetHotspot.currentMark = mark;

    // Emit event
    this.eventBus.emit({
      type: 'markAdded',
      sheetId: this.currentSheetId,
      hotspotId,
      mark
    });

    return true;
  }

  private cycleCheckbox(hotspotId: string, hotspot: Hotspot): boolean {
    if (!hotspot.currentMark) return false;

    const currentValue = hotspot.currentMark.value;
    let newValue: string | boolean;

    if (currentValue === false || currentValue === 'empty') {
      newValue = 'checked';
    } else if (currentValue === 'checked' || currentValue === true) {
      newValue = 'crossed';
    } else {
      // Remove mark if already crossed
      return this.removeMark(hotspotId);
    }

    // Remove old mark and add new one
    this.removeMark(hotspotId);
    return this.addMark(hotspotId, newValue);
  }

  private cycleCircle(hotspotId: string, hotspot: Hotspot): boolean {
    if (!hotspot.currentMark) return false;

    const currentValue = hotspot.currentMark.value;
    let newValue: string;

    if (currentValue === 'empty' || currentValue === false) {
      newValue = 'half';
    } else if (currentValue === 'half') {
      newValue = 'filled';
    } else {
      // Remove mark if already filled
      return this.removeMark(hotspotId);
    }

    // Remove old mark and add new one
    this.removeMark(hotspotId);
    return this.addMark(hotspotId, newValue);
  }

  removeMark(hotspotId: string): boolean {
    const sheet = this.getCurrentSheet();
    if (!sheet) return false;

    const mark = sheet.marks.get(hotspotId);
    if (!mark) return false;

    // Find hotspot
    let targetHotspot: Hotspot | undefined;
    for (const region of sheet.definition.regions) {
      targetHotspot = region.hotspots?.find(h => h.id === hotspotId);
      if (targetHotspot) break;
    }

    // Execute via history
    const command = new RemoveMarkCommand(
      this.currentSheetId,
      hotspotId,
      mark,
      this.sheets
    );
    this.history.execute(command);

    // Update hotspot reference
    if (targetHotspot) {
      targetHotspot.currentMark = undefined;
    }

    // Emit event
    this.eventBus.emit({
      type: 'markRemoved',
      sheetId: this.currentSheetId,
      hotspotId,
      mark
    });

    return true;
  }

  rejectMark(hotspotId: string, reason: string = 'Invalid move'): void {
    this.eventBus.emit({
      type: 'markRejected',
      sheetId: this.currentSheetId,
      hotspotId,
      reason
    });
  }

  // History
  undo(): boolean {
    const result = this.history.undo();
    if (result) {
      // Update hotspot references
      this.syncHotspotsWithMarks();
    }
    return result;
  }

  redo(): boolean {
    const result = this.history.redo();
    if (result) {
      // Update hotspot references
      this.syncHotspotsWithMarks();
    }
    return result;
  }

  canUndo(): boolean {
    return this.history.canUndo();
  }

  canRedo(): boolean {
    return this.history.canRedo();
  }

  private syncHotspotsWithMarks(): void {
    const sheet = this.getCurrentSheet();
    if (!sheet) return;

    // Clear all hotspot marks
    for (const region of sheet.definition.regions) {
      region.hotspots?.forEach(hotspot => {
        hotspot.currentMark = undefined;
      });
    }

    // Re-apply marks from state
    sheet.marks.forEach((mark, hotspotId) => {
      for (const region of sheet.definition.regions) {
        const hotspot = region.hotspots?.find(h => h.id === hotspotId);
        if (hotspot) {
          hotspot.currentMark = mark;
          break;
        }
      }
    });
  }

  // Serialization
  exportState(): SaveState {
    const sheets = Array.from(this.sheets.entries()).map(([sheetId, sheet]) => ({
      sheetId,
      marks: Array.from(sheet.marks.entries()).map(([hotspotId, mark]) => ({
        hotspotId,
        mark
      }))
    }));

    return {
      version: 1,
      timestamp: Date.now(),
      sheets
    };
  }

  importState(saveState: SaveState): void {
    // Validate version
    if (saveState.version !== 1) {
      throw new Error(`Unsupported save state version: ${saveState.version}`);
    }

    // Clear current state
    this.sheets.forEach(sheet => sheet.marks.clear());
    this.history.clear();

    // Restore marks
    saveState.sheets.forEach(savedSheet => {
      const sheet = this.sheets.get(savedSheet.sheetId);
      if (sheet) {
        savedSheet.marks.forEach(({ hotspotId, mark }) => {
          sheet.marks.set(hotspotId, mark);

          // Update hotspot reference
          for (const region of sheet.definition.regions) {
            const hotspot = region.hotspots?.find(h => h.id === hotspotId);
            if (hotspot) {
              hotspot.currentMark = mark;
              break;
            }
          }
        });
      }
    });
  }

  private getDefaultValue(tool: MarkType): string | number | boolean {
    switch (tool) {
      case 'checkbox': return false;
      case 'number': return 0;
      case 'fill': return '#cccccc';
      case 'circle': return 'empty';
      default: return '';
    }
  }
}
