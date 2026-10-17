import type { Feature, FeatureCollection, Point } from 'geojson'
import {
  type CameraOptions,
  type ExpressionSpecification,
  type GeoJSONSource,
  type LngLatBoundsLike,
  Map as MapLibreMap,
  Marker,
  setWorkerUrl,
} from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { allJourneys, allPlaces, eventsAtPlace } from '../../data/atlas'
import type { Place, PlaceKind } from '../../data/types'
import { useI18n } from '../../i18n/i18n'
import { boundsOf, type LngLat } from '../../lib/geo/geo'
import type { MapInsets } from '../layout/useMapInsets'
import { ATLAS_COLORS, createAtlasStyle, MODERN_LABEL_PREFIX } from './atlasStyle'
import { compactMarkers, type LabelItem, layoutLabels } from './labelLayout'
import { type MapLabels, MapControls } from './MapControls'
import { discsFor } from './markerDiscs'
import { type MarkerState, type MarkerVisit, MarkerView } from './MarkerView'
import { buildRouteGeometry, overviewFeatures, routeFeatures } from './routeGeometry'
import { type MapScene, type MarkerSpec, markersForScene, type OverviewEmphasis, sceneKey, scenePoints } from './scene'

// The worker is bundled by Vite; MapLibre cannot find it relative to its own module once bundled.
setWorkerUrl(workerUrl)

export interface AtlasMapProps {
  scene: MapScene
  selectedStopIndex: number | null
  /** Places to keep in view around the selected stop, e.g. every place a search answer names. */
  focusPlaceIds?: readonly string[] | null
  /** A stop hovered in the timeline; its marker is highlighted. */
  hoveredStopIndex: number | null
  onHoverStop: (index: number | null) => void
  highlightJourneyId: string | null
  /** Pointing at "Journeys" or "Places" in the home screen's index brings them forward on the opening view. */
  overviewEmphasis?: OverviewEmphasis | null
  insets: MapInsets
  reducedMotion: boolean
  labels: MapLabels
  onLabelsChange: (labels: MapLabels) => void
  /** The presentation view hides the map controls. */
  presentation: boolean
  onSelectStop: (index: number) => void
  onSelectPlace: (placeId: string) => void
  /** The map cannot run here (no WebGL, or the style failed). */
  onUnavailable: () => void
  /** Tiles keep failing to load (offline or blocked). */
  onTilesFailing: () => void
  /** The map has drawn its first complete view. */
  onReady?: () => void
}

/** The opening view: from Rome to Jerusalem and Antioch, where every mapped journey takes place. */
const OVERVIEW: LngLatBoundsLike = [
  [12.2, 29.8],
  [37.2, 42.2],
]
const MAX_FIT_ZOOM = 13.5
/** Extra space around fitted bounds, inside the padded viewport (room for the end stops' labels). */
const CAMERA_MARGIN = 48

/**
 * How a scene is fitted. A person's places are named markers scattered over a region, so they get
 * more room at the edges (for their labels) and never a street-level zoom.
 */
const fitOptions = (scene: MapScene) =>
  scene.kind === 'person' || scene.kind === 'places' ? { padding: 72, maxZoom: 10 } : { padding: CAMERA_MARGIN, maxZoom: MAX_FIT_ZOOM }

/** Zoom when a place is shown on its own. */
const PLACE_ZOOM: Record<PlaceKind, number> = {
  site: 15,
  mountain: 13,
  village: 10.5,
  town: 10.5,
  city: 9.3,
  port: 9.3,
  river: 9.2,
  lake: 9.4,
  promontory: 9,
  island: 8.2,
  region: 6.4,
}

/** Zoom when a stop is focused within a journey: closer than the whole journey, never further out. */
function stopZoom(place: Place, fitZoom: number): number {
  const lift = place.kind === 'region' ? 0.8 : place.kind === 'island' ? 1.4 : 1.7
  return Math.max(fitZoom, Math.min(fitZoom + lift, PLACE_ZOOM[place.kind]))
}

