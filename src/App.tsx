import { type CSSProperties, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ErrorBoundary } from './components/feedback/ErrorBoundary'
import { JourneyControls } from './components/journey/JourneyControls'
import { JourneyOverview } from './components/journey/JourneyOverview'
import { JourneyRail } from './components/journey/JourneyRail'
import { PresentationCaption } from './components/journey/PresentationCaption'
import { StopCard } from './components/journey/StopCard'
import { Panel, type PanelWidth, type SheetSnap } from './components/layout/Panel'
import { TopBar } from './components/layout/TopBar'
import { useMapInsets } from './components/layout/useMapInsets'
import type { MapLabels } from './components/map/MapControls'
import { MapStage } from './components/map/MapStage'
import type { MapScene, OverviewEmphasis } from './components/map/scene'
import { ScriptureReaderProvider } from './components/scripture/ScriptureReaderProvider'
import type { AnswerPreview } from './components/search/SearchBox'
import { SearchOverlay } from './components/search/SearchOverlay'
import { AboutView } from './components/views/AboutView'
import { EventsIndexView } from './components/views/EventsIndexView'
import { HomeView } from './components/views/HomeView'
import { JourneysIndexView } from './components/views/JourneysIndexView'
import { NotFoundView } from './components/views/NotFoundView'
import { PeopleView } from './components/views/PeopleView'
import { PersonView } from './components/views/PersonView'
import { PlacesIndexView } from './components/views/PlacesIndexView'
import { PlaceView } from './components/views/PlaceView'
import {
  allPlaces,
  getJourney,
  getPerson,
  getPlace,
  originsForPerson,
  placesForPerson,
  placesNear,
  resolveStops,
} from './data/atlas'
import { announce, useAnnouncement } from './hooks/announcer'
import { usePrefersReducedMotion } from './hooks/useMediaQuery'
import { usePlayback } from './hooks/usePlayback'
import { I18nProvider } from './i18n/I18nProvider'
import { DEFAULT_LOCALE } from './i18n/config'
import { useI18n } from './i18n/i18n'
import { navigate, useRoute } from './lib/router/router'

export function App() {
  return (
    <I18nProvider locale={DEFAULT_LOCALE}>
      <ScriptureReaderProvider>
        <AtlasApp />
      </ScriptureReaderProvider>
    </I18nProvider>
  )
}

