import type { Locale, RefString } from '../../data/types'
import { BOOKS, bookOrder, getBook } from './books'

export interface VersePoint {
  chapter: number
  verse: number
}

/** An inclusive verse range within one book. */
export interface ScriptureRange {
  book: string
  start: VersePoint
  end: VersePoint
}

/** Stands in for "the last verse of the chapter" in chapter-level ranges typed into search. */
export const CHAPTER_END = 999

const REF_PATTERN = /^([1-3]?[A-Z]{2,3}) (\d+):(\d+)(?:-(\d+)(?::(\d+))?)?$/

const cache = new Map<string, ScriptureRange | null>()

const pointValue = (point: VersePoint) => point.chapter * 1000 + point.verse

/** Parses the strict data format, e.g. `ACT 16:11-15` or `ACT 13:51-14:6`. Returns null if malformed. */
export function parseRef(ref: string): ScriptureRange | null {
  const cached = cache.get(ref)
  if (cached !== undefined) return cached

  let result: ScriptureRange | null = null
  const match = REF_PATTERN.exec(ref)
  if (match && getBook(match[1]!)) {
    const start = { chapter: Number(match[2]), verse: Number(match[3]) }
    let end = start
    if (match[4] && match[5]) end = { chapter: Number(match[4]), verse: Number(match[5]) }
    else if (match[4]) end = { chapter: start.chapter, verse: Number(match[4]) }

    const valid = start.chapter > 0 && start.verse > 0 && pointValue(end) >= pointValue(start)
    if (valid) result = { book: match[1]!, start, end }
  }
  cache.set(ref, result)
  return result
}

export function comparePoints(a: VersePoint, b: VersePoint): number {
  return pointValue(a) - pointValue(b)
}

/** Sorts ranges canonically: by book, then by starting verse. */
export function compareRanges(a: ScriptureRange, b: ScriptureRange): number {
  return bookOrder(a.book) - bookOrder(b.book) || comparePoints(a.start, b.start)
}

/** References in canonical order (book, then chapter and verse); malformed ones keep their place at the end. */
export function sortRefs<T extends string>(refs: readonly T[]): T[] {
  return [...refs].sort((a, b) => {
    const ra = parseRef(a)
    const rb = parseRef(b)
    if (!ra || !rb) return ra ? -1 : rb ? 1 : 0
    return compareRanges(ra, rb)
  })
}

export function rangesOverlap(a: ScriptureRange, b: ScriptureRange): boolean {
  return a.book === b.book && comparePoints(a.start, b.end) <= 0 && comparePoints(b.start, a.end) <= 0
}

export function rangeContains(outer: ScriptureRange, inner: ScriptureRange): boolean {
  return (
    outer.book === inner.book && comparePoints(outer.start, inner.start) <= 0 && comparePoints(inner.end, outer.end) <= 0
  )
}

export function bookName(code: string, locale: Locale = 'en'): string {
  const info = getBook(code)
  if (!info) return code
  return info.name[locale] ?? info.name.en
}

/** Human-readable label, e.g. "Acts 16:11–15", "Acts 13:51–14:6" or "Acts 16". */
export function formatRange(range: ScriptureRange, locale: Locale = 'en'): string {
  const name = bookName(range.book, locale)
  const { start, end } = range
  const wholeChapters = start.verse === 1 && end.verse === CHAPTER_END
  if (wholeChapters) {
    return start.chapter === end.chapter ? `${name} ${start.chapter}` : `${name} ${start.chapter}–${end.chapter}`
  }
  if (start.chapter === end.chapter) {
    return start.verse === end.verse
      ? `${name} ${start.chapter}:${start.verse}`
      : `${name} ${start.chapter}:${start.verse}–${end.verse}`
  }
  return `${name} ${start.chapter}:${start.verse}–${end.chapter}:${end.verse}`
}

/** Formats a data reference; falls back to the raw string if it is malformed. */
export function formatRef(ref: RefString, locale: Locale = 'en'): string {
  const range = parseRef(ref)
  return range ? formatRange(range, locale) : ref
}

/** Number of verses in a single-chapter range; null for cross-chapter ranges. */
export function verseCount(range: ScriptureRange): number | null {
  return range.start.chapter === range.end.chapter ? range.end.verse - range.start.verse + 1 : null
}

// ---------------------------------------------------------------------------------------------
// Free-text references typed into search

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const compact = (name: string) => name.toLowerCase().replace(/\s+/g, '')

/** Book names and abbreviations, keyed without spaces so "1 Cor" and "1cor" resolve alike. */
const nameToCode = new Map<string, string>()
const allNames: string[] = []
for (const info of BOOKS) {
  for (const name of [info.name.en.toLowerCase(), ...info.abbreviations]) {
    nameToCode.set(compact(name), info.code)
    allNames.push(name)
  }
}

const namePattern = allNames
  .sort((a, b) => b.length - a.length)
  .map((name) => escapeRegExp(name).replace(/ /g, '\\s*'))
  .join('|')

const QUERY_PATTERN = new RegExp(
  `(?:^|[^a-z0-9])(${namePattern})\\.?\\s*(\\d{1,3})(?:\\s*[:.]\\s*(\\d{1,3}))?(?:\\s*[-–—]\\s*(\\d{1,3})(?:\\s*[:.]\\s*(\\d{1,3}))?)?(?![a-z0-9])`,
  'i',
)

export interface ParsedQueryReference {
  range: ScriptureRange
  /** The text that matched, so callers can tell how much of the query was a reference. */
  matchedText: string
}

/** Finds a reference such as "Acts 16", "acts 16:9-10" or "Jn 3:16" inside free text. */
export function findReferenceInText(text: string): ParsedQueryReference | null {
  const normalized = text.toLowerCase().replace(/\bchapter\b/g, ' ')
  const match = QUERY_PATTERN.exec(normalized)
  if (!match) return null

  const code = nameToCode.get(compact(match[1]!))
  if (!code) return null

  const chapter = Number(match[2])
  const verse = match[3] ? Number(match[3]) : undefined
  const dashFirst = match[4] ? Number(match[4]) : undefined
  const dashSecond = match[5] ? Number(match[5]) : undefined
  if (chapter < 1) return null

  let range: ScriptureRange
  if (verse === undefined) {
    // "Acts 16" or "Acts 16-17"
    const endChapter = dashFirst ?? chapter
    range = {
      book: code,
      start: { chapter, verse: 1 },
      end: { chapter: Math.max(endChapter, chapter), verse: dashSecond ?? CHAPTER_END },
    }
  } else if (dashFirst === undefined) {
    range = { book: code, start: { chapter, verse }, end: { chapter, verse } }
  } else if (dashSecond === undefined) {
    range = { book: code, start: { chapter, verse }, end: { chapter, verse: Math.max(dashFirst, verse) } }
  } else {
    range = { book: code, start: { chapter, verse }, end: { chapter: dashFirst, verse: dashSecond } }
  }

  if (comparePoints(range.end, range.start) < 0) return null
  return { range, matchedText: match[0].trim() }
}
