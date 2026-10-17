import type { Certainty, RefString } from '../../data/types'
import type { I18n } from '../../i18n/i18n'
import type { Answer } from '../../lib/search/answers'
import type { Route } from '../../lib/router/routes'
import { formatRange, parseRef, type ScriptureRange } from '../../lib/scripture/reference'
import type { ReaderItem } from '../scripture/readerContext'
import { firstStopInRange, journeyStopRoute, type SearchAction } from './actions'

/** The Scripture behind an answer: always shown first, and quoted verbatim when short. */
export interface AnswerCitation {
  /** e.g. "Acts 17:1" */
  label: string
  /** One or two verses to quote word for word; null when the reference is too long to quote. */
  quote: ScriptureRange | null
  /** What opens in the reader. */
  read: ReaderItem
}

export interface AnswerBlock {
  /** The answer itself, e.g. "Amphipolis · Apollonia · Thessalonica". */
  headline: string
  /** Where the answer comes from in the atlas, e.g. "After Philippi · Second Journey · stops 8–10". */
  context: string
  citation: AnswerCitation
  map?: SearchAction
  /**
   * What the map previews while the answer is shown: the stop that completes the answer, so the
   * legs it describes are drawn as travelled (e.g. Philippi → Amphipolis → Apollonia → Thessalonica).
   */
  preview?: Route
  /** Places the preview keeps in view together (the whole move, not only where it ends). */
  previewFocus?: string[]
  /** The leading place's certainty, when it is not an identified site. */
  certainty?: Certainty
}

export interface AnswerOption {
  id: string
  label: string
  detail: string
  action: SearchAction
}

export interface AnswerView {
  /** One sentence for screen readers, built from the same data as the card. */
  summary: string
  /** The answer first; further blocks for other journeys. Never empty. */
  blocks: AnswerBlock[]
  /** Keyboard-selectable actions (show on map, read the passage). */
  options: AnswerOption[]
}

/** Up to `max` verses from the start of a range, for quoting. */
const opening = (range: ScriptureRange, max: number): ScriptureRange => {
  if (range.start.chapter !== range.end.chapter) return { book: range.book, start: range.start, end: range.start }
  const end = Math.min(range.end.verse, range.start.verse + max - 1)
  return { book: range.book, start: range.start, end: { chapter: range.start.chapter, verse: end } }
}

const quotable = (range: ScriptureRange) =>
  range.start.chapter === range.end.chapter && range.end.verse - range.start.verse < 2 ? range : null

