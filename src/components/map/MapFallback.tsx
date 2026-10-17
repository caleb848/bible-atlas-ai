import { MapPinOff } from 'lucide-react'
import { useI18n } from '../../i18n/i18n'
import type { MapInsets } from '../layout/useMapInsets'
import { RouteSketch } from '../ui/RouteSketch'
import type { MapScene } from './scene'

interface MapFallbackProps {
  scene: MapScene
  selectedStopIndex: number | null
  insets: MapInsets
}

/**
 * Shown when the interactive map cannot run. Journeys still get a schematic drawing of their
 * route, and everything else stays available in the panel.
 */
export function MapFallback({ scene, selectedStopIndex, insets }: MapFallbackProps) {
  const { t, text } = useI18n()
  return (
    <div
      role="region"
      aria-label={t('map.unavailableTitle')}
      className="absolute inset-0 overflow-hidden bg-[#efebe4] [background-image:linear-gradient(rgb(110_100_85/0.07)_1px,transparent_1px),linear-gradient(90deg,rgb(110_100_85/0.07)_1px,transparent_1px)] [background-size:56px_56px]"
    >
      <div
        className="absolute flex flex-col items-center justify-center gap-5 p-6"
        style={{ top: insets.top, right: insets.right, bottom: insets.bottom, left: insets.left }}
      >
        {scene.kind === 'journey' && (
          <RouteSketch
            journey={scene.journey}
            selectedIndex={selectedStopIndex}
            width={560}
            height={360}
            showLabels
            className="h-auto max-h-[55vh] w-full max-w-[560px]"
            title={`${t('map.schematicLabel')}: ${text(scene.journey.title)}`}
          />
        )}
        <div className="surface max-w-md rounded-2xl px-5 py-4 text-center">
          <MapPinOff aria-hidden className="mx-auto mb-2 size-5 text-cobalt-600" />
          <p className="font-medium text-ink-950">{t('map.unavailableTitle')}</p>
          <p className="mt-1 text-[13.5px] leading-relaxed text-ink-600">{t('map.unavailableBody')}</p>
        </div>
      </div>
    </div>
  )
}
