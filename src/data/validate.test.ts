import { describe, expect, it } from 'vitest'
import { journeyPlaces, mappedDistanceKm, resolveStops } from './atlas'
import { eras } from './eras'
import { events } from './events'
import { journeys } from './journeys'
import { people } from './people'
import { places } from './places'
import { validateAtlas } from './validate'

describe('atlas data', () => {
  const issues = validateAtlas({ places, people, events, journeys, eras })

  it('has no integrity errors', () => {
    expect(issues.filter((issue) => issue.severity === 'error')).toEqual([])
  })

  it('has no warnings', () => {
    expect(issues.filter((issue) => issue.severity === 'warning')).toEqual([])
  })

  it('never draws a route through a collection', () => {
    for (const journey of journeys.filter((j) => j.type === 'collection')) {
      expect(mappedDistanceKm(journey)).toBeNull()
    }
  })

  it('numbers stops consecutively', () => {
    for (const journey of journeys) {
      expect(resolveStops(journey).map((stop) => stop.number)).toEqual(journey.stops.map((_, i) => i + 1))
    }
  })

  it('keeps Paul’s second journey faithful to Acts 15:36–18:22', () => {
    const second = journeys.find((j) => j.id === 'paul-second-missionary-journey')!
    expect(resolveStops(second).map((stop) => stop.place.id)).toEqual([
      'antioch-syria',
      'derbe',
      'lystra',
      'troas',
      'samothrace',
      'neapolis',
      'philippi',
      'amphipolis',
      'apollonia',
      'thessalonica',
      'berea',
      'athens',
      'corinth',
      'cenchreae',
      'ephesus',
      'caesarea',
      'jerusalem',
      'antioch-syria',
    ])
    // Tarsus is not named in this section of Acts, so it must not appear as a stop.
    expect(journeyPlaces(second).some((place) => place.id === 'tarsus')).toBe(false)
  })

  it('marks Jerusalem in Acts 18:22 as implied rather than stated', () => {
    const second = journeys.find((j) => j.id === 'paul-second-missionary-journey')!
    const jerusalem = resolveStops(second).find((stop) => stop.place.id === 'jerusalem')!
    expect(jerusalem.stop.arrival?.certainty).toBe('implied')
  })
})
