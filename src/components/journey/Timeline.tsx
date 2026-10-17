import { useEffect, useRef } from 'react'
import type { ResolvedStop } from '../../data/atlas'
import type { Journey } from '../../data/types'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { useI18n } from '../../i18n/i18n'
import { legStyle, type LegStyle } from '../map/routeGeometry'
import { twoDigits } from './stopText'

export type TimelineVariant = 'full' | 'rail'

interface TimelineProps {
  journey: Journey
  stops: readonly ResolvedStop[]
  /** The stop shown in Journey Mode (null on the overview). */
  currentIndex: number | null
  /** The stop hovered here or on the map; both highlight together. */
  hoveredIndex: number | null
  onHover: (index: number | null) => void
  onSelect: (index: number) => void
  variant?: TimelineVariant
}

/** Rail segments use the map's visual language: solid, dashed (sea), dotted (implied or uncertain). */
const RAIL: Record<LegStyle, string> = {
  solid: 'border-solid',
  sea: 'border-dashed',
  uncertain: 'border-dotted',
}

type StopState = 'current' | 'done' | 'upcoming' | 'idle'

/**
 * The editorial timeline: two-figure stop numbers, place names set like inscriptions, and the
 * reference for each stop. In Journey Mode the current stop leads, completed stops recede and
 * upcoming stops are lighter. Hovering a stop highlights its marker on the map, and vice versa.
 */
export function Timeline({ journey, stops, currentIndex, hoveredIndex, onHover, onSelect, variant = 'full' }: TimelineProps) {
  const { text, t } = useI18n()
  const isRoute = journey.type === 'route'
  const currentPosition = currentIndex === null ? -1 : stops.findIndex((stop) => stop.index === currentIndex)

  const renderStop = (stop: ResolvedStop, position: number) => {
    const next = stops[position + 1]
    const state: StopState =
      currentPosition < 0 ? 'idle' : position === currentPosition ? 'current' : position < currentPosition ? 'done' : 'upcoming'
    return (
      <TimelineItem
        key={stop.index}
        stop={stop}
        variant={variant}
        state={state}
        hovered={stop.index === hoveredIndex}
        railAbove={isRoute && position > 0 ? legStyle(stop) : null}
        railBelow={isRoute && next ? legStyle(next) : null}
        railDone={state === 'done' || state === 'current'}
        nextDone={currentPosition >= 0 && position < currentPosition}
        name={text(stop.place.name)}
        modern={stop.place.modern ? text(stop.place.modern.name) : ''}
        onHover={onHover}
        onSelect={() => onSelect(stop.index)}
      />
    )
  }

  if (!isRoute && journey.sections) {
    return (
      <div className={variant === 'rail' ? 'space-y-4' : 'space-y-7'}>
        {journey.sections.map((section) => {
          const sectionStops = stops.filter((stop) => stop.stop.sectionId === section.id)
          if (sectionStops.length === 0) return null
          const headingId = `section-${variant}-${section.id}`
          return (
            <section key={section.id} aria-labelledby={headingId}>
              <h3
                id={headingId}
                className={variant === 'rail' ? 'eyebrow mb-1.5 px-2' : 'font-display text-[19px] font-medium text-ink-950'}
              >
                {text(section.title)}
              </h3>
              {variant === 'full' && section.description && (
                <p className="mt-0.5 text-[13px] text-ink-500">{text(section.description)}</p>
              )}
              <ol className={variant === 'rail' ? '' : 'mt-3'}>{sectionStops.map((stop) => renderStop(stop, stops.indexOf(stop)))}</ol>
            </section>
          )
        })}
      </div>
    )
  }

  return <ol aria-label={t('journey.timeline')}>{stops.map((stop, position) => renderStop(stop, position))}</ol>
}

interface TimelineItemProps {
  stop: ResolvedStop
  variant: TimelineVariant
  state: StopState
  hovered: boolean
  railAbove: LegStyle | null
  railBelow: LegStyle | null
  /** The leg arriving here has been travelled (Journey Mode). */
  railDone: boolean
  /** The leg leaving here has been travelled. */
  nextDone: boolean
  name: string
  modern: string
  onHover: (index: number | null) => void
  onSelect: () => void
}

const NUMBER_STYLE: Record<StopState, string> = {
  current: 'border-cobalt-600 bg-cobalt-600 text-white shadow-[0_0_0_5px_rgb(36_72_176/0.14)]',
  done: 'border-cobalt-400 bg-paper text-cobalt-700',
  upcoming: 'border-stone-400 bg-paper text-ink-500',
  idle: 'border-cobalt-500 bg-paper text-cobalt-700',
}

