import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { useI18n } from '../../i18n/i18n'
import { goBack } from '../../lib/router/router'

/** Back within the app (or to the start when the page was opened directly). */
export function BackButton({ label }: { label?: string }) {
  const { t } = useI18n()
  return (
    <button
      type="button"
      onClick={goBack}
      className="-ml-1 mb-5 inline-flex items-center gap-1.5 rounded-full px-1 py-1 text-[13px] font-medium text-ink-500 transition-colors hover:text-ink-900"
    >
      <ArrowLeft aria-hidden className="size-4" />
      {label ?? t('nav.back')}
    </button>
  )
}

/** A titled section of a view, set off by a hairline like a chapter in an atlas. */
export function PanelSection({ title, children, id, aside }: { title: string; children: ReactNode; id: string; aside?: ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-9">
      <div className="mb-3.5 flex items-baseline justify-between gap-3 border-b border-stone-200 pb-2">
        <h2 id={id} className="eyebrow">
          {title}
        </h2>
        {aside && <span className="text-[12px] tabular-nums text-ink-500">{aside}</span>}
      </div>
      {children}
    </section>
  )
}
