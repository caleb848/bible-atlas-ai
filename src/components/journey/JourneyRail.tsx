import type { ResolvedStop } from '../../data/atlas'
import type { Journey } from '../../data/types'
import { useI18n } from '../../i18n/i18n'
import { Timeline } from './Timeline'

interface JourneyRailProps {
  journey: Journey
  stops: readonly ResolvedStop[]
  currentIndex: number
  hoveredIndex: number | null
  onHover: (index: number | null) => void
  onSelect: (index: number) => void
}

/** Journey Mode on wide windows (1280 px and up): the whole timeline in a slim rail on the right, following the current stop. */
export function JourneyRail({ journey, stops, currentIndex, hoveredIndex, onHover, onSelect }: JourneyRailProps) {
  const { t, text } = useI18n()
  return (
    <aside
      data-map-obstacle
      aria-label={t('journey.timeline')}
      className="surface fixed right-5 top-[78px] z-20 hidden max-h-[calc(100dvh-178px)] w-[252px] flex-col rounded-card animate-fade-in xl:flex"
    >
      <div className="shrink-0 border-b border-stone-200 px-4 pb-3 pt-4">
        <p className="eyebrow">{t('journey.timeline')}</p>
        <p className="mt-1 truncate font-display text-[16px] font-medium text-ink-950">{text(journey.shortTitle)}</p>
      </div>
      <div className="scrollbar-quiet min-h-0 flex-1 overflow-y-auto px-2 py-2">
        <Timeline
          journey={journey}
          stops={stops}
          currentIndex={currentIndex}
          hoveredIndex={hoveredIndex}
          onHover={onHover}
          onSelect={onSelect}
          variant="rail"
        />
      </div>
    </aside>
  )
}
