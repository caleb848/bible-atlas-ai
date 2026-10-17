import { BookOpen, ShieldCheck } from 'lucide-react'
import { useI18n } from '../../i18n/i18n'
import { versesInRange } from '../../lib/scripture/passages'
import { CertaintyBadge } from '../ui/CertaintyBadge'
import { useTranslationText } from '../scripture/useTranslationText'
import type { AnswerView } from './answerView'

/**
 * A grounded answer, Scripture first: the reference and its verse, quoted word for word, then the
 * answer and where it comes from in the atlas. Nothing here is generated text; when no answer can
 * be grounded this way, search shows relevant results instead.
 */
export function AnswerCard({ view }: { view: AnswerView }) {
  const { t } = useI18n()
  const { state } = useTranslationText()
  const [primary, ...others] = view.blocks
  if (!primary) return null
  const verses = state.status === 'ready' && primary.citation.quote ? versesInRange(state.text, primary.citation.quote).filter((verse) => verse.text) : []

  return (
    <section aria-label={t('search.answerLabel')} className="rounded-2xl bg-paper p-4 ring-1 ring-stone-200 md:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow text-cobalt-700!">{t('search.answerLabel')}</p>
        <span
          title={t('search.groundedHelp')}
          className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--color-identified)_9%,var(--color-paper))] px-2 py-[3px] text-[10px] font-semibold uppercase tracking-[0.1em] text-identified"
        >
          <ShieldCheck aria-hidden className="size-3" />
          {t('search.grounded')}
        </span>
      </div>

      <div className="mt-3 rounded-xl bg-vellum-100 px-4 py-3 ring-1 ring-inset ring-vellum-300">
        <p className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.15em] text-vellum-800">
          <BookOpen aria-hidden className="size-3.5" />
          {primary.citation.label} · WEB
        </p>
        {verses.length > 0 && (
          <p className="mt-1.5 font-display text-[16.5px] leading-[1.6] text-ink-900">
            {verses.map((verse) => (
              <span key={`${verse.chapter}:${verse.verse}`}>
                <sup className="mr-0.5 font-sans text-[9.5px] font-semibold text-vellum-700">{verse.verse}</sup>
                {verse.text}{' '}
              </span>
            ))}
          </p>
        )}
      </div>

      <p className="mt-3.5 font-display text-[22px] font-medium leading-snug text-ink-950">{primary.headline}</p>
      <p className="mt-1 flex flex-wrap items-center gap-2 text-[13px] text-ink-600">
        {primary.context}
        {primary.certainty && <CertaintyBadge certainty={primary.certainty} />}
      </p>

      {others.map((block) => (
        <div key={block.context} className="mt-3.5 border-t border-stone-200 pt-3">
          <p className="font-display text-[17px] font-medium text-ink-900">{block.headline}</p>
          <p className="mt-0.5 text-[12.5px] text-ink-600">
            {block.context} · <span className="font-semibold text-vellum-800">{block.citation.label}</span>
          </p>
        </div>
      ))}
    </section>
  )
}
