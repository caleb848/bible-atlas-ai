import { Fragment, type Ref } from 'react'
import { discsFor } from './markerDiscs'
import type { MarkerVariant } from './scene'

/** Journey Mode progression: the current stop leads, travelled stops recede, upcoming ones are lighter. */
export type MarkerState = 'current' | 'done' | 'upcoming' | 'idle'

/** One visit to the marker's place: its stop number, its index in the journey and its state. */
export interface MarkerVisit {
  number: number
  index: number
  state: MarkerState
}

interface MarkerViewProps {
  rootRef: Ref<HTMLDivElement>
  variant: MarkerVariant
  /** The journey's stops at this place, in order (none for places that are not stops). */
  visits: MarkerVisit[]
  label: string
  sublabel?: string
  selected: boolean
  state: MarkerState
  /** Initial reveal state; the route animation updates it directly afterwards. */
  revealed: boolean
  ariaLabel: string
  /** `visit` is the stop index of the visit clicked, or null (a single stop, or the keyboard). */
  onActivate: (visit: number | null) => void
  /** The stop index pointed at, or null when the pointer leaves. */
  onHover?: (visit: number | null) => void
}

const SHAPE: Record<MarkerVariant, string> = {
  stop: 'h-[26px] min-w-[26px] rounded-full px-1.5 text-[11.5px]',
  passed: 'h-[21px] min-w-[21px] rounded-full px-1 text-[10px] border-dashed',
  region: 'h-[24px] min-w-[24px] rounded-[7px] px-1.5 text-[11px] border-dashed',
  focus: 'size-[20px] rounded-full',
  place: 'size-[13px] rounded-full',
  area: 'size-[18px] rounded-full border-dashed',
  origin: 'size-[13px] rounded-[3px] rotate-45',
  context: 'size-[10px] rounded-full',
}

/** Dot markers (places, not numbered stops): the visible dot inside a larger tap area. */
const DOT_COLORS: Partial<Record<MarkerVariant, string>> = {
  focus: 'border-paper bg-cobalt-600 shadow-[0_0_0_7px_rgb(36_72_176/0.16),0_2px_6px_rgb(16_21_31/0.25)]',
  place: 'border-paper bg-cobalt-600 shadow-[0_1px_3px_rgb(16_21_31/0.3)] group-hover:bg-cobalt-800',
  area: 'border-cobalt-600 bg-cobalt-600/15 group-hover:bg-cobalt-600/30',
  origin: 'border-cobalt-600 bg-paper shadow-[0_1px_3px_rgb(16_21_31/0.25)] group-hover:bg-cobalt-100',
  context: 'border-paper bg-ink-500 shadow-[0_1px_2px_rgb(16_21_31/0.25)] group-hover:bg-cobalt-600',
}

/** Numbered stop markers, by Journey Mode state. */
function stopColors(selected: boolean, state: MarkerState): string {
  if (selected || state === 'current') {
    return 'border-cobalt-600 bg-cobalt-600 text-white shadow-[0_0_0_6px_rgb(36_72_176/0.18),0_6px_16px_-4px_rgb(19_36_90/0.55)]'
  }
  if (state === 'upcoming') return 'border-cobalt-300 bg-paper text-cobalt-600 hover:border-cobalt-600 hover:text-cobalt-800'
  return 'border-cobalt-600 bg-paper text-cobalt-700 shadow-[0_1px_3px_rgb(16_21_31/0.18)] hover:bg-cobalt-600 hover:text-white'
}

const LABEL_STYLE: Record<MarkerVariant, string> = {
  stop: 'font-display text-[15.5px] leading-tight',
  passed: 'font-display text-[14.5px] italic leading-tight',
  region: 'font-display text-[15px] italic leading-tight tracking-[0.02em]',
  focus: 'font-display text-[19px] font-semibold leading-tight',
  place: 'font-display text-[15px] leading-tight',
  area: 'font-display text-[15px] italic leading-tight tracking-[0.02em]',
  origin: 'font-display text-[14.5px] italic leading-tight',
  context: 'text-[12.5px] font-medium leading-tight',
}

/** The visit under the pointer, when a marker shows several (null on a count of visits). */
const visitAt = (target: EventTarget): number | null => {
  const disc = target instanceof Element ? target.closest<HTMLElement>('[data-visits]') : null
  const indexes = disc?.dataset.visits?.split(' ') ?? []
  return indexes.length === 1 ? Number(indexes[0]) : null
}

