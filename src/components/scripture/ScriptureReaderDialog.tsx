import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Fragment, type KeyboardEvent, useEffect, useId, useRef, useState } from 'react'
import type { RefString } from '../../data/types'
import { useI18n } from '../../i18n/i18n'
import { readingUrl, type Verse, versesInRange } from '../../lib/scripture/passages'
import { formatRange, parseRef } from '../../lib/scripture/reference'
import { Button, IconButton } from '../ui/Button'
import { ExternalLink } from '../ui/ExternalLink'
import type { ReaderItem, ReaderRequest } from './readerContext'
import { useTranslationText } from './useTranslationText'

/** Long passages open on their first verses; the rest is one tap away. */
const PREVIEW_VERSES = 8

/**
 * The Scripture reader: a calm reading page on the vellum tone reserved for Scripture, with a
 * comfortable measure, generous leading and quiet verse numbers. Text is shown exactly as stored.
 * When opened with a sequence (every passage at a stop, say), it steps through them.
 */
export function ScriptureReaderDialog({ request, onClose }: { request: ReaderRequest | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (request && !dialog.open) dialog.showModal()
    if (!request && dialog.open) dialog.close()
  }, [request])

  return (
    // Clicking the backdrop closes the dialog; keyboard users close it with Escape (native).
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => event.target === dialogRef.current && onClose()}
      className="m-auto max-h-[min(90dvh,880px)] w-[min(740px,calc(100%-20px))] overflow-hidden rounded-[26px] bg-vellum-50 p-0 text-ink-900 shadow-pop open:flex open:animate-fade-up open:flex-col"
    >
      {request && <ReaderBody key={JSON.stringify(request)} request={request} titleId={titleId} onClose={onClose} />}
    </dialog>
  )
}