function AtlasApp() {
  const { t, text } = useI18n()
  const route = useRoute()
  const reducedMotion = usePrefersReducedMotion()
  const announcement = useAnnouncement()
  const contentRef = useRef<HTMLElement>(null)
  const [previewJourneyId, setPreviewJourneyId] = useState<string | null>(null)
  const [hoveredStop, setHoveredStop] = useState<number | null>(null)
  const [sheetSnap, setSheetSnap] = useState<SheetSnap>('half')
  const [search, setSearch] = useState({ open: false, query: '' })
  const [presentation, setPresentation] = useState(false)
  const [labels, setLabels] = useState<MapLabels>({ ancient: true, modern: true })
  /** While the home search shows an answer, the map previews it (the address does not change). */
  const [answerPreview, setAnswerPreview] = useState<AnswerPreview | null>(null)
  /** A person pointed at in the People directory; the map marks their places. */
  const [previewPersonId, setPreviewPersonId] = useState<string | null>(null)
  /** "Journeys" or "Places" pointed at in the home screen's index; the map brings them forward. */
  const [emphasis, setEmphasis] = useState<OverviewEmphasis | null>(null)
  const previewPerson = route.name === 'people' && previewPersonId ? getPerson(previewPersonId) : undefined

  const journey = route.name === 'journey' ? getJourney(route.id) : undefined
  const place = route.name === 'place' ? getPlace(route.id) : undefined
  const person = route.name === 'person' ? getPerson(route.id) : undefined
  const stops = useMemo(() => (journey ? resolveStops(journey) : []), [journey])
  const selectedIndex =
    journey && route.name === 'journey' && route.stop !== undefined && route.stop <= journey.stops.length ? route.stop - 1 : null
  const selectedStop = selectedIndex !== null ? stops.find((stop) => stop.index === selectedIndex) : undefined
  const journeyMode = journey !== undefined && selectedStop !== undefined
  const presenting = presentation && journeyMode
  /** Identifies the screen; changes reset scroll and focus (selecting a stop does not). */
  const viewKey = 'id' in route ? `${route.name}:${route.id}` : route.name

  // What the map shows: the current screen, or the answer being previewed on the home screen.
  const mapRoute = route.name === 'home' && answerPreview ? answerPreview.route : route
  const mapJourney = mapRoute.name === 'journey' ? getJourney(mapRoute.id) : undefined
  const mapPlace = mapRoute.name === 'place' ? getPlace(mapRoute.id) : undefined
  const mapStops = useMemo(() => (mapJourney ? resolveStops(mapJourney) : []), [mapJourney])
  const mapSelectedIndex =
    mapJourney && mapRoute.name === 'journey' && mapRoute.stop !== undefined && mapRoute.stop <= mapJourney.stops.length ? mapRoute.stop - 1 : null

  const scene = useMemo<MapScene>(() => {
    if (mapJourney) return { kind: 'journey', journey: mapJourney, stops: mapStops }
    if (mapPlace) {
      const radius = mapPlace.kind === 'region' ? 220 : 40
      return { kind: 'place', place: mapPlace, context: placesNear(mapPlace.coordinates, radius, mapPlace.id).map((entry) => entry.place) }
    }
    const shown = person ?? previewPerson
    if (shown) {
      return {
        kind: 'person',
        id: shown.id,
        places: placesForPerson(shown.id),
        origins: originsForPerson(shown.id).map((origin) => origin.place),
        ...(person ? {} : { preview: true }),
      }
    }
    if (route.name === 'places') return { kind: 'places', places: allPlaces }
    return { kind: 'overview' }
  }, [mapJourney, mapStops, mapPlace, person, previewPerson, route.name])

  const selectStop = useCallback(
    (index: number | null) => {
      if (!journey) return
      navigate({ name: 'journey', id: journey.id, ...(index === null ? {} : { stop: index + 1 }) }, { replace: true })
    },
    [journey],
  )
  const playback = usePlayback({ count: stops.length, selectedIndex, select: selectStop, reducedMotion, resetKey: viewKey })
  const { pause } = playback
  /** Any manual selection takes over from playback. */
  const chooseStop = useCallback(
    (index: number) => {
      pause()
      selectStop(index)
    },
    [pause, selectStop],
  )
  const exitJourney = useCallback(() => {
    pause()
    setPresentation(false)
    selectStop(null)
  }, [pause, selectStop])

  // The presentation view also asks the browser for full screen where it can.
  const enteredFullscreen = useRef(false)
  const togglePresentation = useCallback(() => {
    const next = !presentation
    setPresentation(next)
    if (next && document.documentElement.requestFullscreen && !document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          enteredFullscreen.current = true
        })
        .catch(() => undefined)
    } else if (!next && enteredFullscreen.current && document.fullscreenElement) {
      enteredFullscreen.current = false
      document.exitFullscreen().catch(() => undefined)
    }
  }, [presentation])
  useEffect(() => {
    const onChange = () => {
      if (!document.fullscreenElement && enteredFullscreen.current) {
        enteredFullscreen.current = false
        setPresentation(false)
      }
    }
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  // Per-screen state resets when the screen changes (but not when only the stop changes).
  const [lastViewKey, setLastViewKey] = useState(viewKey)
  if (lastViewKey !== viewKey) {
    setLastViewKey(viewKey)
    setPreviewJourneyId(null)
    setAnswerPreview(null)
    setPreviewPersonId(null)
    setEmphasis(null)
    setHoveredStop(null)
    setPresentation(false)
    if (sheetSnap === 'peek') setSheetSnap('half')
  }
  if (presentation && !journeyMode) setPresentation(false)

  // New screens start at the top, and keyboard/screen-reader focus moves to them (not on first
  // load). A layout effect, so it runs before the timeline scrolls a selected stop into view.
  const focusedViewKey = useRef(viewKey)
  const focusedMode = useRef(journeyMode)
  useLayoutEffect(() => {
    const content = contentRef.current
    if (!content) return
    const modeChanged = focusedMode.current !== journeyMode
    focusedMode.current = journeyMode
    if (focusedViewKey.current !== viewKey || modeChanged) {
      content.scrollTop = 0
      if (focusedViewKey.current !== viewKey) content.focus({ preventScroll: true })
      focusedViewKey.current = viewKey
    }
  }, [viewKey, journeyMode])
  // Each new stop starts at its top in the card.
  useLayoutEffect(() => {
    if (selectedIndex !== null && contentRef.current) contentRef.current.scrollTop = 0
  }, [selectedIndex])

  // Screen readers hear where they are in a journey.
  useEffect(() => {
    if (!journey) return
    if (selectedStop) {
      announce(t('journey.stopAnnouncement', { number: selectedStop.number, total: stops.length, place: text(selectedStop.place.name) }))
    }
  }, [journey, selectedStop, stops.length, t, text])
  useEffect(() => {
    if (!journey) return
    const key = journey.type === 'route' ? 'journey.journeyAnnouncement' : 'journey.collectionAnnouncement'
    announce(t(key, { title: text(journey.title), count: resolveStops(journey).length }))
  }, [journey, t, text])

  // Journey Mode keys: ← → move between stops, Escape leaves the presentation view, then the journey.
  useEffect(() => {
    if (!journeyMode) return
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target instanceof HTMLElement ? event.target : null
      if (target?.closest('input, textarea, select, [contenteditable="true"], [role="listbox"]')) return
      if (document.querySelector('dialog[open]')) return
      const position = stops.findIndex((stop) => stop.index === selectedIndex)
      if (event.key === 'ArrowRight' && stops[position + 1]) chooseStop(stops[position + 1]!.index)
      else if (event.key === 'ArrowLeft' && stops[position - 1]) chooseStop(stops[position - 1]!.index)
      else if (event.key === 'Escape') {
        if (presenting) togglePresentation()
        else exitJourney()
      } else return
      event.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [journeyMode, stops, selectedIndex, chooseStop, presenting, togglePresentation, exitJourney])

  const insets = useMapInsets(`${viewKey}|${journeyMode}|${presenting}|${sheetSnap}`)
  const openSearch = useCallback((query = '') => setSearch({ open: true, query }), [])

  let view
  let panelWidth: PanelWidth = 'standard'
  switch (route.name) {
    case 'home':
      view = (
        <HomeView onPreviewJourney={setPreviewJourneyId} onEmphasize={setEmphasis} onAnswerPreview={setAnswerPreview} onOpenSearch={openSearch} />
      )
      break
    case 'journey':
      if (!journey) view = <NotFoundView title={t('journey.notFoundTitle')} body={t('journey.notFoundBody')} />
      else if (selectedStop) {
        panelWidth = 'narrow'
        view = (
          <StopCard
            journey={journey}
            stops={stops}
            stop={selectedStop}
            hoveredIndex={hoveredStop}
            onHover={setHoveredStop}
            onSelect={chooseStop}
          />
        )
      } else {
        view = (
          <JourneyOverview
            journey={journey}
            stops={stops}
            hoveredIndex={hoveredStop}
            onHover={setHoveredStop}
            onSelect={chooseStop}
            onBegin={() => stops[0] && chooseStop(stops[0].index)}
          />
        )
      }
      break
    case 'journeys':
      view = <JourneysIndexView onPreviewJourney={setPreviewJourneyId} />
      break
    case 'place':
      view = place ? <PlaceView place={place} /> : <NotFoundView title={t('place.notFoundTitle')} body={t('place.notFoundBody')} />
      break
    case 'person':
      view = person ? <PersonView person={person} /> : <NotFoundView title={t('person.notFoundTitle')} body={t('person.notFoundBody')} />
      break
    case 'places':
      view = <PlacesIndexView />
      break
    case 'people':
      panelWidth = 'wide'
      view = <PeopleView onPreviewPerson={setPreviewPersonId} />
      break
    case 'events':
      view = <EventsIndexView />
      break
    case 'about':
      view = <AboutView />
      break
    case 'not-found':
      view = <NotFoundView />
      break
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-stone-100">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-full bg-ink-900 px-4 py-2 font-medium text-paper focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        {t('nav.skipToContent')}
      </a>

      <MapStage
        scene={scene}
        selectedStopIndex={mapSelectedIndex}
        focusPlaceIds={route.name === 'home' && answerPreview ? answerPreview.focus : null}
        hoveredStopIndex={hoveredStop}
        onHoverStop={setHoveredStop}
        highlightJourneyId={previewJourneyId}
        overviewEmphasis={route.name === 'home' && !answerPreview ? emphasis : null}
        insets={insets}
        reducedMotion={reducedMotion}
        labels={labels}
        onLabelsChange={setLabels}
        presentation={presenting}
        onSelectStop={(index) => (journey || !mapJourney ? chooseStop(index) : navigate({ name: 'journey', id: mapJourney.id, stop: index + 1 }))}
        onSelectPlace={(id) => navigate({ name: 'place', id })}
      />

      <TopBar route={route} minimal={presenting} journeyMode={journeyMode} onOpenSearch={() => openSearch()} />

      <Panel
        snap={sheetSnap}
        onSnapChange={setSheetSnap}
        width={panelWidth}
        hidden={presenting}
        label={t('app.shortName')}
        contentRef={contentRef}
        header={
          journeyMode && selectedIndex !== null ? (
            <JourneyControls
              placement="sheet"
              className="md:hidden"
              stops={stops}
              currentIndex={selectedIndex}
              playback={playback}
              onSelect={chooseStop}
              onExit={exitJourney}
              presentation={presenting}
              onTogglePresentation={togglePresentation}
            />
          ) : undefined
        }
      >
        <ErrorBoundary key={viewKey} fallback={<PanelError />}>
          {view}
        </ErrorBoundary>
      </Panel>

      {journey && journeyMode && selectedIndex !== null && (
        <>
          {!presenting && (
            <JourneyRail
              journey={journey}
              stops={stops}
              currentIndex={selectedIndex}
              hoveredIndex={hoveredStop}
              onHover={setHoveredStop}
              onSelect={chooseStop}
            />
          )}
          {/* Centred on the visible map (between the card and the rail), not on the window. */}
          <div
            className={`pointer-events-none fixed inset-x-0 bottom-4 z-30 justify-center px-3 md:bottom-6 md:left-(--controls-left) md:right-(--controls-right) ${presenting ? 'flex' : 'hidden md:flex'}`}
            style={{ '--controls-left': `${presenting ? 0 : insets.left - 20}px`, '--controls-right': `${presenting ? 0 : insets.right - 20}px` } as CSSProperties}
          >
            <JourneyControls
              placement="floating"
              stops={stops}
              currentIndex={selectedIndex}
              playback={playback}
              onSelect={chooseStop}
              onExit={exitJourney}
              presentation={presenting}
              onTogglePresentation={togglePresentation}
            />
          </div>
          {presenting && selectedStop && <PresentationCaption journey={journey} stops={stops} stop={selectedStop} />}
        </>
      )}

      <SearchOverlay open={search.open} initialQuery={search.query} onClose={() => setSearch({ open: false, query: '' })} />

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
    </div>
  )
}

function PanelError() {
  const { t } = useI18n()
  return (
    <div role="alert" className="space-y-4">
      <p className="text-[15px] text-ink-800">{t('errors.panel')}</p>
      <div className="flex gap-2">
        <button type="button" onClick={() => window.location.reload()} className="rounded-full bg-cobalt-600 px-4 py-2 text-sm font-semibold text-white">
          {t('errors.reload')}
        </button>
        <button type="button" onClick={() => navigate({ name: 'home' })} className="rounded-full bg-stone-150 px-4 py-2 text-sm text-ink-800">
          {t('errors.goHome')}
        </button>
      </div>
    </div>
  )
}
