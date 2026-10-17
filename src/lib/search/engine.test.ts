import { describe, expect, it } from 'vitest'
import { formatRange } from '../scripture/reference'
import { search } from './engine'

const topIds = (query: string, count = 3) => search(query).results.slice(0, count).map((result) => result.doc.id)
const top = (query: string) => topIds(query, 1)[0]

describe('keyword and intent search', () => {
  it('finds journeys by number, in several phrasings', () => {
    expect(top('Paul second journey')).toBe('journey:paul-second-missionary-journey')
    expect(top('Paul’s second missionary journey')).toBe('journey:paul-second-missionary-journey')
    expect(top("paul's 2nd journey")).toBe('journey:paul-second-missionary-journey')
    expect(top('first missionary journey')).toBe('journey:paul-first-missionary-journey')
    expect(top('Show me Paul’s trip to Rome')).toBe('journey:paul-journey-to-rome')
  })

  it('finds places exactly, by prefix and despite typos', () => {
    expect(top('Philippi')).toBe('place:philippi')
    expect(top('Philipp')).toBe('place:philippi')
    // "Philip" names two people first; the city still appears among the results, by prefix.
    expect(topIds('Philip', 2)).toEqual(['person:philip-apostle', 'person:philip-evangelist'])
    expect(topIds('Philip', 8)).toContain('place:philippi')
    expect(top('philipi')).toBe('place:philippi')
    expect(top('Thessalonika')).toBe('place:thessalonica')
    expect(top('Beroea')).toBe('place:berea')
  })

  it('finds people and collections', () => {
    expect(top('Lydia')).toBe('person:lydia')
    expect(top('Jesus locations')).toBe('journey:ministry-of-jesus')
    expect(top('holy week')).toBe('journey:final-week-in-jerusalem')
  })

  it('understands Scripture references', () => {
    const response = search('Acts 16')
    expect(response.results[0]?.doc.id).toBe('scripture:ACT-16')
    expect(response.answer?.kind).toBe('reference')
    if (response.answer?.kind === 'reference') {
      // Acts 16 opens at Derbe and Lystra (16:1–5) before the vision at Troas.
      expect(response.answer.stops.map(({ stop }) => stop.place.id)).toEqual([
        'derbe',
        'lystra',
        'troas',
        'samothrace',
        'neapolis',
        'philippi',
      ])
    }
  })

  it('returns nothing rather than guessing for unknown terms', () => {
    const response = search('zxqv blorp')
    expect(response.results).toEqual([])
    expect(response.answer).toBeNull()
  })
})

describe('grounded answers', () => {
  it('answers where an event happened', () => {
    const born = search('Where was Jesus born?').answer
    expect(born?.kind === 'event' && born.place.id).toBe('bethlehem')
    const shipwreck = search('Where was Paul shipwrecked?').answer
    expect(shipwreck?.kind === 'event' && shipwreck.place.id).toBe('malta')
    const baptism = search('Where was Jesus baptized?').answer
    expect(baptism?.kind === 'event' && baptism.place.id).toBe('jordan-river')
    const lydia = search('Where did Paul meet Lydia?').answer
    expect(lydia?.kind === 'event' && lydia.place.id).toBe('philippi')
  })

  it('does not invent an answer when the question is not about a mapped event', () => {
    expect(search('Where is the Garden of Eden?').answer).toBeNull()
    // A book's name is not an action: Romans is not "a Roman" (Acts 22), and the text does not
    // say where Paul wrote the letter.
    expect(search('Where did Paul write Romans?').answer).toBeNull()
  })

  it('reads a real name as itself, not as a typo for another', () => {
    // "Lydia" is one letter from "Lysias"; only Lydia's own event answers.
    const lydia = search('Where did Paul meet Lydia?')
    expect(lydia.results.map((result) => result.doc.id)).not.toContain('event:defense-on-the-stairs')
    expect(top('philipi')).toBe('place:philippi')
  })

  it('answers what came before or after a stop, per journey', () => {
    const before = search('Where did Paul travel before Corinth?').answer
    expect(before?.kind).toBe('sequence')
    if (before?.kind === 'sequence') {
      expect(before.steps.map((step) => [step.journey.id, step.stops.map((stop) => stop.place.id)])).toEqual([
        ['paul-second-missionary-journey', ['athens']],
      ])
    }

    const after = search('Where did Paul go after Philippi?').answer
    expect(after?.kind).toBe('sequence')
    if (after?.kind === 'sequence') {
      // Acts 17:1 names three places for one move; the answer gives all of them, in order.
      expect(after.steps.map((step) => [step.journey.id, step.stops.map((stop) => stop.place.id), formatRange(step.verse)])).toEqual([
        ['paul-second-missionary-journey', ['amphipolis', 'apollonia', 'thessalonica'], 'Acts 17:1'],
        ['paul-third-missionary-journey', ['troas'], 'Acts 20:6'],
      ])
    }
  })

  it('lists places near a landmark', () => {
    const answer = search('places around the Sea of Galilee').answer
    expect(answer?.kind).toBe('nearby')
    if (answer?.kind === 'nearby') {
      expect(answer.nearby.map((entry) => entry.place.id)).toEqual(expect.arrayContaining(['capernaum', 'bethsaida', 'chorazin']))
    }
  })

  it('groups a person’s stops within a region', () => {
    const answer = search('Paul Macedonia').answer
    expect(answer?.kind).toBe('region')
    if (answer?.kind === 'region') {
      expect(answer.groups.map((group) => group.journey.id)).toEqual([
        'paul-second-missionary-journey',
        'paul-third-missionary-journey',
      ])
      expect(answer.groups[0]?.stops.map((stop) => stop.place.id)).toEqual([
        'neapolis',
        'philippi',
        'amphipolis',
        'apollonia',
        'thessalonica',
        'berea',
      ])
    }
  })
})

describe('Smart Search blending', () => {
  it('lets meaning surface a paraphrase while keeping weak matches out', () => {
    // Samothrace shares no keyword with the query, so only its (weak) similarity could add it.
    const semantic = new Map([
      ['event:viper-on-malta', 0.62],
      ['place:samothrace', 0.45],
      ['event:shipwreck', 0.55],
    ])
    const response = search('the apostle was bitten by a snake', { semantic })
    const ids = response.results.map((result) => result.doc.id)
    expect(ids[0]).toBe('event:viper-on-malta')
    expect(response.results[0]?.bySemantic).toBe(true)
    expect(ids).toContain('event:shipwreck')
    expect(ids).not.toContain('place:samothrace')
  })

  it('never lets meaning override an exact keyword match', () => {
    const response = search('Philippi', { semantic: new Map([['place:thessalonica', 0.7]]) })
    expect(response.results[0]?.doc.id).toBe('place:philippi')
  })
})

