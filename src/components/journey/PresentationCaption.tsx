import type { ResolvedStop } from '../../data/atlas'
import type { Journey } from '../../data/types'
import { useI18n } from '../../i18n/i18n'
import { stopReferences, twoDigits } from './stopText'

/**
 * The presentation view's captions: the stop number and place in the lower left, its passages in
 * the lower right, over a soft paper wash so they stay legible on any part of the map.
 */
export function PresentationCaption({ journey, stops, stop }: { journey: Journey; stops: readonly ResolvedStop[]; stop: ResolvedStop }) {
  const { text, locale } = useI18n()
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-20">
      <div className="absolute inset-x-0 bottom-0 h-[44vh] bg-[linear-gradient(to_top,rgb(242_238_231/0.94)_0%,rgb(242_238_231/0.7)_38%,transparent_100%)]" />
      <div className="relative flex items-end justify-between gap-8 px-6 pb-28 md:px-12 md:pb-12">
        <div key={stop.index} className="min-w-0">
          <p className="eyebrow animate-fade-in text-ink-700!">{text(journey.title)}</p>
          <p className="mt-3 font-display text-[44px] font-light leading-none tabular-nums text-cobalt-600 animate-rise md:text-[64px]">
            {twoDigits(stop.number)} <span className="text-[22px] text-ink-500 md:text-[28px]">/ {twoDigits(stops.length)}</span>
          </p>
          <p className="mt-2 font-display text-[40px] font-medium uppercase leading-[0.98] tracking-[0.05em] text-ink-950 animate-rise [animation-delay:80ms] md:text-[76px]">
            {text(stop.place.name)}
          </p>
        </div>
        <p key={`ref-${stop.index}`} className="hidden shrink-0 pb-2 text-right text-[16px] font-semibold text-cobalt-800 animate-fade-in md:block">
          {stopReferences(stop, locale)}
        </p>
      </div>
    </div>
  )
}
