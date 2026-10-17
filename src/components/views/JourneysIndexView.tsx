import { ArrowRight } from 'lucide-react'
import { allJourneys, journeyPlaces, resolveStops } from '../../data/atlas'
import type { Journey } from '../../data/types'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useI18n } from '../../i18n/i18n'
import { Link } from '../ui/Link'
import { RouteSketch } from '../ui/RouteSketch'

/** All routes and collections. Routes follow a narrated itinerary; collections do not. */
export function JourneysIndexView({ onPreviewJourney }: { onPreviewJourney: (journeyId: string | null) => void }) {
  const { t } = useI18n()
  useDocumentTitle(`${t('journeys.title')} | ${t('app.pageTitleSuffix')}`)
  const routes = allJourneys.filter((journey) => journey.type === 'route')
  const collections = allJourneys.filter((journey) => journey.type === 'collection')

  return (
    <div>
      <p className="eyebrow">{t('nav.journeys')}</p>
      <h1 className="mt-2.5 font-display text-[40px] font-medium leading-[1.02] tracking-[-0.02em] text-ink-950">{t('journeys.title')}</h1>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-600">{t('journeys.lead')}</p>
      {(
        [
          ['routes', routes],
          ['collections', collections],
        ] as const
      ).map(([key, journeys]) => (
        <section key={key} aria-labelledby={`journeys-${key}`} className="mt-9">
          <div className="mb-2 flex items-baseline justify-between border-b border-stone-200 pb-2">
            <h2 id={`journeys-${key}`} className="eyebrow">
              {t(`journeys.${key}`)}
            </h2>
            <span className="text-[12px] tabular-nums text-ink-500">{journeys.length}</span>
          </div>
          <ul className="-mx-2">
            {journeys.map((journey) => (
              <li key={journey.id}>
                <JourneyRow journey={journey} onPreview={onPreviewJourney} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

function JourneyRow({ journey, onPreview }: { journey: Journey; onPreview: (journeyId: string | null) => void }) {
  const { t, text, ref } = useI18n()
  const isRoute = journey.type === 'route'
  const count = isRoute ? resolveStops(journey).length : journeyPlaces(journey).length
  return (
    <Link
      to={{ name: 'journey', id: journey.id }}
      onMouseEnter={() => onPreview(journey.id)}
      onMouseLeave={() => onPreview(null)}
      onFocus={() => onPreview(journey.id)}
      onBlur={() => onPreview(null)}
      className="group flex items-center gap-4 rounded-2xl px-2 py-2.5 transition-colors hover:bg-stone-150"
    >
      <span className="flex h-[54px] w-[70px] shrink-0 items-center justify-center rounded-xl bg-sea-100 ring-1 ring-inset ring-sea-200">
        <RouteSketch journey={journey} width={62} height={46} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[17px] font-medium leading-snug text-ink-950">{text(journey.title)}</span>
        <span className="mt-0.5 block truncate text-[12.5px] text-ink-500">
          {journey.passages.length === 1 ? `${ref(journey.passages[0]!)} · ` : ''}
          {isRoute ? t('home.stops', { count }) : t('home.places', { count })}
        </span>
      </span>
      <ArrowRight aria-hidden className="size-4 shrink-0 text-ink-400 transition-[translate,color] group-hover:translate-x-0.5 group-hover:text-cobalt-600" />
    </Link>
  )
}
