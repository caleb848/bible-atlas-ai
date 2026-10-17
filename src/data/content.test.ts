import { describe, expect, it } from 'vitest'
import { describeAnswer } from '../components/search/answerView'
import { createI18n } from '../i18n/i18n'
import { en } from '../i18n/locales/en'
import { type TranslationText, versesInRange } from '../lib/scripture/passages'
import { comparePoints, parseRef, rangeContains, type ScriptureRange } from '../lib/scripture/reference'
import { search } from '../lib/search/engine'
import { allEvents, allJourneys, allPeople, allPlaces, resolveStops } from './atlas'
import { inlineReferences } from './references'
import web from './scripture/web.json'
import type { LocalizedText, RefString } from './types'

/**
 * Content QA: checks that what the atlas shows as Scripture is Scripture, that every place says
 * where its coordinates come from, that routes follow the text, and that answers cite the text.
 */

const bible = web as TranslationText

const versesOf = (passage: RefString | ScriptureRange): string => {
  const range = typeof passage === 'string' ? parseRef(passage) : passage
  return range ? versesInRange(bible, range).map((verse) => verse.text).join(' ') : ''
}

/** Text inside curly double quotes, which the atlas reserves for Scripture. */
const quotations = (value: LocalizedText | undefined): string[] =>
  [...(value?.en ?? '').matchAll(/“([^”]+)”/g)].map((match) => match[1]!.replace(/[,.;:]$/, ''))

