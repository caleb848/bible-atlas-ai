import { Sparkles } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { useI18n } from '../../i18n/i18n'
import { smartSearch, useSmartSearchStatus } from '../../lib/search/semantic/client'

/**
 * Shows whether Smart Search (the in-browser AI model) is idle, loading, ready or unavailable,
 * and explains what it does. Keyword search works in every state.
 */
export function SmartSearchStatus({ compact }: { compact: boolean }) {
  const { t } = useI18n()
  const status = useSmartSearchStatus()
  const [open, setOpen] = useState(false)
  const popoverId = useId()
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [open])

  // Once downloaded, the model still has to start; a percentage would sit at 100% meanwhile.
  const starting = status.state === 'loading' && status.progress >= 100
  const label =
    status.state === 'loading'
      ? starting
        ? t('search.smart.starting')
        : t('search.smart.loading', { progress: status.progress })
      : status.state === 'ready'
        ? t('search.smart.ready')
        : status.state === 'unavailable'
          ? t('search.smart.unavailable')
          : t('search.smart.idle')

  const hint =
    status.state === 'loading'
      ? t('search.smart.loadingHint')
      : status.state === 'ready'
        ? t('search.smart.readyHint')
        : status.state === 'unavailable'
          ? t('search.smart.unavailableHint')
          : status.reason === 'save-data'
            ? t('search.smart.savingData')
            : t('search.smart.idleHint')

  const tone =
    status.state === 'ready' ? 'text-cobalt-700' : 'text-ink-500'

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={popoverId}
        aria-label={label}
        className={`flex items-center gap-1.5 rounded-full px-2 py-1 text-[12px] font-medium transition-colors hover:bg-stone-150 ${tone}`}
      >
        {status.state === 'loading' && !starting ? (
          <span
            aria-hidden
            className="size-3.5 rounded-full"
            style={{ background: `conic-gradient(var(--color-cobalt-600) ${status.progress * 3.6}deg, var(--color-stone-200) 0deg)` }}
          />
        ) : (
          <Sparkles aria-hidden className={`size-3.5 ${starting ? 'animate-pulse text-cobalt-600' : ''}`} />
        )}
        {!compact && <span className="hidden whitespace-nowrap sm:inline">{label}</span>}
      </button>
      {open && (
        <div
          id={popoverId}
          role="dialog"
          aria-label={t('search.smart.idle')}
          className="surface absolute right-0 top-[calc(100%+10px)] z-50 w-72 rounded-2xl p-4 text-left shadow-pop"
        >
          <p className="flex items-center gap-2 text-[13px] font-semibold text-ink-950">
            <Sparkles aria-hidden className="size-4 text-cobalt-600" />
            {label}
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-600">{hint}</p>
          {status.state === 'idle' && (
            <button
              type="button"
              onClick={() => smartSearch.load({ userInitiated: true })}
              className="mt-3 rounded-full bg-cobalt-600 px-3 py-1.5 text-[12.5px] font-semibold text-white hover:bg-cobalt-700"
            >
              {t('search.smart.enable')}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
