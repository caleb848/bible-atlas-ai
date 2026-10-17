export type LngLat = [number, number]

const EARTH_RADIUS_KM = 6371.0088
const toRadians = (degrees: number) => (degrees * Math.PI) / 180

/** Great-circle distance in kilometres. */
export function haversineKm([lng1, lat1]: LngLat, [lng2, lat2]: LngLat): number {
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)))
}

export type Bounds = [LngLat, LngLat]

/** South-west / north-east corners enclosing all points, or null for an empty list. */
export function boundsOf(points: readonly LngLat[]): Bounds | null {
  if (points.length === 0) return null
  let [west, south] = points[0]!
  let [east, north] = points[0]!
  for (const [lng, lat] of points) {
    west = Math.min(west, lng)
    east = Math.max(east, lng)
    south = Math.min(south, lat)
    north = Math.max(north, lat)
  }
  return [
    [west, south],
    [east, north],
  ]
}

/**
 * A gently curved path between two points (a quadratic Bézier in lng/lat space). Routes are
 * schematic — they connect documented stops, not historical roads — and the curve makes that
 * visually clear while keeping out-and-back legs from drawing on top of each other.
 */
export function curvedSegment(from: LngLat, to: LngLat, bend = 0.12, steps = 32): LngLat[] {
  const [x1, y1] = from
  const [x2, y2] = to
  const dx = x2 - x1
  const dy = y2 - y1
  // Control point offset perpendicular to the chord, always bending to the left of travel.
  const cx = (x1 + x2) / 2 - dy * bend
  const cy = (y1 + y2) / 2 + dx * bend
  const points: LngLat[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const a = (1 - t) ** 2
    const b = 2 * (1 - t) * t
    const c = t ** 2
    points.push([a * x1 + b * cx + c * x2, a * y1 + b * cy + c * y2])
  }
  return points
}

/** Total length of a polyline in kilometres. */
export function pathLengthKm(points: readonly LngLat[]): number {
  let total = 0
  for (let i = 1; i < points.length; i++) total += haversineKm(points[i - 1]!, points[i]!)
  return total
}
