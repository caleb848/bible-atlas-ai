import { ArrowRight } from 'lucide-react'
import { eventsAtPlace, journeysAtPlace, peopleAtPlace, peopleFromPlace, placesNear, stopsForEvent } from '../../data/atlas'
import type { Place } from '../../data/types'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useI18n } from '../../i18n/i18n'
import { sortRefs } from '../../lib/scripture/reference'
import { BackButton, PanelSection } from '../panel/PanelParts'
import { AtlasSummary } from '../scripture/AtlasSummary'
import type { ReaderItem } from '../scripture/readerContext'
import { ScripturePreview } from '../scripture/ScripturePreview'
import { ScriptureRefButton } from '../scripture/ScriptureRefButton'
import { CertaintyBadge } from '../ui/CertaintyBadge'
import { LinkChip } from '../ui/Chip'
import { ExternalLink } from '../ui/ExternalLink'
import { Link } from '../ui/Link'

const formatCoordinate = (value: number, positive: string, negative: string) =>
  `${Math.abs(value).toFixed(4)}° ${value >= 0 ? positive : negative}`

/**
 * A place, set like an atlas entry: the name, where it is today and how sure we are, then what
 * happened there, who was there, and the passages behind it. Short blocks, strong hierarchy.
 */
export function PlaceView({ place }: { place: Place }) {
  const { t, text, list, number } = useI18n()
  const events = eventsAtPlace(place.id)
  const people = peopleAtPlace(place.id)
  const natives = peopleFromPlace(place.id)
  const visits = journeysAtPlace(place.id)
  const nearby = placesNear(place.coordinates, place.kind === 'region' ? 150 : 40, place.id).slice(0, 6)
  const [lng, lat] = place.coordinates
  const featured = events.find((event) => event.excerpt) ?? events[0]
  const refs = sortRefs(place.refs)
  const refItems: ReaderItem[] = refs.map((passage) => ({ passage, context: text(place.name) }))

  useDocumentTitle(`${text(place.name)} | ${t('app.pageTitleSuffix')}`)

  return (
    <article aria-labelledby="place-title">
      <BackButton />
      <p className="eyebrow">
        {place.ancientRegion ? text(place.ancientRegion) : t(`kinds.${place.kind}`)}
        {place.ancientRegion && <span className="text-ink-500"> · {t(`kinds.${place.kind}`)}</span>}
      </p>
      <h1
        id="place-title"
        className="mt-2.5 font-display text-[38px] font-medium uppercase leading-[1.02] tracking-[0.045em] text-ink-950 animate-rise md:text-[44px]"
      >
        {text(place.name)}
      </h1>
      {place.alternateNames && place.alternateNames.length > 0 && (
        <p className="mt-2 text-[13.5px] text-ink-500">{t('place.alsoCalled', { names: list(place.alternateNames.slice(0, 3)) })}</p>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        <CertaintyBadge certainty={place.certainty} size="md" />
        {refs[0] && <ScriptureRefButton passage={refs[0]} context={text(place.name)} sequence={refItems} variant="link" className="text-[14px]" />}
      </div>

      <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2.5 rounded-2xl bg-stone-100 px-4 py-4 text-[14px]">
        <dt className="text-[10.5px] font-semibold uppercase leading-6 tracking-[0.14em] text-ink-500">{t('place.ancient')}</dt>
        <dd className="font-display text-[16px] text-ink-950">{text(place.name)}</dd>
        {place.modern && (
          <>
            <dt className="text-[10.5px] font-semibold uppercase leading-6 tracking-[0.14em] text-ink-500">{t('place.modern')}</dt>
            <dd className="text-ink-800">
              {text(place.modern.name)}
              {place.modern.area && !text(place.modern.name).includes(text(place.modern.area)) && (
                <span className="text-ink-500"> · {text(place.modern.area)}</span>
              )}
            </dd>
          </>
        )}
        {place.ancientRegion && (
          <>
            <dt className="text-[10.5px] font-semibold uppercase leading-6 tracking-[0.14em] text-ink-500">{t('place.region')}</dt>
            <dd className="text-ink-800">{text(place.ancientRegion)}</dd>
          </>
        )}
        <dt className="text-[10.5px] font-semibold uppercase leading-6 tracking-[0.14em] text-ink-500">{t('place.status')}</dt>
        <dd className="text-ink-800">{t(`certainty.${place.certainty}Long`)}</dd>
      </dl>

      <AtlasSummary className="mt-6">{text(place.summary)}</AtlasSummary>

      {featured && (
        <ScripturePreview
          className="mt-5"
          passage={featured.passage}
          {...(featured.excerpt ? { excerpt: featured.excerpt } : {})}
          {...(featured.relatedRefs ? { related: featured.relatedRefs } : {})}
          context={text(featured.title)}
        />
      )}

      {events.length > 0 && (
        <PanelSection id="place-events" title={t('place.keyEvents')} aside={number(events.length)}>
          <ol className="space-y-5">
            {events.map((event) => {
              const context = stopsForEvent(event.id)[0]
              return (
                <li key={event.id}>
                  <h3 className="text-[15.5px] font-semibold leading-snug text-ink-950">{text(event.title)}</h3>
                  <p className="mt-1 line-clamp-3 text-[14px] leading-relaxed text-ink-700">{text(event.summary)}</p>
                  {event.locationNote && <p className="mt-1 text-[12.5px] italic text-ink-500">{text(event.locationNote)}</p>}
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]">
                    <ScriptureRefButton
                      passage={event.passage}
                      {...(event.excerpt ? { excerpt: event.excerpt } : {})}
                      {...(event.relatedRefs ? { related: event.relatedRefs } : {})}
                      context={text(event.title)}
                      variant="plain"
                    />
                    {context && (
                      <Link
                        to={{ name: 'journey', id: context.journey.id, stop: context.stop.index + 1 }}
                        className="inline-flex items-center gap-1 font-medium text-ink-600 hover:text-ink-950"
                      >
                        {text(context.journey.shortTitle)} · {t('journey.stopNumber', { number: context.stop.number })}
                        <ArrowRight aria-hidden className="size-3" />
                      </Link>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        </PanelSection>
      )}

      {people.length > 0 && (
        <PanelSection id="place-people" title={t('place.peopleHere')} aside={number(people.length)}>
          <div className="flex flex-wrap gap-1.5">
            {people.map((person) => (
              <LinkChip key={person.id} to={{ name: 'person', id: person.id }}>
                {text(person.name)}
              </LinkChip>
            ))}
          </div>
        </PanelSection>
      )}

      {natives.length > 0 && (
        <PanelSection id="place-natives" title={t('place.fromHere')}>
          <ul className="space-y-1.5 text-[14px]">
            {natives.map((person) => {
              const origin = person.origins?.find((entry) => entry.placeId === place.id)
              return (
                <li key={person.id} className="flex items-baseline justify-between gap-3">
                  <Link to={{ name: 'person', id: person.id }} className="font-medium text-ink-900 underline decoration-stone-300 underline-offset-4 hover:decoration-cobalt-600">
                    {text(person.name)}
                  </Link>
                  {origin && <ScriptureRefButton passage={origin.ref} context={text(person.name)} variant="plain" className="text-[12.5px]" />}
                </li>
              )
            })}
          </ul>
        </PanelSection>
      )}

      {visits.length > 0 && (
        <PanelSection id="place-journeys" title={t('place.journeys')}>
          <ul className="space-y-2">
            {visits.map(({ journey, stops }) => (
              <li key={journey.id}>
                <Link
                  to={{ name: 'journey', id: journey.id, stop: stops[0]!.index + 1 }}
                  className="group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 ring-1 ring-stone-200 transition-colors hover:bg-cobalt-50 hover:ring-cobalt-200"
                >
                  <span>
                    <span className="block font-display text-[16px] font-medium text-ink-950">{text(journey.title)}</span>
                    <span className="block text-[12.5px] text-ink-500">
                      {t('place.stopsInJourney', { count: stops.length, numbers: list(stops.map((stop) => String(stop.number))) })}
                    </span>
                  </span>
                  <ArrowRight aria-hidden className="size-4 text-ink-400 group-hover:text-cobalt-600" />
                </Link>
              </li>
            ))}
          </ul>
        </PanelSection>
      )}

      <PanelSection id="place-scripture" title={t('place.scripture')}>
        <div className="flex flex-wrap gap-1.5">
          {refs.map((passage) => (
            <ScriptureRefButton key={passage} passage={passage} context={text(place.name)} sequence={refItems} />
          ))}
        </div>
      </PanelSection>

      {nearby.length > 0 && (
        <PanelSection id="place-nearby" title={t('place.nearby')}>
          <ul className="divide-y divide-stone-200 overflow-hidden rounded-2xl ring-1 ring-stone-200">
            {nearby.map(({ place: other, distanceKm }) => (
              <li key={other.id}>
                <Link to={{ name: 'place', id: other.id }} className="flex items-center justify-between gap-3 px-3.5 py-2.5 transition-colors hover:bg-stone-100">
                  <span className="font-display text-[15.5px] text-ink-900">{text(other.name)}</span>
                  <span className="text-[12.5px] tabular-nums text-ink-500">{t('place.kmAway', { km: number(Math.round(distanceKm)) })}</span>
                </Link>
              </li>
            ))}
          </ul>
        </PanelSection>
      )}

      <PanelSection id="place-certainty" title={t('place.certainty')}>
        <CertaintyBadge certainty={place.certainty} length="long" />
        <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-700">
          {place.certaintyNote ? text(place.certaintyNote) : t(`certainty.${place.certainty}Help`)}
        </p>
        <dl className="mt-4 space-y-2 text-[13px]">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-500">{t('place.coordinates')}</dt>
            <dd className="tabular-nums text-ink-800">
              {formatCoordinate(lat, 'N', 'S')}, {formatCoordinate(lng, 'E', 'W')}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-500">{t('place.sources')}</dt>
            <dd className="flex flex-col items-end gap-1">
              {place.sources.map((source) => (
                <ExternalLink key={source.url} href={source.url} className="font-medium text-cobalt-700 hover:text-cobalt-900">
                  {source.name} {source.id}
                </ExternalLink>
              ))}
            </dd>
          </div>
        </dl>
      </PanelSection>
    </article>
  )
}