function sceneBounds(scene: MapScene): LngLatBoundsLike {
  return (boundsOf(scenePoints(scene) as LngLat[]) as LngLatBoundsLike | null) ?? OVERVIEW
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

/**
 * The camera that fits `bounds` with `margin` to spare inside the insets: the given ones, or the
 * map's current padding when none are given.
 */
function fit(map: MapLibreMap, bounds: LngLatBoundsLike, margin: number, maxZoom: number, insets?: MapInsets): CameraOptions | undefined {
  if (!insets) return map.cameraForBounds(bounds, { padding: margin, maxZoom })
  const padding = { top: insets.top + margin, right: insets.right + margin, bottom: insets.bottom + margin, left: insets.left + margin }
  const camera = map.cameraForBounds(bounds, { padding, maxZoom, absolutePadding: true })
  return camera && { center: camera.center, zoom: camera.zoom, bearing: camera.bearing }
}

/**
 * Where the camera belongs for a scene and, in Journey Mode, its selected stop (with any places
 * that must stay in view, such as every place a search answer names). Without `insets`, expects the
 * map's padding to match the current insets.
 */
function sceneCamera(
  map: MapLibreMap,
  scene: MapScene,
  selectedStopIndex: number | null,
  focusIds: readonly string[],
  insets?: MapInsets,
): CameraOptions | undefined {
  if (scene.kind === 'place') return { center: scene.place.coordinates, zoom: PLACE_ZOOM[scene.place.kind] }
  if (scene.kind === 'journey' && selectedStopIndex !== null) {
    const place = scene.stops.find((stop) => stop.index === selectedStopIndex)?.place
    if (place) {
      const fitZoom = fit(map, sceneBounds(scene), CAMERA_MARGIN, MAX_FIT_ZOOM, insets)?.zoom ?? 5
      const focus = scene.stops.filter((stop) => focusIds.includes(stop.place.id)).map((stop) => stop.place.coordinates)
      const bounds = focus.length >= 2 ? boundsOf(focus as LngLat[]) : null
      const framed = bounds ? fit(map, bounds as LngLatBoundsLike, CAMERA_MARGIN * 2, stopZoom(place, fitZoom), insets) : undefined
      return framed ?? { center: place.coordinates, zoom: stopZoom(place, fitZoom) }
    }
  }
  const options = fitOptions(scene)
  return fit(map, sceneBounds(scene), options.padding, options.maxZoom, insets)
}

/** Identifies a framing, so the camera only moves when it changes. */
const framingKey = (key: string, selectedStopIndex: number | null, focusKey: string) => `${key}|${selectedStopIndex ?? ''}|${focusKey}`

/** Before the reader's first interaction, the map starts where it belongs, without a flight. */
const firstPaint = () => document.documentElement.classList.contains('first-paint')

const SETTLEMENT: ReadonlySet<PlaceKind> = new Set(['city', 'port', 'town', 'island'])

/** Where a route begins or ends (Antioch, Jerusalem, Caesarea, Rome…). */
const routeEnds = new Set(
  allJourneys.filter((journey) => journey.type === 'route').flatMap((journey) => [journey.stops[0]?.placeId, journey.stops.at(-1)?.placeId]),
)

/**
 * Every biblical place, for the "biblical places" label layer. `landmark` marks the settlements the
 * atlas narrates most (three or more events) and where its routes begin or end; they are named on
 * the opening view, so it reads as a map of biblical places rather than a tangle of lines.
 */
function ancientPlaces(): FeatureCollection<Point, { id: string; name: string; rank: number; landmark: boolean; area: boolean; weight: number }> {
  return {
    type: 'FeatureCollection',
    features: allPlaces.map((place) => {
      const events = eventsAtPlace(place.id).length
      return {
        type: 'Feature',
        properties: {
          id: place.id,
          name: place.name.en,
          rank: place.kind === 'city' || place.kind === 'region' ? 0 : 1,
          landmark: SETTLEMENT.has(place.kind) && (events >= 3 || routeEnds.has(place.id)),
          area: place.kind === 'region',
          weight: -events,
        },
        geometry: { type: 'Point', coordinates: place.coordinates },
      }
    }),
  }
}

const ROUTE_LAYERS = [
  ['route-solid', 'solid', 2.6],
  ['route-sea', 'sea', 2.6],
  ['route-uncertain', 'uncertain', 2.9],
] as const

export default function AtlasMap(props: AtlasMapProps) {
  const { scene, selectedStopIndex, hoveredStopIndex, highlightJourneyId, overviewEmphasis, insets, reducedMotion, labels, presentation } = props
  const { t, text } = useI18n()
  const containerRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<MapLibreMap | null>(null)
  const [anchors, setAnchors] = useState<Map<string, HTMLElement>>(() => new Map())
  const markerRoots = useRef(new Map<string, HTMLDivElement>())
  /** Measured label and marker sizes, cached per marker (the selected one is re-measured). */
  const sizes = useRef(new Map<string, { labelWidth: number; halfWidth: number; radius: number }>())
  const drawFrame = useRef<number | null>(null)
  const drawing = useRef(false)
  /** Last data sent to the "occupied" source, so it is only updated when the layout changes. */
  const occupiedSignature = useRef('')
  /** The framing the camera last moved to (see `framingKey`). */
  const framed = useRef('')
  /**
   * Where a camera flight is heading. The floating panels can change size while it is under way
   * (Journey Mode's card, timeline and controls arrive as the flight to the first stop begins), and
   * setting the map's padding then would stop the flight short; it is redirected instead.
   */
  const destination = useRef<((insets: MapInsets) => CameraOptions | undefined) | null>(null)

  // Map event handlers are registered once; they read the latest props through this ref.
  const latest = useRef(props)
  useEffect(() => {
    latest.current = props
  })

  const key = sceneKey(scene)
  const markers = useMemo(() => markersForScene(scene), [scene])
  const geometry = useMemo(
    () => (scene.kind === 'journey' && scene.journey.type === 'route' ? buildRouteGeometry(scene.stops) : null),
    [scene],
  )
  /** For each marker, how far along the route it first appears (0..1). */
  const revealAt = useMemo(() => {
    const result = new Map<string, number>()
    if (scene.kind !== 'journey' || !geometry) return result
    scene.stops.forEach((stop, position) => {
      if (!result.has(stop.place.id)) result.set(stop.place.id, geometry.stopFractions[position] ?? 0)
    })
    return result
  }, [scene, geometry])

  const selectedPlaceId =
    scene.kind === 'journey' && selectedStopIndex !== null
      ? (scene.journey.stops[selectedStopIndex]?.placeId ?? null)
      : scene.kind === 'place'
        ? scene.place.id
        : null

  const markerState = (spec: MarkerSpec): MarkerState => {
    if (scene.kind !== 'journey' || selectedStopIndex === null || spec.stopIndexes.length === 0) return 'idle'
    if (spec.stopIndexes.includes(selectedStopIndex)) return 'current'
    return spec.stopIndexes.some((index) => index < selectedStopIndex) ? 'done' : 'upcoming'
  }
  /** Each visit's own state, for places the journey visits more than once. */
  const markerVisits = (spec: MarkerSpec): MarkerVisit[] =>
    spec.numbers.map((number, position) => {
      const index = spec.stopIndexes[position] ?? -1
      const state: MarkerState =
        scene.kind !== 'journey' || selectedStopIndex === null
          ? 'idle'
          : index === selectedStopIndex
            ? 'current'
            : index < selectedStopIndex
              ? 'done'
              : 'upcoming'
      return { number, index, state }
    })

  // --- Map lifecycle ---------------------------------------------------------------------------
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let instance: MapLibreMap
    try {
      instance = new MapLibreMap({
        container,
        style: createAtlasStyle({ relief: window.matchMedia('(min-width: 900px)').matches }),
        center: [24.5, 36],
        zoom: 4,
        minZoom: 2.5,
        maxZoom: 16.5,
        renderWorldCopies: false,
        // Sharp enough on any screen without paying for 3× rendering on phones.
        pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        fadeDuration: 200,
        dragRotate: false,
        pitchWithRotate: false,
        touchPitch: false,
        // Expanded on wide maps; on phones it collapses to a button once the map is moved.
        attributionControl: {},
        locale: { 'Map.Title': t('map.label') },
      })
    } catch {
      latest.current.onUnavailable()
      return
    }
    instance.touchZoomRotate.disableRotation()
    instance.keyboard.disableRotation()
    // The panel insets are the map's persistent padding, so every camera move (and the "centre"
    // of the map) keeps clear of the floating surfaces. Camera calls below add only a margin.
    instance.setPadding({ ...latest.current.insets })
    // Start at the scene's own framing, so a page opened directly never downloads the overview's
    // tiles on the way (and never flies there).
    const { scene: initialScene, selectedStopIndex: initialStop, focusPlaceIds: initialFocus } = latest.current
    const initialCamera = sceneCamera(instance, initialScene, initialStop, initialFocus ?? [])
    if (initialCamera) instance.jumpTo(initialCamera)
    else instance.fitBounds(OVERVIEW, { padding: CAMERA_MARGIN, duration: 0 })
    framed.current = framingKey(sceneKey(initialScene), initialStop, initialFocus?.join(',') ?? '')

    let loaded = false
    let tileErrors = 0
    let tilesLoaded = 0
    let reported = false
    const slowLoad = window.setTimeout(() => !loaded && latest.current.onTilesFailing(), 25_000)
    instance.on('sourcedata', (event) => {
      // Only basemap tiles count; the atlas's own layers are tiled locally from GeoJSON.
      if (event.tile && event.sourceId === 'openmaptiles') tilesLoaded++
    })
    instance.on('error', (event) => {
      if ('sourceId' in event || 'tile' in event) {
        // A few failed tiles are normal on flaky connections; report persistent trouble once: no
        // tile at all after three failures (a phone may only need four), or six failures in all.
        tileErrors++
        if (!reported && ((tileErrors >= 3 && tilesLoaded === 0) || tileErrors >= 6)) {
          reported = true
          latest.current.onTilesFailing()
        }
      } else if (!loaded) {
        latest.current.onUnavailable()
      }
    })
    instance.on('webglcontextlost', () => latest.current.onUnavailable())
    instance.once('idle', () => latest.current.onReady?.())
    instance.on('load', () => {
      loaded = true
      window.clearTimeout(slowLoad)

      // Biblical places beyond the current scene, named in italic like ancient sites on a printed
      // atlas. Shown only when zoomed in, so the overview never shows every place at once.
      instance.addSource('ancient', { type: 'geojson', data: ancientPlaces() })
      instance.addLayer({
        id: 'ancient-dots',
        type: 'circle',
        source: 'ancient',
        minzoom: 5.5,
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 5.5, 2, 10, 3.5],
          'circle-color': '#5f6979',
          'circle-stroke-color': ATLAS_COLORS.halo,
          'circle-stroke-width': 1.2,
          'circle-opacity': ['interpolate', ['linear'], ['zoom'], 5.5, 0, 6.2, 0.9],
          'circle-stroke-opacity': ['interpolate', ['linear'], ['zoom'], 5.5, 0, 6.2, 1],
        },
      })
      instance.addLayer({
        id: 'ancient-labels',
        type: 'symbol',
        source: 'ancient',
        minzoom: 6.2,
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Noto Sans Italic'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 6.2, 11.5, 11, 13.5],
          'text-variable-anchor': ['left', 'right', 'top'],
          'text-radial-offset': 0.55,
          'text-justify': 'auto',
          'symbol-sort-key': ['get', 'rank'],
        },
        paint: { 'text-color': '#374152', 'text-halo-color': ATLAS_COLORS.halo, 'text-halo-width': 1.4 },
      })

      instance.addSource('overview', { type: 'geojson', data: overviewFeatures(allJourneys) })
      instance.addLayer({
        id: 'overview-casing',
        type: 'line',
        source: 'overview',
        layout: { 'line-cap': 'round', 'line-join': 'round', visibility: 'none' },
        paint: { 'line-color': ATLAS_COLORS.routeCasing, 'line-width': 4.5, 'line-opacity': 0.55 },
      })
      instance.addLayer({
        id: 'overview-lines',
        type: 'line',
        source: 'overview',
        layout: { 'line-cap': 'round', 'line-join': 'round', visibility: 'none' },
        // At 0.85 the lines keep a 3:1 contrast with both land and sea.
        paint: { 'line-color': ATLAS_COLORS.overview, 'line-width': 1.8, 'line-opacity': 0.85 },
      })
      // Every place in the atlas (regions are areas, not points), shown while the reader points at
      // "Places" on the home screen.
      instance.addLayer({
        id: 'place-dots',
        type: 'circle',
        source: 'ancient',
        filter: ['!=', ['get', 'area'], true],
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': 3,
          'circle-color': ATLAS_COLORS.routeActive,
          'circle-stroke-color': ATLAS_COLORS.halo,
          'circle-stroke-width': 1.5,
          'circle-opacity': 0,
          'circle-stroke-opacity': 0,
        },
      })
      // The opening view names the best-known places, above the journey lines.
      const landmark: ExpressionSpecification = ['==', ['get', 'landmark'], true]
      instance.addLayer({
        id: 'landmark-dots',
        type: 'circle',
        source: 'ancient',
        filter: landmark,
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': 3,
          'circle-color': ATLAS_COLORS.routeActive,
          'circle-stroke-color': ATLAS_COLORS.halo,
          'circle-stroke-width': 1.5,
        },
      })
      instance.addLayer({
        id: 'landmark-labels',
        type: 'symbol',
        source: 'ancient',
        filter: landmark,
        layout: {
          visibility: 'none',
          'text-field': ['get', 'name'],
          'text-font': ['Noto Sans Italic'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 3.5, 12, 6, 13.5],
          'text-variable-anchor': ['left', 'right', 'top', 'bottom'],
          'text-radial-offset': 0.6,
          'text-justify': 'auto',
          'symbol-sort-key': ['get', 'weight'],
        },
        paint: { 'text-color': '#252e3d', 'text-halo-color': ATLAS_COLORS.halo, 'text-halo-width': 1.6 },
      })

      instance.addSource('route', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } })
      // A paper casing keeps the route crisp over coastlines, relief and labels.
      instance.addLayer({
        id: 'route-casing',
        type: 'line',
        source: 'route',
        filter: ['!=', ['get', 'style'], 'uncertain'],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': ATLAS_COLORS.routeCasing, 'line-width': 7, 'line-opacity': 0.85 },
      })
      instance.addLayer({
        id: 'route-active-glow',
        type: 'line',
        source: 'route',
        filter: ['==', ['get', 'toIndex'], -1],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': ATLAS_COLORS.route, 'line-width': 14, 'line-blur': 8, 'line-opacity': 0.22 },
      })
      for (const [id, style, width] of ROUTE_LAYERS) {
        instance.addLayer({
          id,
          type: 'line',
          source: 'route',
          filter: ['==', ['get', 'style'], style],
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: {
            'line-color': ATLAS_COLORS.route,
            'line-width': width,
            ...(style === 'sea' ? { 'line-dasharray': [2.2, 1.7] } : style === 'uncertain' ? { 'line-dasharray': [0.1, 2.3] } : {}),
          },
        })
      }
      // Invisible stand-ins for the HTML markers and their labels, kept topmost so MapLibre's own
      // collision detection keeps every map label (biblical and modern) clear of them.
      instance.addSource('occupied', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } })
      instance.addLayer({
        id: 'occupied',
        type: 'symbol',
        source: 'occupied',
        layout: {
          'text-field': ['get', 'text'],
          'text-font': ['Noto Sans Regular'],
          'text-size': ['get', 'size'],
          'text-anchor': ['match', ['get', 'anchor'], 'left', 'left', 'right', 'right', 'top', 'top', 'bottom', 'bottom', 'center'],
          'text-offset': ['array', 'number', 2, ['get', 'offset']],
          'text-allow-overlap': true,
          'text-ignore-placement': false,
          'text-padding': 3,
        },
        paint: { 'text-opacity': 0 },
      })
      setMap(instance)
    })

    return () => {
      window.clearTimeout(slowLoad)
      instance.remove()
      setMap(null)
    }
    // Created once per mount; everything else is applied by the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // --- Label layers -----------------------------------------------------------------------------
  useEffect(() => {
    if (!map) return
    for (const layer of map.getStyle().layers) {
      if (layer.id.startsWith(MODERN_LABEL_PREFIX)) map.setLayoutProperty(layer.id, 'visibility', labels.modern ? 'visible' : 'none')
    }
    for (const id of ['ancient-dots', 'ancient-labels']) map.setLayoutProperty(id, 'visibility', labels.ancient ? 'visible' : 'none')
  }, [map, labels])

  // The scene's own markers carry their names; the label layer leaves those places out.
  useEffect(() => {
    if (!map) return
    const shown = markers.map((marker) => marker.id)
    const filter: ExpressionSpecification = ['!', ['in', ['get', 'id'], ['literal', shown]]]
    map.setFilter('ancient-dots', filter)
    map.setFilter('ancient-labels', filter)
  }, [map, markers])

  // --- Markers: DOM anchors positioned by MapLibre; content rendered through React portals ------
  useEffect(() => {
    if (!map) return
    const created = new Map<string, HTMLElement>()
    const instances = markers.map((spec) => {
      const element = document.createElement('div')
      created.set(spec.id, element)
      return new Marker({ element, anchor: 'center' }).setLngLat(spec.place.coordinates).addTo(map)
    })
    sizes.current.clear()
    setAnchors(created)
    return () => instances.forEach((marker) => marker.remove())
  }, [map, markers])

  // The selected marker draws above its neighbours (the label pass below refines the order).
  useEffect(() => {
    anchors.forEach((anchor, id) => {
      anchor.style.zIndex = id === selectedPlaceId ? '3' : '2'
    })
  }, [anchors, selectedPlaceId])

  // A stop hovered in the timeline highlights its marker.
  useEffect(() => {
    for (const spec of markers) {
      const hovered = hoveredStopIndex !== null && spec.stopIndexes.includes(hoveredStopIndex)
      const root = markerRoots.current.get(spec.id)
      root?.setAttribute('data-hovered', String(hovered))
      // A place visited more than once highlights only the visit pointed at (or its count of visits).
      for (const disc of root?.querySelectorAll<HTMLElement>('[data-visits]') ?? []) {
        disc.toggleAttribute('data-hovered', hoveredStopIndex !== null && (disc.dataset.visits ?? '').split(' ').includes(String(hoveredStopIndex)))
      }
    }
  }, [markers, anchors, hoveredStopIndex])

  // --- Label collision, recomputed whenever the camera moves -------------------------------------
  useEffect(() => {
    if (!map) return
    let frame: number | null = null
    const run = () => {
      frame = null
      const items: LabelItem[] = []
      for (const spec of markers) {
        const root = markerRoots.current.get(spec.id)
        const label = root?.querySelector<HTMLElement>('.atlas-marker__label')
        if (!root || !label) continue
        const selected = spec.id === selectedPlaceId
        // The selected label gains a second line, so its width is measured afresh.
        let size = selected ? undefined : sizes.current.get(spec.id)
        if (!size) {
          const button = root.querySelector('button')
          size = { labelWidth: label.offsetWidth, halfWidth: (button?.offsetWidth ?? 26) / 2, radius: (button?.offsetHeight ?? 26) / 2 }
          if (!selected) sizes.current.set(spec.id, size)
        }
        const point = map.project(spec.place.coordinates)
        items.push({
          id: spec.id,
          x: point.x,
          y: point.y,
          radius: size.radius,
          halfWidth: size.halfWidth,
          labelWidth: size.labelWidth,
          labelHeight: label.offsetHeight || 20,
          priority: selected ? 10 : spec.priority,
          force: selected,
        })
      }
      // Labels stay on screen and clear of the floating panels and controls (marked with
      // data-map-obstacle) and the attribution, which cover parts of the map.
      const origin = map.getContainer().getBoundingClientRect()
      const bounds = { left: 0, top: 0, right: origin.width, bottom: origin.height }
      const obstacles = Array.from(document.querySelectorAll('[data-map-obstacle], .maplibregl-ctrl-attrib'), (element) => {
        const rect = element.getBoundingClientRect()
        return { left: rect.left - origin.left, right: rect.right - origin.left, top: rect.top - origin.top, bottom: rect.bottom - origin.top }
      })
      // Crowded markers shrink to dots (and give up their labels) until the map is zoomed in. Full
      // markers never overlap, so each stays a whole 24px target; a shrunken marker leaves the tab
      // order and the accessibility tree (its stop is in the timeline, its place in the lists).
      const compact = compactMarkers(
        items.filter((item) => item.radius >= 10),
        1.05,
      )
      for (const item of items) {
        const root = markerRoots.current.get(item.id)
        root?.setAttribute('data-compact', String(compact.has(item.id)))
        root?.toggleAttribute('inert', compact.has(item.id))
        // Shrunken markers sit beneath full ones; the selected marker is always on top.
        const anchor = anchors.get(item.id)
        if (anchor) anchor.style.zIndex = item.id === selectedPlaceId ? '3' : compact.has(item.id) ? '1' : '2'
      }
      const placements = layoutLabels(
        items.map((item) => (compact.has(item.id) ? { ...item, radius: 4, halfWidth: 4, priority: -1 } : item)),
        { obstacles, bounds },
      )
      for (const [id, placement] of placements) {
        markerRoots.current.get(id)?.setAttribute('data-label', compact.has(id) ? 'hidden' : placement)
      }

      // Reserve the markers' space (and their visible labels') in the map's own label collision.
      const occupied: Array<Feature<Point, { text: string; size: number; anchor: string; offset: [number, number] }>> = []
      for (const item of items) {
        const spec = markers.find((marker) => marker.id === item.id)
        if (!spec) continue
        const coordinates = spec.place.coordinates
        const small = compact.has(item.id)
        const radius = small ? 4 : item.radius
        occupied.push({ type: 'Feature', geometry: { type: 'Point', coordinates }, properties: { text: 'M', size: radius * 2, anchor: 'center', offset: [0, 0] } })
        const placement = placements.get(item.id)
        const label = markerRoots.current.get(item.id)?.querySelector<HTMLElement>('.atlas-marker__label')
        if (small || !label || !placement || placement === 'hidden') continue
        const size = 15
        const vertical = placement === 'top' || placement === 'bottom'
        const shift = ((vertical ? item.radius : (item.halfWidth ?? item.radius)) + 4) / size
        // A label to the right of its marker is text anchored on its left edge, and so on.
        const anchor = { right: 'left', left: 'right', top: 'bottom', bottom: 'top' }[placement]
        const offset: [number, number] = { right: [shift, 0], left: [-shift, 0], top: [0, -shift], bottom: [0, shift] }[placement] as [number, number]
        occupied.push({ type: 'Feature', geometry: { type: 'Point', coordinates }, properties: { text: label.innerText, size, anchor, offset } })
      }
      const signature = JSON.stringify(occupied.map((feature) => [feature.properties, feature.geometry.coordinates]))
      if (signature !== occupiedSignature.current) {
        occupiedSignature.current = signature
        map.getSource<GeoJSONSource>('occupied')?.setData({ type: 'FeatureCollection', features: occupied })
      }
    }
    const schedule = () => {
      frame ??= requestAnimationFrame(run)
    }
    schedule()
    map.on('move', schedule)
    map.on('resize', schedule)
    window.addEventListener('transitionend', schedule)
    return () => {
      map.off('move', schedule)
      map.off('resize', schedule)
      window.removeEventListener('transitionend', schedule)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [map, markers, anchors, selectedPlaceId, presentation])

  // --- Overview lines on the opening view; hovering a journey card highlights its route ----------
  // Pointing at "Journeys" in the home screen's index strengthens every line; pointing at "Places"
  // fades the lines and shows every place.
  useEffect(() => {
    if (!map) return
    const visible = scene.kind === 'overview'
    for (const id of ['overview-lines', 'overview-casing', 'place-dots']) map.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none')
    for (const id of ['landmark-dots', 'landmark-labels']) map.setLayoutProperty(id, 'visibility', visible && labels.ancient ? 'visible' : 'none')
    const highlight = highlightJourneyId ?? ''
    const emphasis = highlight ? null : overviewEmphasis
    const isHighlighted: ExpressionSpecification = ['==', ['get', 'journeyId'], highlight]
    const lineOpacity = highlight ? 0.2 : emphasis === 'journeys' ? 1 : emphasis === 'places' ? 0.35 : 0.85
    map.setPaintProperty('overview-lines', 'line-opacity', ['case', isHighlighted, 1, lineOpacity])
    map.setPaintProperty('overview-lines', 'line-width', ['case', isHighlighted, 3.2, emphasis === 'journeys' ? 2.6 : 1.8])
    map.setPaintProperty('overview-casing', 'line-opacity', ['case', isHighlighted, 0.95, highlight || emphasis === 'places' ? 0.2 : 0.55])
    map.setPaintProperty('overview-casing', 'line-width', ['case', isHighlighted, 7, emphasis === 'journeys' ? 5.5 : 4.5])
    for (const property of ['circle-opacity', 'circle-stroke-opacity'] as const) map.setPaintProperty('place-dots', property, emphasis === 'places' ? 1 : 0)
  }, [map, scene, highlightJourneyId, overviewEmphasis, labels.ancient])

  // --- Route drawing: the line grows from the first stop and markers appear as it reaches them ---
  const setRevealed = (progress: number) => {
    for (const spec of markers) {
      const at = revealAt.get(spec.id) ?? 0
      markerRoots.current.get(spec.id)?.setAttribute('data-revealed', String(at <= progress + 0.001))
    }
  }

  useEffect(() => {
    const source = map?.getSource<GeoJSONSource>('route')
    if (!map || !source) return
    if (!geometry) {
      source.setData({ type: 'FeatureCollection', features: [] })
      return
    }
    // A journey opened directly (before any interaction) shows its whole route at once; the drawing
    // animation is for journeys chosen in the app.
    if (reducedMotion || firstPaint() || latest.current.selectedStopIndex !== null) {
      source.setData(routeFeatures(geometry))
      return
    }

    drawing.current = true
    source.setData(routeFeatures(geometry, 0))
    const duration = Math.min(3400, Math.max(2000, 1100 + geometry.totalKm * 0.55))
    const start = performance.now() + 900 // let the camera settle on the region first
    const step = (now: number) => {
      const progress = easeInOut(Math.min(1, Math.max(0, (now - start) / duration)))
      source.setData(routeFeatures(geometry, progress))
      setRevealed(progress)
      if (progress < 1) drawFrame.current = requestAnimationFrame(step)
      else {
        drawFrame.current = null
        drawing.current = false
      }
    }
    drawFrame.current = requestAnimationFrame(step)
    return () => {
      if (drawFrame.current !== null) cancelAnimationFrame(drawFrame.current)
      drawFrame.current = null
      drawing.current = false
    }
    // Runs when the journey changes; selecting a stop is handled by the next effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, geometry, reducedMotion])

  // Selecting a stop completes any drawing in progress. In Journey Mode the travelled legs stay
  // strong and the legs still ahead are lighter; the leg arriving at the current stop is
  // emphasised, keeping its own dash pattern (a dotted "uncertain" leg never turns solid).
  useEffect(() => {
    if (!map) return
    if (selectedStopIndex !== null && geometry && drawing.current) {
      if (drawFrame.current !== null) cancelAnimationFrame(drawFrame.current)
      drawFrame.current = null
      drawing.current = false
      map.getSource<GeoJSONSource>('route')?.setData(routeFeatures(geometry))
      setRevealed(1)
    }
    const current = selectedStopIndex ?? -1
    const isActive: ExpressionSpecification = ['==', ['get', 'toIndex'], current]
    const isAhead: ExpressionSpecification = ['>', ['get', 'toIndex'], current]
    for (const [layer, , width] of ROUTE_LAYERS) {
      map.setPaintProperty(layer, 'line-width', ['case', isActive, width + 1.8, width])
      map.setPaintProperty(layer, 'line-color', ['case', isActive, ATLAS_COLORS.routeActive, ATLAS_COLORS.route])
      map.setPaintProperty(layer, 'line-opacity', selectedStopIndex === null ? 1 : ['case', isAhead, 0.32, 1])
    }
    map.setPaintProperty('route-casing', 'line-opacity', selectedStopIndex === null ? 0.85 : ['case', isAhead, 0.35, 0.85])
    map.setFilter('route-active-glow', ['==', ['get', 'toIndex'], current])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, geometry, selectedStopIndex])

  // --- Camera -----------------------------------------------------------------------------------
  // MapLibre adds fitBounds padding to the map's own padding, so camera calls first make sure the
  // padding has reached the current insets, then use only a margin.
  const frameScene = (duration: number) => {
    if (!map) return
    map.setPadding({ ...latest.current.insets })
    const camera = sceneCamera(map, scene, null, [])
    if (!camera) return
    if (duration === 0) map.jumpTo(camera)
    else if (scene.kind === 'place') map.flyTo({ ...camera, speed: 1.1, curve: 1.42, essential: true })
    // flyTo pulls back before settling on the new region, rather than sliding across the map.
    else map.flyTo({ ...camera, duration, curve: 1.5, essential: true })
    // Set after the call: starting a flight ends the previous one, which clears the destination.
    if (duration !== 0) destination.current = (next) => sceneCamera(map, scene, null, [], next)
  }

  useEffect(() => {
    if (!map) return
    const arrived = () => {
      destination.current = null
    }
    map.on('moveend', arrived)
    return () => {
      map.off('moveend', arrived)
    }
  }, [map])

  useEffect(() => {
    if (!map) return
    if (scene.kind === 'journey' && latest.current.selectedStopIndex !== null) return // framed by the stop effect
    if (scene.kind === 'person' && scene.preview) return // a preview never moves the map
    const target = framingKey(key, null, '')
    if (framed.current === target) return
    framed.current = target
    frameScene(reducedMotion || firstPaint() ? 0 : scene.kind === 'journey' ? 2000 : 1500)
    // Re-frame only when the scene itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, key])

  const focusKey = props.focusPlaceIds?.join(',') ?? ''
  useEffect(() => {
    if (!map || scene.kind !== 'journey' || selectedStopIndex === null) return
    const target = framingKey(key, selectedStopIndex, focusKey)
    if (framed.current === target) return
    framed.current = target
    map.setPadding({ ...latest.current.insets })
    const options = sceneCamera(map, scene, selectedStopIndex, focusKey ? focusKey.split(',') : [])
    if (!options) return
    if (reducedMotion || firstPaint()) map.jumpTo(options)
    else {
      map.flyTo({ ...options, speed: 0.85, curve: 1.45, essential: true })
      destination.current = (next) => sceneCamera(map, scene, selectedStopIndex, focusKey ? focusKey.split(',') : [], next)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, key, selectedStopIndex, focusKey])

  // Keep the visual centre clear of the floating surfaces as they change. A camera flight under way
  // flies on to the same place with the new padding: setting the padding (a jump) would stop it.
  useEffect(() => {
    if (!map) return
    const current = map.getPadding()
    const changed = (['top', 'right', 'bottom', 'left'] as const).some((side) => current[side] !== insets[side])
    if (!changed) return
    const aim = destination.current
    const camera = aim && map.isMoving() ? aim(insets) : undefined
    if (aim && camera) {
      map.flyTo({ ...camera, padding: { ...insets }, speed: 0.85, curve: 1.45, essential: true })
      destination.current = aim
    } else if (map.isMoving() || reducedMotion) map.setPadding({ ...insets })
    else map.easeTo({ padding: { ...insets }, duration: 450 })
  }, [map, insets, reducedMotion])

  const initiallyRevealed = !geometry || reducedMotion || selectedStopIndex !== null || (typeof document !== 'undefined' && firstPaint())

  return (
    // `isolate` keeps the map's markers in their own stacking context, always beneath the panels.
    <div className="absolute inset-0 isolate">
      {/* Sized with width/height: MapLibre's stylesheet makes its container position: relative. */}
      <div
        ref={containerRef}
        className="atlas-map h-full w-full"
        style={{ '--map-inset-bottom': `${Math.max(0, insets.bottom - 20)}px` } as CSSProperties}
      />
      {map && !presentation && (
        <MapControls
          bottom={insets.bottom}
          right={insets.right > 40 ? insets.right - 4 : 16}
          onZoomIn={() => map.zoomIn({ duration: reducedMotion ? 0 : 250 })}
          onZoomOut={() => map.zoomOut({ duration: reducedMotion ? 0 : 250 })}
          onReset={() => frameScene(reducedMotion ? 0 : 900)}
          resetLabel={scene.kind === 'journey' ? t('map.resetView') : t('map.resetOverview')}
          labels={labels}
          onLabelsChange={props.onLabelsChange}
        />
      )}
      {markers.map((spec) => {
        const anchor = anchors.get(spec.id)
        if (!anchor) return null
        return createPortal(
          <MarkerPortal
            spec={spec}
            scene={scene}
            selectedStopIndex={selectedStopIndex}
            selected={spec.id === selectedPlaceId}
            state={markerState(spec)}
            visits={markerVisits(spec)}
            revealed={initiallyRevealed}
            name={text(spec.place.name)}
            registerRoot={(element) => {
              if (element) markerRoots.current.set(spec.id, element)
              else markerRoots.current.delete(spec.id)
            }}
            onSelectStop={props.onSelectStop}
            onSelectPlace={props.onSelectPlace}
            onHoverStop={props.onHoverStop}
          />,
          anchor,
          spec.id,
        )
      })}
    </div>
  )
}

interface MarkerPortalProps {
  spec: MarkerSpec
  scene: MapScene
  selectedStopIndex: number | null
  selected: boolean
  state: MarkerState
  visits: MarkerVisit[]
  revealed: boolean
  name: string
  registerRoot: (element: HTMLDivElement | null) => void
  onSelectStop: (index: number) => void
  onSelectPlace: (placeId: string) => void
  onHoverStop: (index: number | null) => void
}

function MarkerPortal({ spec, scene, selectedStopIndex, selected, state, visits, revealed, name, registerRoot, onSelectStop, onSelectPlace, onHoverStop }: MarkerPortalProps) {
  const { t, ref, number } = useI18n()

  const activate = (visit: number | null) => {
    if (scene.kind !== 'journey') {
      onSelectPlace(spec.id)
      return
    }
    if (visit !== null) {
      onSelectStop(visit)
      return
    }
    // A place visited more than once: from the keyboard, each activation moves to its next visit.
    const position = selectedStopIndex === null ? -1 : spec.stopIndexes.indexOf(selectedStopIndex)
    const next = spec.stopIndexes[(position + 1) % spec.stopIndexes.length]
    if (next !== undefined) onSelectStop(next)
  }

  // The name repeats the numbers shown, in order ("Stops 1, 18: Antioch"), so speech input can use them.
  const discs = discsFor(visits)
  const ariaLabel =
    spec.numbers.length === 0
      ? t('map.markerPlace', { place: name })
      : discs.length < visits.length
        ? t('map.markerStopsMore', { number: discs[0]!.text, more: number(visits.length - 1), place: name })
        : t('map.markerStop', { count: spec.numbers.length, numbers: spec.numbers.map(number).join(', '), place: name })

  let sublabel: string | undefined
  if (selected && scene.kind === 'journey' && selectedStopIndex !== null) {
    const stop = scene.stops.find((s) => s.index === selectedStopIndex)
    if (stop) sublabel = `${t('journey.stopNumber', { number: stop.number })} · ${ref(stop.stop.passage)}`
  }

  return (
    <MarkerView
      rootRef={registerRoot}
      variant={spec.variant}
      visits={visits}
      label={name}
      {...(sublabel ? { sublabel } : {})}
      selected={selected}
      state={state}
      revealed={revealed}
      ariaLabel={ariaLabel}
      onActivate={activate}
      {...(scene.kind === 'journey' ? { onHover: onHoverStop } : {})}
    />
  )
}
