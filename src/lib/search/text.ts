/** Text normalization shared by indexing and querying, so both sides agree on every token. */

const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'can', 'did', 'do', 'does', 'for', 'from', 'go', 'goes',
  'going', 'had', 'has', 'have', 'he', 'his', 'how', 'i', 'in', 'into', 'is', 'it', 'its', 'me', 'my', 'of',
  'on', 'or', 'show', 'tell', 'that', 'the', 'their', 'them', 'there', 'they', 'this', 'to', 'was', 'were',
  'what', 'when', 'where', 'which', 'who', 'whom', 'why', 'with', 'you', 'went', 'about', 'find', 'see',
  'visit', 'visited', 'travel', 'traveled', 'travelled', 'place', 'places', 'location', 'locations', 'bible',
  'biblical', 'happened', 'happen', 'take', 'took', 'please', 'all', 'list',
])

/** Words that carry meaning for the intent parser but should not drive keyword ranking. */
const INTENT_WORDS = new Set(['after', 'before', 'next', 'then', 'around', 'near', 'nearby', 'close', 'between'])

/** Maps query vocabulary onto the words used in the data. */
const SYNONYMS: Record<string, string> = {
  '1st': 'first',
  '2nd': 'second',
  '3rd': 'third',
  '4th': 'fourth',
  trip: 'journey',
  trips: 'journey',
  travels: 'journey',
  mission: 'missionary',
  baptize: 'baptism',
  baptized: 'baptism',
  baptised: 'baptism',
  baptizing: 'baptism',
  born: 'birth',
  birthplace: 'birth',
  nativity: 'birth',
  crucify: 'crucifixion',
  crucified: 'crucifixion',
  shipwrecked: 'shipwreck',
  wrecked: 'shipwreck',
  jailed: 'prison',
  imprisoned: 'prison',
  jail: 'prison',
  arrested: 'arrest',
  risen: 'resurrection',
  resurrected: 'resurrection',
  rose: 'resurrection',
  sermon: 'speech',
  preached: 'preaching',
  preach: 'preaching',
  healed: 'healing',
  heal: 'healing',
  miracles: 'miracle',
}

/** Lower-cases, strips accents and possessives, and unifies punctuation. */
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[’'`]s\b/g, '')
    .replace(/[’'`]/g, '')
}

function stem(token: string): string {
  if (token.length <= 4 || /^\d+$/.test(token)) return token
  if (token.endsWith('ies') && token.length > 5) return `${token.slice(0, -3)}y`
  if (token.endsWith('es') && /(ches|shes|sses|xes)$/.test(token)) return token.slice(0, -2)
  if (token.endsWith('s') && !token.endsWith('ss') && !token.endsWith('us') && !token.endsWith('is')) {
    return token.slice(0, -1)
  }
  return token
}

/** All meaningful tokens, after synonyms and light stemming. */
export function tokenize(text: string, options: { keepStopwords?: boolean } = {}): string[] {
  const raw = normalize(text).split(/[^a-z0-9]+/).filter(Boolean)
  const tokens: string[] = []
  for (const word of raw) {
    if (!options.keepStopwords && (STOPWORDS.has(word) || INTENT_WORDS.has(word))) continue
    tokens.push(stem(SYNONYMS[word] ?? word))
  }
  return tokens
}

/** Raw lower-case words, including stopwords — for the intent parser. */
export const words = (text: string): string[] => normalize(text).split(/[^a-z0-9]+/).filter(Boolean)

/** Damerau–Levenshtein distance with an early exit once `max` is exceeded. */
export function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1
  const rows = a.length + 1
  const cols = b.length + 1
  // d[i][j] = distance between the first i characters of a and the first j characters of b
  const d = Array.from({ length: rows }, (_, i) => Array.from({ length: cols }, (_unused, j) => (i === 0 ? j : j === 0 ? i : 0)))
  for (let i = 1; i < rows; i++) {
    let rowMin = Number.MAX_SAFE_INTEGER
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      let value = Math.min(d[i - 1]![j]! + 1, d[i]![j - 1]! + 1, d[i - 1]![j - 1]! + cost)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) value = Math.min(value, d[i - 2]![j - 2]! + 1)
      d[i]![j] = value
      rowMin = Math.min(rowMin, value)
    }
    if (rowMin > max) return max + 1
  }
  return d[a.length]![b.length]!
}

/** How many typos a token may contain and still match. */
export const typoBudget = (token: string): number => (token.length >= 8 ? 2 : token.length >= 5 ? 1 : 0)
