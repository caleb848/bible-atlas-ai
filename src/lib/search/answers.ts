/**
 * Grounded answers: short, structured responses assembled only from atlas data. Every answer
 * points to stops, places or passages that exist in the dataset, so nothing here is generated
 * text. When a question cannot be answered from the data, no answer is produced and the UI
 * falls back to the most relevant results.
 */
import {
  allJourneys,
  allPlaces,
  getEvent,
  journeysRoutesFirst,
  getPlace,
  journeysForPerson,
  placesNear,
  type NearbyPlace,
  resolveStops,
  type ResolvedStop,
  stopsForEvent,
} from '../../data/atlas'
import type { BiblicalEvent, Journey, Person, Place } from '../../data/types'
import { BOOKS } from '../scripture/books'
import { parseRef, rangesOverlap, type ScriptureRange } from '../scripture/reference'
import type { SearchDocument } from './documents'
import type { QueryAnalysis } from './intent'
import { normalize, tokenize, words } from './text'

export interface JourneyStopRef {
  journey: Journey
  stop: ResolvedStop
}

export type Answer =
  | { kind: 'reference'; range: ScriptureRange; stops: JourneyStopRef[]; events: BiblicalEvent[] }
  | { kind: 'sequence'; relation: 'after' | 'before'; place: Place; steps: SequenceStep[] }
  | { kind: 'event'; event: BiblicalEvent; place: Place; context?: JourneyStopRef }
  | { kind: 'nearby'; place: Place; nearby: NearbyPlace[] }
  | { kind: 'region'; region: string; person: Person | null; groups: Array<{ journey: Journey; stops: ResolvedStop[] }> }

/**
 * One journey's answer to "where did they go after/before X": the stop(s) on the other side of X.
 * When the verse that narrates the move names several places ("they had passed through Amphipolis
 * and Apollonia, they came to Thessalonica", Acts 17:1), all of them are included, in order.
 */
export interface SequenceStep {
  journey: Journey
  /** The place asked about. */
  anchor: ResolvedStop
  /** The neighbouring stops, in narrative order. */
  stops: ResolvedStop[]
  /** The single verse that narrates the move, quoted as the answer's evidence. */
  verse: ScriptureRange
}

/** A ranked search document, as produced by the engine. */
export interface RankedDocument {
  doc: SearchDocument
  score: number
  coverage: number
}

const nearbyRadiusKm = (place: Place) => (place.kind === 'lake' ? 15 : place.kind === 'region' ? 120 : 25)

/** Book names as typed ("Romans", "Acts"): they name a book, not an action or a topic. */
const BOOK_WORDS = new Set(BOOKS.map((book) => normalize(book.name.en)).filter((name) => !name.includes(' ')))

function referenceAnswer(range: ScriptureRange): Answer | null {
  const stops: JourneyStopRef[] = []
  const placesShown = new Set<string>()
  for (const journey of journeysRoutesFirst) {
    for (const stop of resolveStops(journey)) {
      const stopRange = parseRef(stop.stop.passage)
      if (!stopRange || !rangesOverlap(stopRange, range)) continue
      // A collection repeats a place a route already shows only if it adds a different place.
      if (journey.type === 'collection' && placesShown.has(stop.place.id)) continue
      stops.push({ journey, stop })
      placesShown.add(stop.place.id)
    }
  }
  const events = [
    ...new Map(
      stops
        .flatMap(({ stop }) => stop.events)
        .filter((event) => {
          const eventRange = parseRef(event.passage)
          return eventRange !== null && rangesOverlap(eventRange, range)
        })
        .map((event) => [event.id, event]),
    ).values(),
  ]
  return stops.length > 0 ? { kind: 'reference', range, stops, events } : null
}

/** The first verse of a stop's passage. */
const firstVerse = (stop: ResolvedStop): ScriptureRange | null => {
  const range = parseRef(stop.stop.passage)
  return range ? { book: range.book, start: range.start, end: range.start } : null
}
const sameVerse = (a: ScriptureRange | null, b: ScriptureRange | null) =>
  a !== null && b !== null && a.book === b.book && a.start.chapter === b.start.chapter && a.start.verse === b.start.verse

