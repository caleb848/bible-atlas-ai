import type { LocalizedText, Place } from '../../data/types'

/**
 * Where a place is today, e.g. "Archaeological site of Philippi, near Kavala · Greece". The area is
 * left out when it only repeats the name (the island of Malta is in Malta).
 */
export function modernLocation(place: Place, text: (value: LocalizedText) => string, separator = ', '): string | null {
  if (!place.modern) return null
  const name = text(place.modern.name)
  const area = place.modern.area ? text(place.modern.area) : ''
  return area && !name.includes(area) ? `${name}${separator}${area}` : name
}
