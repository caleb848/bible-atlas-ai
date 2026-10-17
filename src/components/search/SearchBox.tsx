import { ArrowUpRight, BookOpen, CornerDownLeft, Map as MapIcon, MapPin, Route as RouteIcon, Search, Sparkles, User, X, Zap } from 'lucide-react'
import { type KeyboardEvent, type ReactNode, useEffect, useId, useMemo, useRef, useState } from 'react'
import { getJourney } from '../../data/atlas'
import { useI18n } from '../../i18n/i18n'
import { navigate } from '../../lib/router/router'
import type { Route } from '../../lib/router/routes'
import type { SearchDocType } from '../../lib/search/documents'
import { smartSearch } from '../../lib/search/semantic/client'
import { useScriptureReader } from '../scripture/readerContext'
import { actionForDocument, type SearchAction } from './actions'
import { AnswerCard } from './AnswerCard'
import { describeAnswer } from './answerView'
import { SmartSearchStatus } from './SmartSearchStatus'
import { useSearch } from './useSearch'

const TYPE_ICON: Record<SearchDocType, ReactNode> = {
  journey: <RouteIcon className="size-4" />,
  place: <MapPin className="size-4" />,
  person: <User className="size-4" />,
  event: <Zap className="size-4" />,
  scripture: <BookOpen className="size-4" />,
}

interface Option {
  id: string
  label: string
  detail: string
  action: SearchAction
  icon: ReactNode
  hint?: string
  semantic?: boolean
  emphasis?: boolean
}

/** What the map shows while an answer is on screen: a stop, and the places to keep in view. */
export interface AnswerPreview {
  route: Route
  focus: string[]
}

interface SearchBoxProps {
  variant: 'hero' | 'header' | 'overlay'
  autoFocus?: boolean
  /** Called after a result is chosen (e.g. to close the mobile overlay). */
  onDone?: () => void
  /** Overlay variant: results render inline below the input instead of in a popover. */
  inlineResults?: boolean
  /** Fills in a suggested search; a new `nonce` re-applies the same text. */
  requestedQuery?: { value: string; nonce: number } | null
  /** Reports whether there is a query, so a view can make room for inline results. */
  onActiveChange?: (active: boolean) => void
  /** Reports where the map should preview the current answer (null when there is none). */
  onAnswerPreview?: (preview: AnswerPreview | null) => void
  /** Extra classes for the inline results, e.g. to run them under a button beside the field. */
  resultsClassName?: string
}

