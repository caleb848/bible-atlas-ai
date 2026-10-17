import { rangesOverlap } from '../scripture/reference'
import { type Answer, buildAnswer } from './answers'
import { buildSearchDocuments, type SearchDocType, type SearchDocument } from './documents'
import { analyzeQuery, type Ordinal, type QueryAnalysis } from './intent'
import { LexicalIndex } from './lexical'

export interface SearchResult {
  doc: SearchDocument
  score: number
  /** Share of the query's keywords found in this entry (0 when matched by meaning alone). */
  coverage: number
  /** True when Smart Search (meaning) contributed more than keywords did. */
  bySemantic: boolean
}

export interface SearchResponse {
  query: string
  analysis: QueryAnalysis
  results: SearchResult[]
  answer: Answer | null
}

const ORDINAL_JOURNEYS: Record<Ordinal, string> = {
  first: 'paul-first-missionary-journey',
  second: 'paul-second-missionary-journey',
  third: 'paul-third-missionary-journey',
  fourth: 'paul-journey-to-rome',
}

const REFERENCE_BOOST: Record<SearchDocType, number> = { scripture: 30, event: 16, journey: 12, place: 8, person: 3 }

/** Cosine similarity below this is treated as unrelated. */
const SEMANTIC_FLOOR = 0.3
const SEMANTIC_WEIGHT = 26
/** A result found only by meaning must be at least this similar, and close to the best match. */
const SEMANTIC_ONLY_MIN = 0.42
const SEMANTIC_ONLY_SPREAD = 0.1
const MAX_MEANING_ONLY = 5

let index: LexicalIndex | null = null
const getIndex = () => (index ??= new LexicalIndex(buildSearchDocuments()))

function intentBoosts(analysis: QueryAnalysis, documents: readonly SearchDocument[]): Map<string, number> {
  const boosts = new Map<string, number>()
  const add = (doc: SearchDocument, amount: number) => boosts.set(doc.id, (boosts.get(doc.id) ?? 0) + amount)
  const personIds = new Set(analysis.people.map((person) => person.id))
  const placeIds = new Set(analysis.places.map((place) => place.id))
  const ordinalJourney = analysis.ordinal ? ORDINAL_JOURNEYS[analysis.ordinal] : null

  for (const doc of documents) {
    const reference = analysis.reference?.range
    if (reference && doc.ranges.some((range) => rangesOverlap(range, reference))) {
      add(doc, REFERENCE_BOOST[doc.type])
    }
    if (ordinalJourney && doc.id === `journey:${ordinalJourney}`) add(doc, analysis.wantsJourney ? 40 : 25)
    if (analysis.wantsJourney && doc.type === 'journey') {
      if (doc.placeIds.at(-1) && placeIds.has(doc.placeIds.at(-1)!)) add(doc, 25)
      else if (doc.placeIds.some((id) => placeIds.has(id))) add(doc, 6)
    }
    if (personIds.size > 0 && doc.personIds.some((id) => personIds.has(id))) {
      add(doc, doc.type === 'person' ? 6 : 4)
      // "Jesus locations" asks for the places, not the person.
      if (analysis.wantsPlaces) add(doc, doc.type === 'journey' ? 12 : doc.type === 'person' ? -10 : 0)
    }
    if (analysis.regions.some((region) => doc.regions.includes(region))) add(doc, 6)
    if (placeIds.size > 0 && doc.type !== 'place' && doc.placeIds.some((id) => placeIds.has(id))) add(doc, 3)
  }
  return boosts
}

/**
 * Ranks atlas entries for a query. Keyword matching and intent detection always run; semantic
 * similarities from the local model are blended in when available.
 */
export function search(query: string, options: { semantic?: ReadonlyMap<string, number>; limit?: number } = {}): SearchResponse {
  const { semantic, limit = 8 } = options
  const analysis = analyzeQuery(query)
  const documents = buildSearchDocuments()
  if (!query.trim()) return { query, analysis, results: [], answer: null }

  const lexical = getIndex().search(query)
  const boosts = intentBoosts(analysis, documents)
  const bestSimilarity = semantic ? Math.max(0, ...semantic.values()) : 0

  const scored: SearchResult[] = []
  for (const doc of documents) {
    const hit = lexical.get(doc.id)
    const keyword = hit?.score ?? 0
    const boost = boosts.get(doc.id) ?? 0
    const similarity = semantic?.get(doc.id) ?? 0
    const meaning = similarity > SEMANTIC_FLOOR ? ((similarity - SEMANTIC_FLOOR) / (1 - SEMANTIC_FLOOR)) * SEMANTIC_WEIGHT : 0
    // Boosts refine keyword matches; on their own they only count when strong (e.g. a reference).
    // Meaning alone counts only for close matches, near the best similarity for this query.
    const closeInMeaning = similarity >= SEMANTIC_ONLY_MIN && similarity >= bestSimilarity - SEMANTIC_ONLY_SPREAD
    const relevant = keyword > 0 || boost >= 8 || closeInMeaning
    if (!relevant) continue
    scored.push({ doc, score: keyword + boost + meaning, coverage: hit?.coverage ?? 0, bySemantic: meaning > keyword + boost })
  }

  scored.sort((a, b) => b.score - a.score)
  // Results found by meaning alone are capped, so loosely related entries don't crowd the list.
  let meaningOnly = 0
  const ranked = scored.filter((result) => {
    const isMeaningOnly = result.coverage === 0 && (boosts.get(result.doc.id) ?? 0) < 8
    return !isMeaningOnly || ++meaningOnly <= MAX_MEANING_ONLY
  })
  // Keep the list varied: after three events, further events are demoted.
  let eventCount = 0
  for (const result of ranked) {
    if (result.doc.type === 'event' && ++eventCount > 3) result.score *= 0.7
  }
  ranked.sort((a, b) => b.score - a.score)

  const best = ranked[0]?.score ?? 0
  const results = ranked.filter((result) => result.score >= Math.max(1.5, best * 0.2)).slice(0, limit)
  return { query, analysis, results, answer: buildAnswer(analysis, ranked) }
}
