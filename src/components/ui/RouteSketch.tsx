import { useId } from 'react'
import { journeyPlaces, resolveStops } from '../../data/atlas'
import type { Journey } from '../../data/types'
import { useI18n } from '../../i18n/i18n'
import { curvedSegment, type LngLat } from '../../lib/geo/geo'

interface RouteSketchProps {
  journey: Journey
  width?: number
  height?: number
  /** Highlights one stop (by index) — used by the schematic map fallback. */
  selectedIndex?: number | null
  showLabels?: boolean
  className?: string
  title?: string
}

/**
 * A lightweight SVG drawing of a journey's shape, projected from the real coordinates. Used for
 * journey cards and as a schematic when the interactive map cannot run.
 */
export function RouteSketch({
  journey,
  width = 160,
  height = 96,
  selectedIndex = null,
  showLabels = false,
  className = '',
  title,
}: RouteSketchProps) {
  const gradientId = useId()
  const { text } = useI18n()
  const stops = resolveStops(journey)
  const places = journeyPlaces(journey)
  if (stops.length === 0) return null

  const meanLat = places.reduce((sum, place) => sum + place.coordinates[1], 0) / places.length
  const scaleX = Math.cos((meanLat * Math.PI) / 180)
  const projected = (point: LngLat): LngLat => [point[0] * scaleX, -point[1]]
  const all = places.map((place) => projected(place.coordinates))
  const xs = all.map((p) => p[0])
  const ys = all.map((p) => p[1])
  const padding = showLabels ? 28 : 10
  const spanX = Math.max(...xs) - Math.min(...xs) || 1
  const spanY = Math.max(...ys) - Math.min(...ys) || 1
  const scale = Math.min((width - padding * 2) / spanX, (height - padding * 2) / spanY)
  const offsetX = (width - spanX * scale) / 2 - Math.min(...xs) * scale
  const offsetY = (height - spanY * scale) / 2 - Math.min(...ys) * scale
  const toSvg = (point: LngLat): LngLat => {
    const [x, y] = projected(point)
    return [x * scale + offsetX, y * scale + offsetY]
  }

  const path =
    journey.type === 'route'
      ? stops
          .slice(1)
          .map((stop, i) => {
            const from = stops[i]!.place.coordinates
            const points = curvedSegment(from, stop.place.coordinates, 0.12, 12).map(toSvg)
            return points.map((p, j) => `${j === 0 ? 'M' : 'L'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
          })
          .join(' ')
      : ''

  const selectedPlaceId = selectedIndex !== null ? stops[selectedIndex]?.place.id : undefined

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#2448b0" stopOpacity="0.45" />
          <stop offset="1" stopColor="#2448b0" />
        </linearGradient>
      </defs>
      {path && <path d={path} fill="none" stroke={`url(#${gradientId})`} strokeWidth={1.6} strokeLinecap="round" />}
      {places.map((place) => {
        const [x, y] = toSvg(place.coordinates)
        const selected = place.id === selectedPlaceId
        return (
          <g key={place.id}>
            <circle
              cx={x}
              cy={y}
              r={selected ? 4.5 : journey.type === 'route' ? 2.2 : 2.6}
              fill={selected ? '#2448b0' : '#fcfbf8'}
              stroke="#2448b0"
              strokeWidth={1.2}
            />
            {showLabels && (
              <text x={x + 6} y={y + 3.5} fontSize={10} fill={selected ? '#18202d' : '#4a5466'} fontFamily="var(--font-sans)">
                {text(place.name)}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
