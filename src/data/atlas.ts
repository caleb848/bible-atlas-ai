/**
 * Read-only access to the atlas: lookups by id and relationships derived from the source data.
 * Relationships (people at a place, journeys through a place, ...) are always computed from
 * events and stops so they can never drift out of sync with the content.
 */
import { haversineKm, type LngLat } from '../lib/geo/geo'
import { compareRanges, parseRef } from '../lib/scripture/reference'
import { eras } from './eras'
import { events } from './events'
import { journeys } from './journeys'
import { people } from './people'
import { places } from './places'
import type { BiblicalEvent, Era, Journey, JourneyStop, Person, Place } from './types'

const indexById = <T extends { id: string }>(items: readonly T[]) => new Map(items.map((item) => [item.id, item]))

const placeById = indexById(places)
const personById = indexById(people)
const eventById = indexById(events)
const journeyById = indexById(journeys)
const eraById = indexById(eras)

export const getPlace = (id: string): Place | undefined => placeById.get(id)
export const getPerson = (id: string): Person | undefined => personById.get(id)
export const getEvent = (id: string): BiblicalEvent | undefined => eventById.get(id)
export const getJourney = (id: string): Journey | undefined => journeyById.get(id)
export const getEra = (id: string): Era | undefined => eraById.get(id)

export const allPlaces: readonly Place[] = places
export const allPeople: readonly Person[] = people
export const allEvents: readonly BiblicalEvent[] = events
export const allJourneys: readonly Journey[] = journeys

/**
 * Routes before collections. Where a route and a collection share a stop (Philippi is on Paul's
 * second journey and in the women's collection), the route is the one that tells the story.
 */
export const journeysRoutesFirst: readonly Journey[] = [
  ...journeys.filter((journey) => journey.type === 'route'),
  ...journeys.filter((journey) => journey.type === 'collection'),
]

const isDefined = <T>(value: T | undefined): value is T => value !== undefined

/** Canonical order (by book, chapter and verse) of an event's passage. */
export function compareEvents(a: BiblicalEvent, b: BiblicalEvent): number {
  const ra = parseRef(a.passage)
  const rb = parseRef(b.passage)
  if (!ra || !rb) return 0
  return compareRanges(ra, rb)
}

// ---------------------------------------------------------------------------------------------
// Journeys

export interface ResolvedStop {
  /** Index into `journey.stops`. */
  index: number
  /** 1-based number shown on the map and in the timeline. */
  number: number
  stop: JourneyStop
  place: Place
  events: BiblicalEvent[]
}

const resolvedStopsCache = new WeakMap<Journey, ResolvedStop[]>()

/** Stops with their place and events attached. Stops whose place is missing are skipped. */
export function resolveStops(journey: Journey): ResolvedStop[] {
  const cached = resolvedStopsCache.get(journey)
  if (cached) return cached
  const resolved: ResolvedStop[] = []
  journey.stops.forEach((stop, index) => {
    const place = getPlace(stop.placeId)
    if (!place) return
    resolved.push({
      index,
      number: resolved.length + 1,
      stop,
      place,
      events: stop.eventIds.map(getEvent).filter(isDefined),
    })
  })
  resolvedStopsCache.set(journey, resolved)
  return resolved
}

/** Each place once, in order of first appearance. */
export function journeyPlaces(journey: Journey): Place[] {
  const seen = new Set<string>()
  return resolveStops(journey)
    .map((s) => s.place)
    .filter((place) => (seen.has(place.id) ? false : (seen.add(place.id), true)))
}

/**
 * Straight-line distance between consecutive stops, in km. This is an approximate mapped
 * distance only — not the length of the historical roads or sea lanes. Null for collections.
 */
export function mappedDistanceKm(journey: Journey): number | null {
  if (journey.type !== 'route') return null
  const stops = resolveStops(journey)
  let total = 0
  for (let i = 1; i < stops.length; i++) {
    total += haversineKm(stops[i - 1]!.place.coordinates, stops[i]!.place.coordinates)
  }
  return total
}

export const featuredJourneys = (): Journey[] => journeys.filter((journey) => journey.featured)

export interface JourneyPerson {
  person: Person
  /** Number of stops with at least one event naming this person. */
  stops: number
}

const journeyPeopleCache = new WeakMap<Journey, JourneyPerson[]>()

/**
 * Everyone named in the journey's events, most widely present first (then in order of first
 * appearance). Journeys never list people by hand, so this always matches the events. A thematic
 * collection counts only the people of its `focusGroup`.
 */
export function journeyPeople(journey: Journey): JourneyPerson[] {
  const cached = journeyPeopleCache.get(journey)
  if (cached) return cached
  const counts = new Map<string, { stops: number; first: number }>()
  for (const stop of resolveStops(journey)) {
    const here = new Set(stop.events.flatMap((event) => event.personIds))
    for (const id of here) {
      const entry = counts.get(id)
      if (entry) entry.stops++
      else counts.set(id, { stops: 1, first: stop.index })
    }
  }
  const list = [...counts.entries()]
    .sort((a, b) => b[1].stops - a[1].stops || a[1].first - b[1].first)
    .map(([id, entry]) => ({ person: getPerson(id), stops: entry.stops }))
    .filter((entry): entry is JourneyPerson => entry.person !== undefined)
    .filter((entry) => !journey.focusGroup || entry.person.groups.includes(journey.focusGroup))
  journeyPeopleCache.set(journey, list)
  return list
}

