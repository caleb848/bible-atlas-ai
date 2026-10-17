import { comparePoints, type ScriptureRange } from './reference'

export interface Verse {
  chapter: number
  verse: number
  text: string
}

/** Shape of a generated translation file such as `src/data/scripture/web.json`. */
export interface TranslationText {
  translation: string
  name: string
  license: string
  source: string
  sourceUrl: string
  books: Record<string, Record<string, Record<string, string>>>
}

let webText: Promise<TranslationText> | null = null

/**
 * Loads the World English Bible excerpts on first use (a separate ~44 KB gzipped chunk), so Scripture
 * never delays the first paint. Additional translations would be registered here.
 */
export function loadTranslation(): Promise<TranslationText> {
  webText ??= import('../../data/scripture/web.json')
    .then((module) => module.default as TranslationText)
    .catch((error: unknown) => {
      webText = null // allow a retry after a network failure
      throw error
    })
  return webText
}

/** The verses of `range` that the translation file contains, in order. */
export function versesInRange(text: TranslationText, range: ScriptureRange): Verse[] {
  const chapters = text.books[range.book]
  if (!chapters) return []
  const verses: Verse[] = []
  for (let chapter = range.start.chapter; chapter <= range.end.chapter; chapter++) {
    const chapterVerses = chapters[chapter]
    if (!chapterVerses) continue
    for (const [key, value] of Object.entries(chapterVerses)) {
      const point = { chapter, verse: Number(key) }
      if (comparePoints(point, range.start) >= 0 && comparePoints(point, range.end) <= 0) {
        verses.push({ ...point, text: value })
      }
    }
  }
  return verses.sort((a, b) => comparePoints(a, b))
}

/** A link to read the passage in context on eBible.org, the publisher of the WEB. */
export function readingUrl(range: ScriptureRange): string {
  const chapter = String(range.start.chapter).padStart(2, '0')
  return `https://ebible.org/eng-web/${range.book}${chapter}.htm`
}
