import type { MarkerState, MarkerVisit } from './MarkerView'

/** A place visited more often than this shows one visit and a count of the others. */
export const MAX_DISCS = 4

export interface MarkerDisc {
  key: string
  text: string
  /** The stop indexes the disc stands for. */
  indexes: number[]
  state: MarkerState
}

/**
 * The discs of a place visited more than once: one per visit, or, past MAX_DISCS, the visit that
 * matters now (the current one, else the next, else the last; the first before the journey
 * begins) and a count of the rest.
 */
export function discsFor(visits: readonly MarkerVisit[]): MarkerDisc[] {
  const disc = (visit: MarkerVisit): MarkerDisc => ({ key: String(visit.index), text: String(visit.number), indexes: [visit.index], state: visit.state })
  if (visits.length <= MAX_DISCS) return visits.map(disc)
  const featured =
    visits.find((visit) => visit.state === 'current') ??
    visits.find((visit) => visit.state === 'upcoming') ??
    visits.findLast((visit) => visit.state === 'done') ??
    visits[0]!
  const others = visits.filter((visit) => visit !== featured)
  return [disc(featured), { key: 'more', text: `+${others.length}`, indexes: others.map((visit) => visit.index), state: 'upcoming' }]
}
