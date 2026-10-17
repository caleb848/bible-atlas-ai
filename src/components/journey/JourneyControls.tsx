import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Pause, Play, RotateCcw, X } from 'lucide-react'
import type { ResolvedStop } from '../../data/atlas'
import { useI18n } from '../../i18n/i18n'
import { IconButton } from '../ui/Button'
import { twoDigits } from './stopText'

export interface PlaybackControls {
  playing: boolean
  atEnd: boolean
  toggle: () => void
}

interface JourneyControlsProps {
  stops: readonly ResolvedStop[]
  currentIndex: number
  playback: PlaybackControls
  onSelect: (index: number) => void
  onExit: () => void
  presentation: boolean
  onTogglePresentation: () => void
  /** Floating pill over the map, or a row pinned inside the phone sheet. */
  placement: 'floating' | 'sheet'
  className?: string
}

/** Previous · 07 / 18 · Next · Play/Pause, plus the presentation view and a way out of Journey Mode. */
export function JourneyControls({ stops, currentIndex, playback, onSelect, onExit, presentation, onTogglePresentation, placement, className = '' }: JourneyControlsProps) {
  const { t } = useI18n()
  const position = stops.findIndex((stop) => stop.index === currentIndex)
  const previous = stops[position - 1]
  const next = stops[position + 1]
  const current = stops[position]
  if (!current) return null

  const floating = placement === 'floating'
  const playLabel = playback.playing ? t('journey.pause') : playback.atEnd ? t('journey.restart') : t('journey.playJourney')

  return (
    <div
      role="toolbar"
      aria-label={t('journey.controls')}
      {...(floating ? { 'data-map-obstacle': true } : {})}
      className={
        floating
          ? `surface pointer-events-auto flex items-center gap-1 rounded-full p-1.5 shadow-pop ${className}`
          : `flex items-center gap-1 px-3 pb-2.5 pt-0.5 ${className}`
      }
    >
      <IconButton label={presentation ? t('journey.exitPresentation') : t('journey.exit')} onClick={presentation ? onTogglePresentation : onExit}>
        <X className="size-[18px]" />
      </IconButton>
      <span aria-hidden className="mx-0.5 h-6 w-px bg-stone-200" />
      <IconButton label={t('journey.previous')} disabled={!previous} onClick={() => previous && onSelect(previous.index)}>
        <ChevronLeft className="size-5" />
      </IconButton>
      <span className="min-w-[78px] text-center font-display text-[18px] tabular-nums text-ink-950">
        <span className="sr-only">{t('journey.stopOf', { number: current.number, total: stops.length })}</span>
        <span aria-hidden>
          {twoDigits(current.number)} <span className="text-ink-500">/ {twoDigits(stops.length)}</span>
        </span>
      </span>
      <IconButton label={t('journey.next')} disabled={!next} onClick={() => next && onSelect(next.index)}>
        <ChevronRight className="size-5" />
      </IconButton>
      <IconButton tone="primary" label={playLabel} onClick={playback.toggle} className="ml-0.5">
        {playback.playing ? <Pause className="size-[18px]" /> : playback.atEnd ? <RotateCcw className="size-[18px]" /> : <Play className="size-[18px] translate-x-px" />}
      </IconButton>
      <span aria-hidden className="mx-0.5 h-6 w-px bg-stone-200" />
      <IconButton
        label={presentation ? t('journey.exitPresentation') : t('journey.presentation')}
        aria-pressed={presentation}
        onClick={onTogglePresentation}
      >
        {presentation ? <Minimize2 className="size-[18px]" /> : <Maximize2 className="size-[18px]" />}
      </IconButton>
    </div>
  )
}
