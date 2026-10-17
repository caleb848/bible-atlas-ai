import { eventsForPerson, type ResolvedStop } from '../../data/atlas'
import type { Journey, Place } from '../../data/types'

/**
 * What the map frames and marks. Derived from the route; selection (the current stop, a
 * highlighted journey) is passed separately so selecting never rebuilds the markers.
 */
export type MapScene =
  | { kind: 'overview' }
  | { kind: 'journey'; journey: Journey; stops: readonly ResolvedStop[] }
  | { kind: 'place'; place: Place; context: readonly Place[] }
  | { kind: 'places'; places: readonly Place[] }
  /**
   * Where a person's story unfolds: places of the events naming them, and their stated home town.
   * A preview (pointing at a name in the People directory) marks the places without moving the map.
   */
  | { kind: 'person'; id: string; places: readonly Place[]; origins: readonly Place[]; preview?: boolean }

/** What the opening view brings forward while the reader points at it on the home screen. */
export type OverviewEmphasis = 'journeys' | 'places'

export type MarkerVariant = 'stop' | 'passed' | 'region' | 'focus' | 'place' | 'area' | 'origin' | 'context'

export interface MarkerSpec {
  /** Place id — one marker per place, even when a journey visits it more than once. */
  id: string
  place: Place
  variant: MarkerVariant
  /** 1-based stop numbers at this place (journey scenes only). */
  numbers: number[]
  /** Indexes into `journey.stops` for those numbers. */
  stopIndexes: number[]
  /** Lower draws first and loses label collisions. */
  priority: number
}

/** Identifies a scene, so the camera re-frames only when it changes. */
export function sceneKey(scene: MapScene): string {
  switch (scene.kind) {
    case 'overview':
      return 'overview'
    case 'journey':
      return `journey:${scene.journey.id}`
    case 'place':
      return `place:${scene.place.id}`
    case 'places':
      return `places:${scene.places.map((place) => place.id).join(',')}`
    case 'person':
      return `person:${scene.id}${scene.preview ? ':preview' : ''}`
  }
}

/** A region (Galilee, Macedonia) is drawn as an area with a dashed edge, not as a town. */
const placeVariant = (place: Place): MarkerVariant => (place.kind === 'region' ? 'area' : 'place')

export function markersForScene(scene: MapScene): MarkerSpec[] {
  switch (scene.kind) {
    case 'overview':
      return []
    case 'journey': {
      const byPlace = new Map<string, MarkerSpec>()
      for (const stop of scene.stops) {
        const existing = byPlace.get(stop.place.id)
        if (existing) {
          existing.numbers.push(stop.number)
          existing.stopIndexes.push(stop.index)
          existing.priority += Math.min(stop.events.length, 9) / 10
          if (stop.stop.presence !== 'passed') existing.variant = stop.place.kind === 'region' ? 'region' : 'stop'
          continue
        }
        byPlace.set(stop.place.id, {
          id: stop.place.id,
          place: stop.place,
          variant: stop.place.kind === 'region' ? 'region' : stop.stop.presence === 'passed' ? 'passed' : 'stop',
          numbers: [stop.number],
          stopIndexes: [stop.index],
          // Where stops crowd together, the ones the text narrates most stay visible (Philippi
          // before Neapolis, its port).
          priority: (stop.stop.presence === 'passed' ? 1 : 2) + Math.min(stop.events.length, 9) / 10,
        })
      }
      return [...byPlace.values()]
    }
    case 'place':
      return [
        ...scene.context.map((place) => ({
          id: place.id,
          place,
          variant: 'context' as const,
          numbers: [],
          stopIndexes: [],
          priority: 1,
        })),
        { id: scene.place.id, place: scene.place, variant: 'focus', numbers: [], stopIndexes: [], priority: 3 },
      ]
    case 'places':
      return scene.places.map((place) => ({ id: place.id, place, variant: placeVariant(place), numbers: [], stopIndexes: [], priority: 1 }))
    case 'person': {
      // Where markers crowd together, the places where more of the person's story happens stay
      // visible (Philippi before its port, Neapolis, for Timothy).
      const events = eventsForPerson(scene.id)
      const weight = (place: Place) => Math.min(events.filter((event) => event.placeIds.includes(place.id)).length, 9) / 10
      const markers: MarkerSpec[] = scene.places.map((place) => ({
        id: place.id,
        place,
        variant: placeVariant(place),
        numbers: [],
        stopIndexes: [],
        priority: 2 + weight(place),
      }))
      for (const place of scene.origins) {
        if (!markers.some((marker) => marker.id === place.id)) {
          markers.push({ id: place.id, place, variant: 'origin', numbers: [], stopIndexes: [], priority: 2 })
        }
      }
      return markers
    }
  }
}

/** Every coordinate a scene should keep in view. */
export function scenePoints(scene: MapScene): Array<[number, number]> {
  switch (scene.kind) {
    case 'overview':
      return []
    case 'journey':
      return scene.stops.map((stop) => stop.place.coordinates)
    case 'place':
      return [scene.place.coordinates]
    case 'places':
      return scene.places.map((place) => place.coordinates)
    case 'person':
      return [...scene.places, ...scene.origins].map((place) => place.coordinates)
  }
}
