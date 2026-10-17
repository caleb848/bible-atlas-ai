import { ArrowRight, Info } from 'lucide-react'
import { connectedPeople, eventsForPerson, journeysForPerson, originsForPerson, personStats, placesForPerson } from '../../data/atlas'
import type { Person } from '../../data/types'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useI18n } from '../../i18n/i18n'
import { sortRefs } from '../../lib/scripture/reference'
import { BackButton, PanelSection } from '../panel/PanelParts'
import { AtlasSummary } from '../scripture/AtlasSummary'
import type { ReaderItem } from '../scripture/readerContext'
import { ScriptureRefButton } from '../scripture/ScriptureRefButton'
import { CertaintyBadge } from '../ui/CertaintyBadge'
import { Link } from '../ui/Link'

/**
 * A person: who they are, where they appear, who they appear with, which journeys involve them and
 * where their story unfolds (on the map). Every relationship is computed from the events.
 */
export function PersonView({ person }: { person: Person }) {
  const { t, text, list, number } = useI18n()
  const events = eventsForPerson(person.id)
  const places = placesForPerson(person.id)
  const origins = originsForPerson(person.id)
  const journeys = journeysForPerson(person.id)
  const connected = connectedPeople(person.id).slice(0, 12)
  const stats = personStats(person.id)
  const refs = sortRefs(person.refs)
  const refItems: ReaderItem[] = refs.map((passage) => ({ passage, context: text(person.name) }))

  useDocumentTitle(`${text(person.name)} | ${t('app.pageTitleSuffix')}`)

  return (
    <article aria-labelledby="person-title">
      <BackButton />
      <p className="eyebrow">{person.groups.map((group) => t(`groups.${group}`)).join(' · ')}</p>
      <h1 id="person-title" className="mt-2.5 font-display text-[40px] font-medium leading-[1.02] tracking-[-0.02em] text-ink-950 animate-rise md:text-[44px]">
        {text(person.name)}
      </h1>
      {person.alternateNames && person.alternateNames.length > 0 && (
        <p className="mt-2 text-[13.5px] text-ink-500">{t('person.also', { names: list(person.alternateNames) })}</p>
      )}
      <p className="mt-2.5 text-[16px] leading-snug text-ink-700">{text(person.role)}</p>

      <dl className="mt-5 flex gap-7 border-y border-stone-200 py-4">
        {(
          [
            ['events', stats.events, t('person.eventsStat')],
            ['places', stats.places, t('person.places')],
            ['journeys', stats.journeys, t('person.journeys')],
          ] as const
        ).map(([key, value, label]) => (
          <div key={key}>
            <dd className="font-display text-[30px] leading-none tabular-nums text-ink-950">{number(value)}</dd>
            <dt className="mt-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-500">{label}</dt>
          </div>
        ))}
      </dl>

      {person.identityNote && (
        <aside className="mt-5 flex gap-2.5 rounded-xl bg-stone-100 px-4 py-3 text-[13.5px] leading-relaxed text-ink-700">
          <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-cobalt-600" />
          <p>
            <span className="font-semibold text-ink-900">{t('person.aboutName')}. </span>
            {text(person.identityNote)}
          </p>
        </aside>
      )}

      <AtlasSummary className="mt-5">{text(person.summary)}</AtlasSummary>

      <PanelSection id="person-scripture" title={t('person.scripture')}>
        <div className="flex flex-wrap gap-1.5">
          {refs.map((passage) => (
            <ScriptureRefButton key={passage} passage={passage} context={text(person.name)} sequence={refItems} />
          ))}
        </div>
      </PanelSection>

      {journeys.length > 0 && (
        <PanelSection id="person-journeys" title={t('person.journeys')} aside={number(journeys.length)}>
          <ul className="space-y-2">
            {journeys.map((journey) => (
              <li key={journey.id}>
                <Link
                  to={{ name: 'journey', id: journey.id }}
                  className="group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 ring-1 ring-stone-200 transition-colors hover:bg-cobalt-50 hover:ring-cobalt-200"
                >
                  <span className="font-display text-[16px] font-medium text-ink-950">{text(journey.title)}</span>
                  <ArrowRight aria-hidden className="size-4 shrink-0 text-ink-400 group-hover:text-cobalt-600" />
                </Link>
              </li>
            ))}
          </ul>
        </PanelSection>
      )}

      <PanelSection id="person-map" title={t('person.map')} aside={number(places.length)}>
        {origins.length > 0 && (
          <p className="mb-3 text-[13.5px] text-ink-700">
            <span className="font-semibold text-ink-900">{t('person.from')}: </span>
            {origins.map((origin, index) => (
              <span key={origin.place.id}>
                <Link to={{ name: 'place', id: origin.place.id }} className="font-medium text-ink-900 underline decoration-stone-300 underline-offset-4 hover:decoration-cobalt-600">
                  {text(origin.place.name)}
                </Link>{' '}
                <span className="text-ink-500">(</span>
                <ScriptureRefButton passage={origin.ref} context={text(person.name)} variant="plain" className="text-[12.5px]" />
                <span className="text-ink-500">)</span>
                {index < origins.length - 1 && ', '}
              </span>
            ))}
          </p>
        )}
        <ul className="divide-y divide-stone-200 overflow-hidden rounded-2xl ring-1 ring-stone-200">
          {places.map((place) => (
            <li key={place.id}>
              <Link to={{ name: 'place', id: place.id }} className="flex items-center justify-between gap-3 px-3.5 py-2.5 transition-colors hover:bg-stone-100">
                <span className="min-w-0">
                  <span className="block font-display text-[15.5px] text-ink-950">{text(place.name)}</span>
                  {place.modern && <span className="block truncate text-[12px] text-ink-500">{text(place.modern.name)}</span>}
                </span>
                {place.certainty !== 'identified' && <CertaintyBadge certainty={place.certainty} />}
              </Link>
            </li>
          ))}
        </ul>
      </PanelSection>

      <PanelSection id="person-events" title={t('person.events')} aside={number(events.length)}>
        <ol className="space-y-4">
          {events.map((event) => (
            <li key={event.id}>
              <h3 className="text-[15px] font-semibold leading-snug text-ink-950">{text(event.title)}</h3>
              <p className="mt-1 line-clamp-2 text-[13.5px] leading-relaxed text-ink-700">{text(event.summary)}</p>
              <p className="mt-1 flex flex-wrap items-center gap-x-2 text-[12.5px] text-ink-500">
                <ScriptureRefButton
                  passage={event.passage}
                  {...(event.excerpt ? { excerpt: event.excerpt } : {})}
                  {...(event.relatedRefs ? { related: event.relatedRefs } : {})}
                  context={text(event.title)}
                  variant="plain"
                />
              </p>
            </li>
          ))}
        </ol>
      </PanelSection>

      {connected.length > 0 && (
        <PanelSection id="person-connected" title={t('person.connected')}>
          <ul className="flex flex-wrap gap-1.5">
            {connected.map(({ person: other, shared }) => (
              <li key={other.id}>
                <Link
                  to={{ name: 'person', id: other.id }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-paper px-3 py-1.5 text-[13px] font-medium text-ink-800 ring-1 ring-inset ring-stone-200 transition-colors hover:bg-cobalt-50 hover:text-cobalt-800 hover:ring-cobalt-200"
                  title={t('person.sharedEvents', { count: shared })}
                >
                  {text(other.name)}
                  <span className="text-[11px] tabular-nums text-ink-500">{shared}</span>
                </Link>
              </li>
            ))}
          </ul>
        </PanelSection>
      )}
    </article>
  )
}
