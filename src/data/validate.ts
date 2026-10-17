import { parseRef, rangeContains } from '../lib/scripture/reference'
import type { BiblicalEvent, Era, Journey, Person, Place, RefString } from './types'

export interface DataIssue {
  severity: 'error' | 'warning'
  message: string
}

export interface AtlasData {
  places: readonly Place[]
  people: readonly Person[]
  events: readonly BiblicalEvent[]
  journeys: readonly Journey[]
  eras: readonly Era[]
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/**
 * Integrity checks for the atlas content. Errors would show broken or misleading content;
 * warnings flag content that is valid but probably unintended (for example an unused place).
 */
export function validateAtlas(data: AtlasData): DataIssue[] {
  const issues: DataIssue[] = []
  const error = (message: string) => issues.push({ severity: 'error', message })
  const warn = (message: string) => issues.push({ severity: 'warning', message })

  const checkIds = (kind: string, items: readonly { id: string }[]) => {
    const seen = new Set<string>()
    for (const { id } of items) {
      if (!SLUG.test(id)) error(`${kind} id "${id}" is not a URL-safe slug`)
      if (seen.has(id)) error(`Duplicate ${kind} id "${id}"`)
      seen.add(id)
    }
    return seen
  }
  const placeIds = checkIds('place', data.places)
  const personIds = checkIds('person', data.people)
  checkIds('event', data.events)
  checkIds('journey', data.journeys)
  const eraIds = checkIds('era', data.eras)

  const checkRef = (ref: RefString, where: string) => {
    if (!parseRef(ref)) error(`Malformed reference "${ref}" in ${where}`)
  }

  for (const place of data.places) {
    const [lng, lat] = place.coordinates
    if (!(lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90)) {
      error(`Place "${place.id}" has invalid coordinates`)
    } else if (lng < 5 || lng > 45 || lat < 25 || lat > 48) {
      warn(`Place "${place.id}" lies outside the Mediterranean area the atlas covers`)
    }
    if (place.sources.length === 0) error(`Place "${place.id}" has no coordinate source`)
    if (place.certainty !== 'identified' && place.certainty !== 'probable' && !place.certaintyNote) {
      error(`Place "${place.id}" is "${place.certainty}" but has no certaintyNote explaining it`)
    }
    if (place.refs.length === 0) warn(`Place "${place.id}" has no Scripture references`)
    place.refs.forEach((ref) => checkRef(ref, `place "${place.id}"`))
  }

  for (const person of data.people) {
    const where = `person "${person.id}"`
    if (person.refs.length === 0) warn(`Person "${person.id}" has no Scripture references`)
    if (person.groups.length === 0) error(`Person "${person.id}" belongs to no group`)
    person.refs.forEach((ref) => checkRef(ref, where))
    for (const origin of person.origins ?? []) {
      checkRef(origin.ref, where)
      if (!placeIds.has(origin.placeId)) error(`${where} comes from unknown place "${origin.placeId}"`)
    }
  }

  for (const event of data.events) {
    const where = `event "${event.id}"`
    checkRef(event.passage, where)
    if (event.excerpt) {
      checkRef(event.excerpt, where)
      const passage = parseRef(event.passage)
      const excerpt = parseRef(event.excerpt)
      if (passage && excerpt && !rangeContains(passage, excerpt)) {
        error(`Excerpt ${event.excerpt} of ${where} is outside its passage ${event.passage}`)
      }
    }
    event.relatedRefs?.forEach((ref) => checkRef(ref, where))
    if (event.placeIds.length === 0) error(`${where} has no place`)
    event.placeIds.forEach((id) => placeIds.has(id) || error(`${where} references unknown place "${id}"`))
    event.personIds.forEach((id) => personIds.has(id) || error(`${where} references unknown person "${id}"`))
  }

  const eventsById = new Map(data.events.map((event) => [event.id, event]))
  // A place is used when an event happens there or the text gives it as someone's home.
  const usedPlaces = new Set([
    ...data.events.flatMap((event) => event.placeIds),
    ...data.people.flatMap((person) => person.origins?.map((origin) => origin.placeId) ?? []),
  ])
  const usedPeople = new Set(data.events.flatMap((event) => event.personIds))

  for (const journey of data.journeys) {
    const where = `journey "${journey.id}"`
    if (!eraIds.has(journey.eraId)) error(`${where} references unknown era "${journey.eraId}"`)
    journey.passages.forEach((ref) => checkRef(ref, where))
    if (journey.stops.length < 2) error(`${where} needs at least two stops`)
    if (journey.type === 'collection' && !journey.orderingNote) {
      error(`${where} is a collection but does not explain how its entries are ordered`)
    }

    const sectionIds = new Set(journey.sections?.map((section) => section.id))
    journey.stops.forEach((stop, index) => {
      const at = `${where} stop ${index + 1}`
      usedPlaces.add(stop.placeId)
      if (!placeIds.has(stop.placeId)) error(`${at} references unknown place "${stop.placeId}"`)
      checkRef(stop.passage, at)
      if (stop.quote) checkRef(stop.quote.ref, at)
      if (stop.eventIds.length === 0) warn(`${at} has no events`)
      for (const eventId of stop.eventIds) {
        const event = eventsById.get(eventId)
        if (!event) error(`${at} references unknown event "${eventId}"`)
        else if (!event.placeIds.includes(stop.placeId)) {
          error(`${at} lists event "${eventId}", which is not located at "${stop.placeId}"`)
        }
      }

      if (journey.type === 'route') {
        if (index === 0 && stop.arrival) error(`${at} is the start of a route and cannot have an arrival leg`)
        if (index > 0 && !stop.arrival) error(`${at} is missing its arrival leg`)
      } else if (stop.arrival) {
        error(`${at} has an arrival leg, but collections are not routes`)
      }

      if (journey.sections) {
        if (!stop.sectionId) error(`${at} has no section`)
        else if (!sectionIds.has(stop.sectionId)) error(`${at} references unknown section "${stop.sectionId}"`)
      }
    })
  }

  for (const place of data.places) if (!usedPlaces.has(place.id)) warn(`Place "${place.id}" is not used by any event or person`)
  for (const person of data.people) if (!usedPeople.has(person.id)) warn(`Person "${person.id}" is not used`)

  return issues
}
