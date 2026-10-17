import { getEvent, journeysRoutesFirst, resolveStops, stopsForEvent } from '../../data/atlas'
import type { Route } from '../../lib/router/routes'
import type { SearchDocument } from '../../lib/search/documents'
import { parseRef, rangesOverlap, type ScriptureRange } from '../../lib/scripture/reference'
import type { ReaderRequest } from '../scripture/readerContext'

export type SearchAction = { type: 'navigate'; route: Route } | { type: 'read'; request: ReaderRequest }

export const journeyStopRoute = (journeyId: string, stopIndex: number): Route => ({
  name: 'journey',
  id: journeyId,
  stop: stopIndex + 1,
})

/** The first mapped stop whose passage overlaps a range, e.g. where "Acts 16" begins on the map. */
export function firstStopInRange(range: ScriptureRange): Route | null {
  for (const journey of journeysRoutesFirst) {
    for (const stop of resolveStops(journey)) {
      const stopRange = parseRef(stop.stop.passage)
      if (stopRange && rangesOverlap(stopRange, range)) return journeyStopRoute(journey.id, stop.index)
    }
  }
  return null
}

/** Where selecting a search result takes you. Events open in their journey when they have one. */
export function actionForDocument(doc: SearchDocument): SearchAction {
  switch (doc.type) {
    case 'journey':
      return { type: 'navigate', route: { name: 'journey', id: doc.entityId } }
    case 'place':
      return { type: 'navigate', route: { name: 'place', id: doc.entityId } }
    case 'person':
      return { type: 'navigate', route: { name: 'person', id: doc.entityId } }
    case 'event': {
      const context = stopsForEvent(doc.entityId)[0]
      if (context) return { type: 'navigate', route: journeyStopRoute(context.journey.id, context.stop.index) }
      const placeId = getEvent(doc.entityId)?.placeIds[0]
      return { type: 'navigate', route: placeId ? { name: 'place', id: placeId } : { name: 'home' } }
    }
    case 'scripture': {
      const range = doc.ranges[0]!
      const route = firstStopInRange(range)
      if (route) return { type: 'navigate', route }
      return { type: 'read', request: { items: [{ passage: range }] } }
    }
  }
}