export function describeAnswer(answer: Answer, i18n: I18n): AnswerView {
  const { t, text, ref, locale, number } = i18n
  const label = (range: ScriptureRange) => formatRange(range, locale)

  let blocks: AnswerBlock[]
  switch (answer.kind) {
    case 'reference': {
      const reference = label(answer.range)
      const map = firstStopInRange(answer.range)
      const places = [...new Set(answer.stops.map(({ stop }) => text(stop.place.name)))]
      const lead = answer.stops[0]?.journey
      const lastOfLead = answer.stops.filter(({ journey }) => journey === lead).at(-1)
      blocks = [
        {
          headline: places.join(' · '),
          context: t('search.answer.referenceHeading', { reference, count: answer.stops.length }),
          citation: { label: reference, quote: quotable(answer.range), read: { passage: answer.range } },
          ...(map ? { map: { type: 'navigate' as const, route: map } } : {}),
          ...(lastOfLead
            ? {
                preview: journeyStopRoute(lastOfLead.journey.id, lastOfLead.stop.index),
                previewFocus: answer.stops.filter(({ journey }) => journey === lead).map(({ stop }) => stop.place.id),
              }
            : {}),
        },
      ]
      break
    }

    case 'sequence': {
      const place = text(answer.place.name)
      blocks = answer.steps.map((step) => {
        const first = step.stops[0]!
        const last = step.stops.at(-1)!
        const numbers =
          first.number === last.number
            ? t('search.answer.journeyStop', { journey: text(step.journey.shortTitle), number: first.number })
            : t('search.answer.journeyStops', { journey: text(step.journey.shortTitle), from: first.number, to: last.number })
        const lead = step.stops.find((stop) => stop.place.certainty !== 'identified')
        return {
          headline: step.stops.map((stop) => text(stop.place.name)).join(' · '),
          context: `${t(answer.relation === 'after' ? 'search.answer.after' : 'search.answer.before', { place })} · ${numbers}`,
          citation: { label: label(step.verse), quote: step.verse, read: { passage: step.verse, context: text(step.journey.title) } },
          map: { type: 'navigate' as const, route: journeyStopRoute(step.journey.id, first.index) },
          preview: journeyStopRoute(step.journey.id, answer.relation === 'after' ? last.index : step.anchor.index),
          previewFocus: [step.anchor.place.id, ...step.stops.map((stop) => stop.place.id)],
          ...(lead ? { certainty: lead.place.certainty } : {}),
        }
      })
      break
    }

    case 'event': {
      const { event, place, context } = answer
      const passage = parseRef(event.passage)!
      const excerpt = event.excerpt ? parseRef(event.excerpt) : null
      blocks = [
        {
          headline: text(place.name),
          context: [text(event.title), context ? t('search.answer.journeyStop', { journey: text(context.journey.shortTitle), number: context.stop.number }) : '']
            .filter(Boolean)
            .join(' · '),
          citation: {
            label: ref(event.passage),
            quote: opening(excerpt ?? passage, 2),
            read: {
              passage: event.passage,
              ...(event.excerpt ? { excerpt: event.excerpt } : {}),
              ...(event.relatedRefs ? { related: event.relatedRefs } : {}),
              context: text(event.title),
            },
          },
          map: {
            type: 'navigate',
            route: context ? journeyStopRoute(context.journey.id, context.stop.index) : { name: 'place', id: place.id },
          },
          ...(place.certainty !== 'identified' ? { certainty: place.certainty } : {}),
        },
      ]
      break
    }

    case 'nearby': {
      const radius = Math.ceil(Math.max(...answer.nearby.map((entry) => entry.distanceKm)))
      const anchorRef = answer.place.refs[0] as RefString
      const anchorRange = parseRef(anchorRef)!
      blocks = [
        {
          headline: answer.nearby
            .slice(0, 6)
            .map((entry) => text(entry.place.name))
            .join(' · '),
          context: `${t('search.answer.nearbyHeading', { place: text(answer.place.name) })} · ${t('search.answer.nearbyLead', { km: number(radius) })}`,
          citation: { label: ref(anchorRef), quote: opening(anchorRange, 1), read: { passage: anchorRef, context: text(answer.place.name) } },
          map: { type: 'navigate', route: { name: 'place', id: answer.place.id } },
        },
      ]
      break
    }

    case 'region': {
      const region = answer.region.charAt(0).toUpperCase() + answer.region.slice(1)
      const heading = answer.person
        ? t('search.answer.regionHeading', { person: text(answer.person.name), region })
        : t('search.answer.regionHeadingAll', { region })
      blocks = answer.groups.map((group) => {
        const first = parseRef(group.stops[0]!.stop.passage)!
        const last = parseRef(group.stops.at(-1)!.stop.passage)!
        const span: ScriptureRange = first.book === last.book ? { book: first.book, start: first.start, end: last.end } : first
        return {
          headline: [...new Set(group.stops.map((stop) => text(stop.place.name)))].join(' · '),
          context: `${heading} · ${text(group.journey.shortTitle)}`,
          citation: { label: label(span), quote: null, read: { passage: span, context: text(group.journey.title) } },
          map: { type: 'navigate' as const, route: journeyStopRoute(group.journey.id, group.stops[0]!.index) },
          preview: journeyStopRoute(group.journey.id, group.stops.at(-1)!.index),
          previewFocus: group.stops.map((stop) => stop.place.id),
        }
      })
      break
    }
  }

  const options: AnswerOption[] = blocks.flatMap((block, index) => [
    ...(block.map
      ? [{ id: `answer-map-${index}`, label: block.headline, detail: `${t('search.answer.showOnMap')} · ${block.context}`, action: block.map }]
      : []),
    ...(index === 0
      ? [{ id: `answer-read-${index}`, label: t('scripture.open', { reference: block.citation.label }), detail: block.headline, action: { type: 'read' as const, request: { items: [block.citation.read] } } }]
      : []),
  ])

  const primary = blocks[0]!
  return { summary: `${primary.citation.label}. ${primary.headline}. ${primary.context}.`, blocks, options }
}
