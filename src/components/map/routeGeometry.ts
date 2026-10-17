import type { Feature, FeatureCollection, LineString } from 'geojson'
import { resolveStops, type ResolvedStop } from '../../data/atlas'
import type { Journey } from '../../data/types'
import { curvedSegment, type LngLat, pathLengthKm } from '../../lib/geo/geo'

/**
 * How a leg is drawn:
 * - `sea`: the text says the travelers sailed (dashed)
 * - `solid`: overland, or the mode is not stated
 * - `uncertain`: the leg is implied, or its course is unknown (dotted)
 */
export type LegStyle = 'solid' | 'sea' | 'uncertain'

export interface LegProperties {
  /** Index of the stop this leg arrives at. */
  toIndex: number
  style: LegStyle
}

export interface RouteGeometry {
  legs: Array<{ coordinates: LngLat[]; lengthKm: number; properties: LegProperties }>
  /** Distance from the start to each stop, as a fraction of the whole route (0..1). */
  stopFractions: number[]
  totalKm: number
}

export function legStyle(stop: ResolvedStop): LegStyle {
  const arrival = stop.stop.arrival
  if (!arrival || arrival.certainty !== 'stated') return 'uncertain'
  return arrival.mode === 'sea' ? 'sea' : 'solid'
}

export function buildRouteGeometry(stops: readonly ResolvedStop[]): RouteGeometry {
  const legs: RouteGeometry['legs'] = []
  for (let i = 1; i < stops.length; i++) {
    const coordinates = curvedSegment(stops[i - 1]!.place.coordinates, stops[i]!.place.coordinates)
    legs.push({ coordinates, lengthKm: pathLengthKm(coordinates), properties: { toIndex: stops[i]!.index, style: legStyle(stops[i]!) } })
  }
  const totalKm = legs.reduce((sum, leg) => sum + leg.lengthKm, 0)
  const stopFractions = [0]
  let travelled = 0
  for (const leg of legs) {
    travelled += leg.lengthKm
    stopFractions.push(totalKm > 0 ? travelled / totalKm : 1)
  }
  return { legs, stopFractions, totalKm }
}

/** The legs drawn up to `progress` (0..1) of the route's length, for the drawing animation. */
export function routeFeatures(geometry: RouteGeometry, progress = 1): FeatureCollection<LineString, LegProperties> {
  const features: Feature<LineString, LegProperties>[] = []
  let remaining = progress * geometry.totalKm
  for (const leg of geometry.legs) {
    if (remaining <= 0) break
    let coordinates = leg.coordinates
    if (remaining < leg.lengthKm) {
      const keep = Math.max(2, Math.ceil((remaining / leg.lengthKm) * (coordinates.length - 1)) + 1)
      coordinates = coordinates.slice(0, keep)
    }
    remaining -= leg.lengthKm
    features.push({ type: 'Feature', properties: leg.properties, geometry: { type: 'LineString', coordinates } })
  }
  return { type: 'FeatureCollection', features }
}

/** Faint lines for every route journey, shown on the opening view. */
export function overviewFeatures(journeys: readonly Journey[]): FeatureCollection<LineString, { journeyId: string }> {
  return {
    type: 'FeatureCollection',
    features: journeys
      .filter((journey) => journey.type === 'route')
      .map((journey) => ({
        type: 'Feature' as const,
        properties: { journeyId: journey.id },
        geometry: {
          type: 'LineString' as const,
          coordinates: buildRouteGeometry(resolveStops(journey)).legs.flatMap((leg, i) =>
            i === 0 ? leg.coordinates : leg.coordinates.slice(1),
          ),
        },
      })),
  }
}
