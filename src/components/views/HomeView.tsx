import { ArrowRight, Search } from 'lucide-react'
import { useState } from 'react'
import { allEvents, allJourneys, allPeople, allPlaces, journeyPlaces, resolveStops } from '../../data/atlas'
import { collectReferences } from '../../data/references'
import type { Journey } from '../../data/types'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { type I18n, useI18n } from '../../i18n/i18n'
import type { Route } from '../../lib/router/routes'
import type { OverviewEmphasis } from '../map/scene'
import { type AnswerPreview, SearchBox } from '../search/SearchBox'
import { Link } from '../ui/Link'
import { RouteSketch } from '../ui/RouteSketch'

interface HomeViewProps {
  onPreviewJourney: (journeyId: string | null) => void
  /** Pointing at "Journeys" or "Places" in the index brings them forward on the map. */
  onEmphasize: (emphasis: OverviewEmphasis | null) => void
  /** The map previews the search answer while it is shown. */
  onAnswerPreview: (preview: AnswerPreview | null) => void
  /** Phones search in a full-screen overlay. */
  onOpenSearch: (query?: string) => void
}

/** Example searches that show what the atlas can answer. */
const EXAMPLES = ['Where did Paul go after Philippi?', 'Acts 16', 'Jerusalem', 'Timothy'] as const

/** The four featured experiences, in this order. */
const FEATURED = ['paul-second-missionary-journey', 'paul-journey-to-rome', 'ministry-of-jesus', 'final-week-in-jerusalem']

/**
 * The atlas's four ways in, each with how many it holds. The counts are read from the data, so
 * they change when the data does. Routes and collections are counted together: "journeys" alone
 * would claim every collection is a route.
 */
const EXPLORE_ENTRIES = [
  { key: 'journeys', route: { name: 'journeys' }, count: allJourneys.length, emphasis: 'journeys' },
  { key: 'places', route: { name: 'places' }, count: allPlaces.length, emphasis: 'places' },
  { key: 'people', route: { name: 'people' }, count: allPeople.length, emphasis: null },
  { key: 'events', route: { name: 'events' }, count: allEvents.length, emphasis: null },
] as const satisfies ReadonlyArray<{ key: string; route: Route; count: number; emphasis: OverviewEmphasis | null }>

const EXPLORE_TEXT = {
  journeys: ['home.exploreJourneys', 'home.exploreJourneysHint'],
  places: ['home.explorePlaces', 'home.explorePlacesHint'],
  people: ['home.explorePeople', 'home.explorePeopleHint'],
  events: ['home.exploreEvents', 'home.exploreEventsHint'],
} as const

/**
 * The opening view. The map is the hero; this card introduces it in a few words, offers search,
 * indexes the atlas, and invites the reader into four journeys. Hovering a journey previews its
 * route on the map; pointing at Journeys or Places in the index brings them forward.
 */
