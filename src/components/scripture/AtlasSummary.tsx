import { PenLine } from 'lucide-react'
import type { ReactNode } from 'react'
import { useI18n } from '../../i18n/i18n'

/** The "Editorial summary" label that marks atlas-written text. */
export function EditorialLabel({ className = '' }: { className?: string }) {
  const { t } = useI18n()
  return (
    <p
      className={`flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.15em] text-ink-500 ${className}`}
      title={t('scripture.summaryHelp')}
    >
      <PenLine aria-hidden className="size-3" />
      {t('scripture.summaryLabel')}
    </p>
  )
}

/**
 * Editorial text written for the atlas. Deliberately unlike Scripture (sans-serif, no quotation
 * styling, no page tone) and labelled "Editorial summary", so it can never be mistaken for a quotation.
 */
export function AtlasSummary({ children, label = true, className = '' }: { children: ReactNode; label?: boolean; className?: string }) {
  return (
    <div className={className}>
      {label && <EditorialLabel className="mb-1.5" />}
      <p className="text-[15px] leading-[1.65] text-ink-700">{children}</p>
    </div>
  )
}
