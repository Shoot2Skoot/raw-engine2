import { SheetState, Hotspot as HotspotType } from '../types'
import { useGame } from '../context/GameContext'
import { Hotspot } from './Hotspot'

interface SheetRendererProps {
  sheet: SheetState
}

export function SheetRenderer({ sheet }: SheetRendererProps) {
  const { state } = useGame()
  const { definition } = sheet

  // Collect all hotspots from regions and individual hotspots
  const allHotspots: HotspotType[] = [
    ...definition.hotspots,
    ...definition.regions.flatMap((region) => region.hotspots),
  ]

  // Group marks by hotspot
  const marksByHotspot = new Map<string, typeof state.marks[string][]>()
  Object.values(state.marks).forEach((mark) => {
    const existing = marksByHotspot.get(mark.hotspotId) || []
    marksByHotspot.set(mark.hotspotId, [...existing, mark])
  })

  return (
    <div className="flex-1 overflow-auto p-8 bg-gray-50">
      <div
        className="bg-white shadow-lg mx-auto"
        style={{
          width: definition.size.width,
          height: definition.size.height,
          maxWidth: '100%',
        }}
      >
        <svg
          width={definition.size.width}
          height={definition.size.height}
          viewBox={`0 0 ${definition.size.width} ${definition.size.height}`}
          className="w-full h-auto"
        >
          {/* Background */}
          <rect
            width={definition.size.width}
            height={definition.size.height}
            fill={definition.backgroundColor || '#ffffff'}
          />

          {/* Background image if specified */}
          {definition.backgroundImage && (
            <image
              href={definition.backgroundImage}
              width={definition.size.width}
              height={definition.size.height}
            />
          )}

          {/* Render all hotspots */}
          {allHotspots.map((hotspot) => (
            <Hotspot
              key={hotspot.id}
              hotspot={hotspot}
              marks={marksByHotspot.get(hotspot.id) || []}
            />
          ))}
        </svg>
      </div>
    </div>
  )
}