function ReaderBody({ request, titleId, onClose }: { request: ReaderRequest; titleId: string; onClose: () => void }) {
  const { t, ref, locale } = useI18n()
  const items = request.items
  const [index, setIndex] = useState(Math.min(request.index ?? 0, items.length - 1))
  /** A parallel account opened from the current passage replaces it until the reader moves on. */
  const [parallel, setParallel] = useState<ReaderItem | null>(null)
  const [showFull, setShowFull] = useState(false)
  const { state, retry } = useTranslationText()
  const scrollRef = useRef<HTMLDivElement>(null)

  const current = parallel ?? items[index]!
  const passage = typeof current.passage === 'string' ? parseRef(current.passage) : current.passage
  const excerpt = current.excerpt ? parseRef(current.excerpt) : null
  if (!passage) return null

  const allVerses = state.status === 'ready' ? versesInRange(state.text, passage).filter((v) => v.text) : []
  const excerptVerses = state.status === 'ready' && excerpt ? versesInRange(state.text, excerpt).filter((v) => v.text) : []

  let shortVerses: Verse[] = allVerses
  if (excerptVerses.length > 0 && excerptVerses.length < allVerses.length) shortVerses = excerptVerses
  else if (allVerses.length > PREVIEW_VERSES + 2) shortVerses = allVerses.slice(0, PREVIEW_VERSES)
  const canExpand = shortVerses.length < allVerses.length
  const verses = showFull ? allVerses : shortVerses
  const isInExcerpt = (verse: Verse) =>
    showFull && excerptVerses.some((v) => v.chapter === verse.chapter && v.verse === verse.verse)

  const go = (next: number) => {
    if (next < 0 || next >= items.length) return
    setIndex(next)
    setParallel(null)
    setShowFull(false)
    scrollRef.current?.scrollTo({ top: 0 })
  }
  const openParallel = (passageRef: RefString) => {
    const previous = typeof current.passage === 'string' ? [current.passage] : []
    setParallel({ passage: passageRef, related: [...previous, ...(current.related ?? []).filter((r) => r !== passageRef)] })
    setShowFull(false)
    scrollRef.current?.scrollTo({ top: 0 })
  }
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    // Tab wraps around inside the reader rather than leaving it for the browser's own controls.
    if (event.key === 'Tab') {
      const focusable = Array.from(
        event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      ).filter((element) => element.offsetParent !== null)
      const first = focusable[0]
      const last = focusable.at(-1)
      if (first && last && event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (first && last && !event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
      return
    }
    if (items.length < 2 || event.target instanceof HTMLInputElement) return
    if (event.key === 'ArrowRight') go(index + 1)
    if (event.key === 'ArrowLeft') go(index - 1)
  }

  return (
    // The arrow keys step through a sequence of passages; the buttons in the footer do the same.
    // flex-auto, not flex-1: Safari collapses a 0% flex basis inside a dialog that sizes to its content.
    // oxlint-disable-next-line jsx-a11y/no-static-element-interactions
    <div className="flex min-h-0 flex-auto flex-col" onKeyDown={onKeyDown}>
      <header className="flex items-start justify-between gap-4 border-b border-vellum-300/70 px-6 pb-5 pt-6 md:px-11 md:pt-8">
        <div className="min-w-0">
          <p className="eyebrow truncate text-vellum-800!">{current.context ?? t('scripture.dialogTitle')}</p>
          <h2 id={titleId} className="mt-2 font-display text-[30px] font-medium leading-[1.08] text-ink-950 md:text-[38px]">
            {formatRange(passage, locale)}
          </h2>
          <p className="mt-2 text-[13.5px] text-ink-600">
            {t('scripture.translationName')} <span className="text-ink-500">· WEB</span>
          </p>
        </div>
        <IconButton label={t('scripture.close')} onClick={onClose} className="-mr-2 -mt-1 text-ink-600 hover:bg-vellum-200">
          <X className="size-5" />
        </IconButton>
      </header>

      <div ref={scrollRef} className="scrollbar-quiet min-h-0 flex-auto overflow-y-auto px-6 py-7 md:px-11 md:py-9">
        <div className="mx-auto max-w-[35rem]">
          {state.status === 'loading' && <p className="text-ink-600">{t('scripture.loading')}</p>}
          {state.status === 'error' && (
            <div className="space-y-3">
              <p className="text-ink-700">{t('scripture.error')}</p>
              <button type="button" onClick={retry} className="font-medium text-cobalt-700 underline underline-offset-4">
                {t('scripture.retry')}
              </button>
            </div>
          )}
          {state.status === 'ready' && allVerses.length === 0 && <p className="text-ink-700">{t('scripture.missing')}</p>}
          {verses.length > 0 && (
            <p className="font-display text-[19.5px] leading-[1.85] text-ink-900 md:text-[20.5px]">
              {verses.map((verse, position) => {
                const newChapter = position > 0 && verses[position - 1]!.chapter !== verse.chapter
                return (
                  <Fragment key={`${verse.chapter}:${verse.verse}`}>
                    {newChapter && <span className="my-4 block" aria-hidden />}
                    <span className={isInExcerpt(verse) ? 'rounded bg-vellum-200 box-decoration-clone px-0.5' : undefined}>
                      <sup
                        className="mr-1 font-sans text-[10px] font-semibold tracking-wide text-vellum-700"
                        aria-label={t('scripture.verse', { number: verse.verse })}
                      >
                        {position === 0 || newChapter ? `${verse.chapter}:${verse.verse}` : verse.verse}
                      </sup>
                      {verse.text}
                    </span>{' '}
                  </Fragment>
                )
              })}
            </p>
          )}
          {canExpand && (
            <button
              type="button"
              onClick={() => setShowFull((value) => !value)}
              className="mt-5 text-[14px] font-semibold text-cobalt-700 underline decoration-cobalt-300 underline-offset-4 hover:decoration-cobalt-700"
            >
              {showFull ? t('scripture.showExcerpt') : t('scripture.showFull', { count: allVerses.length })}
            </button>
          )}

          {current.related && current.related.length > 0 && (
            <div className="mt-8 border-t border-vellum-300/70 pt-5">
              <p className="eyebrow mb-2.5">{t('scripture.parallels')}</p>
              <div className="flex flex-wrap gap-2">
                {current.related.map((related) => (
                  <button
                    key={related}
                    type="button"
                    onClick={() => openParallel(related)}
                    className="rounded-full bg-paper px-3 py-1.5 text-[13px] font-medium text-ink-800 ring-1 ring-inset ring-vellum-300 transition-colors hover:bg-white hover:ring-vellum-500"
                  >
                    {ref(related)}
                  </button>
                ))}
              </div>
            </div>
          )}
          <p className="mt-8 text-[12px] leading-relaxed text-ink-500">{t('scripture.attribution')}</p>
        </div>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-vellum-300/70 bg-vellum-100 px-5 py-3 md:px-11">
        {items.length > 1 ? (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" disabled={index === 0} onClick={() => go(index - 1)} icon={<ChevronLeft className="size-4" />}>
              <span className="max-sm:sr-only">{t('scripture.previous')}</span>
            </Button>
            <span className="min-w-14 text-center text-[12.5px] tabular-nums text-ink-600">
              {t('scripture.position', { number: index + 1, total: items.length })}
            </span>
            <Button size="sm" variant="secondary" disabled={index === items.length - 1} onClick={() => go(index + 1)}>
              <span className="max-sm:sr-only">{t('scripture.next')}</span>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        ) : (
          <span />
        )}
        <ExternalLink href={readingUrl(passage)} className="text-[13px] font-semibold text-cobalt-700 hover:text-cobalt-900">
          {t('scripture.readInContext')}
        </ExternalLink>
      </footer>
    </div>
  )
}
