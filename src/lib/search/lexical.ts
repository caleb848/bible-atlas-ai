import type { SearchDocument } from './documents'
import { editDistance, normalize, tokenize, typoBudget } from './text'

interface IndexedDocument {
  doc: SearchDocument
  nameTokens: string[]
  keywordTokens: string[]
  bodyTokens: string[]
  /** Normalized full names, for phrase matches such as "sea of galilee". */
  namePhrases: string[]
  keywordPhrases: string[]
}

/** Weights for [exact, prefix, fuzzy] matches in each field. */
const WEIGHTS = {
  name: [10, 7, 5],
  keyword: [5, 3.5, 2.5],
  body: [1.6, 0.9, 0],
} as const

const phrase = (text: string) => tokenize(text, { keepStopwords: true }).join(' ')

/**
 * 0 = no match, 1 = fuzzy, 2 = prefix, 3 = exact. Typo tolerance applies only to words the atlas
 * does not contain, so a real name is never read as a misspelling of another ("Lydia" is not
 * "Lysias").
 */
function matchLevel(query: string, token: string, allowTypos: boolean): 0 | 1 | 2 | 3 {
  if (query === token) return 3
  if (query.length >= 3 && token.startsWith(query)) return 2
  const budget = allowTypos ? typoBudget(query) : 0
  if (budget > 0 && editDistance(query, token, budget) <= budget) return 1
  // "philippians" should still find "philippi"
  if (token.length >= 5 && query.startsWith(token)) return 1
  return 0
}

function bestInField(query: string, tokens: readonly string[], weights: readonly [number, number, number], allowTypos: boolean): number {
  let best = 0
  for (const token of tokens) {
    const level = matchLevel(query, token, allowTypos)
    if (level === 0) continue
    best = Math.max(best, weights[3 - level]!)
    if (level === 3) break
  }
  return best
}

export interface LexicalHit {
  score: number
  /** Share of query tokens that matched something in the document. */
  coverage: number
}

export class LexicalIndex {
  private readonly entries: IndexedDocument[]
  /** Every token in the index. */
  private readonly vocabulary: Set<string>

  constructor(documents: readonly SearchDocument[]) {
    this.entries = documents.map((doc) => ({
      doc,
      nameTokens: [...new Set(doc.names.flatMap((name) => tokenize(name)))],
      keywordTokens: [...new Set(doc.keywords.flatMap((keyword) => tokenize(keyword)))],
      bodyTokens: [...new Set(tokenize(doc.body))],
      namePhrases: doc.names.map(phrase),
      keywordPhrases: doc.keywords.map(phrase).filter((value) => value.includes(' ')),
    }))
    this.vocabulary = new Set(this.entries.flatMap((entry) => [...entry.nameTokens, ...entry.keywordTokens, ...entry.bodyTokens]))
  }

  search(query: string): Map<string, LexicalHit> {
    const hits = new Map<string, LexicalHit>()
    const tokens = [...new Set(tokenize(query))]
    if (tokens.length === 0) return hits
    const queryPhrase = phrase(query)
    const strippedQuery = tokens.join(' ')

    for (const entry of this.entries) {
      let score = 0
      let matched = 0
      for (const token of tokens) {
        const allowTypos = !this.vocabulary.has(token)
        const tokenScore = Math.max(
          bestInField(token, entry.nameTokens, WEIGHTS.name, allowTypos),
          bestInField(token, entry.keywordTokens, WEIGHTS.keyword, allowTypos),
          bestInField(token, entry.bodyTokens, WEIGHTS.body, allowTypos),
        )
        if (tokenScore > 0) matched++
        score += tokenScore
      }
      if (matched === 0) continue

      for (const name of entry.namePhrases) {
        if (name === queryPhrase || name === strippedQuery) score += 20
        else if (name.length > 3 && ` ${queryPhrase} `.includes(` ${name} `)) score += 12
        else if (name.startsWith(queryPhrase) && queryPhrase.length >= 3) score += 6
      }

      if (entry.keywordPhrases.includes(queryPhrase)) score += 15

      const coverage = matched / tokens.length
      score *= 0.3 + 0.7 * coverage ** 2
      hits.set(entry.doc.id, { score: score * entry.doc.prior, coverage })
    }
    return hits
  }
}

/** True when `needle` appears in `haystack` as whole words (both normalized). */
export function containsPhrase(haystack: string, needle: string): boolean {
  const h = ` ${normalize(haystack).replace(/[^a-z0-9]+/g, ' ').trim()} `
  const n = normalize(needle).replace(/[^a-z0-9]+/g, ' ').trim()
  return n.length > 0 && h.includes(` ${n} `)
}
