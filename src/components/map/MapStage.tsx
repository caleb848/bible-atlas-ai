import { CloudOff, X } from 'lucide-react'
import { lazy, Suspense, useEffect, useState } from 'react'
import { useI18n } from '../../i18n/i18n'
import { ErrorBoundary } from '../feedback/ErrorBoundary'
import type { AtlasMapProps } from './AtlasMap'
import { MapFallback } from './MapFallback'
import { supportsWebGL } from './webgl'
import { useIsDesktop } from '../../hooks/useMediaQuery'

// MapLibre is the largest dependency, so it loads once the page has painted (see below).
const AtlasMap = lazy(() => import('./AtlasMap'))

type MapStageProps = Omit<AtlasMapProps, 'onUnavailable' | 'onTilesFailing' | 'onReady'>

type Status = 'waiting' | 'map' | 'unavailable'

const INTERACTIONS = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const

/**
 * The map layer. The server-rendered page shows a quiet atlas-paper placeholder; the interactive
 * map loads when the browser is idle after the first paint, and a schematic view replaces it if
 * WebGL is unavailable.
 *
 * On phones, the opening view first shows a static image of the same map (public/posters, rendered
 * by `npm run map:poster`), and the live map loads on the reader's first interaction: a phone's
 * first visit then skips the map library and over a megabyte of map tiles.
 */
export function MapStage(props: MapStageProps) {
  const { t } = useI18n()
  const [status, setStatus] = useState<Status>('waiting')
  const [ready, setReady] = useState(false)
  const [tilesFailing, setTilesFailing] = useState(false)
  const overview = props.scene.kind === 'overview'
  const desktop = useIsDesktop()
  /** Phones' opening view: the map image stays on top until the live map has drawn, then fades. */
  const cover = overview && !desktop

  useEffect(() => {
    const start = () => setStatus((current) => (current === 'waiting' ? (supportsWebGL() ? 'map' : 'unavailable') : current))
    if (window.matchMedia('(max-width: 899px)').matches && overview && document.documentElement.classList.contains('first-paint')) {
      for (const type of INTERACTIONS) window.addEventListener(type, start, { passive: true })
      return () => {
        for (const type of INTERACTIONS) window.removeEventListener(type, start)
      }
    }
    // Safari has no requestIdleCallback.
    const idle = window.requestIdleCallback as typeof window.requestIdleCallback | undefined
    if (idle) {
      const id = idle(start, { timeout: 500 })
      return () => window.cancelIdleCallback(id)
    }
    const timer = setTimeout(start, 120)
    return () => clearTimeout(timer)
    // A screen other than the overview (reached without a tap, e.g. with the back button) needs the map.
  }, [overview])

  const fallback = <MapFallback scene={props.scene} selectedStopIndex={props.selectedStopIndex} insets={props.insets} />
  if (status === 'unavailable') return fallback

  return (
    <ErrorBoundary fallback={fallback}>
      {/* The placeholder (or the phone's map image) is shown until the live map has drawn. */}
      <MapPlaceholder
        poster={overview}
        insetBottom={props.insets.bottom}
        className={`transition-opacity duration-500 ${cover ? 'pointer-events-none z-10' : ''} ${ready ? 'opacity-0' : ''}`}
      />
      {status === 'map' && (
        <Suspense fallback={null}>
          <AtlasMap
            {...props}
            onReady={() => setReady(true)}
            onUnavailable={() => setStatus('unavailable')}
            onTilesFailing={() => setTilesFailing(true)}
          />
        </Suspense>
      )}
      {tilesFailing && (
        <div
          role="status"
          className="surface absolute left-1/2 z-20 flex max-w-[min(92vw,460px)] -translate-x-1/2 items-start gap-3 rounded-2xl px-4 py-3 text-[13px] text-ink-800"
          style={{ bottom: props.insets.bottom + 16 }}
        >
          <CloudOff aria-hidden className="mt-0.5 size-4 shrink-0 text-cobalt-600" />
          <p className="flex-1">{t('map.tilesFailed')}</p>
          <button
            type="button"
            onClick={() => setTilesFailing(false)}
            aria-label={t('common.close')}
            className="-mr-1 rounded-full p-1 text-ink-500 hover:text-ink-900"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
    </ErrorBoundary>
  )
}

/** A transparent pixel: larger screens never download the phone's map image. */
const NO_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

/**
 * The limestone land colour with a faint engraved grid, until the map's first tiles arrive. On
 * phones the opening view shows a picture of the map instead.
 */
function MapPlaceholder({ poster, insetBottom, className = '' }: { poster: boolean; insetBottom: number; className?: string }) {
  const { t } = useI18n()
  return (
    <div
      className={`absolute inset-0 overflow-hidden bg-[#efebe4] [background-image:linear-gradient(rgb(110_100_85/0.06)_1px,transparent_1px),linear-gradient(90deg,rgb(110_100_85/0.06)_1px,transparent_1px)] [background-size:72px_72px] ${className}`}
    >
      {poster && (
        <picture>
          <source media="(max-width: 899px)" srcSet="/posters/overview-phone.jpg" />
          {/* The image covers the top of the map (what shows above the sheet), at the map's width. */}
          <img src={NO_IMAGE} alt="" fetchPriority="high" width={412} height={560} className="h-auto w-full md:hidden" />
        </picture>
      )}
      {poster && (
        // The picture shows OpenStreetMap data, so it carries the same credit as the live map.
        <p
          className="pointer-events-auto absolute left-2.5 rounded-xl bg-paper/80 px-2 py-0.5 text-[10.5px] leading-[1.4] text-ink-500 md:hidden"
          style={{ bottom: Math.max(0, insetBottom - 20) + 8 }}
        >
          <a href="https://openfreemap.org" className="text-ink-600">
            OpenFreeMap
          </a>{' '}
          <a href="https://www.openmaptiles.org/" className="text-ink-600">
            © OpenMapTiles
          </a>{' '}
          {t('map.dataFrom')}{' '}
          <a href="https://www.openstreetmap.org/copyright" className="text-ink-600">
            OpenStreetMap
          </a>
        </p>
      )}
      <span className="sr-only">{t('map.loading')}</span>
    </div>
  )
}
