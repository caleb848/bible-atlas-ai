import { BookOpen } from 'lucide-react'
import type { RefString } from '../../data/types'
import { useI18n } from '../../i18n/i18n'
import { type ReaderItem, useScriptureReader } from './readerContext'

interface ScriptureRefButtonProps {
  passage: RefString
  excerpt?: RefString
  related?: RefString[]
  context?: string
  /** Opens the reader on this passage within a sequence it can step through. */
  sequence?: ReaderItem[]
  variant?: 'chip' | 'link' | 'plain'
  className?: string
}

/** Opens the passage in the Scripture reader. */
export function ScriptureRefButton({ passage, excerpt, related, context, sequence, variant = 'chip', className = '' }: ScriptureRefButtonProps) {
  const { t, ref } = useI18n()
  const reader = useScriptureReader()
  const label = ref(passage)
  const open = () => {
    const item: ReaderItem = { passage, ...(excerpt ? { excerpt } : {}), ...(related ? { related } : {}), ...(context ? { context } : {}) }
    if (sequence && sequence.length > 1) {
      const index = sequence.findIndex((entry) => entry.passage === passage)
      reader.open({ items: sequence, index: Math.max(0, index) })
    } else reader.open(item)
  }

  if (variant === 'link' || variant === 'plain') {
    return (
      <button
        type="button"
        onClick={open}
        aria-label={t('scripture.open', { reference: label })}
        className={`font-medium text-cobalt-700 decoration-cobalt-300 underline-offset-4 transition-colors hover:text-cobalt-900 hover:decoration-cobalt-600 ${variant === 'link' ? 'underline' : 'hover:underline'} ${className}`}
      >
        {label}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={open}
      aria-label={t('scripture.open', { reference: label })}
      className={`inline-flex items-center gap-1.5 rounded-full bg-cobalt-50 px-2.5 py-1 text-[12.5px] font-semibold text-cobalt-700 ring-1 ring-inset ring-cobalt-100 transition-colors hover:bg-cobalt-100 hover:text-cobalt-900 ${className}`}
    >
      <BookOpen aria-hidden className="size-3.5" />
      {label}
    </button>
  )
}
