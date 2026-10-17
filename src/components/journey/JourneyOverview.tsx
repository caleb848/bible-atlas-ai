import { ArrowLeft, Info, Play } from 'lucide-react'
import { useId } from 'react'
import { journeyPlaces, journeyTravelers, mappedDistanceKm, type ResolvedStop } from '../../data/atlas'
import type { Journey } from '../../data/types'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useI18n } from '../../i18n/i18n'
import { AtlasSummary } from '../scripture/AtlasSummary'
import { ScriptureRefButton } from '../scripture/ScriptureRefButton'
import { Button } from '../ui/Button'
import { Link } from '../ui/Link'
import { RouteLegend } from './RouteLegend'
import { Timeline } from './Timeline'

interface JourneyOverviewProps {
  journey: Journey
  stops: readonly ResolvedStop[]
  hoveredIndex: number | null
  onHover: (index: number | null) => void
  onSelect: (index: number) => void
  onBegin: () => void
}

/**
 * The journey's title page, shown while the map draws the route: title and passage, the key
 * figures (all derived from the data), who travels, an editorial summary and one strong call to
 * action. The timeline below lets readers jump to any stop.
 */
export function JourneyOverview({ journey, stops, hoveredIndex, onHover, onSelect, onBegin }: JourneyOverviewProps) {
  const { t, text, number, list } = useI18n()
  const isRoute = journey.type === 'route'
  const distance = mappedDistanceKm(journey)
  const travelers = journeyTravelers(journey)
  const placeCount = journeyPlaces(journey).length
  const tipId = useId()

  useDocumentTitle(`${text(journey.title)} | ${t('app.pageTitleSuffix')}`)

  const delay = (ms: number) => ({ animationDelay: `${ms}ms` })

  return (
    <article key={journey.id} aria-labelledby="journey-title">
      <Link
        to={{ name: 'journeys' }}
        className="-ml-1 mb-5 inline-flex items-center gap-1.5 rounded-full px-1 py-1 text-[13px] font-medium text-ink-500 transition-colors hover:text-ink-900"
      >
        <ArrowLeft aria-hidden className="size-4" />
        {t('nav.journeys')}
      </Link>

      <p className="eyebrow animate-rise text-cobalt-700!" style={delay(60)}>
        {isRoute ? t('journey.route') : `${t('journey.collection')} · ${t('journey.collectionNotice')}`}
      </p>
      <h1
        id="journey-title"
        className="mt-3 font-display text-[36px] font-medium leading-[1.03] tracking-[-0.022em] text-ink-950 animate-rise md:text-[42px]"
        style={delay(140)}
      >
        {text(journey.title)}
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-600 animate-rise" style={delay(220)}>
        {text(journey.subtitle)}
      </p>
      <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[15px] animate-rise" style={delay(260)}>
        {journey.passages.slice(0, isRoute ? 1 : 3).map((passage) => (
          <ScriptureRefButton key={passage} passage={passage} variant="link" />
        ))}
      </p>

      <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-7 gap-y-4 border-y border-stone-200 py-5 animate-rise" style={delay(340)}>
        <div>
          <dd className="font-display text-[34px] font-normal leading-none tabular-nums text-ink-950">{number(isRoute ? stops.length : placeCount)}</dd>
          <dt className="mt-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-500">
            {isRoute ? t('journey.stops') : t('journey.places')}
          </dt>
        </div>
        {distance !== null && (
          <div className="group relative">
            <dd className="font-display text-[34px] font-normal leading-none tabular-nums text-ink-950">
              ≈ {number(Math.round(distance / 10) * 10)}
              <span className="ml-1 text-[18px] text-ink-500">km</span>
            </dd>
            <dt className="mt-1.5 flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-500">
              {t('journey.distance')}
              <button type="button" aria-describedby={tipId} aria-label={t('journey.distanceNote')} className="peer rounded-full text-ink-500 hover:text-ink-800">
                <Info aria-hidden className="size-3.5" />
              </button>
              <span
                id={tipId}
                role="tooltip"
                className="pointer-events-none invisible absolute left-0 top-[calc(100%+6px)] z-30 w-64 rounded-xl bg-ink-900 px-3 py-2 text-[12.5px] font-normal normal-case leading-snug tracking-normal text-stone-50 opacity-0 shadow-pop transition-opacity peer-hover:visible peer-hover:opacity-100 peer-focus-visible:visible peer-focus-visible:opacity-100"
              >
                {t('journey.distanceNote')}
              </span>
            </dt>
          </div>
        )}
        {journey.period && (
          <div className="col-span-2 flex items-baseline gap-2.5 border-t border-stone-200 pt-3.5">
            <dt className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-500">{t('journey.period')}</dt>
            <dd className="font-display text-[17px] text-ink-950">{text(journey.period.label)}</dd>
          </div>
        )}
      </dl>

      {travelers.length > 0 && (
        <p className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1 animate-rise" style={delay(420)}>
          <span className="eyebrow mr-1">{t('journey.with')}</span>
          {travelers.map((person, index) => (
            <span key={person.id} className="text-[15px]">
              <Link
                to={{ name: 'person', id: person.id }}
                className="font-display text-[17px] font-medium text-ink-900 underline decoration-stone-300 underline-offset-4 hover:decoration-cobalt-600"
              >
                {text(person.name)}
              </Link>
              {index < travelers.length - 1 && <span className="ml-2 text-ink-500">·</span>}
            </span>
          ))}
          <span className="sr-only">{list(travelers.map((person) => text(person.name)))}</span>
        </p>
      )}

      {/* The one call to action, above the fold: everything below it is reference. */}
      <Button
        variant="primary"
        size="lg"
        onClick={onBegin}
        icon={<Play aria-hidden className="size-[18px] translate-x-px" />}
        className="mt-6 w-full animate-rise text-[16px]"
        style={delay(480)}
      >
        {isRoute ? t('journey.begin') : t('journey.explore')}
      </Button>

      <AtlasSummary className="mt-8 animate-rise">{text(journey.summary)}</AtlasSummary>
      {journey.period && <p className="mt-3 text-[12.5px] leading-relaxed text-ink-500">{text(journey.period.note)}</p>}
      {journey.orderingNote && <p className="mt-4 text-[13px] leading-relaxed text-ink-500">{text(journey.orderingNote)}</p>}

      <section aria-labelledby="journey-timeline" className="mt-9">
        <h2 id="journey-timeline" className="eyebrow mb-3">
          {isRoute ? t('journey.timeline') : t('journey.places')}
        </h2>
        <Timeline journey={journey} stops={stops} currentIndex={null} hoveredIndex={hoveredIndex} onHover={onHover} onSelect={onSelect} />
      </section>

      {isRoute && <RouteLegend className="mt-9" />}
    </article>
  )
}