const NAME_STYLE: Record<StopState, string> = {
  current: 'text-ink-950',
  done: 'text-ink-600',
  upcoming: 'text-ink-500',
  idle: 'text-ink-900',
}

function TimelineItem({ stop, variant, state, hovered, railAbove, railBelow, railDone, nextDone, name, modern, onHover, onSelect }: TimelineItemProps) {
  const { t, ref } = useI18n()
  const itemRef = useRef<HTMLLIElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const rail = variant === 'rail'

  // The rail follows the current stop. Elsewhere (the phone's stop card) scrolling would move the
  // whole sheet away from the stop's own details.
  useEffect(() => {
    if (rail && state === 'current') itemRef.current?.scrollIntoView({ block: 'nearest', behavior: reducedMotion ? 'auto' : 'smooth' })
  }, [rail, state, reducedMotion])

  const passed = stop.stop.presence === 'passed'
  /** A single long word ("Thessalonica") cannot wrap in the narrow rail, so it is set smaller. */
  const longWord = name.split(/\s+/).some((word) => word.length > 10)
  const region = stop.place.kind === 'region'
  const size = rail ? 'h-6 min-w-6 text-[10.5px]' : 'h-8 min-w-8 text-[12px]'
  const railX = rail ? 'left-[11px]' : 'left-[15px]'
  const numberTop = rail ? 'top-[7px]' : 'top-[10px]'

  return (
    <li ref={itemRef} className={`relative ${rail ? 'pl-9' : 'pl-12'}`}>
      {railAbove && (
        <span
          aria-hidden
          className={`absolute top-0 ${railX} ${rail ? 'h-[8px]' : 'h-[11px]'} border-l-2 ${RAIL[railAbove]} ${railDone ? 'border-cobalt-500' : 'border-stone-300'}`}
        />
      )}
      {railBelow && (
        <span
          aria-hidden
          className={`absolute bottom-0 ${railX} ${rail ? 'top-[31px]' : 'top-[42px]'} border-l-2 ${RAIL[railBelow]} ${nextDone ? 'border-cobalt-500' : 'border-stone-300'}`}
        />
      )}
      <span
        aria-hidden
        className={`absolute left-0 ${numberTop} flex items-center justify-center px-1 font-semibold tabular-nums tracking-tight transition-[background-color,color,box-shadow,border-color] duration-300 ${size} ${
          region ? 'rounded-[8px]' : 'rounded-full'
        } border-[1.5px] ${passed || region ? 'border-dashed' : ''} ${NUMBER_STYLE[state]} ${hovered && state !== 'current' ? 'border-cobalt-600! text-cobalt-800!' : ''}`}
      >
        {twoDigits(stop.number)}
      </span>
      <button
        type="button"
        onClick={onSelect}
        onMouseEnter={() => onHover(stop.index)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(stop.index)}
        onBlur={() => onHover(null)}
        aria-current={state === 'current' ? 'step' : undefined}
        className={`group flex w-full items-baseline justify-between gap-3 rounded-xl text-left transition-colors ${
          rail ? 'px-2 py-[7px]' : 'px-3 py-2.5'
        } ${state === 'current' ? 'bg-cobalt-50' : hovered ? 'bg-stone-150' : 'hover:bg-stone-150'}`}
      >
        <span className="min-w-0">
          {/* The name includes everything visible, so speech input can use what is on screen. */}
          <span className="sr-only">{t('journey.stopNumber', { number: stop.number })}: </span>
          <span
            className={`block font-display uppercase transition-colors ${
              rail ? `leading-snug ${longWord ? 'text-[11.5px] tracking-[0.03em]' : 'text-[13px] tracking-[0.06em]'}` : 'truncate text-[15.5px] tracking-[0.07em]'
            } ${
              state === 'current' ? 'font-semibold' : 'font-medium'
            } ${NAME_STYLE[state]}`}
          >
            {name}
          </span>
          {!rail && modern && <span className="mt-0.5 block truncate text-[12.5px] text-ink-500">{modern}</span>}
          {passed && !rail && <span className="mt-0.5 block text-[11.5px] italic text-ink-500">{t('journey.passed')}</span>}
        </span>
        <span className={`shrink-0 tabular-nums text-ink-500 ${rail ? 'text-[11px]' : 'text-[12px]'}`}>
          {ref(stop.stop.passage)}
        </span>
      </button>
    </li>
  )
}
