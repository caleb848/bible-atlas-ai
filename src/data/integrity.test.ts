import { describe, expect, it } from 'vitest'
import { firstStopInRange } from '../components/search/actions'
import { describeAnswer } from '../components/search/answerView'
import { buildRouteGeometry } from '../components/map/routeGeometry'
import { createI18n } from '../i18n/i18n'
import { parseRef } from '../lib/scripture/reference'
import { search } from '../lib/search/engine'
import { normalize } from '../lib/search/text'
import {
  allEvents,
  allJourneys,
  allPeople,
  allPlaces,
  eventsAtPlace,
  eventsForPerson,
  getJourney,
  getPerson,
  journeyPeople,
  journeysAtPlace,
  journeysForPerson,
  journeyTravelers,
  peopleAtPlace,
  personStats,
  placesForPerson,
  resolveStops,
  stopsForEvent,
  TRAVELER_MIN_STOPS,
} from './atlas'
import { MATTHIAS, ORIGINAL_TWELVE } from './people/twelve'

describe('people', () => {
  it('has the original Twelve, exactly twelve, each a distinct person', () => {
    expect(ORIGINAL_TWELVE).toHaveLength(12)
    expect(new Set(ORIGINAL_TWELVE).size).toBe(12)
    for (const id of ORIGINAL_TWELVE) {
      const person = getPerson(id)
      expect(person, id).toBeDefined()
      expect(person?.groups, id).toContain('jesus-and-the-twelve')
    }
  })

  it('keeps Matthias separate from the original Twelve', () => {
    const matthias = getPerson(MATTHIAS)
    expect(matthias).toBeDefined()
    expect(ORIGINAL_TWELVE).not.toContain(MATTHIAS)
    expect(matthias?.refs.some((ref) => ref.startsWith('ACT 1:'))).toBe(true)
  })

  it('names Thaddaeus as the WEB does and labels the Jude identification as tradition', () => {
    const thaddaeus = getPerson('thaddaeus')!
    expect(thaddaeus.name.en).toBe('Thaddaeus')
    expect(thaddaeus.alternateNames).toEqual(expect.arrayContaining(['Lebbaeus', 'Judas son of James']))
    expect(thaddaeus.identityNote?.en).toMatch(/tradition/i)
    // Jude, author of the Epistle of Jude, is never a name or search term for him.
    expect([...(thaddaeus.alternateNames ?? []), ...(thaddaeus.searchTerms ?? [])]).not.toContain('Jude')
  })

  it('develops Timothy from the text, at the places it names him', () => {
    const timothy = getPerson('timothy')!
    const places = placesForPerson('timothy').map((place) => place.id)
    expect(places).toEqual(expect.arrayContaining(['lystra', 'berea', 'corinth', 'ephesus', 'thessalonica', 'athens', 'macedonia']))
    expect(eventsForPerson('timothy').length).toBeGreaterThanOrEqual(8)
    expect(timothy.refs.length).toBeGreaterThanOrEqual(4)
  })

  it('has no duplicate ids, names or names reused as another person’s alias', () => {
    const ids = allPeople.map((person) => person.id)
    expect(new Set(ids).size).toBe(ids.length)
    const names = new Map(allPeople.map((person) => [normalize(person.name.en), person.id]))
    expect(names.size).toBe(allPeople.length)
    for (const person of allPeople) {
      for (const alias of person.alternateNames ?? []) {
        const owner = names.get(normalize(alias))
        expect(owner === undefined || owner === person.id, `${person.id} alias "${alias}" is ${owner}'s name`).toBe(true)
      }
    }
  })

  it('connects every person to Scripture and to at least one mapped event', () => {
    for (const person of allPeople) {
      expect(person.refs.length, person.id).toBeGreaterThan(0)
      expect(person.groups.length, person.id).toBeGreaterThan(0)
      expect(eventsForPerson(person.id).length, person.id).toBeGreaterThan(0)
    }
  })
})

describe('relationships', () => {
  it('agrees in both directions between events, places, people and journeys', () => {
    for (const event of allEvents) {
      for (const placeId of event.placeIds) expect(eventsAtPlace(placeId), `${event.id} @ ${placeId}`).toContain(event)
      for (const personId of event.personIds) expect(eventsForPerson(personId), `${event.id} / ${personId}`).toContain(event)
    }
    for (const place of allPlaces) {
      for (const person of peopleAtPlace(place.id)) {
        expect(eventsAtPlace(place.id).some((event) => event.personIds.includes(person.id)), `${place.id} / ${person.id}`).toBe(true)
      }
    }
    for (const journey of allJourneys) {
      for (const stop of resolveStops(journey)) expect(journeysAtPlace(stop.place.id).map((visit) => visit.journey)).toContain(journey)
      for (const { person } of journeyPeople(journey)) expect(journeysForPerson(person.id), `${journey.id} / ${person.id}`).toContain(journey)
    }
  })

  it('derives every displayed journey participant from the events at its stops', () => {
    for (const journey of allJourneys) {
      const minimum = journey.type === 'route' ? TRAVELER_MIN_STOPS : 2
      for (const person of journeyTravelers(journey)) {
        const stopsNamingThem = resolveStops(journey).filter((stop) => stop.events.some((event) => event.personIds.includes(person.id)))
        expect(stopsNamingThem.length, `${journey.id} / ${person.id}`).toBeGreaterThanOrEqual(minimum)
      }
    }
  })

  it('counts a person’s events, places and journeys from the data', () => {
    const stats = personStats('paul')
    expect(stats.events).toBe(eventsForPerson('paul').length)
    expect(stats.places).toBe(placesForPerson('paul').length)
    expect(stats.journeys).toBe(journeysForPerson('paul').length)
  })
})

describe('journeys', () => {
  it('keeps all 18 mapped stops of Paul’s second journey', () => {
    // Changing this number must be a deliberate, documented data decision.
    expect(resolveStops(getJourney('paul-second-missionary-journey')!)).toHaveLength(18)
  })

  it('opens a shared event or passage in the route that narrates it, not in a collection', () => {
    // Lydia's baptism is also in the women's collection, which comes earlier in story order.
    expect(stopsForEvent('lydia-baptized')[0]?.journey.id).toBe('paul-second-missionary-journey')
    expect(firstStopInRange(parseRef('ACT 16:1-40')!)).toEqual({ name: 'journey', id: 'paul-second-missionary-journey', stop: 2 })
  })

  it('draws every route leg between consecutive stops, in order', () => {
    for (const journey of allJourneys.filter((candidate) => candidate.type === 'route')) {
      const stops = resolveStops(journey)
      const legs = buildRouteGeometry(stops).legs.map((leg) => leg.properties.toIndex)
      expect(legs, journey.id).toEqual(stops.slice(1).map((stop) => stop.index))
    }
  })
})

describe('search answers', () => {
  const i18n = createI18n('en')
  const questions = [
    'Where did Paul go after Philippi?',
    'Where did Paul travel before Corinth?',
    'Acts 16',
    'Where was Jesus born?',
    'Where was Paul shipwrecked?',
    'places around the Sea of Galilee',
    'Paul Macedonia',
  ]

  it('always cites Scripture in an answer card', () => {
    for (const question of questions) {
      const answer = search(question).answer
      expect(answer, question).not.toBeNull()
      const view = describeAnswer(answer!, i18n)
      expect(view.blocks.length, question).toBeGreaterThan(0)
      for (const block of view.blocks) {
        expect(block.citation.label, question).toMatch(/\d/)
        const passage = block.citation.read.passage
        expect(typeof passage === 'string' ? parseRef(passage) : passage, question).not.toBeNull()
      }
    }
  })
})
