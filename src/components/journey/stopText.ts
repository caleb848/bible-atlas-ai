import type { ResolvedStop } from '../../data/atlas'
import type { Locale, RefString } from '../../data/types'
import { bookName, formatRange, parseRef, type ScriptureRange } from '../../lib/scripture/reference'
import type { ReaderItem } from '../scripture/readerContext'

/** "07" — stop numbers are set as two figures in the editorial timeline and stop card. */
export const twoDigits = (value: number) => String(value).padStart(2, '0')

/**
 * The passages behind a stop as one compact label, e.g. "Acts 16:12–15 · 16:16–40": each event's
 * passage, with the book name given once. Falls back to the stop's own passage.
 */
export function stopReferences(stop: ResolvedStop, locale: Locale): string {
  const refs: RefString[] = stop.events.length > 0 ? stop.events.map((event) => event.passage) : [stop.stop.passage]
  const ranges = [...new Set(refs)].map(parseRef).filter((range): range is ScriptureRange => range !== null)
  return ranges
    .map((range, index) => {
      const label = formatRange(range, locale)
      if (index === 0 || ranges[index - 1]!.book !== range.book) return label
      return label.slice(bookName(range.book, locale).length + 1)
    })
    .join(' · ')
}

/** The passages to read at a stop, in order, each labelled with its event. */
export function stopReaderItems(stop: ResolvedStop, title: (event: ResolvedStop['events'][number]) => string): ReaderItem[] {
  if (stop.events.length === 0) return [{ passage: stop.stop.passage }]
  return stop.events.map((event) => ({
    passage: event.passage,
    ...(event.excerpt ? { excerpt: event.excerpt } : {}),
    ...(event.relatedRefs ? { related: event.relatedRefs } : {}),
    context: title(event),
  }))
}
