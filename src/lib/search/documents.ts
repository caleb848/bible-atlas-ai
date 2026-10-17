import {
  allEvents,
  allJourneys,
  allPeople,
  allPlaces,
  eventsAtPlace,
  getPerson,
  getPlace,
  eventsForPerson,
  journeysForPerson,
  journeyTravelers,
  peopleAtPlace,
  placesForPerson,
  resolveStops,
  stopsForEvent,
} from '../../data/atlas'
import type { RefString } from '../../data/types'
import type { LngLat } from '../geo/geo'
import { BOOKS } from '../scripture/books'
import { CHAPTER_END, formatRef, parseRef, type ScriptureRange } from '../scripture/reference'

export type SearchDocType = 'journey' | 'place' | 'person' | 'event' | 'scripture'

/**
 * One searchable entry. Documents are generated from the atlas data at runtime (and by the
 * embeddings script at build time), so search can only ever return things the atlas contains.
 */
export interface SearchDocument {
  /** Stable id, e.g. `place:philippi` or `scripture:ACT-16`. */
  id: string
  type: SearchDocType
  entityId: string
  title: string
  subtitle: string
  /** Text fields weighted from strongest to weakest. */
  names: string[]
  keywords: string[]
  body: string
  /** The sentence(s) embedded for Smart Search. */
  embeddingText: string
  ranges: ScriptureRange[]
  personIds: string[]
  placeIds: string[]
  /** Ancient regions this document belongs to, lower-case. */
  regions: string[]
  coordinates?: LngLat
  /** Prior importance, multiplied into the score. */
  prior: number
}

const en = (value: { en: string }) => value.en
const ranges = (refs: readonly (RefString | undefined)[]): ScriptureRange[] =>
  refs.map((ref) => (ref ? parseRef(ref) : null)).filter((range): range is ScriptureRange => range !== null)
const unique = <T>(items: T[]) => [...new Set(items)]

let cached: SearchDocument[] | null = null

