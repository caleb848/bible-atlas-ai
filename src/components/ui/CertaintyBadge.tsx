import { useId } from 'react'
import type { Certainty } from '../../data/types'
import { useI18n } from '../../i18n/i18n'

const CERTAINTY_COLOR: Record<Certainty, string> = {
  identified: 'var(--color-identified)',
  probable: 'var(--color-probable)',
  traditional: 'var(--color-traditional)',
  debated: 'var(--color-debated)',
  approximate: 'var(--color-approximate)',
}

/** Marks for each label, so certainty never depends on colour alone. */
const CERTAINTY_MARK: Record<Certainty, string> = {
  identified: 'rounded-full',
  probable: 'rounded-full opacity-70',
  traditional: 'rotate-45 rounded-[1px]',
  debated: 'rounded-full ring-[1.5px] ring-current bg-transparent!',
  approximate: 'rounded-full ring-[1.5px] ring-current ring-offset-1 bg-transparent!',
}

interface CertaintyBadgeProps {
  certainty: Certainty
  /** "long" shows "Identified site" instead of "Identified". */
  length?: 'short' | 'long'
  size?: 'sm' | 'md'
  className?: string
}

/**
 * How securely a place is identified, as a small uppercase label with a concise explanation on
 * hover or keyboard focus. Uncertainty is part of the data, so it is presented calmly, not as an error.
 */
export function CertaintyBadge({ certainty, length = 'short', size = 'sm', className = '' }: CertaintyBadgeProps) {
  const { t } = useI18n()
  const tipId = useId()
  const label = t(`certainty.${certainty}${length === 'long' ? 'Long' : ''}`)
  return (
    <span className={`group relative inline-flex ${className}`}>
      {/* A button only so keyboard users can focus it and read the explanation; it has no action. */}
      <button
        type="button"
        aria-describedby={tipId}
        className={`inline-flex cursor-help items-center gap-1.5 rounded-full font-semibold uppercase tracking-[0.1em] outline-offset-2 ${size === 'sm' ? 'px-2 py-[3px] text-[10px]' : 'px-2.5 py-1 text-[11px]'}`}
        style={{
          color: CERTAINTY_COLOR[certainty],
          backgroundColor: `color-mix(in oklab, ${CERTAINTY_COLOR[certainty]} 9%, var(--color-paper))`,
          boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${CERTAINTY_COLOR[certainty]} 26%, transparent)`,
        }}
      >
        <span aria-hidden className={`size-[7px] shrink-0 bg-current ${CERTAINTY_MARK[certainty]}`} />
        {label}
      </button>
      <span
        id={tipId}
        role="tooltip"
        className="pointer-events-none invisible absolute bottom-[calc(100%+8px)] left-0 z-30 w-60 rounded-xl bg-ink-900 px-3 py-2 text-[12.5px] font-normal normal-case leading-snug tracking-normal text-stone-50 opacity-0 shadow-pop transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
      >
        <span className="font-semibold">{t(`certainty.${certainty}Long`)}.</span> {t(`certainty.${certainty}Help`)}
      </span>
    </span>
  )
}
