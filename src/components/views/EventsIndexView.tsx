import { ArrowRight, Search } from 'lucide-react'
import { Fragment, memo, useDeferredValue, useId, useMemo, useState } from 'react'
import { allEvents, compareEvents, getPerson, getPlace, stopsForEvent } from '../../data/atlas'
import type { BiblicalEvent } from '../../data/types'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { type I18n, useI18n } from '../../i18n/i18n'
import { bookName, findReferenceInText, parseRef, rangesOverlap, type ScriptureRange } from '../../lib/scripture/reference'
import { normalize } from '../../lib/search/text'
import { ScriptureRefButton } from '../scripture/ScriptureRefButton'
import { Link } from '../ui/Link'

/** Books whose events are listed under their own name; events cited from the letters share one group. */
const NARRATIVE_BOOKS: ReadonlySet<string> = new Set(['MAT', 'MRK', 'LUK', 'JHN', 'ACT'])

const eventsInOrder = [...allEvents].sort(compareEvents)

const isDefined = <T,>(value: T | undefined): value is T => value !== undefined

interface EventGroup {
  key: string
  title: string
  events: BiblicalEvent[]
}

/** A query that is only a reference ("Acts 16", "Jn 4:1-42"), as a range; otherwise null. */
function referenceQuery(query: string): ScriptureRange | null {
  const found = findReferenceInText(query)
  if (!found) return null
  const rest = query.toLowerCase().replace(/\bchapter\b/g, ' ').replace(found.matchedText, '')
  return /[\p{L}\p{N}]/u.test(rest) ? null : found.range
}

function matcher(query: string, i18n: I18n): (event: BiblicalEvent) => boolean {
  const needle = normalize(query.trim())
  if (!needle) return () => true
  const range = referenceQuery(query.trim())
  if (range) {
    // The events narrated in that passage, or with a parallel account there.
    return (event) =>
      [event.passage, ...(event.relatedRefs ?? [])].some((ref) => {
        const eventRange = parseRef(ref)
        return eventRange !== null && rangesOverlap(eventRange, range)
      })
  }
  const { text } = i18n
  return (event) => {
    const places = event.placeIds.map(getPlace).filter(isDefined)
    const people = event.personIds.map(getPerson).filter(isDefined)
    const haystack = [
      text(event.title),
      text(event.summary),
      i18n.ref(event.passage),
      ...(event.tags ?? []),
      ...places.flatMap((place) => [text(place.name), ...(place.alternateNames ?? [])]),
      ...people.flatMap((person) => [text(person.name), ...(person.alternateNames ?? [])]),
    ]
    return haystack.some((value) => normalize(value).includes(needle))
  }
}

/**
 * Every event as a list, in the order of the Bible: the non-map way to browse what happened, where,
 * who the text names, and the passage behind it. Each event links to its places, its people, the
 * passage (in the reader) and, where it has one, its stop on a journey.
 */