export function HomeView({ onPreviewJourney, onEmphasize, onAnswerPreview, onOpenSearch }: HomeViewProps) {
  const i18n = useI18n()
  const { t, number } = i18n
  const [requested, setRequested] = useState<{ value: string; nonce: number } | null>(null)
  /** While searching, results take the place of the featured journeys. */
  const [searching, setSearching] = useState(false)
  const featured = FEATURED.map((id) => allJourneys.find((journey) => journey.id === id)).filter((journey) => journey !== undefined)
  useDocumentTitle(t('app.homeTitle'))

  const example = (query: string) => {
    // Wide screens fill the search field in place; phones open the full-screen search.
    if (window.matchMedia('(min-width: 900px)').matches) setRequested((previous) => ({ value: query, nonce: (previous?.nonce ?? 0) + 1 }))
    else onOpenSearch(query)
  }

  return (
    <div>
      <p className="eyebrow text-cobalt-700! animate-fade-in">{t('app.name')}</p>
      <h1 className="mt-3 font-display text-[40px] font-medium leading-[1.0] tracking-[-0.025em] text-ink-950 animate-rise md:text-[50px]">
        {t('app.tagline')}
      </h1>
      <p className="mt-4 max-w-[30ch] text-[17px] leading-[1.55] text-ink-600 animate-rise [animation-delay:90ms]">{t('app.lead')}</p>

      <div className="mt-7 animate-rise [animation-delay:160ms]">
        <div className="hidden md:block">
          <SearchBox variant="hero" inlineResults requestedQuery={requested} onActiveChange={setSearching} onAnswerPreview={onAnswerPreview} />
        </div>
        <button
          type="button"
          onClick={() => onOpenSearch()}
          className="flex h-14 w-full items-center gap-3 rounded-full bg-paper px-5 text-left text-[16px] text-ink-500 shadow-float ring-1 ring-stone-300 md:hidden"
        >
          <Search aria-hidden className="size-5 text-cobalt-600" />
          {t('search.heroPlaceholder')}
        </button>
        <ul className={`mt-3 flex-wrap gap-x-1 gap-y-1 text-[13px] ${searching ? 'flex md:hidden' : 'flex'}`} aria-label={t('search.label')}>
          {EXAMPLES.map((query) => (
            <li key={query}>
              <button
                type="button"
                onClick={() => example(query)}
                className="rounded-full px-2.5 py-1 text-ink-600 underline decoration-stone-300 underline-offset-4 transition-colors hover:bg-stone-150 hover:text-ink-950 hover:decoration-transparent"
              >
                {query}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <section aria-labelledby="home-explore" className={`mt-6 animate-rise [animation-delay:200ms] ${searching ? 'md:hidden' : ''}`}>
        <h2 id="home-explore" className="eyebrow">
          {t('home.exploreTitle')}
        </h2>
        <ul className="mt-2 grid grid-cols-2 border-y border-stone-200">
          {EXPLORE_ENTRIES.map((entry, index) => {
            const [label, hint] = EXPLORE_TEXT[entry.key]
            return (
              <li key={entry.key} className={`${index < 2 ? 'border-b' : ''} ${index % 2 === 0 ? 'border-r' : ''} border-stone-200`}>
                <Link
                  to={entry.route}
                  // Read as "117 People, explore people", not just "117".
                  aria-label={`${number(entry.count)} ${t(label)}, ${t(hint)}`}
                  onMouseEnter={() => onEmphasize(entry.emphasis)}
                  onMouseLeave={() => onEmphasize(null)}
                  onFocus={() => onEmphasize(entry.emphasis)}
                  onBlur={() => onEmphasize(null)}
                  className={`group relative flex h-full flex-col justify-center py-2 ${index % 2 === 0 ? 'pr-3' : 'pl-4'}`}
                >
                  <span className="font-display text-[26px] font-medium leading-none tracking-[-0.015em] text-ink-950 transition-colors group-hover:text-cobalt-700">
                    {number(entry.count)}
                  </span>{' '}
                  <span className="mt-1 text-[13px] font-semibold leading-4 text-cobalt-700 decoration-cobalt-300 underline-offset-4 group-hover:text-cobalt-900 group-hover:underline">
                    {t(label)}
                  </span>
                  <ArrowRight
                    aria-hidden
                    className={`absolute top-1/2 size-4 -translate-x-1 -translate-y-1/2 text-cobalt-600 opacity-0 transition-[opacity,translate] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 ${index % 2 === 0 ? 'right-3' : 'right-0'}`}
                  />
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <section aria-labelledby="home-featured" className={`mt-6 ${searching ? 'md:hidden' : ''}`}>
        <h2 id="home-featured" className="eyebrow mb-2">
          {t('home.featured')}
        </h2>
        <ul className="-mx-2">
          {featured.map((journey, index) => (
            <li key={journey.id} className="animate-rise" style={{ animationDelay: `${240 + index * 70}ms` }}>
              <FeaturedJourney journey={journey} i18n={i18n} onPreview={onPreviewJourney} />
            </li>
          ))}
        </ul>
        <Link
          to={{ name: 'journeys' }}
          className="mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-cobalt-700 hover:text-cobalt-900"
        >
          {t('home.allJourneys')}
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </section>

      <p className="mt-9 border-t border-stone-200 pt-4 text-[12.5px] leading-relaxed text-ink-500">
        {t('home.stats', { refs: number(collectReferences().length) })}
      </p>
    </div>
  )
}

function journeyMeta(journey: Journey, i18n: I18n): string {
  const count = journey.type === 'route' ? resolveStops(journey).length : journeyPlaces(journey).length
  const unit = journey.type === 'route' ? i18n.t('home.stops', { count }) : i18n.t('home.places', { count })
  return journey.passages.length === 1 ? `${i18n.ref(journey.passages[0]!)} · ${unit}` : unit
}

function FeaturedJourney({ journey, i18n, onPreview }: { journey: Journey; i18n: I18n; onPreview: (journeyId: string | null) => void }) {
  const { t, text } = i18n
  return (
    <Link
      to={{ name: 'journey', id: journey.id }}
      onMouseEnter={() => onPreview(journey.id)}
      onMouseLeave={() => onPreview(null)}
      onFocus={() => onPreview(journey.id)}
      onBlur={() => onPreview(null)}
      className="group flex items-center gap-4 rounded-2xl px-2 py-2.5 transition-colors hover:bg-stone-150"
    >
      <span className="flex h-[58px] w-[76px] shrink-0 items-center justify-center rounded-xl bg-sea-100 ring-1 ring-inset ring-sea-200 transition-colors group-hover:bg-paper">
        <RouteSketch journey={journey} width={68} height={50} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-500">
          {journey.type === 'route' ? t('journey.route') : t('journey.collection')}
        </span>
        <span className="mt-0.5 block font-display text-[18px] font-medium leading-snug text-ink-950">{text(journey.title)}</span>
        <span className="mt-0.5 block truncate text-[12.5px] text-ink-500">{journeyMeta(journey, i18n)}</span>
      </span>
      <ArrowRight aria-hidden className="size-4 shrink-0 text-ink-400 transition-[translate,color] group-hover:translate-x-0.5 group-hover:text-cobalt-600" />
    </Link>
  )
}
