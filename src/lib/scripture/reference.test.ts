import { describe, expect, it } from 'vitest'
import { CHAPTER_END, findReferenceInText, formatRange, formatRef, parseRef, rangeContains, rangesOverlap } from './reference'

describe('parseRef', () => {
  it('parses single verses, verse ranges and cross-chapter ranges', () => {
    expect(parseRef('ACT 16:9')).toEqual({ book: 'ACT', start: { chapter: 16, verse: 9 }, end: { chapter: 16, verse: 9 } })
    expect(parseRef('ACT 16:11-15')?.end).toEqual({ chapter: 16, verse: 15 })
    expect(parseRef('ACT 18:23-21:17')?.end).toEqual({ chapter: 21, verse: 17 })
  })

  it('rejects malformed or reversed references', () => {
    expect(parseRef('ACTS 16:9')).toBeNull()
    expect(parseRef('ACT 16')).toBeNull()
    expect(parseRef('ACT 16:15-11')).toBeNull()
    expect(parseRef('XYZ 1:1')).toBeNull()
  })
})

describe('formatting', () => {
  it('uses an en dash and full book names', () => {
    expect(formatRef('ACT 16:9-10')).toBe('Acts 16:9–10')
    expect(formatRef('ACT 13:51-14:6')).toBe('Acts 13:51–14:6')
    expect(formatRef('JHN 2:1')).toBe('John 2:1')
  })

  it('formats whole chapters from search', () => {
    expect(formatRange({ book: 'ACT', start: { chapter: 16, verse: 1 }, end: { chapter: 16, verse: CHAPTER_END } })).toBe(
      'Acts 16',
    )
  })
})

describe('range helpers', () => {
  it('detects overlap and containment', () => {
    const chapter16 = parseRef('ACT 16:1-40')!
    expect(rangesOverlap(chapter16, parseRef('ACT 16:40-17:1')!)).toBe(true)
    expect(rangesOverlap(chapter16, parseRef('ACT 17:1-9')!)).toBe(false)
    expect(rangeContains(chapter16, parseRef('ACT 16:9-10')!)).toBe(true)
  })
})

describe('findReferenceInText', () => {
  const find = (text: string) => {
    const found = findReferenceInText(text)
    return found ? formatRange(found.range) : null
  }

  it('understands common ways of typing a reference', () => {
    expect(find('Acts 16')).toBe('Acts 16')
    expect(find('acts 16:9-10')).toBe('Acts 16:9–10')
    expect(find('Acts 16:9–10')).toBe('Acts 16:9–10')
    expect(find('Jn 3:16')).toBe('John 3:16')
    expect(find('1 cor 13')).toBe('1 Corinthians 13')
    expect(find('1cor 13:4')).toBe('1 Corinthians 13:4')
    expect(find('what happens in acts chapter 27?')).toBe('Acts 27')
    expect(find('Acts 16-17')).toBe('Acts 16–17')
  })

  it('ignores text without a reference', () => {
    expect(find('Philippi')).toBeNull()
    expect(find('Paul second journey')).toBeNull()
    expect(find('where is 1st journey')).toBeNull()
  })
})