/**
 * One map marker. It is a real button (keyboard and screen-reader accessible); the label is
 * positioned by the collision layout via the `data-label` attribute on the root.
 *
 * A place the journey visits more than once (Antioch, stops 1 and 18) shows each visit as its own
 * numbered disc, so "1 · 18" is never read as "stop 1 of 18", and each disc shows its own progress.
 * Clicking a disc opens that visit; the keyboard steps through the visits.
 */
export function MarkerView({ rootRef, variant, visits, label, sublabel, selected, state, revealed, ariaLabel, onActivate, onHover }: MarkerViewProps) {
  const numbered = variant === 'stop' || variant === 'passed' || variant === 'region'
  const several = numbered && visits.length > 1
  const strong = selected || state === 'current' || variant === 'focus'
  const labelColor = strong ? 'font-semibold text-ink-950' : state === 'upcoming' ? 'text-ink-600' : variant === 'context' ? 'text-ink-700' : 'text-ink-900'
  // Focus (and a pointer between discs) stands for the current visit, or else the first.
  const primary = (visits.find((visit) => visit.state === 'current') ?? visits[0])?.index ?? null

  return (
    <div ref={rootRef} className="atlas-marker" data-label="right" data-revealed={String(revealed)}>
      {/* Shrink-wraps the button, so the label sits beside its edge however many numbers it shows. */}
      <div className="absolute left-0 top-0 flex -translate-x-1/2 -translate-y-1/2">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onActivate(several ? visitAt(event.target) : null)
          }}
          onMouseEnter={() => onHover?.(primary)}
          onMouseOver={several ? (event) => onHover?.(visitAt(event.target) ?? primary) : undefined}
          onMouseLeave={() => onHover?.(null)}
          onFocus={() => onHover?.(primary)}
          onBlur={() => onHover?.(null)}
          aria-label={ariaLabel}
          aria-pressed={numbered ? selected : undefined}
          className={
            several
              ? `atlas-marker__visits inline-flex items-center rounded-full transition-[scale] duration-200 ${selected ? 'scale-115' : 'hover:scale-110'}`
              : numbered
                ? `inline-flex items-center justify-center whitespace-nowrap border-[1.5px] font-semibold tabular-nums transition-[scale,background-color,box-shadow,color,border-color] duration-200 ${SHAPE[variant]} ${stopColors(selected, state)} ${selected ? 'scale-115' : 'hover:scale-110'}`
                : // A comfortable 24px target around the small dot.
                  `group inline-flex size-6 items-center justify-center rounded-full transition-[scale] duration-200 ${selected ? 'scale-115' : 'hover:scale-110'}`
          }
        >
          {several ? (
            discsFor(visits).map((disc, position, discs) => (
              // The space keeps the numbers apart in the button's text ("1 18"), as they are on screen.
              <Fragment key={disc.key}>
                {position > 0 && ' '}
                <span
                  aria-hidden
                  data-visits={disc.indexes.join(' ')}
                  // Overlapping slightly, like stacked coins; the current visit sits on top.
                  style={{ zIndex: disc.state === 'current' ? discs.length + 1 : discs.length - position }}
                  className={`atlas-marker__visit relative inline-flex items-center justify-center whitespace-nowrap border-[1.5px] font-semibold tabular-nums ring-2 ring-paper transition-[scale,background-color,box-shadow,color,border-color] duration-200 ${SHAPE[variant]} ${stopColors(disc.state === 'current', disc.state)} ${position > 0 ? '-ml-1' : ''}`}
                >
                  {disc.text}
                </span>
              </Fragment>
            ))
          ) : numbered ? (
            <span aria-hidden>{visits[0]?.number}</span>
          ) : (
            <span aria-hidden className={`block border-[1.5px] transition-colors duration-200 ${SHAPE[variant]} ${DOT_COLORS[variant] ?? ''}`} />
          )}
        </button>
        <span className="atlas-marker__label" aria-hidden>
          <span className={`block ${LABEL_STYLE[variant]} ${labelColor}`}>{label}</span>
          {sublabel && (
            <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.13em] text-cobalt-700">{sublabel}</span>
          )}
        </span>
      </div>
    </div>
  )
}
