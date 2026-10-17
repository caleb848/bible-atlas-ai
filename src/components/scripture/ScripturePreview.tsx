import { BookOpen } from 'lucide-react'
import type { RefString } from '../../data/types'
import { useI18n } from '../../i18n/i18n'
import { versesInRange } from '../../lib/scripture/passages'
import { formatRange, parseRef } from '../../lib/scripture/reference'
import { type ReaderItem, useScriptureReader } from './readerContext'
import { useTranslationText } from './useTranslationText'

interface ScripturePreviewProps {
  passage: RefString
  excerpt?: RefString
  related?: RefString[]
  context?: string
  /** How many verses to quote inline. */
  maxVerses?: number
  className?: string
}

/**
 * An inline quotation from the World English Bible on the warm "page" tone used only for
 * Scripture, always labelled with its reference and translation. Selecting it opens the reader.
 */
export function ScripturePreview({ passage, excerpt, related, context, maxVerses = 2, className = '' }: ScripturePreviewProps) {
  const { t, ref, locale } = useI18n()
  const reader = useScriptureReader()
  const { state } = useTranslationText()
  const quoteRef = excerpt ?? passage
  const range = parseRef(quoteRef)
  if (!range) return null

  const verses = state.status === 'ready' ? versesInRange(state.text, range).filter((verse) => verse.text) : []
  const shown = verses.slice(0, maxVerses)
  const first = shown[0]
  const last = shown.at(-1)
  const shownRef = first && last ? formatRange({ book: range.book, start: first, end: last }, locale) : ref(quoteRef)
  const item: ReaderItem = { passage, ...(excerpt ? { excerpt } : {}), ...(related ? { related } : {}), ...(context ? { context } : {}) }

  return (
    <figure
      className={`relative rounded-2xl bg-vellum-100 px-5 py-4 ring-1 ring-inset ring-vellum-300 transition-[box-shadow,background-color] hover:bg-vellum-200 hover:shadow-float ${FOCUS_WITHIN} ${className}`}
    >
      <figcaption className="mb-2 flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.15em] text-vellum-800">
        <BookOpen aria-hidden className="size-3.5" />
        <ReadButton label={t('scripture.excerptLabel', { reference: shownRef, translation: 'WEB' })} onOpen={() => reader.open(item)} />
      </figcaption>
      {state.status === 'ready' ? (
        <blockquote className="font-display text-[17px] leading-[1.7] text-ink-900">
          {shown.map((verse) => (
            <span key={`${verse.chapter}:${verse.verse}`}>
              <sup className="mr-0.5 font-sans text-[9.5px] font-semibold text-vellum-700">{verse.verse}</sup>
              {verse.text}{' '}
            </span>
          ))}
          {verses.length > shown.length && <span className="text-ink-500">…</span>}
        </blockquote>
      ) : (
        <span className="block h-12 animate-pulse rounded-md bg-vellum-200" role="status" aria-label={t('scripture.loading')} />
      )}
    </figure>
  )
}

/** Shows focus on the whole quotation when its (stretched) read button has keyboard focus. */
const FOCUS_WITHIN = 'has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-cobalt-600'

/**
 * The quotation's caption, "Acts 16:12 · WEB", as a button whose click area covers the whole
 * quotation. Its accessible name is the visible caption plus "Read", so it matches what is on
 * screen; the quoted verses stay plain text rather than becoming a very long button name.
 */
function ReadButton({ label, onOpen }: { label: string; onOpen: () => void }) {
  const { t } = useI18n()
  return (
    <button
      type="button"
      onClick={onOpen}
      className="text-left font-semibold uppercase tracking-[0.15em] outline-none after:absolute after:inset-0 after:rounded-2xl after:content-['']"
    >
      <span className="sr-only">{t('scripture.read')} </span>
      {label}
    </button>
  )
}

/** A short verbatim fragment of the WEB, quoted with its reference (e.g. a stop's characterizing line). */
export function VerseQuote({ text, reference, onOpen, className = '' }: { text: string; reference: string; onOpen?: () => void; className?: string }) {
  const { t } = useI18n()
  const label = t('scripture.excerptLabel', { reference, translation: 'WEB' })
  return (
    <figure
      className={`relative rounded-2xl border-l-[3px] border-vellum-500 bg-vellum-100 py-3.5 pl-4 pr-4 ${onOpen ? `transition-colors hover:bg-vellum-200 ${FOCUS_WITHIN}` : ''} ${className}`}
    >
      <blockquote className="font-display text-[19px] italic leading-[1.5] text-ink-900">“{text}”</blockquote>
      <figcaption className="mt-2 flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.15em] text-vellum-800">
        <BookOpen aria-hidden className="size-3.5" />
        {onOpen ? <ReadButton label={label} onOpen={onOpen} /> : label}
      </figcaption>
    </figure>
  )
}