export function buildSearchDocuments(): SearchDocument[] {
  if (cached) return cached
  const documents: SearchDocument[] = []

  for (const journey of allJourneys) {
    const stops = resolveStops(journey)
    const placeNames = unique(stops.map((stop) => en(stop.place.name)))
    const personNames = journeyTravelers(journey)
    documents.push({
      id: `journey:${journey.id}`,
      type: 'journey',
      entityId: journey.id,
      title: en(journey.title),
      subtitle: `${journey.passages.map((ref) => formatRef(ref)).join('; ')} · ${en(journey.subtitle)}`,
      names: [en(journey.title), en(journey.shortTitle)],
      keywords: [...journey.tags, ...personNames.map((person) => en(person.name))],
      body: `${en(journey.summary)} ${placeNames.join(' ')}`,
      embeddingText: `${en(journey.title)}. ${en(journey.subtitle)}. ${en(journey.summary)} Places: ${placeNames.join(', ')}.`,
      ranges: ranges([...journey.passages, ...journey.stops.map((stop) => stop.passage)]),
      personIds: unique(stops.flatMap((stop) => stop.events.flatMap((e) => e.personIds))),
      placeIds: unique(stops.map((stop) => stop.place.id)),
      regions: [],
      prior: journey.featured ? 1.25 : 1.15,
    })
  }

  for (const place of allPlaces) {
    const events = eventsAtPlace(place.id)
    const modern = place.modern ? `${en(place.modern.name)}${place.modern.area ? `, ${en(place.modern.area)}` : ''}` : ''
    documents.push({
      id: `place:${place.id}`,
      type: 'place',
      entityId: place.id,
      title: en(place.name),
      subtitle: modern || en(place.summary),
      names: [en(place.name), ...(place.alternateNames ?? []), ...(place.searchTerms ?? [])],
      keywords: [place.kind, place.ancientRegion ? en(place.ancientRegion) : '', modern].filter(Boolean),
      body: `${en(place.summary)} ${events.map((event) => en(event.title)).join('. ')}`,
      embeddingText: `${en(place.name)}${modern ? ` (${modern})` : ''}. ${en(place.summary)} ${events
        .map((event) => en(event.title))
        .join('. ')}`,
      ranges: ranges([...place.refs, ...events.map((event) => event.passage)]),
      personIds: peopleAtPlace(place.id).map((person) => person.id),
      placeIds: [place.id],
      regions: place.ancientRegion ? [en(place.ancientRegion).toLowerCase()] : [],
      coordinates: place.coordinates,
      prior: 1.1 + Math.min(events.length, 6) * 0.02,
    })
  }

  for (const person of allPeople) {
    const journeys = journeysForPerson(person.id)
    const places = placesForPerson(person.id)
    documents.push({
      id: `person:${person.id}`,
      type: 'person',
      entityId: person.id,
      title: en(person.name),
      subtitle: en(person.role),
      names: [en(person.name), ...(person.alternateNames ?? []), ...(person.searchTerms ?? [])],
      keywords: [en(person.role)],
      body: `${en(person.summary)} ${journeys.map((journey) => en(journey.title)).join(' ')} ${places
        .map((place) => en(place.name))
        .join(' ')}`,
      embeddingText: `${en(person.name)}, ${en(person.role)}. ${en(person.summary)}`,
      ranges: ranges([...person.refs, ...eventsForPerson(person.id).map((event) => event.passage)]),
      personIds: [person.id],
      placeIds: places.map((place) => place.id),
      regions: [],
      prior: 1,
    })
  }

  for (const event of allEvents) {
    const places = event.placeIds.map(getPlace).filter((place) => place !== undefined)
    const people = event.personIds.map(getPerson).filter((person) => person !== undefined)
    const placeNames = places.map((place) => en(place.name))
    const context = stopsForEvent(event.id)[0]
    documents.push({
      id: `event:${event.id}`,
      type: 'event',
      entityId: event.id,
      title: en(event.title),
      subtitle: `${placeNames.join(', ')} · ${formatRef(event.passage)}${context ? ` · ${en(context.journey.shortTitle)}` : ''}`,
      names: [en(event.title)],
      keywords: [...(event.tags ?? []), ...placeNames, ...people.map((person) => en(person.name))],
      body: en(event.summary),
      embeddingText: `${en(event.title)} at ${placeNames.join(' and ')}. ${en(event.summary)}`,
      ranges: ranges([event.passage, ...(event.relatedRefs ?? [])]),
      personIds: event.personIds,
      placeIds: event.placeIds,
      regions: places.flatMap((place) => (place.ancientRegion ? [en(place.ancientRegion).toLowerCase()] : [])),
      coordinates: places[0]?.coordinates,
      prior: 0.95,
    })
  }

  // One Scripture entry per chapter that the atlas maps, e.g. "Acts 16".
  const chapters = new Map<string, { book: string; chapter: number; events: typeof allEvents[number][] }>()
  for (const event of allEvents) {
    const range = parseRef(event.passage)
    if (!range) continue
    for (let chapter = range.start.chapter; chapter <= range.end.chapter; chapter++) {
      const key = `${range.book}-${chapter}`
      const entry = chapters.get(key) ?? { book: range.book, chapter, events: [] }
      entry.events.push(event)
      chapters.set(key, entry)
    }
  }
  for (const [key, { book, chapter, events }] of chapters) {
    const bookName = BOOKS.find((info) => info.code === book)?.name.en ?? book
    const placeNames = unique(events.flatMap((event) => event.placeIds))
      .map(getPlace)
      .filter((place) => place !== undefined)
      .map((place) => en(place.name))
    documents.push({
      id: `scripture:${key}`,
      type: 'scripture',
      entityId: key,
      title: `${bookName} ${chapter}`,
      subtitle: placeNames.join(' · '),
      names: [`${bookName} ${chapter}`],
      keywords: [bookName, ...placeNames],
      body: events.map((event) => en(event.title)).join('. '),
      embeddingText: `${bookName} chapter ${chapter}: ${events.map((event) => en(event.title)).join('; ')}.`,
      ranges: [{ book, start: { chapter, verse: 1 }, end: { chapter, verse: CHAPTER_END } }],
      personIds: unique(events.flatMap((event) => event.personIds)),
      placeIds: unique(events.flatMap((event) => event.placeIds)),
      regions: [],
      prior: 0.9,
    })
  }

  cached = documents
  return documents
}