/** A route's travelers are the people its events name at this many stops or more. */
export const TRAVELER_MIN_STOPS = 3

/**
 * The people a journey is "with": for a route, those named at `TRAVELER_MIN_STOPS` or more stops
 * (Paul, Silas and Timothy on the second journey); for a collection, those named at two or more.
 */
export function journeyTravelers(journey: Journey): Person[] {
  const minimum = journey.type === 'route' ? TRAVELER_MIN_STOPS : 2
  return journeyPeople(journey)
    .filter((entry) => entry.stops >= minimum)
    .map((entry) => entry.person)
}

// ---------------------------------------------------------------------------------------------
// Places

const eventsByPlace = new Map<string, BiblicalEvent[]>()
for (const event of [...events].sort(compareEvents)) {
  for (const placeId of event.placeIds) {
    const list = eventsByPlace.get(placeId) ?? []
    list.push(event)
    eventsByPlace.set(placeId, list)
  }
}

export const eventsAtPlace = (placeId: string): BiblicalEvent[] => eventsByPlace.get(placeId) ?? []

export interface PlaceVisit {
  journey: Journey
  stops: ResolvedStop[]
}

export function journeysAtPlace(placeId: string): PlaceVisit[] {
  return journeysRoutesFirst
    .map((journey) => ({ journey, stops: resolveStops(journey).filter((s) => s.place.id === placeId) }))
    .filter((visit) => visit.stops.length > 0)
}

/** People named in events at this place, most frequently mentioned first. */
export function peopleAtPlace(placeId: string): Person[] {
  const counts = new Map<string, number>()
  for (const event of eventsAtPlace(placeId)) {
    for (const personId of event.personIds) counts.set(personId, (counts.get(personId) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => getPerson(id))
    .filter(isDefined)
}

export interface NearbyPlace {
  place: Place
  distanceKm: number
}

/** Other places within `radiusKm` of a coordinate, nearest first. */
export function placesNear(coordinates: LngLat, radiusKm: number, excludeId?: string): NearbyPlace[] {
  return places
    .filter((place) => place.id !== excludeId)
    .map((place) => ({ place, distanceKm: haversineKm(coordinates, place.coordinates) }))
    .filter((entry) => entry.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm)
}

// ---------------------------------------------------------------------------------------------
// People

export const eventsForPerson = (personId: string): BiblicalEvent[] =>
  events.filter((event) => event.personIds.includes(personId)).sort(compareEvents)

/** Places where events naming the person happen, in narrative order (home towns not included). */
export function placesForPerson(personId: string): Place[] {
  const seen = new Set<string>()
  const result: Place[] = []
  for (const event of eventsForPerson(personId)) {
    for (const placeId of event.placeIds) {
      const place = getPlace(placeId)
      if (place && !seen.has(place.id)) {
        seen.add(place.id)
        result.push(place)
      }
    }
  }
  return result
}

/** Home towns the text gives for a person, with the verse that says so. */
export function originsForPerson(personId: string): Array<{ place: Place; ref: Person['refs'][number] }> {
  return (getPerson(personId)?.origins ?? [])
    .map((origin) => ({ place: getPlace(origin.placeId), ref: origin.ref }))
    .filter((origin): origin is { place: Place; ref: Person['refs'][number] } => origin.place !== undefined)
}

/** People whose home town (as the text gives it) is this place. */
export const peopleFromPlace = (placeId: string): Person[] =>
  people.filter((person) => person.origins?.some((origin) => origin.placeId === placeId))

/** Journeys and collections with at least one event naming the person. */
export function journeysForPerson(personId: string): Journey[] {
  return journeys.filter((journey) => journeyPeople(journey).some((entry) => entry.person.id === personId))
}

export interface PersonStats {
  events: number
  places: number
  journeys: number
}

/** How much of the atlas a person appears in, always computed from the events. */
export function personStats(personId: string): PersonStats {
  return {
    events: eventsForPerson(personId).length,
    places: placesForPerson(personId).length,
    journeys: journeysForPerson(personId).length,
  }
}

export interface ConnectedPerson {
  person: Person
  /** Events naming both people. */
  shared: number
}

/** People named alongside this person in the same events, most shared events first. */
export function connectedPeople(personId: string): ConnectedPerson[] {
  const counts = new Map<string, number>()
  for (const event of eventsForPerson(personId)) {
    for (const other of event.personIds) {
      if (other !== personId) counts.set(other, (counts.get(other) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id, shared]) => ({ person: getPerson(id), shared }))
    .filter((entry): entry is ConnectedPerson => entry.person !== undefined)
}

/** Where an event appears in journeys, so search and links can open it in context. */
export function stopsForEvent(eventId: string): Array<{ journey: Journey; stop: ResolvedStop }> {
  const result: Array<{ journey: Journey; stop: ResolvedStop }> = []
  for (const journey of journeysRoutesFirst) {
    for (const stop of resolveStops(journey)) {
      if (stop.stop.eventIds.includes(eventId)) result.push({ journey, stop })
    }
  }
  return result
}