export function SearchBox({
  variant,
  autoFocus = false,
  onDone,
  inlineResults = false,
  requestedQuery = null,
  onActiveChange,
  onAnswerPreview,
  resultsClassName = '',
}: SearchBoxProps) {
  const i18n = useI18n()
  const { t } = i18n
  const reader = useScriptureReader()
  const inputId = useId()
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState(requestedQuery?.value ?? '')
  const [open, setOpen] = useState(Boolean(requestedQuery))
  const [active, setActive] = useState(0)
  const [appliedNonce, setAppliedNonce] = useState(requestedQuery?.nonce ?? null)
  const response = useSearch(query)

  // A suggested search (e.g. on the home view) replaces the current text once per nonce.
  if (requestedQuery && requestedQuery.nonce !== appliedNonce) {
    setAppliedNonce(requestedQuery.nonce)
    setQuery(requestedQuery.value)
    setOpen(true)
    setActive(0)
  }

  const answer = useMemo(() => (response.answer ? describeAnswer(response.answer, i18n) : null), [response.answer, i18n])

  const answerOptions: Option[] = useMemo(
    () =>
      (answer?.options ?? []).map((option) => ({
        ...option,
        icon: option.action.type === 'read' ? <BookOpen className="size-4" /> : <MapIcon className="size-4" />,
        emphasis: true,
      })),
    [answer],
  )

  const resultOptions: Option[] = useMemo(
    () =>
      response.results.slice(0, inlineResults ? 12 : 7).map((result) => ({
        id: result.doc.id,
        label: result.doc.title,
        detail: result.doc.subtitle,
        action: actionForDocument(result.doc),
        icon: TYPE_ICON[result.doc.type],
        hint:
          result.doc.type === 'journey' && getJourney(result.doc.entityId)?.type === 'collection'
            ? t('search.types.collection')
            : t(`search.types.${result.doc.type}`),
        semantic: result.bySemantic,
      })),
    [response.results, inlineResults, t],
  )

  const options = useMemo(() => [...answerOptions, ...resultOptions], [answerOptions, resultOptions])
  const hasQuery = query.trim().length > 0
  const showPanel = (open || inlineResults) && hasQuery

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  useEffect(() => {
    onActiveChange?.(hasQuery)
  }, [hasQuery, onActiveChange])

  const primary = hasQuery ? answer?.blocks[0] : undefined
  const previewRoute = primary?.preview ?? (primary?.map?.type === 'navigate' ? primary.map.route : null)
  const previewKey = previewRoute ? JSON.stringify({ route: previewRoute, focus: primary?.previewFocus ?? [] }) : ''
  useEffect(() => {
    if (!onAnswerPreview) return
    onAnswerPreview(previewKey ? (JSON.parse(previewKey) as AnswerPreview) : null)
  }, [previewKey, onAnswerPreview])
  useEffect(() => () => onAnswerPreview?.(null), [onAnswerPreview])

  const requestedNonce = requestedQuery?.nonce
  useEffect(() => {
    if (requestedNonce === undefined) return
    inputRef.current?.focus()
    smartSearch.load()
  }, [requestedNonce])

  // "/" focuses the main search field from anywhere (unless typing in another field).
  useEffect(() => {
    if (variant === 'overlay') return
    const onKey = (event: globalThis.KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const typing = target?.closest('input, textarea, [contenteditable="true"]')
      if (event.key === '/' && !typing && inputRef.current?.offsetParent) {
        event.preventDefault()
        inputRef.current.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [variant])

  // Close the popover when focus or clicks move elsewhere.
  useEffect(() => {
    if (!open || inlineResults) return
    const onPointer = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [open, inlineResults])

  const run = (option: Option | undefined) => {
    if (!option) return
    if (option.action.type === 'navigate') navigate(option.action.route)
    else reader.open(option.action.request)
    setOpen(false)
    setQuery('')
    inputRef.current?.blur()
    onDone?.()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setOpen(true)
        setActive((index) => Math.min(index + 1, options.length - 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        setActive((index) => Math.max(index - 1, 0))
        break
      case 'Enter':
        event.preventDefault()
        run(options[active])
        break
      case 'Escape':
        if (query) {
          event.preventDefault() // clear the field without also closing a surrounding dialog
          setQuery('')
          setActive(0)
        } else {
          setOpen(false)
          inputRef.current?.blur()
          onDone?.()
        }
        break
      case 'Tab':
        setOpen(false)
        break
    }
  }

  const activeOption = showPanel ? options[active] : undefined
  const isHero = variant === 'hero'
  const announcement = hasQuery
    ? [answer?.summary, t('search.resultCount', { count: response.results.length })].filter(Boolean).join(' ')
    : ''

  const renderOption = (option: Option, index: number) => {
    const selected = index === active
    return (
      // Keyboard selection happens in the input (aria-activedescendant), so options only need clicks.
      // oxlint-disable-next-line jsx-a11y/click-events-have-key-events
      <div
        key={option.id}
        id={`${listId}-${index}`}
        role="option"
        aria-selected={selected}
        tabIndex={-1}
        onPointerDown={(event) => event.preventDefault()}
        onClick={() => run(option)}
        onPointerMove={() => setActive(index)}
        className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${selected ? 'bg-cobalt-50' : ''}`}
      >
        <span
          className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
            option.emphasis ? 'bg-cobalt-600 text-white' : selected ? 'bg-cobalt-100 text-cobalt-700' : 'bg-stone-100 text-ink-600'
          }`}
        >
          {option.icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className={`truncate text-[14.5px] ${option.emphasis ? 'font-semibold' : 'font-medium'} text-ink-950`}>{option.label}</span>
            {option.semantic && (
              <span title={t('search.semanticMatch')} className="text-cobalt-600">
                <Sparkles aria-hidden className="size-3.5" />
                <span className="sr-only">{t('search.semanticMatch')}</span>
              </span>
            )}
          </span>
          {option.detail && <span className="block truncate text-[12.5px] text-ink-500">{option.detail}</span>}
        </span>
        {option.hint && <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-500">{option.hint}</span>}
        {selected ? (
          <CornerDownLeft aria-hidden className="size-3.5 shrink-0 text-cobalt-600" />
        ) : option.emphasis ? (
          <ArrowUpRight aria-hidden className="size-3.5 shrink-0 text-ink-400" />
        ) : null}
      </div>
    )
  }

  const panel = (
    <div
      className={
        inlineResults
          ? `mt-4 space-y-3 pb-6 ${resultsClassName}`
          : 'scrollbar-quiet absolute left-0 top-[calc(100%+10px)] z-40 max-h-[min(76vh,640px)] w-[min(560px,calc(100vw-40px))] space-y-2 overflow-y-auto rounded-[22px] bg-stone-50 p-2.5 shadow-pop ring-1 ring-stone-200'
      }
    >
      {answer && <AnswerCard view={answer} />}
      {options.length > 0 ? (
        <div id={listId} role="listbox" aria-label={t('search.label')} className="space-y-0.5">
          {answerOptions.length > 0 && (
            <div role="group" aria-label={t('search.answerLabel')} className="space-y-0.5">
              {answerOptions.map((option, index) => renderOption(option, index))}
            </div>
          )}
          {resultOptions.length > 0 && (
            <div role="group" aria-labelledby={`${listId}-results`} className="space-y-0.5 pt-1">
              <p id={`${listId}-results`} className="eyebrow px-3 pb-1 pt-2">
                {t('search.resultsLabel')}
              </p>
              {resultOptions.map((option, index) => renderOption(option, answerOptions.length + index))}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl bg-paper px-4 py-4 ring-1 ring-stone-200">
          <p className="text-[14.5px] font-medium text-ink-900">{t('search.noResults', { query: query.trim() })}</p>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-600">{t('search.noResultsHint')}</p>
        </div>
      )}
    </div>
  )

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={inputId} className="sr-only">
        {t('search.label')}
      </label>
      <div
        className={`group flex items-center gap-2.5 rounded-full bg-paper transition-[box-shadow] focus-within:ring-2 focus-within:ring-cobalt-600 ${
          isHero
            ? 'h-[58px] pl-[18px] pr-3 shadow-[0_1px_2px_rgb(24_32_45/0.06),0_14px_34px_-16px_rgb(24_32_45/0.32)] ring-1 ring-stone-300'
            : variant === 'header'
              ? 'surface h-12 px-4'
              : 'h-12 px-4 ring-1 ring-stone-300'
        }`}
      >
        <Search aria-hidden className={`shrink-0 text-cobalt-600 ${isHero ? 'size-5' : 'size-[18px]'}`} />
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeOption ? `${listId}-${active}` : undefined}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="search"
          value={query}
          placeholder={isHero ? t('search.heroPlaceholder') : variant === 'header' ? t('search.shortPlaceholder') : t('search.placeholder')}
          title={variant === 'overlay' ? undefined : t('search.shortcutHint')}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
            setActive(0)
          }}
          onFocus={() => {
            setOpen(true)
            smartSearch.load()
          }}
          onKeyDown={onKeyDown}
          className={`min-w-0 flex-1 bg-transparent text-ink-950 outline-none placeholder:text-ink-500 [&::-webkit-search-cancel-button]:hidden ${
            isHero ? 'text-[17px]' : 'text-[15px]'
          }`}
        />
        {hasQuery && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setActive(0)
              inputRef.current?.focus()
            }}
            aria-label={t('search.clear')}
            className="rounded-full p-1 text-ink-500 transition-colors hover:bg-stone-150 hover:text-ink-900"
          >
            <X className="size-4" />
          </button>
        )}
        {!isHero && <SmartSearchStatus compact />}
      </div>
      {isHero && (
        <div className="mt-2.5 flex justify-end">
          <SmartSearchStatus compact={false} />
        </div>
      )}
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>
      {showPanel && panel}
    </div>
  )
}
