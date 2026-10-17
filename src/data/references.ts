import { BOOKS } from '../lib/scripture/books'
import { events } from './events'
import { journeys } from './journeys'
import { people } from './people'
import { places } from './places'
import type { LocalizedText, RefString } from './types'

/** A reference written out in prose, e.g. "(John 14:22)" or "Luke 1:39–40". */
const INLINE_REF = new RegExp(
  `\\b(${BOOKS.map((book) => book.name.en)
    .sort((a, b) => b.length - a.length)
    .join('|')}) (\\d+):(\\d+)(?:[–-](\\d+)(?::(\\d+))?)?`,
  'g',
)
const codeForName = new Map(BOOKS.map((book) => [book.name.en, book.code]))

/**
 * References cited inside editorial text (notes and summaries). Chapter-only forms ("Acts 16") and
 * continuations without a book ("(1:65)") are not matched.
 */
export function inlineReferences(text: LocalizedText | undefined): RefString[] {
  return [...(text?.en ?? '').matchAll(INLINE_REF)].map(([, book, chapter, verse, to, toVerse]) => {
    const end = toVerse ? `-${to}:${toVerse}` : to ? `-${to}` : ''
    return `${codeForName.get(book!)} ${chapter}:${verse}${end}` as RefString
  })
}

/** Every Scripture reference used anywhere in the atlas content, including those cited in notes. */
export function collectReferences(): RefString[] {
  const refs = new Set<RefString>()
  const add = (ref: RefString | undefined) => ref && refs.add(ref)
  const addInline = (...texts: Array<LocalizedText | undefined>) => texts.forEach((text) => inlineReferences(text).forEach(add))
  for (const place of places) {
    place.refs.forEach(add)
    addInline(place.summary, place.certaintyNote)
  }
  for (const person of people) {
    person.refs.forEach(add)
    person.origins?.forEach((origin) => add(origin.ref))
    addInline(person.summary, person.identityNote)
  }
  for (const event of events) {
    add(event.passage)
    add(event.excerpt)
    event.relatedRefs?.forEach(add)
    addInline(event.summary, event.locationNote)
  }
  for (const journey of journeys) {
    journey.passages.forEach(add)
    addInline(journey.summary, journey.orderingNote, journey.period?.note)
    for (const stop of journey.stops) {
      add(stop.passage)
      add(stop.quote?.ref)
      addInline(stop.note, stop.arrival?.note)
    }
  }
  return [...refs]
}
