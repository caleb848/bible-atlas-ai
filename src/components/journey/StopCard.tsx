import { ArrowRight, BookOpen, Route as RouteIcon, StickyNote } from 'lucide-react'
import type { ResolvedStop } from '../../data/atlas'
import type { Journey } from '../../data/types'
import { useI18n } from '../../i18n/i18n'
import { EditorialLabel } from '../scripture/AtlasSummary'
import { useScriptureReader } from '../scripture/readerContext'
import { VerseQuote } from '../scripture/ScripturePreview'
import { ScriptureRefButton } from '../scripture/ScriptureRefButton'
import { Button } from '../ui/Button'
import { CertaintyBadge } from '../ui/CertaintyBadge'
import { modernLocation } from '../ui/placeText'
import { Link } from '../ui/Link'
import { stopReaderItems, stopReferences, twoDigits } from './stopText'
import { Timeline } from './Timeline'

interface StopCardProps {
  journey: Journey
  stops: readonly ResolvedStop[]
  stop: ResolvedStop
  hoveredIndex: number | null
  onHover: (index: number | null) => void
  onSelect: (index: number) => void
}

/**
 * Journey Mode: one stop at a time. The number and place lead, then the passages behind the stop,
 * a verbatim line from the text where one characterizes it, and the editorial summary of each event.
 */
export function StopCard({ journey, stops, stop, hoveredIndex, onHover, onSelect }: StopCardProps) {
  const { t, text, ref, locale } = useI18n()
  const reader = useScriptureReader()
  const { place, events } = stop
  const items = stopReaderItems(stop, (event) => text(event.title))
  const quote = stop.stop.quote
  const arrivalNote = stop.stop.arrival?.note
  const geography = [place.ancientRegion ? text(place.ancientRegion) : null, modernLocation(place, text)].filter(Boolean).join(' · ')

  return (
    <article key={stop.index} aria-labelledby="stop-title">
      <p className="eyebrow animate-fade-in">{text(journey.shortTitle)}</p>
      <div className="mt-3 flex items-baseline gap-2 animate-rise">
        <span className="font-display text-[54px] font-light leading-[0.9] tabular-nums text-cobalt-600 md:text-[60px]">
          {twoDigits(stop.number)}
        </span>
        <span className="font-display text-[19px] tabular-nums text-ink-500">/ {twoDigits(stops.length)}</span>
      </div>
      <h1
        id="stop-title"
        className="mt-3 font-display text-[34px] font-medium uppercase leading-[1.02] tracking-[0.045em] text-ink-950 animate-rise [animation-delay:60ms] md:text-[42px]"
      >
        {text(place.name)}
      </h1>
      <p className="mt-3 animate-rise [animation-delay:120ms]">
        <button
          type="button"
          onClick={() => reader.open({ items, index: 0 })}
          aria-label={t('scripture.open', { reference: stopReferences(stop, locale) })}
          className="text-[14px] font-semibold tracking-[0.01em] text-cobalt-700 underline decoration-cobalt-200 underline-offset-4 hover:decoration-cobalt-600"
        >
          {stopReferences(stop, locale)}
        </button>
      </p>
      <div className="mt-3.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[13px] text-ink-600 animate-rise [animation-delay:160ms]">
        <CertaintyBadge certainty={place.certainty} />
        {geography && <span>{geography}</span>}
        {stop.stop.presence === 'passed' && <span className="italic text-ink-500">· {t('journey.passed')}</span>}
      </div>

      {quote && (
        <VerseQuote
          className="mt-6 animate-rise [animation-delay:200ms]"
          text={quote.text}
          reference={ref(quote.ref)}
          onOpen={() => reader.open({ passage: quote.ref, context: text(place.name) })}
        />
      )}

      {(arrivalNote || stop.stop.note) && (
        <div className="mt-5 space-y-2">
          {arrivalNote && (
            <p className="flex gap-2.5 rounded-xl bg-stone-100 px-3.5 py-2.5 text-[13px] leading-relaxed text-ink-700">
              <RouteIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-cobalt-600" />
              <span>
                <span className="sr-only">{t('journey.routeNote')}: </span>
                {text(arrivalNote)}
              </span>
            </p>
          )}
          {stop.stop.note && (
            <p className="flex gap-2.5 rounded-xl bg-stone-100 px-3.5 py-2.5 text-[13px] leading-relaxed text-ink-700">
              <StickyNote aria-hidden className="mt-0.5 size-4 shrink-0 text-cobalt-600" />
              <span>
                <span className="sr-only">{t('journey.note')}: </span>
                {text(stop.stop.note)}
              </span>
            </p>
          )}
        </div>
      )}

      {events.length > 0 && (
        <section className="mt-6" aria-label={t('scripture.summaryLabel')}>
          <EditorialLabel className="mb-3" />
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id}>
                <h2 className="text-[15.5px] font-semibold leading-snug text-ink-950">{text(event.title)}</h2>
                <p className="mt-1 text-[14.5px] leading-[1.65] text-ink-700">{text(event.summary)}</p>
                {event.locationNote && <p className="mt-1.5 text-[12.5px] italic leading-relaxed text-ink-500">{text(event.locationNote)}</p>}
                <ScriptureRefButton
                  passage={event.passage}
                  {...(event.excerpt ? { excerpt: event.excerpt } : {})}
                  {...(event.relatedRefs ? { related: event.relatedRefs } : {})}
                  context={text(event.title)}
                  sequence={items}
                  variant="plain"
                  className="mt-1.5 text-[13px]"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-2">
        <Button variant="primary" onClick={() => reader.open({ items, index: 0 })} icon={<BookOpen aria-hidden className="size-4" />}>
          {t('journey.readScripture')}
        </Button>
        <Link
          to={{ name: 'place', id: place.id }}
          className="inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-medium text-ink-700 transition-colors hover:bg-stone-150 hover:text-ink-950"
        >
          {t('journey.placeDetails', { place: text(place.name) })}
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>

      {/* On phones the timeline continues below the stop; wide screens show it in the side rail. */}
      {/* The timeline sits in the card until the window is wide enough for a separate rail. */}
      <section aria-labelledby="stop-timeline" className="mt-9 border-t border-stone-200 pt-6 xl:hidden">
        <h2 id="stop-timeline" className="eyebrow mb-3">
          {t('journey.timeline')}
        </h2>
        <Timeline
          journey={journey}
          stops={stops}
          currentIndex={stop.index}
          hoveredIndex={hoveredIndex}
          onHover={onHover}
          onSelect={onSelect}
        />
      </section>
    </article>
  )
}