export function EventsIndexView() {
  const i18n = useI18n()
  const { t, number, locale } = i18n
  const [filter, setFilter] = useState('')
  const inputId = useId()
  useDocumentTitle(`${t('events.indexTitle')} | ${t('app.pageTitleSuffix')}`)

  const groups = useMemo(() => {
    const matches = matcher(filter, i18n)
    const result: EventGroup[] = []
    for (const event of eventsInOrder) {
      if (!matches(event)) continue
      const book = parseRef(event.passage)?.book ?? ''
      const key = NARRATIVE_BOOKS.has(book) ? book : 'letters'
      let group = result.at(-1)
      if (group?.key !== key) {
        group = { key, title: key === 'letters' ? t('events.letters') : bookName(book, locale), events: [] }
        result.push(group)
      }
      group.events.push(event)
    }
    return result
  }, [filter, i18n, t, locale])
  const shown = groups.reduce((total, group) => total + group.events.length, 0)
  // The pre-rendered page holds the first book only, so it arrives as quickly as the other
  // directories; the rest renders straight after, in the background, without blocking input.
  const complete = useDeferredValue(true, false)

  return (
    <div>
      <p className="eyebrow">{t('nav.events')}</p>
      <h1 className="mt-2.5 font-display text-[40px] font-medium leading-[1.02] tracking-[-0.02em] text-ink-950">{t('events.indexTitle')}</h1>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-600">{t('events.indexLead')}</p>
      <p className="mt-2 text-[12.5px] leading-relaxed text-ink-500">{t('events.editorialNote')}</p>
      <label htmlFor={inputId} className="sr-only">
        {t('events.filterLabel')}
      </label>
      <div className="mt-6 flex h-11 items-center gap-2 rounded-full bg-paper px-4 ring-1 ring-stone-300 focus-within:ring-2 focus-within:ring-cobalt-600">
        <Search aria-hidden className="size-4 text-cobalt-600" />
        <input
          id={inputId}
          type="search"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder={t('events.filterPlaceholder')}
          className="min-w-0 flex-1 bg-transparent text-[14.5px] text-ink-950 outline-none placeholder:text-ink-500"
        />
      </div>
      <p className="mt-3 text-[12.5px] text-ink-500" aria-live="polite">
        {shown === 0 ? t('events.noMatches', { query: filter.trim() }) : t('events.count', { count: shown })}
      </p>

      {(complete ? groups : groups.slice(0, 1)).map((group) => (
        <section key={group.key} aria-labelledby={`events-${group.key}`} className="mt-7">
          <div className="flex items-baseline justify-between border-b border-stone-200 pb-2">
            <h2 id={`events-${group.key}`} className="eyebrow">
              {group.title}
            </h2>
            <span className="text-[12px] tabular-nums text-ink-500">{number(group.events.length)}</span>
          </div>
          <ol className="divide-y divide-stone-200">
            {group.events.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}

const linkClass = 'font-medium text-ink-800 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-ink-950 hover:decoration-cobalt-600'

const EventRow = memo(function EventRow({ event }: { event: BiblicalEvent }) {
  const { t, text } = useI18n()
  const places = event.placeIds.map(getPlace).filter(isDefined)
  const people = event.personIds.map(getPerson).filter(isDefined)
  // Routes come first, so an event on Paul's second journey opens there rather than in a collection.
  const context = stopsForEvent(event.id)[0]
  return (
    <li className="py-4">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-[15px] font-semibold leading-snug text-ink-950">{text(event.title)}</h3>
        <ScriptureRefButton
          passage={event.passage}
          {...(event.excerpt ? { excerpt: event.excerpt } : {})}
          {...(event.relatedRefs ? { related: event.relatedRefs } : {})}
          context={text(event.title)}
          variant="plain"
          className="shrink-0 text-[12.5px]"
        />
      </div>
      <p className="mt-1 line-clamp-2 text-[13.5px] leading-relaxed text-ink-700">{text(event.summary)}</p>
      <p className="mt-1.5 text-[12.5px] leading-6 text-ink-500">
        {places.map((place, index) => (
          <Fragment key={place.id}>
            {index > 0 && ', '}
            <Link to={{ name: 'place', id: place.id }} className={linkClass}>
              {text(place.name)}
            </Link>
          </Fragment>
        ))}
        {people.length > 0 && (
          <>
            {places.length > 0 && <span aria-hidden> · </span>} {t('events.with')}{' '}
            {people.map((person, index) => (
              <Fragment key={person.id}>
                {index > 0 && ', '}
                <Link to={{ name: 'person', id: person.id }} className={linkClass}>
                  {text(person.name)}
                </Link>
              </Fragment>
            ))}
          </>
        )}
      </p>
      {context && (
        <Link
          to={{ name: 'journey', id: context.journey.id, stop: context.stop.index + 1 }}
          className="mt-1 inline-flex min-h-6 items-center gap-1 text-[12.5px] font-medium text-cobalt-700 transition-colors hover:text-cobalt-900"
        >
          {text(context.journey.shortTitle)} · {t('journey.stopNumber', { number: context.stop.number })}
          <ArrowRight aria-hidden className="size-3" />
        </Link>
      )}
    </li>
  )
})