function sequenceAnswer(relation: 'after' | 'before', place: Place, person: Person | null): Answer | null {
  const steps: SequenceStep[] = []
  const step = relation === 'after' ? 1 : -1
  for (const journey of allJourneys) {
    if (journey.type !== 'route') continue
    if (person && !journeysForPerson(person.id).includes(journey)) continue
    const stops = resolveStops(journey)
    stops.forEach((stop, index) => {
      if (stop.place.id !== place.id) return
      const neighbour = stops[index + step]
      const verse = neighbour ? firstVerse(neighbour) : null
      if (!neighbour || !verse) return
      // Every further stop narrated from the same verse belongs to the same move.
      const group = [neighbour]
      for (let next = stops[index + step * 2]; next && sameVerse(firstVerse(next), verse); next = stops[index + step * (group.length + 1)]) {
        group.push(next)
      }
      if (relation === 'before') group.reverse()
      steps.push({ journey, anchor: stop, stops: group, verse })
    })
  }
  return steps.length > 0 ? { kind: 'sequence', relation, place, steps } : null
}

function regionAnswer(region: string, person: Person | null): Answer | null {
  const regionPlace = allPlaces.find((place) => place.kind === 'region' && place.name.en.toLowerCase() === region)
  const inRegion = (place: Place) =>
    place.ancientRegion?.en.toLowerCase() === region || (regionPlace !== undefined && place.id === regionPlace.id)
  const groupsOf = (type: Journey['type']) =>
    allJourneys
      .filter((journey) => journey.type === type && (!person || journeysForPerson(person.id).includes(journey)))
      .map((journey) => ({ journey, stops: resolveStops(journey).filter((stop) => inRegion(stop.place)) }))
      .filter((group) => group.stops.length > 0)
  // Travels through a region are routes; collections answer only when no route passes through it.
  const routes = groupsOf('route')
  const groups = routes.length > 0 ? routes : groupsOf('collection')
  return groups.length > 0 ? { kind: 'region', region, person, groups } : null
}

/**
 * Answers "where" questions when one event is clearly the best match for the question's action
 * ("born", "shipwrecked") or involves every person it names ("meet Lydia").
 */
function eventAnswer(analysis: QueryAnalysis, ranked: readonly RankedDocument[]): Answer | null {
  const events = ranked.filter((result) => result.doc.type === 'event')
  const [first, second] = events
  if (!first || first.score < 6 || first.coverage < 0.66) return null
  if (second && second.score > first.score * 0.87) return null
  const event = getEvent(first.doc.entityId)
  const place = event && getPlace(event.placeIds[0]!)
  if (!event || !place) return null

  const nameTokens = new Set(
    [...analysis.people, ...analysis.places]
      .flatMap((item) => [item.name.en, ...(item.alternateNames ?? []), ...(item.searchTerms ?? [])])
      .flatMap((name) => tokenize(name)),
  )
  const actionWords = words(analysis.raw).filter((word) => !BOOK_WORDS.has(word))
  const actionTokens = tokenize(actionWords.join(' ')).filter((token) => !nameTokens.has(token))
  const eventTokens = [...tokenize(first.doc.title), ...first.doc.keywords.flatMap((keyword) => tokenize(keyword))]
  const matchesAction = actionTokens.some((token) => eventTokens.some((word) => word === token || word.startsWith(token)))
  const involvesEveryone =
    analysis.people.length >= 2 && analysis.people.every((person) => event.personIds.includes(person.id))
  if (!matchesAction && !involvesEveryone) return null

  const context = stopsForEvent(event.id)[0]
  return { kind: 'event', event, place, ...(context ? { context } : {}) }
}

export function buildAnswer(analysis: QueryAnalysis, ranked: readonly RankedDocument[]): Answer | null {
  const person = analysis.people.length === 1 ? analysis.people[0]! : null
  const place = analysis.places[0]

  if (analysis.reference) {
    const answer = referenceAnswer(analysis.reference.range)
    if (answer) return answer
  }
  if (analysis.relation && place) {
    const answer = sequenceAnswer(analysis.relation, place, person)
    if (answer) return answer
  }
  if (analysis.proximity && place) {
    const nearby = placesNear(place.coordinates, nearbyRadiusKm(place), place.id)
    if (nearby.length > 0) return { kind: 'nearby', place, nearby }
  }
  if (analysis.regions.length > 0 && (person || analysis.places.every((p) => p.kind === 'region'))) {
    const answer = regionAnswer(analysis.regions[0]!, person)
    if (answer) return answer
  }
  if (analysis.whereQuestion) return eventAnswer(analysis, ranked)
  return null
}
