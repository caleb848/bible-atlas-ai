import { describe, expect, it } from 'vitest'
import { collectReferences } from './references'
import { parseRef } from '../lib/scripture/reference'
import { type TranslationText, versesInRange } from '../lib/scripture/passages'
import web from './scripture/web.json'

const text = web as TranslationText

describe('World English Bible excerpts', () => {
  it('contains the text of every reference used in the atlas', () => {
    const missing: string[] = []
    for (const ref of collectReferences()) {
      const range = parseRef(ref)!
      const verses = versesInRange(text, range)
      const first = verses[0]
      const last = verses.at(-1)
      const complete =
        first?.chapter === range.start.chapter &&
        first.verse === range.start.verse &&
        last?.chapter === range.end.chapter &&
        last.verse === range.end.verse
      if (!complete) missing.push(ref)
    }
    expect(missing).toEqual([])
  })

  it('stores verses exactly as published, without stray whitespace', () => {
    for (const chapters of Object.values(text.books)) {
      for (const verses of Object.values(chapters)) {
        for (const verse of Object.values(verses)) expect(verse).toBe(verse.trim())
      }
    }
    expect(text.books.ACT?.['16']?.['9']).toBe(
      'A vision appeared to Paul in the night. There was a man of Macedonia standing, begging him and saying, “Come over into Macedonia and help us.”',
    )
  })

  it('is labelled with its translation', () => {
    expect(text.translation).toBe('WEB')
    expect(text.license).toBe('Public domain')
  })
})
