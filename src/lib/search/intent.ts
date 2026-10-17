import { allPeople, allPlaces } from '../../data/atlas'
import type { Person, Place } from '../../data/types'
import { findReferenceInText, type ParsedQueryReference } from '../scripture/reference'
import { containsPhrase } from './lexical'
import { words } from './text'

export type Ordinal = 'first' | 'second' | 'third' | 'fourth'

/** What the query asks for, beyond its keywords. Used to boost results and build answers. */
export interface QueryAnalysis {
  raw: string
  reference: ParsedQueryReference | null
  ordinal: Ordinal | null
  /** The query talks about a journey, trip or voyage. */
  wantsJourney: boolean
  /** The query asks for places or locations (e.g. "Jesus locations"). */
  wantsPlaces: boolean
  people: Person[]
  places: Place[]
  regions: string[]
  relation: 'after' | 'before' | null
  proximity: boolean
  /** A "where …" question, e.g. "Where was Jesus born?" */
  whereQuestion: boolean
  question: boolean
}

const ORDINALS: Record<string, Ordinal> = {
  first: 'first',
  '1st': 'first',
  second: 'second',
  '2nd': 'second',
  third: 'third',
  '3rd': 'third',
  fourth: 'fourth',
  '4th': 'fourth',
  last: 'fourth',
  final: 'fourth',
}
const JOURNEY_WORDS = new Set(['journey', 'journeys', 'trip', 'trips', 'voyage', 'route', 'travels', 'missionary', 'mission'])
const PLACE_WORDS = new Set(['place', 'places', 'location', 'locations', 'sites', 'map'])
const QUESTION_WORDS = new Set(['where', 'what', 'who', 'which', 'when', 'how', 'why'])

/** Ancient region names in the atlas, e.g. "macedonia", plus region-type places. */
const REGION_NAMES = [
  ...new Set([
    ...allPlaces.flatMap((place) => (place.ancientRegion ? [place.ancientRegion.en.toLowerCase()] : [])),
    ...allPlaces.filter((place) => place.kind === 'region').map((place) => place.name.en.toLowerCase()),
  ]),
]

const namesOf = (item: { name: { en: string }; alternateNames?: string[]; searchTerms?: string[] }) => [
  item.name.en,
  ...(item.alternateNames ?? []),
  ...(item.searchTerms ?? []),
]

export function analyzeQuery(raw: string): QueryAnalysis {
  const list = words(raw)
  const set = new Set(list)

  const ordinal = list.map((word) => ORDINALS[word]).find(Boolean) ?? null
  const relation = set.has('after') || set.has('next') ? 'after' : set.has('before') ? 'before' : null

  // Longest names first, so "Antioch of Pisidia" wins over "Antioch".
  const places = allPlaces
    .flatMap((place) => namesOf(place).map((name) => ({ place, name })))
    .sort((a, b) => b.name.length - a.name.length)
    .filter(({ name }) => containsPhrase(raw, name))
    .map(({ place }) => place)
    .filter((place, index, all) => all.indexOf(place) === index)

  const people = allPeople.filter((person) => namesOf(person).some((name) => containsPhrase(raw, name)))

  return {
    raw,
    reference: findReferenceInText(raw),
    ordinal,
    wantsJourney: list.some((word) => JOURNEY_WORDS.has(word)),
    wantsPlaces: list.some((word) => PLACE_WORDS.has(word)),
    people,
    places,
    regions: REGION_NAMES.filter((region) => containsPhrase(raw, region)),
    relation,
    proximity: set.has('around') || set.has('near') || set.has('nearby') || raw.toLowerCase().includes('close to'),
    whereQuestion: list[0] === 'where' || (list.includes('where') && raw.trim().endsWith('?')),
    question: QUESTION_WORDS.has(list[0] ?? '') || raw.trim().endsWith('?'),
  }
}