/** Straight quotes or apostrophes in the data would bypass the check above and break typography. */
const straightQuotes = /["]|(?<![a-z])'|'(?![a-z])/i

describe('Scripture quotations', () => {
  it('quotes every stop fragment word for word from the World English Bible', () => {
    const wrong: string[] = []
    for (const journey of allJourneys) {
      for (const stop of journey.stops) {
        if (stop.quote && !versesOf(stop.quote.ref).includes(stop.quote.text)) {
          wrong.push(`${journey.id} / ${stop.placeId} / ${stop.quote.ref}`)
        }
      }
    }
    expect(wrong).toEqual([])
  })

  it('takes each stop quotation from the passage that stop cites', () => {
    for (const journey of allJourneys) {
      for (const stop of journey.stops) {
        if (!stop.quote) continue
        const passage = parseRef(stop.passage)!
        expect(rangeContains(passage, parseRef(stop.quote.ref)!), `${journey.id} / ${stop.placeId}`).toBe(true)
      }
    }
  })

  it('never puts quotation marks around words the cited passages do not contain', () => {
    const wrong: string[] = []
    const check = (where: string, refs: readonly RefString[], ...texts: Array<LocalizedText | undefined>) => {
      // The quotation may come from the record's references or from a verse the sentence cites.
      const source = [...refs, ...texts.flatMap(inlineReferences)].map(versesOf).join(' ')
      for (const quoted of texts.flatMap(quotations)) {
        if (!source.includes(quoted)) wrong.push(`${where}: “${quoted}”`)
      }
    }
    for (const event of allEvents) {
      check(`event ${event.id}`, [event.passage, ...(event.relatedRefs ?? [])], event.summary, event.locationNote)
    }
    for (const person of allPeople) {
      check(`person ${person.id}`, [...person.refs, ...(person.origins ?? []).map((origin) => origin.ref)], person.summary, person.identityNote)
    }
    for (const place of allPlaces) check(`place ${place.id}`, place.refs, place.summary, place.certaintyNote)
    for (const journey of allJourneys) {
      check(`journey ${journey.id}`, [...journey.passages, ...journey.stops.map((stop) => stop.passage)], journey.summary, journey.orderingNote)
      // A stop's note is checked against that stop's own passage, not the whole journey's.
      journey.stops.forEach((stop, index) => check(`journey ${journey.id} stop ${index + 1}`, [stop.passage], stop.note, stop.arrival?.note))
    }
    expect(wrong).toEqual([])
  })

  it('quotes Scripture exactly in interface text that cites a verse', () => {
    const strings = (value: unknown): string[] =>
      typeof value === 'string' ? [value] : value && typeof value === 'object' ? Object.values(value).flatMap(strings) : []
    const wrong: string[] = []
    for (const value of strings(en)) {
      const refs = inlineReferences({ en: value })
      if (refs.length === 0) continue
      const source = refs.map(versesOf).join(' ')
      for (const quoted of quotations({ en: value })) if (!source.includes(quoted)) wrong.push(`“${quoted}”`)
    }
    expect(wrong).toEqual([])
  })

  it('uses typographic quotes, so nothing slips past the quotation check', () => {
    const texts = [
      ...allEvents.flatMap((event) => [event.title, event.summary, event.locationNote].map((value) => ({ id: event.id, value }))),
      ...allPeople.flatMap((person) => [person.name, person.role, person.summary, person.identityNote].map((value) => ({ id: person.id, value }))),
      ...allPlaces.flatMap((place) => [place.name, place.summary, place.certaintyNote].map((value) => ({ id: place.id, value }))),
      ...allJourneys.flatMap((journey) =>
        [journey.title, journey.subtitle, journey.summary, journey.orderingNote, ...journey.stops.map((stop) => stop.note)].map((value) => ({
          id: journey.id,
          value,
        })),
      ),
    ]
    const wrong = texts.filter(({ value }) => value && straightQuotes.test(value.en)).map(({ id }) => id)
    expect(wrong).toEqual([])
  })

  it('keeps editorial wording the brief rules out', () => {
    const everything = JSON.stringify([allEvents, allPeople, allPlaces, allJourneys]).toLowerCase()
    expect(everything).not.toContain('first recorded ministry in europe')
  })
})

describe('places', () => {
  it('names the source of every coordinate, with a link', () => {
    for (const place of allPlaces) {
      const primary = place.sources[0]
      expect(primary, place.id).toBeDefined()
      expect(['OpenBible.info', 'Pleiades', 'Wikidata'], place.id).toContain(primary!.name)
      expect(primary!.id, place.id).toMatch(/\S/)
      expect(primary!.url, place.id).toMatch(/^https:\/\//)
    }
  })

  it('cites Scripture for every place', () => {
    for (const place of allPlaces) expect(place.refs.length, place.id).toBeGreaterThan(0)
  })
})

describe('routes', () => {
  it('lists stops in the order the text narrates them', () => {
    for (const journey of allJourneys.filter((candidate) => candidate.type === 'route')) {
      const starts = resolveStops(journey).map((stop) => parseRef(stop.stop.passage)!)
      starts.slice(1).forEach((start, index) => {
        const previous = starts[index]!
        const inOrder = previous.book !== start.book || comparePoints(previous.start, start.start) <= 0
        expect(inOrder, `${journey.id}: stop ${index + 2} starts before stop ${index + 1}`).toBe(true)
      })
    }
  })
})

describe('search answers', () => {
  const i18n = createI18n('en')

  /** Questions generated from the data: every stop, every journey passage, a few phrasings. */
  const questions = [
    ...new Set([
      ...allJourneys
        .filter((journey) => journey.type === 'route')
        .flatMap((journey) => resolveStops(journey))
        .flatMap(({ place }) => [`Where did Paul go after ${place.name.en}?`, `Where did they travel before ${place.name.en}?`]),
      ...allJourneys.flatMap((journey) => journey.passages.map((passage) => i18n.ref(passage))),
      'Where was Jesus born?',
      'Where was Paul shipwrecked?',
      'Where was Jesus baptized?',
      'Where did Paul meet Lydia?',
      'places around the Sea of Galilee',
      'places near Jerusalem',
      'Paul Macedonia',
      'Peter Judea',
      'Acts 16',
      'Acts 17:1',
      'Luke 1',
    ]),
  ]

  it('answers the generated questions', () => {
    const answered = questions.filter((question) => search(question).answer !== null)
    // Most of these must produce an answer; the rest fall back to results, never to invented text.
    expect(answered.length).toBeGreaterThan(questions.length / 2)
  })

  it('always shows Scripture, with verses that exist, in every answer card', () => {
    for (const question of questions) {
      const answer = search(question).answer
      if (!answer) continue
      const view = describeAnswer(answer, i18n)
      expect(view.blocks.length, question).toBeGreaterThan(0)
      for (const block of view.blocks) {
        expect(block.citation.label, question).toMatch(/\d/)
        expect(versesOf(block.citation.read.passage).length, `${question} → ${block.citation.label}`).toBeGreaterThan(0)
        if (block.citation.quote) expect(versesOf(block.citation.quote).length, question).toBeGreaterThan(0)
      }
    }
  })
})
